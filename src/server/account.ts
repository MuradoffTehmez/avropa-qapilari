import type {
  Appointment,
  CartItem,
  MeasurementRequest,
  Order,
  OrderStatus,
  OrderTimelineEntry,
  Quote,
  RepairCategoryKey,
  RepairRequest,
  RepairStatus,
  Warranty,
} from "@/types";
import { db } from "@/server/db";
/** Sifariş snapshot-ındakı option id-ləri bazadan oxunur. */
type OptionIndex = Map<string, { hex: string | null }>;

async function loadOptionIndex(
  choiceSets: Record<string, string | string[]>[],
): Promise<OptionIndex> {
  const ids = [
    ...new Set(
      choiceSets.flatMap((choices) =>
        Object.values(choices).flatMap((value) => (Array.isArray(value) ? value : [value])),
      ),
    ),
  ];
  if (ids.length === 0) return new Map();
  const rows = await db.optionValue.findMany({
    where: { id: { in: ids } },
    select: { id: true, hex: true },
  });
  return new Map(rows.map((row) => [row.id, { hex: row.hex }]));
}

/**
 * Kabinet oxu qatı.
 *
 * Bütün funksiyalar `userId` ilə məhdudlaşır — başqa istifadəçinin
 * sifarişi heç bir halda qaytarılmır (PRD §93). Nəticələr komponentlərin
 * mövcud props tiplərinə uyğun gəlir ki, UI dəyişməsin.
 */

/** Sifariş vəziyyətlərinin gedişi; ad `dict.orderStatus`-dan gəlir. */
const TIMELINE: OrderStatus[] = [
  "CONFIRMED",
  "PAID",
  "MANUFACTURING",
  "SHIPPED",
  "INSTALLATION_SCHEDULED",
  "COMPLETED",
];

function buildTimeline(history: { status: string; createdAt: Date }[]): OrderTimelineEntry[] {
  const reached = new Map<string, Date>();
  for (const entry of history) {
    if (!reached.has(entry.status)) reached.set(entry.status, entry.createdAt);
  }

  const lastIndex = TIMELINE.reduce((last, status, i) => (reached.has(status) ? i : last), 0);

  return TIMELINE.map((status, i) => ({
    status,
    date: reached.get(status)?.toISOString() ?? null,
    state: i < lastIndex ? "done" : i === lastIndex ? "current" : "pending",
  }));
}

/** Sifariş sətrinin seçimlərini kartda göstərilən formaya çevirir. */
function snapshotLines(choices: Record<string, string | string[]>, options: OptionIndex) {
  const lines: { group: string; value: string }[] = [];
  for (const [group, raw] of Object.entries(choices)) {
    if (!raw) continue;
    for (const id of Array.isArray(raw) ? raw : [raw]) {
      if (options.has(id)) lines.push({ group, value: id });
    }
  }
  return lines;
}

function panelHexOf(
  choices: Record<string, string | string[]>,
  fallback: string,
  options: OptionIndex,
): string {
  const outside = choices.OUTSIDE_COLOR;
  const value = typeof outside === "string" ? options.get(outside) : undefined;
  return value?.hex ?? fallback;
}

export async function userOrders(userId: string): Promise<Order[]> {
  const rows = await db.order.findMany({
    where: { userId, archivedAt: null },
    include: { items: { include: { product: true } }, history: true },
    orderBy: { createdAt: "desc" },
  });

  const options = await loadOptionIndex(
    rows.flatMap((o) =>
      o.items.map((i) => JSON.parse(i.snapshot) as Record<string, string | string[]>),
    ),
  );

  return rows.map((o) => ({
    id: o.id,
    number: o.number,
    createdAt: o.createdAt.toISOString(),
    status: o.status as OrderStatus,
    total: o.total,
    itemCount: o.items.length,
    customerName: o.customerName,
    city: o.address.split(",")[0]?.trim() ?? "",
    installation: o.items.some((i) => i.snapshot.includes("INSTALLATION")),
    items: o.items.map((i): CartItem => {
      const choices = JSON.parse(i.snapshot) as Record<string, string | string[]>;
      const hexes = JSON.parse(i.product.panelHexes) as string[];
      return {
        id: i.id,
        productId: i.productId,
        productSlug: i.product.slug,
        productName: i.product.name,
        sku: i.product.sku,
        panelHex: panelHexOf(choices, hexes[0], options),
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        snapshot: { width: i.width, height: i.height, lines: snapshotLines(choices, options) },
      };
    }),
    timeline: buildTimeline(o.history),
  }));
}

export interface SavedConfigurationRow {
  id: string;
  productSlug: string;
  productName: string;
  date: string;
  total: number;
  width: number;
  height: number;
  choices: Record<string, string | string[]>;
}

