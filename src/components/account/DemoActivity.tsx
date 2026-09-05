"use client";
import Link from "next/link";
import { useState } from "react";
import { useDemo } from "@/store/demo";
import { useHydrated } from "@/lib/hooks";
import { formatDateTime, formatPrice } from "@/lib/utils";
import { technicians } from "@/mock/content";

export function DemoActivity({ section, locale, manage = false }: { section: string; locale: string; manage?: boolean }) {
  const records = useDemo((s) => s.records);
  const designs = useDemo((s) => s.designs);
  const update = useDemo((s) => s.update);
  const hydrated = useHydrated();
  const [query, setQuery] = useState("");
  if (!hydrated) return null;
  if (section === "configurations") return <div className="mb-6 grid gap-3">{designs.map((d) => <article key={d.id} className="border border-line bg-bone p-5"><h3 className="font-semibold">{d.productName}</h3><p className="my-2 text-sm">{d.selection.width} × {d.selection.height} mm · {formatPrice(d.total)}</p><Link className="underline" href={`/${locale}/konfiqurator/${d.productSlug}?design=${encodeURIComponent(JSON.stringify(d.selection))}`}>Saxlanmış dizaynı aç</Link></article>)}</div>;
  const kinds: Record<string, string[]> = { orders: ["orders", "quotes"], repairs: ["repairs"], appointments: ["measurements"], measurements: ["measurements"], quotes: ["quotes"], all: ["orders", "repairs", "measurements", "quotes"] };
  const filtered = records.filter((r) => (kinds[section] ?? []).includes(r.kind) && `${r.id} ${r.title}`.toLocaleLowerCase("az").includes(query.toLocaleLowerCase("az")));
  if (!(kinds[section] ?? []).some((kind) => records.some((r) => r.kind === kind))) return null;
  return <section className="mb-7 space-y-3"><h2 className="text-lg font-semibold">Bu demoda yaratdığınız müraciətlər</h2><input aria-label="Müraciət axtarışı" className="w-full border p-3" placeholder="Nömrə və ya ad ilə axtar" value={query} onChange={(e) => setQuery(e.target.value)} />{filtered.map((r) => <article key={r.id} className="border border-line bg-paper p-5"><div className="flex flex-wrap justify-between gap-3"><div><p className="font-mono text-xs">{r.id}</p><h3 className="mt-1 font-semibold">{r.title}</h3></div><span className="text-success">{r.status}</span></div><p className="mt-2 whitespace-pre-wrap text-sm text-graphite">{r.detail}</p>{r.total !== undefined && <p className="mt-2 font-semibold">{formatPrice(r.total)}</p>}{r.technician && <p className="mt-2 text-sm">Usta: {r.technician}</p>}<ol className="mt-4 flex flex-wrap gap-4 border-t pt-3 text-xs">{r.history.map((h, i) => <li key={i}>{h.status} · {formatDateTime(h.date)}</li>)}</ol>{manage && <div className="mt-4 flex flex-wrap gap-3"><select aria-label={`${r.id} statusu`} className="border p-2" value={r.status} onChange={(e) => update(r.id, e.target.value)}>{["Yeni", "Təsdiqləndi", "Planlaşdırıldı", "İcradadır", "Tamamlandı", "Ləğv edildi"].map((s) => <option key={s}>{s}</option>)}</select><select aria-label={`${r.id} üçün usta`} className="border p-2" value={r.technician ?? ""} onChange={(e) => update(r.id, "Planlaşdırıldı", e.target.value)}><option value="" disabled>Usta təyin et</option>{technicians.map((t) => <option key={t.id}>{t.name}</option>)}</select></div>}</article>)}{!filtered.length && <p>Axtarışa uyğun müraciət yoxdur.</p>}</section>;
}
