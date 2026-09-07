"use client";
import { ActivityFeed } from "@/components/account/ActivityFeed";
import { notFound } from "next/navigation";


import { getDictionary } from "@/i18n";
import type { Locale } from "@/types";
import { formatDate, formatDateTime, formatNumber, formatPrice } from "@/lib/utils";
import { Badge, Card, DataRow, Notice, Rating } from "@/components/ui/primitives";

import { AdminPageHeader, DataTable } from "@/components/admin/DataTable";
import { AdminDeleteAction, AdminEntityAction } from "@/components/admin/AdminEntityAction";
import type { CrudField } from "@/components/admin/AdminCrud";
import {
  ContentTable,
  DiscountsTable,
  ReviewsTable,
  SeoTable,
  SettingsForm,
} from "@/components/admin/AdminEditorial";
import {
  OrderStatusControl,
  PaymentStatusControl,
  RepairStatusControl,
  RequestStatusControl,
  RoleControl,
  TechnicianControl,
} from "@/components/admin/AdminControls";
import { ProductMedia } from "@/components/product/ProductMedia";
import { optionLabelById } from "@/mock/options.i18n";
import {
  categoryNameBySlug,
  countryNameByCode,
  materialName,
  specializationName,
  styleName,
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

  const productOptionChoices = (data.optionGroups ?? []).flatMap((group) =>
    group.values.map((value) => ({
      value: value.id,
      label: `${dict.configurator.steps[group.groupKey]} · ${optionLabelById(value.id, locale, value.label)}`,
    })),
  );

  const productFields: CrudField[] = [
    { name: "name", label: ui.fields.name, required: true },
    { name: "slug", label: ui.fields.slug, required: true },
    { name: "sku", label: ui.fields.sku, required: true },
    { name: "categorySlug", label: ui.fields.categorySlug, type: "select", required: true, options: (data.categories ?? []).map((category) => ({ value: category.slug, label: categoryNameBySlug(category.slug, dict, category.name) })) },
    { name: "brandSlug", label: ui.fields.brandSlug, type: "select", required: true, options: (data.brands ?? []).map((brand) => ({ value: brand.slug, label: brand.name })) },
    { name: "collection", label: ui.fields.collection, required: true },
    { name: "material", label: ui.fields.material, type: "select", required: true, options: ["STEEL", "SOLID_WOOD", "MDF", "ALUMINIUM", "COMPOSITE", "GLASS"].map((value) => ({ value, label: materialName(value as Parameters<typeof materialName>[0], dict) })) },
    { name: "securityClass", label: ui.fields.securityClass, required: true },
    { name: "style", label: ui.fields.style, type: "select", required: true, options: ["MODERN", "CLASSIC", "MINIMAL", "LOFT", "NEOCLASSIC"].map((value) => ({ value, label: styleName(value as Parameters<typeof styleName>[0], dict) })) },
    { name: "status", label: ui.fields.status, type: "select", required: true, options: [
      { value: "DRAFT", label: ui.draft },
      { value: "PUBLISHED", label: ui.published },
    ] },
    { name: "basePrice", label: ui.fields.basePrice, type: "number", required: true },
    { name: "warrantyYears", label: ui.fields.warrantyYears, type: "number", required: true },
    { name: "soundInsulationDb", label: ui.fields.soundInsulationDb, type: "number", required: true },
    { name: "defaultWidth", label: ui.fields.defaultWidth, type: "number", required: true },
    { name: "defaultHeight", label: ui.fields.defaultHeight, type: "number", required: true },
    { name: "minWidth", label: ui.fields.minWidth, type: "number", required: true },
    { name: "maxWidth", label: ui.fields.maxWidth, type: "number", required: true },
    { name: "minHeight", label: ui.fields.minHeight, type: "number", required: true },
    { name: "maxHeight", label: ui.fields.maxHeight, type: "number", required: true },
    { name: "deliveryDaysMin", label: ui.fields.deliveryDaysMin, type: "number", required: true },
    { name: "deliveryDaysMax", label: ui.fields.deliveryDaysMax, type: "number", required: true },
    { name: "inStock", label: ui.fields.inStock, type: "checkbox" },
    { name: "isBestseller", label: ui.fields.featured, type: "checkbox" },
    { name: "optionValueIds", label: ui.fields.availableOptions, type: "multiselect", required: true, options: productOptionChoices },
  ];
  const categoryFields: CrudField[] = [
    { name: "name", label: ui.fields.name, required: true },
    { name: "slug", label: ui.fields.slug, required: true },
  ];
  const brandFields: CrudField[] = [
    { name: "name", label: ui.fields.name, required: true },
    { name: "slug", label: ui.fields.slug, required: true },
    { name: "country", label: ui.fields.country, required: true },
    { name: "founded", label: ui.fields.founded, type: "number", required: true },
  ];
  const optionFields: CrudField[] = [
    { name: "id", label: ui.fields.optionName, required: true, createOnly: true },
    { name: "groupKey", label: ui.fields.group, type: "select", required: true, createOnly: true, options: Object.entries(dict.configurator.steps).filter(([key]) => key !== "SIZE").map(([value, label]) => ({ value, label })) },
    { name: "code", label: ui.fields.code, required: true },
    { name: "label", label: ui.fields.label, required: true },
    { name: "description", label: ui.fields.description, type: "textarea" },
    { name: "priceDelta", label: ui.fields.priceDelta, type: "number" },
    { name: "hex", label: ui.fields.hex },
    { name: "requires", label: ui.fields.requiresOptions, type: "multiselect", options: productOptionChoices },
    { name: "excludes", label: ui.fields.excludesOptions, type: "multiselect", options: productOptionChoices },
  ];
  const appointmentFields: CrudField[] = [
    { name: "reference", label: ui.fields.reference, required: true },
    { name: "type", label: ui.fields.type, required: true },
    { name: "date", label: ui.fields.date, type: "date", required: true },
    { name: "startTime", label: ui.fields.startTime, required: true },
    { name: "endTime", label: ui.fields.endTime, required: true },
    { name: "address", label: ui.fields.address, required: true },
    { name: "technicianId", label: ui.fields.technician, type: "select", options: [
      { value: "", label: ui.unassigned },
      ...(data.technicians ?? []).map((technician) => ({ value: technician.id, label: technician.name })),
    ] },
    { name: "status", label: ui.fields.status, required: true },
  ];
  const technicianFields: CrudField[] = [
    { name: "name", label: ui.fields.name, required: true },
    { name: "phone", label: ui.fields.phone },
    { name: "email", label: ui.fields.email, required: true, createOnly: true },
    { name: "password", label: ui.fields.password, required: true, createOnly: true },
    { name: "specialization", label: ui.fields.specialization },
    { name: "serviceAreas", label: ui.fields.serviceArea },
    { name: "status", label: ui.fields.status, type: "select", options: [
      { value: "AVAILABLE", label: ui.technicianAvailable },
      { value: "BUSY", label: ui.technicianOnJob },
      { value: "OFF", label: ui.technicianOffDuty },
    ] },
  ];
  const userFields: CrudField[] = [
    { name: "name", label: ui.fields.name, required: true },
    { name: "email", label: ui.fields.email, required: true },
    { name: "phone", label: ui.fields.phone },
    { name: "password", label: ui.fields.password, required: true, createOnly: true },
    { name: "role", label: label.function, type: "select", createOnly: true, options: Object.entries(ui.roleNames).map(([value, name]) => ({ value, label: name })) },
  ];
  const warrantyFields: CrudField[] = [
    { name: "number", label: label.number, required: true },
    { name: "serialNumber", label: ui.fields.serialNumber, required: true },
    { name: "productName", label: ui.fields.productName, required: true },
    { name: "orderNumber", label: ui.fields.orderNumber },
    { name: "installationDate", label: ui.fields.installationDate, type: "date", required: true },
    { name: "startDate", label: ui.fields.startDate, type: "date", required: true },
    { name: "endDate", label: ui.fields.endDate, type: "date", required: true },
    { name: "status", label: ui.fields.status, required: true },
  ];

  /* ---------------------------------------------------------- PRODUCTS */
  if (section === "products") {
    const products = data.products ?? [];

    return (
      <><ActivityFeed section={section} locale={locale} manage />
        <AdminPageHeader
          title={dict.admin.products}
          description={`${products.length} ${ui.modelUnit}`}
          action={<AdminEntityAction entity="products" fields={productFields} createLabel={ui.newProduct} />}
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
                    <ProductMedia product={p.media} sizes="36px" />
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
              key: "status",
              header: label.status,
              render: (p) => (
                <Badge tone={p.status === "PUBLISHED" ? "success" : "neutral"}>
                  {p.status === "PUBLISHED" ? ui.published : ui.draft}
                </Badge>
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
            {
              key: "actions",
              header: ui.operation,
              render: (p) => <AdminEntityAction entity="products" id={p.id} fields={productFields} values={p} archive />,
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
        <AdminPageHeader title={dict.admin.categories} action={<AdminEntityAction entity="categories" fields={categoryFields} createLabel={ui.newCategory} />} />
        <DataTable
          title={dict.admin.categories}
          minWidth={640}
          source="server"
          rows={data.categories ?? []}
          columns={[
            { key: "name", header: label.name, render: (c) => <span className="font-medium text-ink">{categoryNameBySlug(c.slug, dict, c.name)}</span> },
            { key: "slug", header: ui.fields.slug, render: (c) => <code className="text-[12px] text-stone">{c.slug}</code> },
            { key: "count", header: label.product, align: "right", render: (c) => c.productCount },
            { key: "actions", header: ui.operation, render: (c) => <AdminEntityAction entity="categories" id={c.id} fields={categoryFields} values={c} /> },
          ]}
        />
      </>
    );
  }

  /* ------------------------------------------------------------ BRANDS */
  if (section === "brands") {
    return (
      <><ActivityFeed section={section} locale={locale} manage />
        <AdminPageHeader title={dict.admin.brands} action={<AdminEntityAction entity="brands" fields={brandFields} createLabel={ui.newBrand} />} />
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
            { key: "actions", header: ui.operation, render: (b) => <AdminEntityAction entity="brands" id={b.id} fields={brandFields} values={b} /> },
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
          action={<AdminEntityAction entity="options" fields={optionFields} createLabel={ui.newOption} />}
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
                {
                  key: "actions",
                  header: ui.operation,
                  render: (v) => <AdminEntityAction entity="options" id={v.id} fields={optionFields} values={{ ...v, groupKey: g.groupKey }} />,
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
          minWidth={1040}
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
              key: "payment",
              header: label.payment,
              render: (o) => <PaymentStatusControl number={o.number} status={o.paymentStatus} />,
            },
            {
              key: "total",
              header: label.amount,
              align: "right",
              render: (o) => <span className="font-medium tabular-nums text-ink">{formatPrice(o.total)}</span>,
            },
            { key: "actions", header: ui.operation, render: (o) => <AdminDeleteAction entity="orders" id={o.id} archive /> },
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
            { key: "status", header: label.status, render: (q) => <RequestStatusControl kind="quote" number={q.number} status={q.status} /> },
            { key: "actions", header: ui.operation, render: (q) => <AdminDeleteAction entity="quotes" id={q.id} /> },
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
            { key: "actions", header: ui.operation, render: (rp) => <AdminDeleteAction entity="repairs" id={rp.id} archive /> },
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
            { key: "status", header: label.status, render: (m) => <RequestStatusControl kind="measurement" number={m.number} status={m.status} /> },
            { key: "actions", header: ui.operation, render: (m) => <AdminDeleteAction entity="measurements" id={m.id} /> },
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
          action={<AdminEntityAction entity="appointments" fields={appointmentFields} createLabel={ui.newRecord} />}
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
            { key: "actions", header: ui.operation, render: (a) => <AdminEntityAction entity="appointments" id={a.id} fields={appointmentFields} values={a} /> },
          ]}
        />
      </>
    );
  }

  /* ------------------------------------------------------- TECHNICIANS */
  if (section === "technicians") {
    return (
      <><ActivityFeed section={section} locale={locale} manage />
        <AdminPageHeader title={dict.admin.technicians} action={<AdminEntityAction entity="technicians" fields={technicianFields} createLabel={ui.newTechnician} />} />
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
                <Badge tone={t.status === "AVAILABLE" ? "success" : t.status === "BUSY" ? "gold" : "neutral"}>
                  {t.status === "AVAILABLE" ? ui.technicianAvailable : t.status === "BUSY" ? ui.technicianOnJob : ui.technicianOffDuty}
                </Badge>
              ),
            },
            { key: "actions", header: ui.operation, render: (t) => <AdminEntityAction entity="technicians" id={t.id} fields={technicianFields} values={{ ...t, specialization: t.specialization.join(", "), serviceAreas: t.serviceAreas.join(", ") }} /> },
          ]}
        />
      </>
    );
  }

  /* ------------------------------------------------------------- ROLES */
  if (section === "roles") {
    const roleFunctions = ui.roleFunctions;

    // Matris kodda həqiqətən tətbiq olunanı göstərir: `requireUser` və
    // `hasRole` üç rolu tanıyır, ADMIN hamısını əhatə edir (PRD §93).
    const matrix = [
      { fn: roleFunctions.products, admin: ui.fullAccess, technician: ui.noAccess, customer: ui.noAccess },
      { fn: roleFunctions.orders, admin: ui.fullAccess, technician: ui.noAccess, customer: ui.restrictedAccess },
      { fn: roleFunctions.repairs, admin: ui.fullAccess, technician: ui.assignedAccess, customer: ui.restrictedAccess },
      { fn: roleFunctions.customers, admin: ui.fullAccess, technician: ui.noAccess, customer: ui.noAccess },
      { fn: roleFunctions.finance, admin: ui.fullAccess, technician: ui.noAccess, customer: ui.noAccess },
      { fn: roleFunctions.roles, admin: ui.fullAccess, technician: ui.noAccess, customer: ui.noAccess },
      { fn: roleFunctions.settings, admin: ui.fullAccess, technician: ui.noAccess, customer: ui.noAccess },
    ];

    const permissions = [
      "order.update",
      "payment.update",
      "repair.assign",
      "measurement.assign",
      "quote.update",
      "discount.create",
      "content.update",
      "seo.update",
      "review.moderate",
      "setting.manage",
      "user.manage",
    ];

    return (
      <>
        <ActivityFeed section={section} locale={locale} manage />
        <AdminPageHeader title={dict.admin.roles} description={ui.rolesDescription} />

        <div className="space-y-4">
          <DataTable
            title={ui.roleUsersTitle}
            minWidth={720}
            source="server"
            rows={data.customers ?? []}
            columns={[
              { key: "name", header: label.name, render: (u) => <span className="font-medium text-ink">{u.name}</span> },
              { key: "email", header: dict.common.email, render: (u) => <span className="text-stone">{u.email}</span> },
              { key: "since", header: label.registration, render: (u) => formatDate(u.since) },
              {
                key: "role",
                header: label.function,
                render: (u) => <RoleControl userId={u.id} email={u.email} role={u.role} />,
              },
            ]}
          />

          <Notice tone="info">{ui.roleMatrixNote}</Notice>

          <DataTable
            title={ui.roleMatrix}
            minWidth={640}
            source="server"
            rows={matrix}
            columns={[
              { key: "fn", header: label.function, render: (m) => <span className="font-medium text-ink">{m.fn}</span> },
              { key: "a", header: ui.roleNames.ADMIN, align: "center", render: (m) => m.admin },
              { key: "t", header: ui.roleNames.TECHNICIAN, align: "center", render: (m) => m.technician },
              { key: "c", header: ui.roleNames.CUSTOMER, align: "center", render: (m) => m.customer },
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
        <AdminPageHeader title={dict.admin.customers} description={`${customers.length} ${ui.customerUnit}`} action={<AdminEntityAction entity="users" fields={userFields} createLabel={ui.newRecord} />} />
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
            { key: "actions", header: ui.operation, render: (c) => <AdminEntityAction entity="users" id={c.id} fields={userFields} values={c} /> },
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
            { key: "actions", header: ui.operation, render: (s) => <AdminEntityAction entity="products" id={s.product.id} fields={productFields} values={s.product} archive /> },
          ]}
        />
      </>
    );
  }

  /* ---------------------------------------------------------- WARRANTY */
  if (section === "warranty") {
    return (
      <><ActivityFeed section={section} locale={locale} manage />
        <AdminPageHeader title={dict.admin.warranty} description={ui.warrantyDescription} action={<AdminEntityAction entity="warranties" fields={warrantyFields} createLabel={ui.newRecord} />} />
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
            { key: "actions", header: ui.operation, render: (w) => <AdminEntityAction entity="warranties" id={w.id} fields={warrantyFields} values={w} archive /> },
          ]}
        />
      </>
    );
  }

  /* ----------------------------------------------------------- REVIEWS */
  if (section === "reviews") {
    return (
      <>
        <ActivityFeed section={section} locale={locale} manage />
        <AdminPageHeader title={dict.admin.reviews} description={ui.reviewsDescription} />
        <ReviewsTable rows={data.reviews ?? []} />
      </>
    );
  }

  /* ----------------------------------------------------------- CONTENT */
  if (section === "content") {
    return (
      <>
        <ActivityFeed section={section} locale={locale} manage />
        <AdminPageHeader title={dict.admin.content} description={ui.contentDescription} />
        <ContentTable rows={data.contentPages ?? []} />
      </>
    );
  }

  /* --------------------------------------------------------------- SEO */
  if (section === "seo") {
    return (
      <>
        <ActivityFeed section={section} locale={locale} manage />
        <AdminPageHeader title={dict.admin.seo} description={ui.seoDescription} />

        <SeoTable rows={data.seoEntries ?? []} />

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
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
    const analytics = data.analytics;

    return (
      <>
        <ActivityFeed section={section} locale={locale} manage />
        <AdminPageHeader title={dict.admin.analytics} description={ui.analyticsDescription} />

        {/* Səhifə baxışı toplanmır — burada yalnız bazadakı faktiki
            qeydlərin nisbəti göstərilir. */}
        <Notice tone="info" className="mb-4">
          {ui.analyticsSourceNote}
        </Notice>

        <DataTable
          title={ui.funnelTitle}
          minWidth={560}
          source="server"
          rows={analytics?.funnel ?? []}
          columns={[
            {
              key: "step",
              header: label.step,
              render: (f) => (
                <span className="font-medium text-ink">
                  {ui.funnelSteps[f.key as keyof typeof ui.funnelSteps]}
                </span>
              ),
            },
            {
              key: "count",
              header: label.count,
              align: "right",
              render: (f) => <span className="tabular-nums">{formatNumber(f.count)}</span>,
            },
            {
              key: "bar",
              header: "",
              render: (f) => (
                <span className="block h-2 w-full max-w-[160px] bg-sand">
                  <span className="block h-full bg-gold-400" style={{ width: `${f.share}%` }} />
                </span>
              ),
            },
          ]}
        />

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Card className="p-5">
            <h2 className="mb-4 text-[13px] font-semibold text-ink">{ui.conversionTitle}</h2>
            <dl>
              <DataRow
                label={ui.configurationToOrder}
                value={percent(analytics?.conversion.configurationToOrder, ui.noData)}
              />
              <DataRow
                label={ui.quoteToOrder}
                value={percent(analytics?.conversion.quoteToOrder, ui.noData)}
              />
            </dl>
          </Card>

          <Card className="p-5">
            <h2 className="mb-4 text-[13px] font-semibold text-ink">{ui.monthlyRevenue}</h2>
            {(analytics?.months.length ?? 0) === 0 ? (
              <p className="text-[13px] text-stone">{ui.empty}</p>
            ) : (
              <dl>
                {analytics?.months.map((m) => (
                  <DataRow
                    key={m.month}
                    label={m.month}
                    value={`${formatPrice(m.revenue)} · ${m.orders}`}
                  />
                ))}
              </dl>
            )}
          </Card>
        </div>
      </>
    );
  }

  /* ------------------------------------------------------------- AUDIT */
  if (section === "audit") {
    return (
      <>
        <ActivityFeed section={section} locale={locale} manage />
        <AdminPageHeader title={dict.admin.auditLogs} description={ui.auditDescription} />
        <DataTable
          title={dict.admin.auditLogs}
          minWidth={860}
          source="server"
          empty={ui.auditEmpty}
          rows={data.auditLog ?? []}
          columns={[
            { key: "at", header: label.time, render: (l) => formatDateTime(l.createdAt) },
            {
              key: "actor",
              header: label.actor,
              render: (l) => (
                <span>
                  <span className="block font-medium text-ink">{l.actorEmail}</span>
                  <span className="block text-[11px] uppercase tracking-wider text-stone">
                    {l.actorRole}
                  </span>
                </span>
              ),
            },
            { key: "action", header: label.action, render: (l) => <code className="text-[12px] text-graphite">{l.action}</code> },
            { key: "target", header: label.target, render: (l) => <code className="text-[12px] text-stone">{l.target}</code> },
            { key: "detail", header: label.detail, render: (l) => <span className="text-stone">{l.detail || "—"}</span> },
          ]}
        />
      </>
    );
  }

  /* ---------------------------------------------------------- SETTINGS */
  if (section === "settings") {
    return (
      <>
        <ActivityFeed section={section} locale={locale} manage />
        <AdminPageHeader title={dict.admin.settings} description={ui.settingsDescription} />
        <SettingsForm rows={data.settings ?? []} />
      </>
    );
  }

  /* --------------------------------------------------------- DISCOUNTS */
  return (
    <>
      <ActivityFeed section={section} locale={locale} manage />
      <AdminPageHeader title={dict.admin.discounts} description={ui.discountDescription} />
      <DiscountsTable rows={data.discounts ?? []} />
    </>
  );
}

/** Faiz göstəricisi; məlumat yoxdursa rəqəm uydurulmur. */
function percent(value: number | null | undefined, empty: string): string {
  return value === null || value === undefined ? empty : `${value.toFixed(1)}%`;
}
