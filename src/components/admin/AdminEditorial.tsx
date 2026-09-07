"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Badge, Card, Rating } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/form";
import { toast } from "@/components/ui/overlays";
import { DataTable } from "@/components/admin/DataTable";
import { AdminCrud } from "@/components/admin/AdminCrud";
import { AdminDeleteAction } from "@/components/admin/AdminEntityAction";
import { formatDate, formatPrice } from "@/lib/utils";
import { ApiRequestError, apiFetch } from "@/lib/api";
import { useDict } from "@/i18n/provider";
import type {
  AdminContentRow,
  AdminDiscountRow,
  AdminReviewRow,
  AdminSeoRow,
  AdminSettingRow,
} from "@/server/admin";

/* ------------------------------------------------------------ ENDİRİM */

export function DiscountsTable({ rows }: { rows: AdminDiscountRow[] }) {
  const dict = useDict();
  const ui = dict.adminUi;
  const label = ui.labels;
  const [data, setData] = useState(rows);

  const types = [
    { value: "PERCENTAGE", label: ui.discount.percentage },
    { value: "AMOUNT", label: ui.discount.amount },
    { value: "SERVICE", label: ui.discount.service },
  ];

  return (
    <AdminCrud<AdminDiscountRow>
      endpoint="/api/admin/discounts"
      createLabel={ui.newDiscount}
      editTitle={ui.editRecord}
      onRows={(next) => setData(next)}
      fields={[
        { name: "code", label: label.code, required: true, hint: ui.discount.codeHint },
        { name: "name", label: label.name, required: true },
        { name: "type", label: label.type, type: "select", options: types },
        { name: "value", label: label.value, type: "number" },
        { name: "scope", label: label.scope, hint: ui.discount.scopeHint },
        { name: "startsAt", label: ui.discount.startDate, type: "date", required: true },
        { name: "endsAt", label: ui.fields.endDate, type: "date", required: true },
        { name: "active", label: ui.active, type: "checkbox" },
      ]}
    >
      {(actions) => (
        <DataTable
          title={dict.admin.discounts}
          minWidth={880}
          source="server"
          empty={ui.discountEmpty}
          rows={data}
          columns={[
            {
              key: "code",
              header: label.code,
              render: (d) => <code className="text-[12px] font-semibold text-ink">{d.code}</code>,
            },
            { key: "name", header: label.name, render: (d) => d.name },
            {
              key: "value",
              header: label.value,
              render: (d) => (
                <span className="font-medium text-ink">
                  {d.type === "PERCENTAGE"
                    ? `${d.value}%`
                    : d.type === "AMOUNT"
                      ? formatPrice(d.value)
                      : ui.discount.service}
                </span>
              ),
            },
            { key: "scope", header: label.scope, render: (d) => <span className="text-stone">{d.scope}</span> },
            {
              key: "period",
              header: label.period,
              render: (d) => `${formatDate(d.startsAt)} – ${formatDate(d.endsAt)}`,
            },
            {
              key: "active",
              header: label.status,
              align: "center",
              render: (d) => (
                <Badge tone={d.active ? "success" : "neutral"}>
                  {d.active ? ui.active : ui.pending}
                </Badge>
              ),
            },
            { key: "actions", header: ui.operation, render: actions },
          ]}
        />
      )}
    </AdminCrud>
  );
}

/* ------------------------------------------------------------- MƏZMUN */

export function ContentTable({ rows }: { rows: AdminContentRow[] }) {
  const dict = useDict();
  const ui = dict.adminUi;
  const label = ui.labels;
  const [data, setData] = useState(rows);

  return (
    <AdminCrud<AdminContentRow>
      endpoint="/api/admin/content"
      createLabel={ui.newPage}
      editTitle={ui.editRecord}
      onRows={(next) => setData(next)}
      fields={[
        { name: "path", label: label.url, required: true, hint: ui.pathHint },
        { name: "title", label: label.title, required: true },
        { name: "body", label: ui.fields.content, type: "textarea" },
        { name: "published", label: ui.published, type: "checkbox" },
      ]}
    >
      {(actions) => (
        <DataTable
          title={dict.admin.pages}
          minWidth={720}
          source="server"
          rows={data}
          columns={[
            { key: "title", header: label.title, render: (p) => <span className="font-medium text-ink">{p.title}</span> },
            { key: "path", header: label.url, render: (p) => <code className="text-[12px] text-stone">{p.path}</code> },
            { key: "updated", header: label.updated, render: (p) => formatDate(p.updatedAt) },
            {
              key: "status",
              header: label.status,
              render: (p) => (
                <Badge tone={p.published ? "success" : "warning"}>
                  {p.published ? ui.published : ui.draft}
                </Badge>
              ),
            },
            { key: "actions", header: ui.operation, render: actions },
          ]}
        />
      )}
    </AdminCrud>
  );
}

/* ---------------------------------------------------------------- SEO */

