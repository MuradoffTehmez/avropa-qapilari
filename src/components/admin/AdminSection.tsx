"use client";
import { LocalManager } from "@/components/admin/LocalManager";
import { DemoActivity } from "@/components/account/DemoActivity";
import { notFound } from "next/navigation";


import { getDictionary } from "@/i18n";
import type { Locale } from "@/types";
import { formatDate, formatDateTime, formatNumber, formatPrice } from "@/lib/utils";
import { Badge, Card, DataRow, Notice, Rating } from "@/components/ui/primitives";

import { AdminPageHeader, DataTable } from "@/components/admin/DataTable";
import { OrderStatusPill, RepairStatusPill } from "@/components/account/StatusPill";
import { DoorVisual } from "@/components/product/DoorVisual";
import { materialLabels, products } from "@/mock/products";
import { brands, categories } from "@/mock/taxonomy";
import { optionGroups } from "@/mock/options";
import { reviews, technicians } from "@/mock/content";
import {
  appointments,
  demoUser,
  measurements,
  orders,
  quotes,
  repairRequests,
  warranties,
} from "@/mock/account";

const sections = [
  "products",
  "categories",
  "brands",
  "configurator",
  "orders",
  "quotes",
  "discounts",
  "repairs",
  "measurements",
  "appointments",
  "technicians",
  "roles",
  "customers",
  "inventory",
  "warranty",
  "reviews",
  "content",
  "seo",
  "analytics",
  "audit",
  "settings",
] as const;

type Section = (typeof sections)[number];

