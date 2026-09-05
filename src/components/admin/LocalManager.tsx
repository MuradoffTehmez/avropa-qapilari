"use client";
import { useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useHydrated } from "@/lib/hooks";
import { Modal, toast } from "@/components/ui/overlays";
import { Button } from "@/components/ui/Button";

type Row = { id: string; values: Record<string, string> };
const useEntries = create<{ data: Record<string, Row[]>; put: (key: string, rows: Row[]) => void }>()(persist((set) => ({ data: {}, put: (key, rows) => set((s) => ({ data: { ...s.data, [key]: rows } })) }), { name: "ep-management-demo-v1" }));
const fields: Record<string, string[]> = {
  products: ["Məhsul adı", "SKU", "Kateqoriya", "Qiymət (AZN)", "Stok", "Təsvir"],
  categories: ["Kateqoriya adı", "Slug", "Təsvir"], brands: ["Brend adı", "Ölkə", "Təsvir"],
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

export function LocalManager({ section, label = "Demo qeydlərini idarə et" }: { section: string; label?: string }) {
  const state = useEntries();
  const hydrated = useHydrated();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [query, setQuery] = useState("");
  const names = fields[section] ?? ["Ad", "Status", "Qeyd"];
  const rows = hydrated ? state.data[section] ?? [] : [];
  function begin(row?: Row) { setEditing(row?.id ?? null); setValues(row?.values ?? {}); setOpen(true); }
  return <div className="my-4 space-y-3"><Button variant="secondary" size="sm" onClick={() => begin()}>{label}</Button>{rows.length > 0 && <div className="border bg-paper p-4"><h3 className="mb-3 font-semibold">Saxlanmış demo qeydləri</h3><input className="mb-3 w-full border p-2" aria-label="Qeydləri axtar" placeholder="Axtar…" value={query} onChange={(e) => setQuery(e.target.value)} />{rows.filter((r) => Object.values(r.values).join(" ").toLocaleLowerCase("az").includes(query.toLocaleLowerCase("az"))).map((r) => <div key={r.id} className="flex flex-wrap justify-between gap-3 border-t py-3"><div>{Object.entries(r.values).map(([k,v]) => <p className="text-sm" key={k}><span className="text-stone">{k}: </span>{v}</p>)}</div><div className="flex items-start gap-2"><Button size="sm" variant="ghost" onClick={() => begin(r)}>Redaktə et</Button><Button size="sm" variant="ghost" onClick={() => { state.put(section, rows.filter((x) => x.id !== r.id)); toast("Demo qeydi silindi"); }}>Sil</Button></div></div>)}</div>}<Modal open={open} onClose={() => setOpen(false)} title={editing ? "Qeydi redaktə et" : label}><form className="space-y-4" onSubmit={(e) => { e.preventDefault(); const row = { id: editing ?? crypto.randomUUID(), values }; state.put(section, editing ? rows.map((r) => r.id === editing ? row : r) : [...rows, row]); setOpen(false); toast("Bu brauzerdə saxlanıldı"); }}>{names.map((name) => <label className="block text-sm" key={name}>{name}{/Təsvir|Məzmun|Qeyd/.test(name) ? <textarea className="mt-1 min-h-28 w-full border p-2" value={values[name] ?? ""} onChange={(e) => setValues({ ...values, [name]: e.target.value })} /> : <input required className="mt-1 w-full border p-2" type={/Qiymət|Stok|Faiz/.test(name) ? "number" : /tarixi/.test(name) ? "date" : "text"} min="0" value={values[name] ?? ""} onChange={(e) => setValues({ ...values, [name]: e.target.value })} />}</label>)}<p className="text-xs text-stone">Demo qeydi yalnız bu brauzerdə saxlanılır.</p><Button type="submit">Yadda saxla</Button></form></Modal></div>;
}
