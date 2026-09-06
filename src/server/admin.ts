import type {
  DoorMaterial,
  OptionGroupKey,
  OrderStatus,
  PropertyType,
  RepairCategoryKey,
  RepairStatus,
  SecurityClass,
} from "@/types";
import { db } from "@/server/db";

/**
 * Admin panelinin oxu qatı.
 *
 * Route handler-i çağırmadan əvvəl `requireUser("ADMIN")` işlədir;
 * bu modul özü səlahiyyət yoxlamır, ona görə birbaşa komponentdən
 * deyil, yalnız qorunan səhifədən çağırılmalıdır (PRD §93).
 */

export interface AdminProductRow {
  id: string;
  slug: string;
  sku: string;
  name: string;
  categorySlug: string;
  brandSlug: string;
  brandName: string;
  material: DoorMaterial;
  securityClass: SecurityClass;
  basePrice: number;
  inStock: boolean;
}

export async function adminProducts(): Promise<AdminProductRow[]> {
  const rows = await db.product.findMany({
    include: { category: true, brand: true },
    orderBy: { name: "asc" },
  });

  return rows.map((p) => ({
    id: p.id,
    slug: p.slug,
    sku: p.sku,
    name: p.name,
    categorySlug: p.category.slug,
    brandSlug: p.brand.slug,
    brandName: p.brand.name,
    material: p.material as DoorMaterial,
    securityClass: p.securityClass as SecurityClass,
    basePrice: p.basePrice,
    inStock: p.inStock,
  }));
}

export interface AdminCategoryRow {
  id: string;
  slug: string;
  name: string;
  productCount: number;
}

export async function adminCategories(): Promise<AdminCategoryRow[]> {
  const rows = await db.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return rows.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    productCount: c._count.products,
  }));
}

export interface AdminBrandRow {
  id: string;
  slug: string;
  name: string;
  country: string;
  founded: number;
  productCount: number;
}

export async function adminBrands(): Promise<AdminBrandRow[]> {
  const rows = await db.brand.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return rows.map((b) => ({
    id: b.id,
    slug: b.slug,
    name: b.name,
    country: b.country,
    founded: b.founded,
    productCount: b._count.products,
  }));
}

export interface AdminOptionRow {
  id: string;
  code: string;
  label: string;
  priceDelta: number;
  hex: string | null;
  requiresCount: number;
}

export interface AdminOptionGroup {
  groupKey: OptionGroupKey;
  values: AdminOptionRow[];
}

export async function adminOptionGroups(): Promise<AdminOptionGroup[]> {
  const rows = await db.optionValue.findMany({ orderBy: [{ groupKey: "asc" }, { id: "asc" }] });

  const groups = new Map<string, AdminOptionRow[]>();
  for (const v of rows) {
    const list = groups.get(v.groupKey) ?? [];
    list.push({
      id: v.id,
      code: v.code,
      label: v.label,
      priceDelta: v.priceDelta,
      hex: v.hex,
      requiresCount: v.requires ? (JSON.parse(v.requires) as string[]).length : 0,
    });
    groups.set(v.groupKey, list);
  }

  return [...groups.entries()].map(([groupKey, values]) => ({
    groupKey: groupKey as OptionGroupKey,
    values,
  }));
}

export interface AdminOrderRow {
  id: string;
  number: string;
  createdAt: string;
  customerName: string;
  city: string;
  itemCount: number;
  installation: boolean;
  status: OrderStatus;
  paymentStatus: string;
  total: number;
}

export async function adminOrders(): Promise<AdminOrderRow[]> {
  const rows = await db.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return rows.map((o) => ({
    id: o.id,
    number: o.number,
    createdAt: o.createdAt.toISOString(),
    customerName: o.customerName,
    city: o.address.split(",")[0]?.trim() ?? "",
    itemCount: o.items.length,
    installation: o.items.some((i) => i.snapshot.includes("INSTALLATION")),
    status: o.status as OrderStatus,
    paymentStatus: o.paymentStatus,
    total: o.total,
  }));
}

export interface AdminQuoteRow {
  id: string;
  number: string;
  createdAt: string;
  customerName: string;
  subject: string;
  status: string;
}

export async function adminQuotes(): Promise<AdminQuoteRow[]> {
  const rows = await db.quoteRequest.findMany({ orderBy: { createdAt: "desc" } });

  return rows.map((q) => ({
    id: q.id,
    number: q.number,
    createdAt: q.createdAt.toISOString(),
    customerName: q.name,
    subject: q.message.length > 70 ? `${q.message.slice(0, 70)}…` : q.message,
    status: q.status,
  }));
}

