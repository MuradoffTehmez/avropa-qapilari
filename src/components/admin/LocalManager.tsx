"use client";

import { useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useHydrated } from "@/lib/hooks";
import { Modal, toast } from "@/components/ui/overlays";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/primitives";
import { Field, Input, Textarea } from "@/components/ui/form";
import { useDict } from "@/i18n/provider";
import type { Dictionary } from "@/i18n";

type Row = { id: string; values: Record<string, string> };

const useEntries = create<{
  data: Record<string, Row[]>;
  put: (key: string, rows: Row[]) => void;
}>()(
  persist(
    (set) => ({
      data: {},
      put: (key, rows) => set((s) => ({ data: { ...s.data, [key]: rows } })),
    }),
    { name: "ep-management-v1" },
  ),
);

type FieldKey = keyof Dictionary["adminUi"]["fields"];

const fields: Record<string, FieldKey[]> = {
  products: ["productName", "sku", "category", "price", "stock", "description"],
  categories: ["categoryName", "slug", "description"],
  brands: ["brandName", "country", "description"],
  configurator: ["optionName", "group", "price", "compatibleModels"],
  discounts: ["discountName", "promoCode", "percentage", "endDate"],
  addresses: ["addressName", "city", "street", "building", "apartment"],
  content: ["title", "pageUrl", "content", "status"],
  inventory: ["component", "sku", "stock", "minimum", "supplier"],
  seo: ["pageUrl", "seoTitle", "metaDescription", "canonical"],
  settings: ["siteName", "phone", "email", "address"],
  technicians: ["name", "phone", "specialization", "serviceArea"],
  suppliers: ["supplierName", "contact", "country", "deliveryTime"],
};

const longFields = new Set<FieldKey>(["description", "shortDescription", "content", "text", "note", "metaDescription"]);
const numberFields = new Set<FieldKey>(["price", "basePrice", "priceDelta", "stock", "minimum", "percentage", "amount", "total", "rating", "warrantyYears"]);
const dateFields = new Set<FieldKey>(["endDate"]);

export function LocalManager({
  section,
  label,
}: {
  section: string;
  label?: string;
}) {
  const dict = useDict();
  const state = useEntries();
  const hydrated = useHydrated();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [query, setQuery] = useState("");

  const names = fields[section] ?? (["name", "status", "note"] as FieldKey[]);
  const buttonLabel = label ?? dict.adminUi.newRecord;
  const rows = hydrated ? (state.data[section] ?? []) : [];

  function begin(row?: Row) {
    setEditing(row?.id ?? null);
    setValues(row?.values ?? {});
    setOpen(true);
  }

  const q = query.toLowerCase();
  const visible = rows.filter((r) =>
    Object.values(r.values).join(" ").toLowerCase().includes(q),
  );

  return (
    <div className="mb-4 space-y-3">
      <Button variant="secondary" size="sm" onClick={() => begin()}>
        <Plus size={14} /> {buttonLabel}
      </Button>

      {rows.length > 0 && (
        <Card className="p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-[13px] font-semibold text-ink">
              {dict.adminUi.addedRecords} ({rows.length})
            </h3>
            <div className="relative w-full sm:w-56">
              <Search
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mist"
              />
              <Input
                aria-label={dict.adminUi.searchRecords}
                placeholder={dict.adminUi.search}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-9 pl-8 text-[13px]"
              />
            </div>
          </div>

          <ul className="divide-y divide-line">
            {visible.map((r) => (
              <li key={r.id} className="flex flex-wrap items-start justify-between gap-3 py-3">
                <div className="min-w-0 space-y-0.5">
                  {Object.entries(r.values)
                    .filter(([, v]) => v)
                    .map(([k, v]) => (
                      <p className="text-[13px] text-ink" key={k}>
                        <span className="text-stone">{k}: </span>
                        {v}
                      </p>
                    ))}
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button size="sm" variant="ghost" onClick={() => begin(r)}>
                    <Pencil size={13} /> {dict.adminUi.edit}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-danger"
                    onClick={() => {
                      state.put(section, rows.filter((x) => x.id !== r.id));
                      toast(dict.adminUi.deleted);
                    }}
                  >
                    <Trash2 size={13} />
                  </Button>
                </div>
              </li>
            ))}
            {visible.length === 0 && (
              <li className="py-4 text-[13px] text-stone">{dict.adminUi.noMatchingRecord}</li>
            )}
          </ul>
        </Card>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? dict.adminUi.editRecord : buttonLabel}>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const row = { id: editing ?? crypto.randomUUID(), values };
            state.put(
              section,
              editing ? rows.map((r) => (r.id === editing ? row : r)) : [...rows, row],
            );
            setOpen(false);
            toast(dict.adminUi.saved);
          }}
        >
          {names.map((name) => (
            <Field key={name} label={dict.adminUi.fields[name]} required={!longFields.has(name)}>
              {longFields.has(name) ? (
                <Textarea
                  value={values[name] ?? ""}
                  onChange={(e) => setValues({ ...values, [name]: e.target.value })}
                />
              ) : (
                <Input
                  required
                  type={
                    numberFields.has(name) ? "number" : dateFields.has(name) ? "date" : "text"
                  }
                  min={numberFields.has(name) ? 0 : undefined}
                  value={values[name] ?? ""}
                  onChange={(e) => setValues({ ...values, [name]: e.target.value })}
                />
              )}
            </Field>
          ))}

          <Button type="submit" full>
            {dict.actions.save}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