export async function userConfigurations(userId: string): Promise<SavedConfigurationRow[]> {
  const rows = await db.configuration.findMany({
    where: { userId },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  return rows.map((c) => ({
    id: c.code,
    productSlug: c.product.slug,
    productName: c.product.name,
    date: c.createdAt.toISOString(),
    total: c.total,
    width: c.width,
    height: c.height,
    choices: JSON.parse(c.choices) as Record<string, string | string[]>,
  }));
}

export async function userRepairs(userId: string): Promise<RepairRequest[]> {
  const rows = await db.repairRequest.findMany({
    where: { userId, archivedAt: null },
    include: { technician: true },
    orderBy: { createdAt: "desc" },
  });

  return rows.map((rp) => ({
    id: rp.id,
    number: rp.number,
    createdAt: rp.createdAt.toISOString(),
    category: rp.category as RepairCategoryKey,
    status: rp.status as RepairStatus,
    address: `${rp.city}, ${rp.address}`,
    customerName: rp.name,
    phone: rp.phone,
    technician: rp.technician?.name,
    scheduledAt: rp.scheduledAt ?? undefined,
    estimatedCost: rp.estimatedCost ?? undefined,
  }));
}

export async function userMeasurements(userId: string): Promise<MeasurementRequest[]> {
  const rows = await db.measurementRequest.findMany({
    where: { userId },
    include: { technician: true },
    orderBy: { createdAt: "desc" },
  });

  return rows.map((m) => ({
    id: m.id,
    number: m.number,
    createdAt: m.createdAt.toISOString(),
    status: m.status as MeasurementRequest["status"],
    propertyType: m.propertyType as MeasurementRequest["propertyType"],
    doorCount: m.doorCount,
    address: `${m.city}, ${m.address}`,
    preferredDate: m.preferredAt ?? m.createdAt.toISOString(),
    technician: m.technician?.name,
  }));
}

export async function userQuotes(userId: string): Promise<Quote[]> {
  const rows = await db.quoteRequest.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return rows.map((q) => ({
    id: q.id,
    number: q.number,
    createdAt: q.createdAt.toISOString(),
    status: q.status as Quote["status"],
    customerName: q.name,
    subject: q.message.length > 80 ? `${q.message.slice(0, 80)}…` : q.message,
  }));
}

export type WarrantyRow = Warranty & { orderNumber: string };

export async function userWarranties(userId: string): Promise<WarrantyRow[]> {
  const rows = await db.warranty.findMany({
    where: { userId, archivedAt: null },
    include: { order: true },
    orderBy: { startDate: "desc" },
  });

  return rows.map((w) => ({
    id: w.id,
    number: w.number,
    productName: w.productName,
    serialNumber: w.serialNumber,
    orderNumber: w.order?.number ?? "",
    installationDate: w.installationDate,
    startDate: w.startDate,
    endDate: w.endDate,
    coverage: w.coverage ?? undefined,
    status: w.status as Warranty["status"],
  }));
}

export type AppointmentRow = Appointment & { technicianName: string | null };

export async function userAppointments(userId: string): Promise<AppointmentRow[]> {
  const rows = await db.appointment.findMany({
    where: { userId },
    include: { technician: true },
    orderBy: { date: "asc" },
  });

  return rows.map((a) => ({
    id: a.id,
    type: a.type as Appointment["type"],
    date: a.date,
    startTime: a.startTime,
    endTime: a.endTime,
    technicianId: a.technicianId ?? "",
    technicianName: a.technician?.name ?? null,
    address: a.address,
    status: a.status as Appointment["status"],
    reference: a.reference,
  }));
}

export interface AddressRow {
  id: string;
  label: string;
  city: string;
  district: string;
  street: string;
  building: string;
  apartment: string;
  floor: string;
  isDefault: boolean;
}

export async function userAddresses(userId: string): Promise<AddressRow[]> {
  const rows = await db.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
  });

  return rows.map((a) => ({
    id: a.id,
    label: a.label,
    city: a.city,
    district: a.district ?? "",
    street: a.street,
    building: a.building,
    apartment: a.apartment,
    floor: a.floor,
    isDefault: a.isDefault,
  }));
}

/** Kabinet başlanğıc səhifəsindəki sayğaclar. */
export async function accountSummary(userId: string) {
  const closed = ["COMPLETED", "CANCELLED"];

  const [orders, repairs, warranties, appointments] = await Promise.all([
    db.order.findMany({ where: { userId, archivedAt: null }, select: { status: true } }),
    db.repairRequest.findMany({ where: { userId, archivedAt: null }, select: { status: true } }),
    db.warranty.count({ where: { userId, status: "ACTIVE", archivedAt: null } }),
    db.appointment.count({ where: { userId, status: { in: ["SCHEDULED", "CONFIRMED"] } } }),
  ]);

  return {
    orders: orders.length,
    activeOrders: orders.filter((o) => !closed.includes(o.status)).length,
    repairs: repairs.length,
    activeRepairs: repairs.filter((rp) => !closed.includes(rp.status)).length,
    warranties,
    appointments,
  };
}