export interface AdminRepairRow {
  id: string;
  number: string;
  createdAt: string;
  category: RepairCategoryKey;
  customerName: string;
  address: string;
  technician: string | null;
  technicianId: string | null;
  status: RepairStatus;
}

export async function adminRepairs(): Promise<AdminRepairRow[]> {
  const rows = await db.repairRequest.findMany({
    include: { technician: true },
    orderBy: { createdAt: "desc" },
  });

  return rows.map((rp) => ({
    id: rp.id,
    number: rp.number,
    createdAt: rp.createdAt.toISOString(),
    category: rp.category as RepairCategoryKey,
    customerName: rp.name,
    address: `${rp.city}, ${rp.address}`,
    technician: rp.technician?.name ?? null,
    technicianId: rp.technicianId,
    status: rp.status as RepairStatus,
  }));
}

export interface AdminMeasurementRow {
  id: string;
  number: string;
  propertyType: PropertyType;
  doorCount: number;
  address: string;
  preferredDate: string;
  technician: string | null;
  technicianId: string | null;
  status: string;
}

export async function adminMeasurements(): Promise<AdminMeasurementRow[]> {
  const rows = await db.measurementRequest.findMany({
    include: { technician: true },
    orderBy: { createdAt: "desc" },
  });

  return rows.map((m) => ({
    id: m.id,
    number: m.number,
    propertyType: m.propertyType as PropertyType,
    doorCount: m.doorCount,
    address: `${m.city}, ${m.address}`,
    preferredDate: m.preferredAt ?? m.createdAt.toISOString(),
    technician: m.technician?.name ?? null,
    technicianId: m.technicianId,
    status: m.status,
  }));
}

export interface AdminAppointmentRow {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  type: string;
  technician: string | null;
  address: string;
  reference: string;
  status: string;
}

export async function adminAppointments(): Promise<AdminAppointmentRow[]> {
  const rows = await db.appointment.findMany({
    include: { technician: true },
    orderBy: { date: "asc" },
  });

  return rows.map((a) => ({
    id: a.id,
    date: a.date,
    startTime: a.startTime,
    endTime: a.endTime,
    type: a.type,
    technician: a.technician?.name ?? null,
    address: a.address,
    reference: a.reference,
    status: a.status,
  }));
}

export interface AdminTechnicianRow {
  id: string;
  name: string;
  phone: string;
  specialization: string[];
  serviceAreas: string[];
  completedJobs: number;
  rating: number;
  status: string;
  openJobs: number;
}

