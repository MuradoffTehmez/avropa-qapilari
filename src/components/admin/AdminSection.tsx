"use client";
import { LocalManager } from "@/components/admin/LocalManager";
import { ActivityFeed } from "@/components/account/ActivityFeed";
import { notFound } from "next/navigation";


import { getDictionary } from "@/i18n";
import type { Locale } from "@/types";
import { formatDate, formatDateTime, formatNumber, formatPrice } from "@/lib/utils";
import { Badge, Card, DataRow, Rating } from "@/components/ui/primitives";

import { AdminPageHeader, DataTable } from "@/components/admin/DataTable";
import {
  OrderStatusControl,
  RepairStatusControl,
  TechnicianControl,
} from "@/components/admin/AdminControls";
import { ProductMedia } from "@/components/product/ProductMedia";
import { getProduct } from "@/mock/products";
import { optionLabelById } from "@/mock/options.i18n";
import { localizedReviews } from "@/mock/content.i18n";
import {
  categoryNameBySlug,
  countryNameByCode,
  materialName,
  specializationName,
} from "@/lib/i18n-format";
import type { AdminData } from "@/server/admin";

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

export function AdminSection({
  locale,
  section,
  data,
}: {
  locale: Locale;
  section: string;
  /** Bazadan gələn sətirlər; bölməyə uyğun sahə doldurulur. */
  data: AdminData;
}) {
  const dict = getDictionary(locale);
  const ui = dict.adminUi;
  const label = ui.labels;
  if (!sections.includes(section as Section)) notFound();

  const addButton = (label: string) => <LocalManager section={section} label={label} />;

  /* ---------------------------------------------------------- PRODUCTS */
  if (section === "products") {
    const products = data.products ?? [];

    return (
      <><ActivityFeed section={section} locale={locale} manage />
        <AdminPageHeader
          title={dict.admin.products}
          description={`${products.length} ${ui.modelUnit}`}
          action={addButton(ui.newProduct)}
        />
        <DataTable
          title={dict.admin.products}
          minWidth={900}
          source="server"
          rows={products}
          columns={[
            {
              key: "product",
              header: label.product,
              render: (p) => (
                <div className="flex items-center gap-3">
                  <span className="aspect-3/4 w-9 shrink-0 overflow-hidden border border-line bg-bone">
                    <ProductMedia product={getProduct(p.slug)!} sizes="36px" />
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
              header: label.category,
              render: (p) => (
                <span className="text-graphite">
                  {categoryNameBySlug(p.categorySlug, dict, p.categorySlug)}
                </span>
              ),
            },
            {
              key: "brand",
              header: label.brand,
              render: (p) => <span className="text-graphite">{p.brandName}</span>,
            },
            { key: "material", header: label.material, render: (p) => materialName(p.material, dict) },
            { key: "security", header: label.securityClass, render: (p) => p.securityClass },
            {
              key: "price",
              header: label.price,
              align: "right",
              render: (p) => (
                <span className="font-medium tabular-nums text-ink">{formatPrice(p.basePrice)}</span>
              ),
            },
            {
              key: "stock",
              header: label.stock,
              align: "center",
              render: (p) => (
                <Badge tone={p.inStock ? "success" : "neutral"}>
                  {p.inStock ? ui.available : ui.toOrder}
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
      <><ActivityFeed section={section} locale={locale} manage />
        <AdminPageHeader title={dict.admin.categories} action={addButton(ui.newCategory)} />
        <DataTable
          title={dict.admin.categories}
          minWidth={640}
          source="server"
          rows={data.categories ?? []}
          columns={[
            { key: "name", header: label.name, render: (c) => <span className="font-medium text-ink">{categoryNameBySlug(c.slug, dict, c.name)}</span> },
            { key: "slug", header: "Slug", render: (c) => <code className="text-[12px] text-stone">{c.slug}</code> },
            { key: "count", header: label.product, align: "right", render: (c) => c.productCount },
          ]}
        />
      </>
    );
  }

  /* ------------------------------------------------------------ BRANDS */
  if (section === "brands") {
    return (
      <><ActivityFeed section={section} locale={locale} manage />
        <AdminPageHeader title={dict.admin.brands} action={addButton(ui.newBrand)} />
        <DataTable
          title={dict.admin.brands}
          minWidth={640}
          source="server"
          rows={data.brands ?? []}
          columns={[
            { key: "name", header: label.name, render: (b) => <span className="font-medium text-ink">{b.name}</span> },
            { key: "country", header: dict.adminUi.fields.country, render: (b) => countryNameByCode(b.country, dict) },
            { key: "founded", header: label.founded, align: "right", render: (b) => b.founded },
            { key: "count", header: label.model, align: "right", render: (b) => b.productCount },
          ]}
        />
      </>
    );
  }

  /* ------------------------------------------------------ CONFIGURATOR */
  if (section === "configurator") {
    const groups = data.optionGroups ?? [];
    return (
      <><ActivityFeed section={section} locale={locale} manage />
        <AdminPageHeader
          title={dict.admin.configurator}
          description={ui.optionsDescription}
          action={addButton(ui.newOption)}
        />
        <div className="space-y-4">
          {groups.map((g) => (
            <DataTable
              key={g.groupKey}
              title={`${dict.configurator.steps[g.groupKey]} · ${g.groupKey}`}
              description={dict.configurator.hints[g.groupKey]}
              minWidth={720}
              source="server"
              rows={g.values}
              columns={[
                {
                  key: "label",
                  header: label.value,
                  render: (v) => (
                    <span className="flex items-center gap-2.5">
                      {v.hex && (
                        <span
                          className="h-5 w-5 shrink-0 rounded-[2px] border border-line"
                          style={{ background: v.hex }}
                        />
                      )}
                      <span className="font-medium text-ink">
                        {optionLabelById(v.id, locale, v.label)}
                      </span>
                    </span>
                  ),
                },
                { key: "code", header: label.code, render: (v) => <code className="text-[12px] text-stone">{v.code}</code> },
                {
                  key: "delta",
                  header: label.price,
                  align: "right",
                  render: (v) => (
                    <span className="tabular-nums text-graphite">
                      {v.priceDelta === 0 ? "—" : `+${formatPrice(v.priceDelta)}`}
                    </span>
                  ),
                },
                {
                  key: "rules",
                  header: label.compatibility,
                  render: (v) =>
                    v.requiresCount > 0 ? (
                      <Badge tone="warning">{ui.requires}: {v.requiresCount}</Badge>
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
      <><ActivityFeed section={section} locale={locale} manage />
        <AdminPageHeader
          title={dict.admin.orders}
          description={`${(data.orders ?? []).length} ${ui.orderUnit}`}
        />
        <DataTable
          title={dict.admin.orders}
          minWidth={860}
          source="server"
          rows={data.orders ?? []}
          columns={[
            { key: "number", header: label.number, render: (o) => <code className="text-[12px] text-graphite">{o.number}</code> },
            { key: "date", header: label.date, render: (o) => formatDate(o.createdAt) },
            { key: "customer", header: label.customer, render: (o) => <span className="text-ink">{o.customerName}</span> },
            { key: "city", header: label.city, render: (o) => o.city },
            { key: "items", header: label.item, align: "center", render: (o) => o.itemCount },
            {
              key: "install",
              header: label.installation,
              align: "center",
              render: (o) => (o.installation ? <Badge tone="info">{dict.common.yes}</Badge> : <span className="text-mist">—</span>),
            },
            {
              key: "status",
              header: label.status,
              render: (o) => <OrderStatusControl number={o.number} status={o.status} />,
            },
            {
              key: "total",
              header: label.amount,
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
      <><ActivityFeed section={section} locale={locale} manage />
        <AdminPageHeader title={dict.admin.quotes} description={ui.quoteDescription} />
        <DataTable
          title={dict.admin.quotes}
          minWidth={720}
          source="server"
          rows={data.quotes ?? []}
          columns={[
            { key: "number", header: label.number, render: (q) => <code className="text-[12px] text-graphite">{q.number}</code> },
            { key: "date", header: label.date, render: (q) => formatDate(q.createdAt) },
            { key: "customer", header: label.customer, render: (q) => q.customerName },
            { key: "subject", header: label.subject, render: (q) => <span className="text-ink">{q.subject}</span> },
            { key: "status", header: label.status, render: (q) => <Badge tone="gold">{q.status === "SENT" ? dict.accountUi.quoteSent : q.status}</Badge> },
          ]}
        />
      </>
    );
  }

  /* ----------------------------------------------------------- REPAIRS */
  if (section === "repairs") {
    return (
      <><ActivityFeed section={section} locale={locale} manage />
        <AdminPageHeader title={dict.admin.repairs} description={ui.repairDescription} />
        <DataTable
          title={dict.admin.repairs}
          minWidth={900}
          source="server"
          rows={data.repairs ?? []}
          columns={[
            { key: "number", header: label.number, render: (rp) => <code className="text-[12px] text-graphite">{rp.number}</code> },
            { key: "date", header: label.date, render: (rp) => formatDate(rp.createdAt) },
            { key: "category", header: label.problem, render: (rp) => <span className="text-ink">{dict.repair.categories[rp.category]}</span> },
            { key: "customer", header: label.customer, render: (rp) => rp.customerName },
            { key: "address", header: dict.common.address, render: (rp) => <span className="text-stone">{rp.address}</span> },
            {
              key: "tech",
              header: label.technician,
              render: (rp) => (
                <TechnicianControl
                  kind="repair"
                  number={rp.number}
                  technicianId={rp.technicianId}
                  technicians={data.technicians ?? []}
                />
              ),
            },
            {
              key: "status",
              header: label.status,
              render: (rp) => <RepairStatusControl number={rp.number} status={rp.status} />,
            },
          ]}
        />
      </>
    );
  }

  /* ------------------------------------------------------ MEASUREMENTS */
  if (section === "measurements") {
    return (
      <><ActivityFeed section={section} locale={locale} manage />
        <AdminPageHeader title={dict.admin.measurements} description={ui.measurementDescription} />
        <DataTable
          title={dict.admin.measurements}
          minWidth={800}
          source="server"
          rows={data.measurements ?? []}
          columns={[
            { key: "number", header: label.number, render: (m) => <code className="text-[12px] text-graphite">{m.number}</code> },
            { key: "property", header: label.object, render: (m) => dict.measurement.property[m.propertyType] },
            { key: "doors", header: label.door, align: "center", render: (m) => m.doorCount },
            { key: "address", header: dict.common.address, render: (m) => <span className="text-stone">{m.address}</span> },
            { key: "date", header: label.date, render: (m) => formatDate(m.preferredDate) },
            {
              key: "tech",
              header: label.technician,
              render: (m) => (
                <TechnicianControl
                  kind="measurement"
                  number={m.number}
                  technicianId={m.technicianId}
                  technicians={data.technicians ?? []}
                />
              ),
            },
            { key: "status", header: label.status, render: (m) => <Badge tone="gold">{m.status === "SCHEDULED" ? dict.accountUi.statuses.scheduled : m.status}</Badge> },
          ]}
        />
      </>
    );
  }

  /* ------------------------------------------------------ APPOINTMENTS */
  if (section === "appointments") {
    return (
      <><ActivityFeed section={section} locale={locale} manage />
        <AdminPageHeader
          title={dict.admin.appointments}
          description={ui.appointmentDescription}
        />
        <DataTable
          title={dict.admin.appointments}
          minWidth={800}
          source="server"
          rows={data.appointments ?? []}
          columns={[
            { key: "date", header: label.date, render: (a) => formatDate(a.date) },
            { key: "time", header: label.time, render: (a) => `${a.startTime} – ${a.endTime}` },
            { key: "type", header: label.type, render: (a) => <Badge tone="info">{a.type === "REPAIR" ? dict.services.repair : a.type === "MEASUREMENT" ? dict.services.measurement : dict.services.installation}</Badge> },
            { key: "tech", header: label.technician, render: (a) => a.technician ?? "—" },
            { key: "address", header: dict.common.address, render: (a) => <span className="text-stone">{a.address}</span> },
            { key: "ref", header: label.reference, render: (a) => <code className="text-[12px] text-graphite">{a.reference}</code> },
            { key: "status", header: label.status, render: (a) => <Badge tone="gold">{a.status === "CONFIRMED" ? dict.accountUi.statuses.confirmed : dict.accountUi.statuses.scheduled}</Badge> },
          ]}
        />
      </>
    );
  }

  /* ------------------------------------------------------- TECHNICIANS */
  if (section === "technicians") {
    return (
      <><ActivityFeed section={section} locale={locale} manage />
        <AdminPageHeader title={dict.admin.technicians} action={addButton(ui.newTechnician)} />
        <DataTable
          title={dict.admin.technicians}
          minWidth={860}
          source="server"
          rows={data.technicians ?? []}
          columns={[
            { key: "name", header: label.name, render: (t) => <span className="font-medium text-ink">{t.name}</span> },
            { key: "phone", header: dict.common.phone, render: (t) => t.phone },
            { key: "spec", header: label.specialization, render: (t) => <span className="text-stone">{t.specialization.map((k) => specializationName(k, dict)).join(", ")}</span> },
            { key: "areas", header: label.area, render: (t) => <span className="text-stone">{t.serviceAreas.join(", ")}</span> },
            { key: "jobs", header: label.job, align: "right", render: (t) => t.completedJobs },
            { key: "rating", header: label.rating, align: "right", render: (t) => <Rating value={t.rating} /> },
            {
              key: "status",
              header: label.status,
              render: (t) => (
                <Badge tone={t.status === "AVAILABLE" ? "success" : t.status === "ON_JOB" ? "gold" : "neutral"}>
                  {t.status === "AVAILABLE" ? ui.technicianAvailable : t.status === "ON_JOB" ? ui.technicianOnJob : ui.technicianOffDuty}
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
    const roleFunctions = ui.roleFunctions;
    const permissions = [
      "product.view", "product.create", "product.update", "product.delete",
      "order.view", "order.update", "repair.assign", "user.manage", "setting.manage",
    ];
    const matrix: { fn: string; superAdmin: string; admin: string; editor: string; technician: string }[] = [
      { fn: roleFunctions.products, superAdmin: ui.fullAccess, admin: ui.fullAccess, editor: ui.editAccess, technician: ui.noAccess },
      { fn: roleFunctions.orders, superAdmin: ui.fullAccess, admin: ui.fullAccess, editor: ui.noAccess, technician: ui.assignedAccess },
      { fn: roleFunctions.repairs, superAdmin: ui.fullAccess, admin: ui.fullAccess, editor: ui.noAccess, technician: ui.assignedAccess },
      { fn: roleFunctions.customers, superAdmin: ui.fullAccess, admin: ui.fullAccess, editor: ui.noAccess, technician: ui.restrictedAccess },
      { fn: roleFunctions.finance, superAdmin: ui.fullAccess, admin: ui.viewAccess, editor: ui.noAccess, technician: ui.noAccess },
      { fn: roleFunctions.roles, superAdmin: ui.fullAccess, admin: ui.noAccess, editor: ui.noAccess, technician: ui.noAccess },
      { fn: roleFunctions.settings, superAdmin: ui.fullAccess, admin: ui.noAccess, editor: ui.noAccess, technician: ui.noAccess },
    ];

    return (
      <><ActivityFeed section={section} locale={locale} manage />
        <AdminPageHeader title={dict.admin.roles} description={ui.rolesDescription} />

        <div className="space-y-4">
          <DataTable
            title={ui.roleMatrix}
            minWidth={720}
            rows={matrix}
            columns={[
              { key: "fn", header: label.function, render: (m) => <span className="font-medium text-ink">{m.fn}</span> },
              { key: "sa", header: "Super Admin", align: "center", render: (m) => m.superAdmin },
              { key: "a", header: "Admin", align: "center", render: (m) => m.admin },
              { key: "e", header: "Editor", align: "center", render: (m) => m.editor },
              { key: "t", header: "Technician", align: "center", render: (m) => m.technician },
            ]}
          />

          <Card className="p-5">
            <h2 className="mb-4 text-[13px] font-semibold text-ink">{ui.permissionKeys}</h2>
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
    const customers = data.customers ?? [];

    return (
      <><ActivityFeed section={section} locale={locale} manage />
        <AdminPageHeader title={dict.admin.customers} description={`${customers.length} ${ui.customerUnit}`} />
        <DataTable
          title={dict.admin.customers}
          minWidth={800}
          source="server"
          rows={customers}
          columns={[
            { key: "name", header: label.name, render: (c) => <span className="font-medium text-ink">{c.name}</span> },
            { key: "email", header: dict.common.email, render: (c) => <span className="text-stone">{c.email}</span> },
            { key: "phone", header: dict.common.phone, render: (c) => c.phone },
            { key: "orders", header: label.orders, align: "center", render: (c) => c.orders },
            {
              key: "total",
              header: label.total,
              align: "right",
              render: (c) => <span className="font-medium tabular-nums text-ink">{formatPrice(c.total)}</span>,
            },
            { key: "since", header: label.registration, render: (c) => formatDate(c.since) },
          ]}
        />
      </>
    );
  }

  /* --------------------------------------------------------- INVENTORY */
  if (section === "inventory") {
    // Anbar sayı üçün ayrıca model yoxdur; hazırda yalnız məhsulun
    // `inStock` bayrağı bazadadır, ona görə cədvəl həmin vəziyyəti göstərir.
    const stock = (data.products ?? []).map((p) => ({ product: p, inStock: p.inStock }));

    return (
      <><ActivityFeed section={section} locale={locale} manage />
        <AdminPageHeader title={dict.admin.inventory} description={ui.inventoryDescription} />
        <DataTable
          title={dict.admin.stock}
          minWidth={640}
          source="server"
          rows={stock}
          columns={[
            {
              key: "product",
              header: label.product,
              render: (s) => (
                <span>
                  <span className="block font-medium text-ink">{s.product.name}</span>
                  <span className="block font-mono text-[11px] text-stone">{s.product.sku}</span>
                </span>
              ),
            },
            {
              key: "category",
              header: label.category,
              render: (s) => (
                <span className="text-graphite">
                  {categoryNameBySlug(s.product.categorySlug, dict, s.product.categorySlug)}
                </span>
              ),
            },
            {
              key: "state",
              header: label.state,
              align: "center",
              render: (s) =>
                s.inStock ? (
                  <Badge tone="success">{ui.available}</Badge>
                ) : (
                  <Badge tone="neutral">{ui.toOrder}</Badge>
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
      <><ActivityFeed section={section} locale={locale} manage />
        <AdminPageHeader title={dict.admin.warranty} description={ui.warrantyDescription} />
        <DataTable
          title={dict.admin.warranty}
          minWidth={860}
          source="server"
          rows={data.warranties ?? []}
          columns={[
            { key: "number", header: label.number, render: (w) => <code className="text-[12px] text-graphite">{w.number}</code> },
            { key: "serial", header: label.serial, render: (w) => <code className="text-[12px] text-ink">{w.serialNumber}</code> },
            { key: "product", header: label.product, render: (w) => w.productName },
            { key: "order", header: label.orders, render: (w) => <code className="text-[12px] text-stone">{w.orderNumber}</code> },
            { key: "install", header: label.installation, render: (w) => formatDate(w.startDate) },
            { key: "end", header: label.end, render: (w) => formatDate(w.endDate) },
            {
              key: "status",
              header: label.status,
              render: (w) => <Badge tone={w.status === "ACTIVE" ? "success" : "neutral"}>{w.status === "ACTIVE" ? dict.warranty.active : dict.warranty.expired}</Badge>,
            },
          ]}
        />
      </>
    );
  }

  /* ----------------------------------------------------------- REVIEWS */
  if (section === "reviews") {
    const reviews = localizedReviews(locale);
    return (
      <><ActivityFeed section={section} locale={locale} manage />
        <AdminPageHeader title={dict.admin.reviews} description={ui.reviewsDescription} />
        <DataTable
          title={dict.admin.reviews}
          minWidth={860}
          rows={reviews}
          columns={[
            { key: "author", header: label.author, render: (rv) => <span className="font-medium text-ink">{rv.author}</span> },
            { key: "product", header: label.product, render: (rv) => rv.productName },
            { key: "rating", header: label.rating, render: (rv) => <Rating value={rv.rating} /> },
            { key: "text", header: label.text, render: (rv) => <span className="line-clamp-2 max-w-md text-stone">{rv.text}</span> },
            { key: "date", header: label.date, render: (rv) => formatDate(rv.date) },
            {
              key: "status",
              header: label.status,
              render: (rv) => <Badge tone={rv.verified ? "success" : "warning"}>{rv.verified ? ui.verified : ui.pending}</Badge>,
            },
          ]}
        />
      </>
    );
  }

  /* ----------------------------------------------------------- CONTENT */
  if (section === "content") {
    const pages = [
      { title: ui.contentPages.home, path: "/", updated: "2026-08-30", published: true },
      { title: ui.contentPages.about, path: "/haqqimizda", updated: "2026-08-12", published: true },
      { title: ui.contentPages.services, path: "/xidmetler", updated: "2026-08-22", published: true },
      { title: ui.contentPages.faq, path: "/faq", updated: "2026-09-01", published: true },
      { title: ui.contentPages.privacy, path: "/legal/privacy", updated: "2026-07-05", published: false },
    ];

    return (
      <><ActivityFeed section={section} locale={locale} manage />
        <AdminPageHeader title={dict.admin.content} action={addButton(ui.newPage)} />
        <DataTable
          title={dict.admin.pages}
          minWidth={640}
          rows={pages}
          columns={[
            { key: "title", header: label.title, render: (p) => <span className="font-medium text-ink">{p.title}</span> },
            { key: "path", header: label.url, render: (p) => <code className="text-[12px] text-stone">{p.path}</code> },
            { key: "updated", header: label.updated, render: (p) => formatDate(p.updated) },
            {
              key: "status",
              header: label.status,
              render: (p) => <Badge tone={p.published ? "success" : "warning"}>{p.published ? ui.published : ui.draft}</Badge>,
            },
          ]}
        />
      </>
    );
  }

  /* --------------------------------------------------------------- SEO */
  if (section === "seo") {
    return (
      <><ActivityFeed section={section} locale={locale} manage />
        <LocalManager section="seo" label={ui.addSeo} />
        <AdminPageHeader title={dict.admin.seo} description={ui.seoDescription} />
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="p-5">
            <h2 className="mb-4 text-[13px] font-semibold text-ink">{ui.technicalSeo}</h2>
            <dl>
              <DataRow label="Sitemap" value={<Badge tone="success">{ui.active}</Badge>} />
              <DataRow label="robots.txt" value={<Badge tone="success">{ui.active}</Badge>} />
              <DataRow label="Canonical" value={<Badge tone="success">{ui.active}</Badge>} />
              <DataRow label="hreflang (az/en/ru)" value={<Badge tone="success">{ui.active}</Badge>} />
              <DataRow label="Product schema" value={<Badge tone="success">{ui.active}</Badge>} />
              <DataRow label="FAQ schema" value={<Badge tone="success">{ui.active}</Badge>} />
              <DataRow label="Open Graph" value={<Badge tone="success">{ui.active}</Badge>} />
            </dl>
          </Card>

          <Card className="p-5">
            <h2 className="mb-4 text-[13px] font-semibold text-ink">{ui.performanceTargets}</h2>
            <dl>
              <DataRow label="LCP" value="≤ 2.5 s" />
              <DataRow label="INP" value="≤ 200 ms" />
              <DataRow label="CLS" value="≤ 0.1" />
              <DataRow label="Server Components" value="Default" />
              <DataRow label={ui.imageFormats} value="AVIF / WebP" />
            </dl>
          </Card>
        </div>
      </>
    );
  }

  /* --------------------------------------------------------- ANALYTICS */
  if (section === "analytics") {
    const funnel = [
      { step: ui.funnelSteps.catalog, value: 12480, rate: "100%" },
      { step: ui.funnelSteps.product, value: 5240, rate: "42%" },
      { step: ui.funnelSteps.configurator, value: 1980, rate: "16%" },
      { step: ui.funnelSteps.completed, value: 860, rate: "6.9%" },
      { step: ui.funnelSteps.cart, value: 520, rate: "4.2%" },
      { step: ui.funnelSteps.checkout, value: 310, rate: "2.5%" },
      { step: ui.funnelSteps.order, value: 148, rate: "1.2%" },
    ];

    return (
      <><ActivityFeed section={section} locale={locale} manage />
        <AdminPageHeader title={dict.admin.analytics} description={ui.analyticsDescription} />
        <DataTable
          title={ui.funnelTitle}
          minWidth={560}
          rows={funnel}
          columns={[
            { key: "step", header: label.step, render: (f) => <span className="font-medium text-ink">{f.step}</span> },
            { key: "value", header: label.count, align: "right", render: (f) => <span className="tabular-nums">{formatNumber(f.value)}</span> },
            { key: "rate", header: label.rate, align: "right", render: (f) => <span className="tabular-nums text-stone">{f.rate}</span> },
            {
              key: "bar",
              header: "",
              render: (f) => (
                <span className="block h-2 w-full max-w-[160px] bg-sand">
                  <span
                    className="block h-full bg-gold-400"
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
      <><ActivityFeed section={section} locale={locale} manage />
        <AdminPageHeader title={dict.admin.auditLogs} description={ui.auditDescription} />
        <DataTable
          title={dict.admin.auditLogs}
          minWidth={780}
          rows={logs}
          columns={[
            { key: "at", header: label.time, render: (l) => formatDateTime(l.at) },
            { key: "actor", header: label.actor, render: (l) => <span className="font-medium text-ink">{l.actor}</span> },
            { key: "action", header: label.action, render: (l) => <code className="text-[12px] text-graphite">{l.action}</code> },
            { key: "target", header: label.target, render: (l) => <code className="text-[12px] text-stone">{l.target}</code> },
            { key: "detail", header: label.detail, render: (l) => <span className="text-stone">{l.detail}</span> },
          ]}
        />
      </>
    );
  }

  /* ---------------------------------------------------------- SETTINGS */
  if (section === "settings") {
    return (
      <><ActivityFeed section={section} locale={locale} manage />
        <LocalManager section="settings" label={ui.editSettings} />
        <AdminPageHeader title={dict.admin.settings} description={ui.settingsDescription} />
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="p-5">
            <h2 className="mb-4 text-[13px] font-semibold text-ink">{ui.general}</h2>
            <dl>
              <DataRow label={ui.siteName} value="EuroPorta" />
              <DataRow label={ui.currency} value="AZN" />
              <DataRow label={ui.defaultLanguage} value="AZ" />
              <DataRow label={ui.supportedLanguages} value="AZ / EN / RU" />
              <DataRow label={ui.timeZone} value="Asia/Baku" />
            </dl>
          </Card>

          <Card className="p-5">
            <h2 className="mb-4 text-[13px] font-semibold text-ink">{ui.plannedIntegrations}</h2>
            <dl>
              <DataRow label="Cloudflare D1" value={<Badge tone="warning">{ui.pending}</Badge>} />
              <DataRow label="Cloudflare R2" value={<Badge tone="warning">{ui.pending}</Badge>} />
              <DataRow label="Cloudflare Images" value={<Badge tone="warning">{ui.pending}</Badge>} />
              <DataRow label="Turnstile" value={<Badge tone="warning">{ui.pending}</Badge>} />
              <DataRow label={ui.paymentProvider} value={<Badge tone="warning">{ui.pending}</Badge>} />
              <DataRow label={ui.emailQueue} value={<Badge tone="warning">{ui.pending}</Badge>} />
            </dl>
          </Card>
        </div>

      </>
    );
  }

  /* --------------------------------------------------------- DISCOUNTS */
  const discounts = [
    { code: "YAZ2026", type: ui.discount.percentage, value: "10%", scope: ui.discount.allCatalog, from: "2026-03-01", to: "2026-04-30", active: false },
    { code: "SMART200", type: ui.discount.amount, value: "200 AZN", scope: ui.discount.smartDoors, from: "2026-08-01", to: "2026-09-30", active: true },
    { code: "INSTALL0", type: ui.discount.service, value: ui.discount.freeInstallation, scope: ui.discount.threeDoors, from: "2026-09-01", to: "2026-10-31", active: true },
  ];

  return (
    <>
      <AdminPageHeader title={dict.admin.discounts} action={addButton(ui.newDiscount)} />
      <DataTable
        title={dict.admin.discounts}
        minWidth={780}
        rows={discounts}
        columns={[
          { key: "code", header: label.code, render: (d) => <code className="text-[12px] font-semibold text-ink">{d.code}</code> },
          { key: "type", header: label.type, render: (d) => d.type },
          { key: "value", header: label.value, render: (d) => <span className="font-medium text-ink">{d.value}</span> },
          { key: "scope", header: label.scope, render: (d) => <span className="text-stone">{d.scope}</span> },
          { key: "period", header: label.period, render: (d) => `${formatDate(d.from)} – ${formatDate(d.to)}` },
          {
            key: "status",
            header: label.status,
            render: (d) => <Badge tone={d.active ? "success" : "neutral"}>{d.active ? ui.active : ui.expired}</Badge>,
          },
        ]}
      />
    </>
  );
}