export function AdminSection({ locale, section }: { locale: Locale; section: string }) {
  const dict = getDictionary(locale);
  if (!sections.includes(section as Section)) notFound();

  const addButton = (label: string) => <LocalManager section={section} label={label} />;

  /* ---------------------------------------------------------- PRODUCTS */
  if (section === "products") {
    return (
      <><DemoActivity section={section} locale={locale} manage />
        <AdminPageHeader
          title={dict.admin.products}
          description={`${products.length} model · ${categories.length} kateqoriya`}
          action={addButton("Yeni məhsul")}
        />
        <DataTable
          title={dict.admin.products}
          minWidth={900}
          rows={products}
          columns={[
            {
              key: "product",
              header: "Məhsul",
              render: (p) => (
                <div className="flex items-center gap-3">
                  <span className="aspect-3/4 w-9 shrink-0 overflow-hidden border border-line bg-bone">
                    <DoorVisual panelHex={p.panelHexes[0]} style={p.style} ambient={false} />
                  </span>
                  <span>
                    <span className="block font-medium text-ink">{p.name}</span>
                    <span className="block font-mono text-[11px] text-stone">{p.sku}</span>
                  </span>
                </div>
              ),
            },
            {
              key: "category",
              header: "Kateqoriya",
              render: (p) => (
                <span className="text-graphite">
                  {categories.find((c) => c.slug === p.categorySlug)?.name}
                </span>
              ),
            },
            {
              key: "brand",
              header: "Brend",
              render: (p) => (
                <span className="text-graphite">
                  {brands.find((b) => b.slug === p.brandSlug)?.name}
                </span>
              ),
            },
            { key: "material", header: "Material", render: (p) => materialLabels[p.material] },
            { key: "security", header: "Sinif", render: (p) => p.securityClass },
            {
              key: "price",
              header: "Qiymət",
              align: "right",
              render: (p) => (
                <span className="font-medium tabular-nums text-ink">{formatPrice(p.basePrice)}</span>
              ),
            },
            {
              key: "stock",
              header: "Stok",
              align: "center",
              render: (p) => (
                <Badge tone={p.inStock ? "success" : "neutral"}>
                  {p.inStock ? "Var" : "Sifarişlə"}
                </Badge>
              ),
            },
          ]}
        />
      </>
    );
  }

  /* -------------------------------------------------------- CATEGORIES */
  if (section === "categories") {
    return (
      <><DemoActivity section={section} locale={locale} manage />
        <AdminPageHeader title={dict.admin.categories} action={addButton("Yeni kateqoriya")} />
        <DataTable
          title={dict.admin.categories}
          minWidth={640}
          rows={categories}
          columns={[
            { key: "name", header: "Ad", render: (c) => <span className="font-medium text-ink">{c.name}</span> },
            { key: "slug", header: "Slug", render: (c) => <code className="text-[12px] text-stone">{c.slug}</code> },
            { key: "count", header: "Məhsul", align: "right", render: (c) => c.productCount },
            {
              key: "featured",
              header: "Ana səhifə",
              align: "center",
              render: (c) => (c.featured ? <Badge tone="success">Bəli</Badge> : <span className="text-mist">—</span>),
            },
          ]}
        />
      </>
    );
  }

  /* ------------------------------------------------------------ BRANDS */
  if (section === "brands") {
    return (
      <><DemoActivity section={section} locale={locale} manage />
        <AdminPageHeader title={dict.admin.brands} action={addButton("Yeni brend")} />
        <DataTable
          title={dict.admin.brands}
          minWidth={640}
          rows={brands}
          columns={[
            { key: "name", header: "Ad", render: (b) => <span className="font-medium text-ink">{b.name}</span> },
            { key: "country", header: "Ölkə", render: (b) => b.country },
            { key: "founded", header: "Təsis", align: "right", render: (b) => b.founded },
            {
              key: "count",
              header: "Model",
              align: "right",
              render: (b) => products.filter((p) => p.brandSlug === b.slug).length,
            },
          ]}
        />
      </>
    );
  }

  /* ------------------------------------------------------ CONFIGURATOR */
  if (section === "configurator") {
    const groups = Object.values(optionGroups).filter((g) => g.values.length > 0);
    return (
      <><DemoActivity section={section} locale={locale} manage />
        <AdminPageHeader
          title={dict.admin.configurator}
          description="Option qrupları və dəyərləri (PRD §96, §97)"
          action={addButton("Yeni option")}
        />
        <div className="space-y-4">
          {groups.map((g) => (
            <DataTable
              key={g.key}
              title={`${g.title} · ${g.key}`}
              description={g.hint}
              minWidth={720}
              rows={g.values}
              columns={[
                {
                  key: "label",
                  header: "Dəyər",
                  render: (v) => (
                    <span className="flex items-center gap-2.5">
                      {v.hex && (
                        <span
                          className="h-5 w-5 shrink-0 rounded-[2px] border border-line"
                          style={{ background: v.swatch ?? v.hex }}
                        />
                      )}
                      <span className="font-medium text-ink">{v.label}</span>
                    </span>
                  ),
                },
                { key: "code", header: "Kod", render: (v) => <code className="text-[12px] text-stone">{v.code}</code> },
                {
                  key: "delta",
                  header: "Qiymət",
                  align: "right",
                  render: (v) => (
                    <span className="tabular-nums text-graphite">
                      {v.priceDelta === 0 ? "—" : `+${formatPrice(v.priceDelta)}`}
                    </span>
                  ),
                },
                {
                  key: "rules",
                  header: "Uyğunluq",
                  render: (v) =>
                    v.requires?.length ? (
                      <Badge tone="warning">tələb edir: {v.requires.length}</Badge>
                    ) : (
                      <span className="text-mist">—</span>
                    ),
                },
              ]}
            />
          ))}
        </div>
      </>
    );
  }

  /* ------------------------------------------------------------ ORDERS */
  if (section === "orders") {
    return (
      <><DemoActivity section={section} locale={locale} manage />
        <AdminPageHeader title={dict.admin.orders} description={`${orders.length} sifariş`} />
        <DataTable
          title={dict.admin.orders}
          minWidth={860}
          rows={orders}
          columns={[
            { key: "number", header: "Nömrə", render: (o) => <code className="text-[12px] text-graphite">{o.number}</code> },
            { key: "date", header: "Tarix", render: (o) => formatDate(o.createdAt) },
            { key: "customer", header: "Müştəri", render: (o) => <span className="text-ink">{o.customerName}</span> },
            { key: "city", header: "Şəhər", render: (o) => o.city },
            { key: "items", header: "Məhsul", align: "center", render: (o) => o.itemCount },
            {
              key: "install",
              header: "Quraşdırma",
              align: "center",
              render: (o) => (o.installation ? <Badge tone="info">Bəli</Badge> : <span className="text-mist">—</span>),
            },
            {
              key: "status",
              header: "Status",
              render: (o) => <OrderStatusPill status={o.status} label={dict.orderStatus[o.status]} />,
            },
            {
              key: "total",
              header: "Məbləğ",
              align: "right",
              render: (o) => <span className="font-medium tabular-nums text-ink">{formatPrice(o.total)}</span>,
            },
          ]}
        />
      </>
    );
  }

  /* ------------------------------------------------------------ QUOTES */
  if (section === "quotes") {
    return (
      <><DemoActivity section={section} locale={locale} manage />
        <AdminPageHeader title={dict.admin.quotes} description="Qiymət təklifi sorğuları (PRD §66)" />
        <DataTable
          title={dict.admin.quotes}
          minWidth={720}
          rows={quotes}
          columns={[
            { key: "number", header: "Nömrə", render: (q) => <code className="text-[12px] text-graphite">{q.number}</code> },
            { key: "date", header: "Tarix", render: (q) => formatDate(q.createdAt) },
            { key: "customer", header: "Müştəri", render: (q) => q.customerName },
            { key: "subject", header: "Mövzu", render: (q) => <span className="text-ink">{q.subject}</span> },
            { key: "status", header: "Status", render: (q) => <Badge tone="brass">{q.status}</Badge> },
            {
              key: "amount",
              header: "Məbləğ",
              align: "right",
              render: (q) => (q.amount ? formatPrice(q.amount) : <span className="text-mist">—</span>),
            },
          ]}
        />
      </>
    );
  }

  /* ----------------------------------------------------------- REPAIRS */
  if (section === "repairs") {
    return (
      <><DemoActivity section={section} locale={locale} manage />
        <AdminPageHeader title={dict.admin.repairs} description="Təmir müraciətləri (PRD §69–§77)" />
        <DataTable
          title={dict.admin.repairs}
          minWidth={900}
          rows={repairRequests}
          columns={[
            { key: "number", header: "Nömrə", render: (rp) => <code className="text-[12px] text-graphite">{rp.number}</code> },
            { key: "date", header: "Tarix", render: (rp) => formatDate(rp.createdAt) },
            { key: "category", header: "Problem", render: (rp) => <span className="text-ink">{dict.repair.categories[rp.category]}</span> },
            { key: "customer", header: "Müştəri", render: (rp) => rp.customerName },
            { key: "address", header: "Ünvan", render: (rp) => <span className="text-stone">{rp.address}</span> },
            {
              key: "tech",
              header: "Usta",
              render: (rp) => rp.technician ?? <Badge tone="warning">Təyin edilməyib</Badge>,
            },
            {
              key: "status",
              header: "Status",
              render: (rp) => <RepairStatusPill status={rp.status} label={dict.repairStatus[rp.status]} />,
            },
          ]}
        />
      </>
    );
  }

  /* ------------------------------------------------------ MEASUREMENTS */
  if (section === "measurements") {
    return (
      <><DemoActivity section={section} locale={locale} manage />
        <AdminPageHeader title={dict.admin.measurements} description="Ölçü sifarişləri (PRD §67, §68)" />
        <DataTable
          title={dict.admin.measurements}
          minWidth={800}
          rows={measurements}
          columns={[
            { key: "number", header: "Nömrə", render: (m) => <code className="text-[12px] text-graphite">{m.number}</code> },
            { key: "property", header: "Obyekt", render: (m) => dict.measurement.property[m.propertyType] },
            { key: "doors", header: "Qapı", align: "center", render: (m) => m.doorCount },
            { key: "address", header: "Ünvan", render: (m) => <span className="text-stone">{m.address}</span> },
            { key: "date", header: "Tarix", render: (m) => formatDate(m.preferredDate) },
            { key: "tech", header: "Usta", render: (m) => m.technician ?? "—" },
            { key: "status", header: "Status", render: (m) => <Badge tone="brass">{m.status}</Badge> },
          ]}
        />
      </>
    );
  }

  /* ------------------------------------------------------ APPOINTMENTS */
  if (section === "appointments") {
    return (
      <><DemoActivity section={section} locale={locale} manage />
        <AdminPageHeader
          title={dict.admin.appointments}
          description="Görüş cədvəli — usta üzrə overlap serverdə bloklanır (PRD §79)"
        />
        <DataTable
          title={dict.admin.appointments}
          minWidth={800}
          rows={appointments}
          columns={[
            { key: "date", header: "Tarix", render: (a) => formatDate(a.date) },
            { key: "time", header: "Saat", render: (a) => `${a.startTime} – ${a.endTime}` },
            { key: "type", header: "Növ", render: (a) => <Badge tone="info">{a.type}</Badge> },
            {
              key: "tech",
              header: "Usta",
              render: (a) => technicians.find((t) => t.id === a.technicianId)?.name ?? "—",
            },
            { key: "address", header: "Ünvan", render: (a) => <span className="text-stone">{a.address}</span> },
            { key: "ref", header: "İstinad", render: (a) => <code className="text-[12px] text-graphite">{a.reference}</code> },
            { key: "status", header: "Status", render: (a) => <Badge tone="brass">{a.status}</Badge> },
          ]}
        />
      </>
    );
  }

  /* ------------------------------------------------------- TECHNICIANS */
  if (section === "technicians") {
    return (
      <><DemoActivity section={section} locale={locale} manage />
        <AdminPageHeader title={dict.admin.technicians} action={addButton("Yeni usta")} />
        <DataTable
          title={dict.admin.technicians}
          minWidth={860}
          rows={technicians}
          columns={[
            { key: "name", header: "Ad", render: (t) => <span className="font-medium text-ink">{t.name}</span> },
            { key: "phone", header: "Telefon", render: (t) => t.phone },
            { key: "spec", header: "İxtisas", render: (t) => <span className="text-stone">{t.specialization.join(", ")}</span> },
            { key: "areas", header: "Ərazi", render: (t) => <span className="text-stone">{t.serviceAreas.join(", ")}</span> },
            { key: "jobs", header: "İş", align: "right", render: (t) => t.completedJobs },
            { key: "rating", header: "Reytinq", align: "right", render: (t) => <Rating value={t.rating} /> },
            {
              key: "status",
              header: "Status",
              render: (t) => (
                <Badge tone={t.status === "AVAILABLE" ? "success" : t.status === "ON_JOB" ? "brass" : "neutral"}>
                  {t.status}
                </Badge>
              ),
            },
          ]}
        />
      </>
    );
  }

  /* ------------------------------------------------------------- ROLES */
  if (section === "roles") {
    const permissions = [
      "product.view", "product.create", "product.update", "product.delete",
      "order.view", "order.update", "repair.assign", "user.manage", "setting.manage",
    ];
    const matrix: { fn: string; superAdmin: string; admin: string; editor: string; technician: string }[] = [
      { fn: "Məhsullar", superAdmin: "Tam", admin: "Tam", editor: "Redaktə", technician: "Yox" },
      { fn: "Sifarişlər", superAdmin: "Tam", admin: "Tam", editor: "Yox", technician: "Təyin olunan" },
      { fn: "Təmir", superAdmin: "Tam", admin: "Tam", editor: "Yox", technician: "Təyin olunan" },
      { fn: "Müştərilər", superAdmin: "Tam", admin: "Tam", editor: "Yox", technician: "Məhdud" },
      { fn: "Maliyyə", superAdmin: "Tam", admin: "Baxış", editor: "Yox", technician: "Yox" },
      { fn: "Rollar / RBAC", superAdmin: "Tam", admin: "Yox", editor: "Yox", technician: "Yox" },
      { fn: "Sistem tənzimləmələri", superAdmin: "Tam", admin: "Yox", editor: "Yox", technician: "Yox" },
    ];

    return (
      <><DemoActivity section={section} locale={locale} manage />
        <AdminPageHeader title={dict.admin.roles} description="RBAC — resource.action formatı (PRD §93, §94)" />

        <div className="space-y-4">
          <DataTable
            title="Rol matrisi"
            minWidth={720}
            rows={matrix}
            columns={[
              { key: "fn", header: "Funksiya", render: (m) => <span className="font-medium text-ink">{m.fn}</span> },
              { key: "sa", header: "Super Admin", align: "center", render: (m) => m.superAdmin },
              { key: "a", header: "Admin", align: "center", render: (m) => m.admin },
              { key: "e", header: "Editor", align: "center", render: (m) => m.editor },
              { key: "t", header: "Technician", align: "center", render: (m) => m.technician },
            ]}
          />

          <Card className="p-5">
            <h2 className="mb-4 text-[13px] font-semibold text-ink">İcazə açarları</h2>
            <div className="flex flex-wrap gap-2">
              {permissions.map((p) => (
                <code
                  key={p}
                  className="rounded-[2px] border border-line bg-bone px-2 py-1 text-[12px] text-graphite"
                >
                  {p}
                </code>
              ))}
            </div>
          </Card>
        </div>
      </>
    );
  }

  /* --------------------------------------------------------- CUSTOMERS */
  if (section === "customers") {
    const customers = [
      { name: `${demoUser.name} ${demoUser.surname}`, email: demoUser.email, phone: demoUser.phone, orders: 3, total: 5180, since: demoUser.memberSince },
      { name: "Nigar Abbasova", email: "nigar@example.com", phone: "+994 55 111 11 11", orders: 1, total: 1860, since: "2026-03-14" },
      { name: "Kamran Səfərov", email: "kamran@example.com", phone: "+994 70 222 22 22", orders: 2, total: 4720, since: "2025-08-02" },
      { name: "Elvin Məmmədov", email: "elvin@example.com", phone: "+994 50 333 33 33", orders: 1, total: 2340, since: "2026-06-30" },
    ];

    return (
      <><DemoActivity section={section} locale={locale} manage />
        <AdminPageHeader title={dict.admin.customers} description={`${customers.length} müştəri`} />
        <DataTable
          title={dict.admin.customers}
          minWidth={800}
          rows={customers}
          columns={[
            { key: "name", header: "Ad", render: (c) => <span className="font-medium text-ink">{c.name}</span> },
            { key: "email", header: "E-poçt", render: (c) => <span className="text-stone">{c.email}</span> },
            { key: "phone", header: "Telefon", render: (c) => c.phone },
            { key: "orders", header: "Sifariş", align: "center", render: (c) => c.orders },
            {
              key: "total",
              header: "Ümumi",
              align: "right",
              render: (c) => <span className="font-medium tabular-nums text-ink">{formatPrice(c.total)}</span>,
            },
            { key: "since", header: "Qeydiyyat", render: (c) => formatDate(c.since) },
          ]}
        />
      </>
    );
  }

  /* --------------------------------------------------------- INVENTORY */
  if (section === "inventory") {
    const stock = products.slice(0, 10).map((p, i) => ({
      product: p,
      onHand: p.inStock ? 12 - i : 0,
      reserved: p.inStock ? Math.max(0, 4 - i) : 0,
      threshold: 3,
    }));

    return (
      <><DemoActivity section={section} locale={locale} manage />
        <AdminPageHeader title={dict.admin.inventory} description="Stok, rezervasiya və minimum həddlər (PRD §98–§101)" />
        <DataTable
          title={dict.admin.stock}
          minWidth={780}
          rows={stock}
          columns={[
            {
              key: "product",
              header: "Məhsul",
              render: (s) => (
                <span>
                  <span className="block font-medium text-ink">{s.product.name}</span>
                  <span className="block font-mono text-[11px] text-stone">{s.product.sku}</span>
                </span>
              ),
            },
            { key: "onHand", header: "Anbarda", align: "right", render: (s) => <span className="tabular-nums">{s.onHand}</span> },
            { key: "reserved", header: "Rezerv", align: "right", render: (s) => <span className="tabular-nums text-stone">{s.reserved}</span> },
            {
              key: "available",
              header: "Əlçatan",
              align: "right",
              render: (s) => <span className="font-medium tabular-nums text-ink">{s.onHand - s.reserved}</span>,
            },
            {
              key: "state",
              header: "Vəziyyət",
              align: "center",
              render: (s) =>
                s.onHand === 0 ? (
                  <Badge tone="neutral">Sifarişlə</Badge>
                ) : s.onHand - s.reserved <= s.threshold ? (
                  <Badge tone="danger">Az qalıb</Badge>
                ) : (
                  <Badge tone="success">Normal</Badge>
                ),
            },
          ]}
        />
      </>
    );
  }

  /* ---------------------------------------------------------- WARRANTY */
  if (section === "warranty") {
    return (
      <><DemoActivity section={section} locale={locale} manage />
        <AdminPageHeader title={dict.admin.warranty} description="Serial nömrəyə bağlı zəmanətlər (PRD §81, §82)" />
        <DataTable
          title={dict.admin.warranty}
          minWidth={860}
          rows={warranties}
          columns={[
            { key: "number", header: "Nömrə", render: (w) => <code className="text-[12px] text-graphite">{w.number}</code> },
            { key: "serial", header: "Serial", render: (w) => <code className="text-[12px] text-ink">{w.serialNumber}</code> },
            { key: "product", header: "Məhsul", render: (w) => w.productName },
            { key: "order", header: "Sifariş", render: (w) => <code className="text-[12px] text-stone">{w.orderNumber}</code> },
            { key: "install", header: "Quraşdırma", render: (w) => formatDate(w.installationDate) },
            { key: "end", header: "Bitmə", render: (w) => formatDate(w.endDate) },
            {
              key: "status",
              header: "Status",
              render: (w) => <Badge tone={w.status === "ACTIVE" ? "success" : "neutral"}>{w.status}</Badge>,
            },
          ]}
        />
      </>
    );
  }

  /* ----------------------------------------------------------- REVIEWS */
  if (section === "reviews") {
    return (
      <><DemoActivity section={section} locale={locale} manage />
        <AdminPageHeader title={dict.admin.reviews} description="Moderasiya növbəsi (PRD §103)" />
        <DataTable
          title={dict.admin.reviews}
          minWidth={860}
          rows={reviews}
          columns={[
            { key: "author", header: "Müəllif", render: (rv) => <span className="font-medium text-ink">{rv.author}</span> },
            { key: "product", header: "Məhsul", render: (rv) => rv.productName },
            { key: "rating", header: "Reytinq", render: (rv) => <Rating value={rv.rating} /> },
            { key: "text", header: "Mətn", render: (rv) => <span className="line-clamp-2 max-w-md text-stone">{rv.text}</span> },
            { key: "date", header: "Tarix", render: (rv) => formatDate(rv.date) },
            {
              key: "status",
              header: "Status",
              render: (rv) => <Badge tone={rv.verified ? "success" : "warning"}>{rv.verified ? "Təsdiqlənib" : "Gözləyir"}</Badge>,
            },
          ]}
        />
      </>
    );
  }

  /* ----------------------------------------------------------- CONTENT */
  if (section === "content") {
    const pages = [
      { title: "Ana səhifə", path: "/", updated: "2026-08-30", status: "Dərc olunub" },
      { title: "Haqqımızda", path: "/haqqimizda", updated: "2026-08-12", status: "Dərc olunub" },
      { title: "Xidmətlər", path: "/xidmetler", updated: "2026-08-22", status: "Dərc olunub" },
      { title: "FAQ", path: "/faq", updated: "2026-09-01", status: "Dərc olunub" },
      { title: "Məxfilik siyasəti", path: "/legal/privacy", updated: "2026-07-05", status: "Qaralama" },
    ];

    return (
      <><DemoActivity section={section} locale={locale} manage />
        <AdminPageHeader title={dict.admin.content} action={addButton("Yeni səhifə")} />
        <DataTable
          title={dict.admin.pages}
          minWidth={640}
          rows={pages}
          columns={[
            { key: "title", header: "Başlıq", render: (p) => <span className="font-medium text-ink">{p.title}</span> },
            { key: "path", header: "URL", render: (p) => <code className="text-[12px] text-stone">{p.path}</code> },
            { key: "updated", header: "Yenilənib", render: (p) => formatDate(p.updated) },
            {
              key: "status",
              header: "Status",
              render: (p) => <Badge tone={p.status === "Dərc olunub" ? "success" : "warning"}>{p.status}</Badge>,
            },
          ]}
        />
      </>
    );
  }

  /* --------------------------------------------------------------- SEO */
  if (section === "seo") {
    return (
      <><DemoActivity section={section} locale={locale} manage />
        <LocalManager section="seo" label="SEO məlumatı əlavə et" />
        <AdminPageHeader title={dict.admin.seo} description="Metadata, sitemap və structured data (PRD §107–§111)" />
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="p-5">
            <h2 className="mb-4 text-[13px] font-semibold text-ink">Texniki SEO vəziyyəti</h2>
            <dl>
              <DataRow label="Sitemap" value={<Badge tone="success">Aktiv</Badge>} />
              <DataRow label="robots.txt" value={<Badge tone="success">Aktiv</Badge>} />
              <DataRow label="Canonical" value={<Badge tone="success">Aktiv</Badge>} />
              <DataRow label="hreflang (az/en/ru)" value={<Badge tone="success">Aktiv</Badge>} />
              <DataRow label="Product schema" value={<Badge tone="success">Aktiv</Badge>} />
              <DataRow label="FAQ schema" value={<Badge tone="success">Aktiv</Badge>} />
              <DataRow label="Open Graph" value={<Badge tone="success">Aktiv</Badge>} />
            </dl>
          </Card>

          <Card className="p-5">
            <h2 className="mb-4 text-[13px] font-semibold text-ink">Performans hədəfləri (PRD §112)</h2>
            <dl>
              <DataRow label="LCP" value="≤ 2.5 s" />
              <DataRow label="INP" value="≤ 200 ms" />
              <DataRow label="CLS" value="≤ 0.1" />
              <DataRow label="Server Components" value="Default" />
              <DataRow label="Şəkil formatları" value="AVIF / WebP" />
            </dl>
          </Card>
        </div>
      </>
    );
  }

  /* --------------------------------------------------------- ANALYTICS */
  if (section === "analytics") {
    const funnel = [
      { step: "Kataloq baxışı", value: 12480, rate: "100%" },
      { step: "Məhsul səhifəsi", value: 5240, rate: "42%" },
      { step: "Konfiqurator açılışı", value: 1980, rate: "16%" },
      { step: "Konfiqurasiya tamamlanması", value: 860, rate: "6.9%" },
      { step: "Səbətə əlavə", value: 520, rate: "4.2%" },
      { step: "Checkout başlanğıcı", value: 310, rate: "2.5%" },
      { step: "Sifariş", value: 148, rate: "1.2%" },
    ];

    return (
      <><DemoActivity section={section} locale={locale} manage />
        <AdminPageHeader title={dict.admin.analytics} description="Konversiya hunisi (PRD §126, §127)" />
        <DataTable
          title="Konversiya hunisi — son 30 gün"
          minWidth={560}
          rows={funnel}
          columns={[
            { key: "step", header: "Mərhələ", render: (f) => <span className="font-medium text-ink">{f.step}</span> },
            { key: "value", header: "Say", align: "right", render: (f) => <span className="tabular-nums">{formatNumber(f.value)}</span> },
            { key: "rate", header: "Nisbət", align: "right", render: (f) => <span className="tabular-nums text-stone">{f.rate}</span> },
            {
              key: "bar",
              header: "",
              render: (f) => (
                <span className="block h-2 w-full max-w-[160px] bg-sand">
                  <span
                    className="block h-full bg-brass-400"
                    style={{ width: f.rate }}
                  />
                </span>
              ),
            },
          ]}
        />
      </>
    );
  }

  /* ------------------------------------------------------------- AUDIT */
  if (section === "audit") {
    const logs = [
      { at: "2026-09-05T09:12:00.000Z", actor: "Super Admin", action: "order.update", target: "ORD-2026-000184", detail: "Status: PROCESSING → MANUFACTURING" },
      { at: "2026-09-04T16:40:00.000Z", actor: "Admin", action: "repair.assign", target: "REP-2026-000128", detail: "Usta: Əli Məmmədov" },
      { at: "2026-09-04T11:05:00.000Z", actor: "Editor", action: "product.update", target: "MIL-720", detail: "Təsvir yeniləndi" },
      { at: "2026-09-03T14:22:00.000Z", actor: "Super Admin", action: "setting.manage", target: "pricing", detail: "Ölçü qaydası əlavə edildi" },
      { at: "2026-09-02T10:31:00.000Z", actor: "Admin", action: "product.create", target: "SMG-S2", detail: "Yeni məhsul yaradıldı" },
    ];

    return (
      <><DemoActivity section={section} locale={locale} manage />
        <AdminPageHeader title={dict.admin.auditLogs} description="Kritik əməliyyatların izi (PRD §128)" />
        <DataTable
          title={dict.admin.auditLogs}
          minWidth={780}
          rows={logs}
          columns={[
            { key: "at", header: "Vaxt", render: (l) => formatDateTime(l.at) },
            { key: "actor", header: "İstifadəçi", render: (l) => <span className="font-medium text-ink">{l.actor}</span> },
            { key: "action", header: "Əməliyyat", render: (l) => <code className="text-[12px] text-graphite">{l.action}</code> },
            { key: "target", header: "Obyekt", render: (l) => <code className="text-[12px] text-stone">{l.target}</code> },
            { key: "detail", header: "Detal", render: (l) => <span className="text-stone">{l.detail}</span> },
          ]}
        />
      </>
    );
  }

  /* ---------------------------------------------------------- SETTINGS */
  if (section === "settings") {
    return (
      <><DemoActivity section={section} locale={locale} manage />
        <LocalManager section="settings" label="Parametrləri redaktə et" />
        <AdminPageHeader title={dict.admin.settings} description="Platforma konfiqurasiyası" />
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="p-5">
            <h2 className="mb-4 text-[13px] font-semibold text-ink">Ümumi</h2>
            <dl>
              <DataRow label="Sayt adı" value="EuroPorta (demo)" />
              <DataRow label="Valyuta" value="AZN" />
              <DataRow label="Default dil" value="Azərbaycan" />
              <DataRow label="Dəstəklənən dillər" value="AZ / EN / RU" />
              <DataRow label="Vaxt zonası" value="Asia/Baku" />
            </dl>
          </Card>

          <Card className="p-5">
            <h2 className="mb-4 text-[13px] font-semibold text-ink">Planlaşdırılan inteqrasiyalar</h2>
            <dl>
              <DataRow label="Cloudflare D1" value={<Badge tone="warning">Gözləyir</Badge>} />
              <DataRow label="Cloudflare R2" value={<Badge tone="warning">Gözləyir</Badge>} />
              <DataRow label="Cloudflare Images" value={<Badge tone="warning">Gözləyir</Badge>} />
              <DataRow label="Turnstile" value={<Badge tone="warning">Gözləyir</Badge>} />
              <DataRow label="Ödəniş provayderi" value={<Badge tone="warning">Gözləyir</Badge>} />
              <DataRow label="E-poçt Queue" value={<Badge tone="warning">Gözləyir</Badge>} />
            </dl>
          </Card>
        </div>

        <Notice tone="warning" className="mt-4">
          {dict.admin.readOnlyNotice}
        </Notice>
      </>
    );
  }

  /* --------------------------------------------------------- DISCOUNTS */
  const discounts = [
    { code: "YAZ2026", type: "Faiz", value: "10%", scope: "Bütün kataloq", from: "2026-03-01", to: "2026-04-30", status: "Bitib" },
    { code: "SMART200", type: "Məbləğ", value: "200 AZN", scope: "Smart qapılar", from: "2026-08-01", to: "2026-09-30", status: "Aktiv" },
    { code: "INSTALL0", type: "Xidmət", value: "Pulsuz quraşdırma", scope: "3+ qapı", from: "2026-09-01", to: "2026-10-31", status: "Aktiv" },
  ];

  return (
    <>
      <AdminPageHeader title={dict.admin.discounts} action={addButton("Yeni endirim")} />
      <DataTable
        title={dict.admin.discounts}
        minWidth={780}
        rows={discounts}
        columns={[
          { key: "code", header: "Kod", render: (d) => <code className="text-[12px] font-semibold text-ink">{d.code}</code> },
          { key: "type", header: "Növ", render: (d) => d.type },
          { key: "value", header: "Dəyər", render: (d) => <span className="font-medium text-ink">{d.value}</span> },
          { key: "scope", header: "Əhatə", render: (d) => <span className="text-stone">{d.scope}</span> },
          { key: "period", header: "Müddət", render: (d) => `${formatDate(d.from)} – ${formatDate(d.to)}` },
          {
            key: "status",
            header: "Status",
            render: (d) => <Badge tone={d.status === "Aktiv" ? "success" : "neutral"}>{d.status}</Badge>,
          },
        ]}
      />
    </>
  );
}
