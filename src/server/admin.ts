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
  collection: string;
  material: DoorMaterial;
  securityClass: SecurityClass;
  style: string;
  status: string;
  basePrice: number;
  inStock: boolean;
  isBestseller: boolean;
  warrantyYears: number;
  soundInsulationDb: number;
  defaultWidth: number;
  defaultHeight: number;
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
  deliveryDaysMin: number;
  deliveryDaysMax: number;
  optionValueIds: string[];
}

export async function adminProducts(): Promise<AdminProductRow[]> {
  const rows = await db.product.findMany({
    where: { archivedAt: null },
    include: {
      category: true,
      brand: true,
      productOptions: { where: { enabled: true }, select: { optionValueId: true } },
    },
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
    collection: p.collection,
    material: p.material as DoorMaterial,
    securityClass: p.securityClass as SecurityClass,
    style: p.style,
    status: p.status,
    basePrice: p.basePrice,
    inStock: p.inStock,
    isBestseller: p.isBestseller,
    warrantyYears: p.warrantyYears,
    soundInsulationDb: p.soundInsulationDb,
    defaultWidth: p.defaultWidth,
    defaultHeight: p.defaultHeight,
    minWidth: p.minWidth,
    maxWidth: p.maxWidth,
    minHeight: p.minHeight,
    maxHeight: p.maxHeight,
    deliveryDaysMin: p.deliveryDaysMin,
    deliveryDaysMax: p.deliveryDaysMax,
    optionValueIds: p.productOptions.map((option) => option.optionValueId),
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
    where: { archivedAt: null },
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
    where: { archivedAt: null },
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
  technicianId: string | null;
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
    technicianId: a.technicianId,
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
    include: { orders: { where: { archivedAt: null }, select: { total: true } } },
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
  installationDate: string;
  startDate: string;
  endDate: string;
  status: string;
}

export async function adminWarranties(): Promise<AdminWarrantyRow[]> {
  const rows = await db.warranty.findMany({
    where: { archivedAt: null },
    include: { order: true },
    orderBy: { startDate: "desc" },
  });

  return rows.map((w) => ({
    id: w.id,
    number: w.number,
    serialNumber: w.serialNumber,
    productName: w.productName,
    orderNumber: w.order?.number ?? "",
    installationDate: w.installationDate,
    startDate: w.startDate,
    endDate: w.endDate,
    status: w.status,
  }));
}

/** İcmal səhifəsindəki sayğaclar. */
export async function adminStats() {
  const [products, orders, users, openRepairs, openMeasurements, openQuotes, revenue] =
    await Promise.all([
      db.product.count({ where: { archivedAt: null } }),
      db.order.count({ where: { archivedAt: null } }),
      db.user.count(),
      db.repairRequest.count({ where: { status: { notIn: ["COMPLETED", "CANCELLED"] }, archivedAt: null } }),
      db.measurementRequest.count({ where: { status: { notIn: ["COMPLETED", "CANCELLED"] } } }),
      db.quoteRequest.count({ where: { status: { notIn: ["ACCEPTED", "REJECTED", "EXPIRED"] } } }),
      db.order.aggregate({ _sum: { total: true }, where: { archivedAt: null } }),
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
      db.order.aggregate({ _sum: { total: true }, where: { createdAt: { gte: dayStart }, archivedAt: null } }),
      db.order.aggregate({
        _sum: { total: true },
        _count: true,
        where: { createdAt: { gte: monthStart }, archivedAt: null },
      }),
      db.order.aggregate({
        _sum: { total: true },
        where: { createdAt: { gte: prevMonthStart, lt: monthStart }, archivedAt: null },
      }),
      db.order.aggregate({ _sum: { total: true }, _count: true, where: { archivedAt: null } }),
      db.order.count({ where: { status: { in: ["CONFIRMED", "PAID"] }, archivedAt: null } }),
      db.repairRequest.count({ where: { status: "NEW", archivedAt: null } }),
      db.repairRequest.count({
        where: { status: { in: ["TECHNICIAN_ASSIGNED", "SCHEDULED", "IN_PROGRESS"] }, archivedAt: null },
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
    where: { order: { archivedAt: null } },
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
  const items = await db.orderItem.findMany({
    where: { order: { archivedAt: null } },
    select: { snapshot: true, quantity: true },
  });

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
  discounts?: AdminDiscountRow[];
  contentPages?: AdminContentRow[];
  seoEntries?: AdminSeoRow[];
  reviews?: AdminReviewRow[];
  auditLog?: AdminAuditRow[];
  settings?: AdminSettingRow[];
  analytics?: AdminAnalytics;
}

/* ------------------------- Qalan admin bölmələri ----------------------- */

export interface AdminDiscountRow {
  id: string;
  code: string;
  name: string;
  type: string;
  value: number;
  scope: string;
  startsAt: string;
  endsAt: string;
  active: boolean;
  usageCount: number;
}

export async function adminDiscounts(): Promise<AdminDiscountRow[]> {
  const rows = await db.discount.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map((d) => ({
    id: d.id,
    code: d.code,
    name: d.name,
    type: d.type,
    value: d.value,
    scope: d.scope,
    startsAt: d.startsAt,
    endsAt: d.endsAt,
    active: d.active,
    usageCount: d.usageCount,
  }));
}

export interface AdminContentRow {
  id: string;
  path: string;
  title: string;
  published: boolean;
  updatedAt: string;
}

export async function adminContentPages(): Promise<AdminContentRow[]> {
  const rows = await db.contentPage.findMany({ orderBy: { path: "asc" } });
  return rows.map((p) => ({
    id: p.id,
    path: p.path,
    title: p.title,
    published: p.published,
    updatedAt: p.updatedAt.toISOString(),
  }));
}

export interface AdminSeoRow {
  id: string;
  path: string;
  title: string;
  description: string;
  canonical: string;
  updatedAt: string;
}

export async function adminSeoEntries(): Promise<AdminSeoRow[]> {
  const rows = await db.seoEntry.findMany({ orderBy: { path: "asc" } });
  return rows.map((e) => ({
    id: e.id,
    path: e.path,
    title: e.title,
    description: e.description,
    canonical: e.canonical ?? "",
    updatedAt: e.updatedAt.toISOString(),
  }));
}

export interface AdminReviewRow {
  id: string;
  author: string;
  productName: string;
  rating: number;
  text: string;
  status: string;
  verified: boolean;
  createdAt: string;
}

export async function adminReviews(): Promise<AdminReviewRow[]> {
  const rows = await db.review.findMany({
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  return rows.map((rv) => ({
    id: rv.id,
    author: rv.author,
    productName: rv.product.name,
    rating: rv.rating,
    text: rv.text,
    status: rv.status,
    verified: rv.verified,
    createdAt: rv.createdAt.toISOString(),
  }));
}

export interface AdminAuditRow {
  id: string;
  createdAt: string;
  actorEmail: string;
  actorRole: string;
  action: string;
  target: string;
  detail: string;
}

export async function adminAuditLog(limit = 200): Promise<AdminAuditRow[]> {
  const rows = await db.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return rows.map((l) => ({
    id: l.id,
    createdAt: l.createdAt.toISOString(),
    actorEmail: l.actorEmail,
    actorRole: l.actorRole,
    action: l.action,
    target: l.target,
    detail: l.detail,
  }));
}

export interface AdminSettingRow {
  key: string;
  value: string;
  updatedAt: string;
}

export async function adminSettings(): Promise<AdminSettingRow[]> {
  const rows = await db.setting.findMany({ orderBy: { key: "asc" } });
  return rows.map((s) => ({
    key: s.key,
    value: s.value,
    updatedAt: s.updatedAt.toISOString(),
  }));
}

/**
 * Analitika — bazadakı faktiki qeydlərdən.
 *
 * Səhifə baxışı sayğacı yoxdur (PRD §126 hadisə toplama qatı hələ
 * qurulmayıb), ona görə burada yalnız real biznes göstəriciləri var:
 * konfiqurasiya → təklif → sifariş dönüşümü və aylıq dövriyyə.
 */
export async function adminAnalytics() {
  const [configurations, quotes, orders, repairs, measurements, monthly] = await Promise.all([
    db.configuration.count(),
    db.quoteRequest.count(),
    db.order.count({ where: { archivedAt: null } }),
    db.repairRequest.count({ where: { archivedAt: null } }),
    db.measurementRequest.count(),
    db.order.findMany({ where: { archivedAt: null }, select: { createdAt: true, total: true }, orderBy: { createdAt: "asc" } }),
  ]);

  const byMonth = new Map<string, { orders: number; revenue: number }>();
  for (const order of monthly) {
    const key = order.createdAt.toISOString().slice(0, 7);
    const current = byMonth.get(key) ?? { orders: 0, revenue: 0 };
    byMonth.set(key, { orders: current.orders + 1, revenue: current.revenue + order.total });
  }

  const top = Math.max(configurations, quotes, orders, repairs, measurements, 1);

  return {
    funnel: [
      { key: "configurations", count: configurations },
      { key: "quotes", count: quotes },
      { key: "orders", count: orders },
      { key: "repairs", count: repairs },
      { key: "measurements", count: measurements },
    ].map((row) => ({ ...row, share: Math.round((row.count / top) * 100) })),
    conversion: {
      configurationToOrder: configurations > 0 ? (orders / configurations) * 100 : null,
      quoteToOrder: quotes > 0 ? (orders / quotes) * 100 : null,
    },
    months: [...byMonth.entries()].map(([month, v]) => ({ month, ...v })).reverse(),
  };
}

export type AdminAnalytics = Awaited<ReturnType<typeof adminAnalytics>>;
