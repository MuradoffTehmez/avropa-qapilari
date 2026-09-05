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

const fields: Record<string, string[]> = {
  products: ["Məhsul adı", "SKU", "Kateqoriya", "Qiymət (AZN)", "Stok", "Təsvir"],
  categories: ["Kateqoriya adı", "Slug", "Təsvir"],
  brands: ["Brend adı", "Ölkə", "Təsvir"],
  configurator: ["Option adı", "Qrup", "Qiymət (AZN)", "Uyğun modellər"],
  discounts: ["Endirim adı", "Promo kod", "Faiz", "Bitmə tarixi"],
  addresses: ["Ünvan adı", "Şəhər", "Küçə", "Bina", "Mənzil"],
  content: ["Başlıq", "URL", "Məzmun", "Status"],
  inventory: ["Komponent", "SKU", "Stok", "Minimum stok", "Təchizatçı"],
  seo: ["Səhifə URL", "SEO başlığı", "Meta təsvir", "Canonical"],
  settings: ["Sayt adı", "Telefon", "E-poçt", "Ünvan"],
  technicians: ["Usta adı", "Telefon", "İxtisas", "Xidmət ərazisi"],
  suppliers: ["Təchizatçı adı", "Əlaqə", "Ölkə", "Çatdırılma müddəti"],
};

const longField = /Təsvir|Məzmun|Qeyd/;
const numberField = /Qiymət|Stok|Faiz/;
const dateField = /tarixi/;

export function LocalManager({
  section,
  label = "Yeni qeyd",
}: {
  section: string;
  label?: string;
}) {
  const state = useEntries();
  const hydrated = useHydrated();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [query, setQuery] = useState("");

  const names = fields[section] ?? ["Ad", "Status", "Qeyd"];
  const rows = hydrated ? (state.data[section] ?? []) : [];

  function begin(row?: Row) {
    setEditing(row?.id ?? null);
    setValues(row?.values ?? {});
    setOpen(true);
  }

  const q = query.toLocaleLowerCase("az");
  const visible = rows.filter((r) =>
    Object.values(r.values).join(" ").toLocaleLowerCase("az").includes(q),
  );

  return (
    <div className="mb-4 space-y-3">
      <Button variant="secondary" size="sm" onClick={() => begin()}>
        <Plus size={14} /> {label}
      </Button>

      {rows.length > 0 && (
        <Card className="p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-[13px] font-semibold text-ink">
              Əlavə edilmiş qeydlər ({rows.length})
            </h3>
            <div className="relative w-full sm:w-56">
              <Search
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mist"
              />
              <Input
                aria-label="Qeydləri axtar"
                placeholder="Axtar…"
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
                    <Pencil size={13} /> Redaktə
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-danger"
                    onClick={() => {
                      state.put(section, rows.filter((x) => x.id !== r.id));
                      toast("Qeyd silindi");
                    }}
                  >
                    <Trash2 size={13} />
                  </Button>
                </div>
              </li>
            ))}
            {visible.length === 0 && (
              <li className="py-4 text-[13px] text-stone">Axtarışa uyğun qeyd yoxdur.</li>
            )}
          </ul>
        </Card>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Qeydi redaktə et" : label}>
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
            toast("Yadda saxlanıldı");
          }}
        >
          {names.map((name) => (
            <Field key={name} label={name} required={!longField.test(name)}>
              {longField.test(name) ? (
                <Textarea
                  value={values[name] ?? ""}
                  onChange={(e) => setValues({ ...values, [name]: e.target.value })}
                />
              ) : (
                <Input
                  required
                  type={
                    numberField.test(name) ? "number" : dateField.test(name) ? "date" : "text"
                  }
                  min={numberField.test(name) ? 0 : undefined}
                  value={values[name] ?? ""}
                  onChange={(e) => setValues({ ...values, [name]: e.target.value })}
                />
              )}
            </Field>
          ))}

          <Button type="submit" full>
            Yadda saxla
          </Button>
        </form>
      </Modal>
    </div>
  );
}