export function SeoTable({ rows }: { rows: AdminSeoRow[] }) {
  const dict = useDict();
  const ui = dict.adminUi;
  const label = ui.labels;
  const [data, setData] = useState(rows);

  return (
    <AdminCrud<AdminSeoRow>
      endpoint="/api/admin/seo"
      createLabel={ui.addSeo}
      editTitle={ui.editRecord}
      onRows={(next) => setData(next)}
      fields={[
        { name: "path", label: label.url, required: true, hint: ui.pathHint },
        { name: "title", label: ui.fields.seoTitle, required: true, hint: ui.seoTitleHint },
        { name: "description", label: ui.fields.metaDescription, type: "textarea", hint: ui.seoDescriptionHint },
        { name: "canonical", label: ui.fields.canonical },
      ]}
    >
      {(actions) => (
        <DataTable
          title={dict.admin.seo}
          minWidth={820}
          source="server"
          rows={data}
          columns={[
            { key: "path", header: label.url, render: (e) => <code className="text-[12px] text-stone">{e.path}</code> },
            {
              key: "title",
              header: ui.fields.seoTitle,
              render: (e) => (
                <span>
                  <span className="block font-medium text-ink">{e.title}</span>
                  <span className="block text-[11px] text-mist">{e.title.length}/70</span>
                </span>
              ),
            },
            {
              key: "description",
              header: ui.fields.metaDescription,
              render: (e) => (
                <span>
                  <span className="line-clamp-2 max-w-md text-stone">{e.description || "—"}</span>
                  <span className="block text-[11px] text-mist">{e.description.length}/160</span>
                </span>
              ),
            },
            { key: "actions", header: ui.operation, render: actions },
          ]}
        />
      )}
    </AdminCrud>
  );
}

/* ---------------------------------------------------------------- RƏY */

export function ReviewsTable({ rows }: { rows: AdminReviewRow[] }) {
  const dict = useDict();
  const ui = dict.adminUi;
  const label = ui.labels;
  const router = useRouter();
  const [data, setData] = useState(rows);

  async function moderate(id: string, status: string) {
    try {
      setData(
        await apiFetch<AdminReviewRow[]>(`/api/admin/reviews/${id}`, {
          method: "PATCH",
          json: { status },
        }),
      );
      router.refresh();
    } catch (error) {
      if (error instanceof ApiRequestError) toast(error.error.message);
    }
  }

  const statuses = [
    { value: "PENDING", label: ui.pending },
    { value: "APPROVED", label: ui.published },
    { value: "REJECTED", label: ui.rejected },
  ];

  return (
    <DataTable
      title={dict.admin.reviews}
      minWidth={900}
      source="server"
      rows={data}
      columns={[
        { key: "author", header: label.author, render: (rv) => <span className="font-medium text-ink">{rv.author}</span> },
        { key: "product", header: label.product, render: (rv) => rv.productName },
        { key: "rating", header: label.rating, render: (rv) => <Rating value={rv.rating} /> },
        { key: "text", header: label.text, render: (rv) => <span className="line-clamp-2 max-w-md text-stone">{rv.text}</span> },
        { key: "date", header: label.date, render: (rv) => formatDate(rv.createdAt) },
        {
          key: "status",
          header: label.status,
          render: (rv) => (
            <select
              value={rv.status}
              aria-label={`${rv.author} — ${label.status}`}
              onChange={(e) => void moderate(rv.id, e.target.value)}
              className="h-11 rounded-[3px] border border-line bg-paper px-2 text-[12.5px] text-ink outline-none focus:border-ink sm:h-9"
            >
              {statuses.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          ),
        },
        { key: "actions", header: ui.operation, render: (rv) => <AdminDeleteAction entity="reviews" id={rv.id} /> },
      ]}
    />
  );
}

/* --------------------------------------------------------- TƏNZİMLƏMƏ */

export function SettingsForm({ rows }: { rows: AdminSettingRow[] }) {
  const dict = useDict();
  const ui = dict.adminUi;
  const router = useRouter();

  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(rows.map((r) => [r.key, r.value])),
  );
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);

    try {
      const next = await apiFetch<AdminSettingRow[]>("/api/admin/settings", {
        method: "PATCH",
        json: { values },
      });
      setValues(Object.fromEntries(next.map((r) => [r.key, r.value])));
      toast(ui.changesSaved);
      router.refresh();
    } catch (error) {
      if (error instanceof ApiRequestError) toast(error.error.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="p-5">
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        {rows.map((row) => (
          <Field
            key={row.key}
            label={ui.settingKeys[row.key as keyof typeof ui.settingKeys] ?? row.key}
            hint={row.key}
          >
            <Input
              value={values[row.key] ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, [row.key]: e.target.value }))}
            />
          </Field>
        ))}

        <div className="sm:col-span-2">
          <Button type="submit" disabled={busy}>
            {dict.actions.save}
          </Button>
        </div>
      </form>
    </Card>
  );
}