export async function adminTechnicians(): Promise<AdminTechnicianRow[]> {
  const rows = await db.technician.findMany({
    include: {
      _count: {
        select: {
          repairs: { where: { status: { notIn: ["COMPLETED", "CANCELLED"] } } },
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return rows.map((t) => ({
    id: t.id,
    name: t.name,
    phone: t.phone,
    specialization: JSON.parse(t.specialization) as string[],
    serviceAreas: JSON.parse(t.serviceAreas) as string[],
    completedJobs: t.completedJobs,
    rating: t.rating,
    status: t.status,
    openJobs: t._count.repairs,
  }));
}

export interface AdminCustomerRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  orders: number;
  total: number;
  since: string;
}

export async function adminCustomers(): Promise<AdminCustomerRow[]> {
  const rows = await db.user.findMany({
    include: { orders: { select: { total: true } } },
    orderBy: { createdAt: "desc" },
  });

  return rows.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone ?? "",
    role: u.role,
    orders: u.orders.length,
    total: u.orders.reduce((sum, o) => sum + o.total, 0),
    since: u.createdAt.toISOString(),
  }));
}

export interface AdminWarrantyRow {
  id: string;
  number: string;
  serialNumber: string;
  productName: string;
  orderNumber: string;
  startDate: string;
  endDate: string;
  status: string;
}

export async function adminWarranties(): Promise<AdminWarrantyRow[]> {
  const rows = await db.warranty.findMany({
    include: { order: true },
    orderBy: { startDate: "desc" },
  });

  return rows.map((w) => ({
    id: w.id,
    number: w.number,
    serialNumber: w.serialNumber,
    productName: w.productName,
    orderNumber: w.order?.number ?? "",
    startDate: w.startDate,
    endDate: w.endDate,
    status: w.status,
  }));
}

/** İcmal səhifəsindəki sayğaclar. */
export async function adminStats() {
  const [products, orders, users, openRepairs, openMeasurements, openQuotes, revenue] =
    await Promise.all([
      db.product.count(),
      db.order.count(),
      db.user.count(),
      db.repairRequest.count({ where: { status: { notIn: ["COMPLETED", "CANCELLED"] } } }),
      db.measurementRequest.count({ where: { status: { notIn: ["COMPLETED", "CANCELLED"] } } }),
      db.quoteRequest.count({ where: { status: { notIn: ["ACCEPTED", "REJECTED", "EXPIRED"] } } }),
      db.order.aggregate({ _sum: { total: true } }),
    ]);

  return {
    products,
    orders,
    users,
    openRepairs,
    openMeasurements,
    openQuotes,
    revenue: revenue._sum.total ?? 0,
  };
}

/**
 * İcmal KPI-ları. Bütün rəqəmlər bazadan hesablanır — sabit dəyər
 * yazılmır, məlumat yoxdursa sıfır göstərilir.
 */
export async function adminDashboard() {
  const now = new Date();
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const today = dayStart.toISOString().slice(0, 10);

  const [day, month, prevMonth, allTime, pendingOrders, newRepairs, activeRepairs, todayAppointments] =
    await Promise.all([
      db.order.aggregate({ _sum: { total: true }, where: { createdAt: { gte: dayStart } } }),
      db.order.aggregate({
        _sum: { total: true },
        _count: true,
        where: { createdAt: { gte: monthStart } },
      }),
      db.order.aggregate({
        _sum: { total: true },
        where: { createdAt: { gte: prevMonthStart, lt: monthStart } },
      }),
      db.order.aggregate({ _sum: { total: true }, _count: true }),
      db.order.count({ where: { status: { in: ["CONFIRMED", "PAID"] } } }),
      db.repairRequest.count({ where: { status: "NEW" } }),
      db.repairRequest.count({
        where: { status: { in: ["TECHNICIAN_ASSIGNED", "SCHEDULED", "IN_PROGRESS"] } },
      }),
      db.appointment.count({ where: { date: today } }),
    ]);

  const monthRevenue = month._sum.total ?? 0;
  const prevRevenue = prevMonth._sum.total ?? 0;
  const orders = allTime._count;

  return {
    dayRevenue: day._sum.total ?? 0,
    monthRevenue,
    // Keçən ay sıfırdırsa faiz mənasızdır — `null` göstərilmir.
    monthDelta: prevRevenue > 0 ? ((monthRevenue - prevRevenue) / prevRevenue) * 100 : null,
    orders,
    monthOrders: month._count,
    averageOrder: orders > 0 ? Math.round((allTime._sum.total ?? 0) / orders) : 0,
    pendingOrders,
    newRepairs,
    activeRepairs,
    todayAppointments,
  };
}

/** Ən çox sifariş edilən modellər — faktiki sifariş sətirlərindən. */
export async function adminTopProducts(limit = 5) {
  const grouped = await db.orderItem.groupBy({
    by: ["productId"],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: limit,
  });

  if (grouped.length === 0) return [];

  const products = await db.product.findMany({
    where: { id: { in: grouped.map((g) => g.productId) } },
    select: { id: true, name: true },
  });

  return grouped.map((g) => ({
    name: products.find((p) => p.id === g.productId)?.name ?? "",
    quantity: g._sum.quantity ?? 0,
  }));
}

/** Sifarişlərdə ən çox seçilən option dəyərləri (rəng, kilid və s.). */
export async function adminTopOptions(groupKey: string, limit = 5) {
  const items = await db.orderItem.findMany({ select: { snapshot: true, quantity: true } });

  const counts = new Map<string, number>();
  for (const item of items) {
    const choices = JSON.parse(item.snapshot) as Record<string, string | string[]>;
    const raw = choices[groupKey];
    for (const id of !raw ? [] : Array.isArray(raw) ? raw : [raw]) {
      counts.set(id, (counts.get(id) ?? 0) + item.quantity);
    }
  }

  if (counts.size === 0) return [];

  const values = await db.optionValue.findMany({ where: { id: { in: [...counts.keys()] } } });
  const total = [...counts.values()].reduce((sum, n) => sum + n, 0);

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id, count]) => ({
      id,
      label: values.find((v) => v.id === id)?.label ?? id,
      hex: values.find((v) => v.id === id)?.hex ?? null,
      share: Math.round((count / total) * 100),
    }));
}

/** Bölməyə görə yüklənən data — səhifə yalnız lazım olanı doldurur. */
export interface AdminData {
  products?: AdminProductRow[];
  categories?: AdminCategoryRow[];
  brands?: AdminBrandRow[];
  optionGroups?: AdminOptionGroup[];
  orders?: AdminOrderRow[];
  quotes?: AdminQuoteRow[];
  repairs?: AdminRepairRow[];
  measurements?: AdminMeasurementRow[];
  appointments?: AdminAppointmentRow[];
  technicians?: AdminTechnicianRow[];
  customers?: AdminCustomerRow[];
  warranties?: AdminWarrantyRow[];
}
