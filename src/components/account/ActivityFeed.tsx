"use client";

import Link from "next/link";
import { useState } from "react";
import { Search } from "lucide-react";
import { useWorkflow } from "@/store/workflow";
import { useHydrated } from "@/lib/hooks";
import { formatDateTime, formatPrice } from "@/lib/utils";
import { Badge, Card } from "@/components/ui/primitives";
import { Input, Select } from "@/components/ui/form";
import { technicians } from "@/mock/content";

const kindsBySection: Record<string, string[]> = {
  orders: ["orders", "quotes"],
  repairs: ["repairs"],
  appointments: ["measurements"],
  measurements: ["measurements"],
  quotes: ["quotes"],
  all: ["orders", "repairs", "measurements", "quotes"],
};

const statuses = [
  "Yeni",
  "Təsdiqləndi",
  "Planlaşdırıldı",
  "İcradadır",
  "Tamamlandı",
  "Ləğv edildi",
];

/** Bu brauzerdə yaradılmış müraciətlər — hesabda və idarəetmə panelində göstərilir. */
export function ActivityFeed({
  section,
  locale,
  manage = false,
}: {
  section: string;
  locale: string;
  manage?: boolean;
}) {
  const records = useWorkflow((s) => s.records);
  const designs = useWorkflow((s) => s.designs);
  const update = useWorkflow((s) => s.update);
  const hydrated = useHydrated();
  const [query, setQuery] = useState("");

  if (!hydrated) return null;

  /* --------------------------- saxlanmış dizaynlar --------------------------- */
  if (section === "configurations") {
    if (designs.length === 0) return null;
    return (
      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        {designs.map((d) => (
          <Card key={d.id} className="p-4 sm:p-5">
            <p className="font-mono text-[11px] text-stone">{d.id}</p>
            <h3 className="mt-1 text-[15px] font-medium text-ink">{d.productName}</h3>
            <p className="mt-1 text-[13px] text-stone">
              {d.selection.width} × {d.selection.height} mm
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
              <span className="text-[15px] font-semibold tabular-nums text-ink">
                {formatPrice(d.total)}
              </span>
              <Link
                href={`/${locale}/konfiqurator/${d.productSlug}?design=${encodeURIComponent(JSON.stringify(d.selection))}`}
                className="text-[13px] font-medium text-gold-600 underline-offset-4 hover:underline"
              >
                Dizaynı aç →
              </Link>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  /* ------------------------------- müraciətlər ------------------------------ */
  const kinds = kindsBySection[section] ?? [];
  const relevant = records.filter((r) => kinds.includes(r.kind));
  if (relevant.length === 0) return null;

  const q = query.toLocaleLowerCase("az");
  const filtered = relevant.filter((r) =>
    `${r.id} ${r.title} ${r.detail}`.toLocaleLowerCase("az").includes(q),
  );

  return (
    <section className="mb-8 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight text-ink">Yeni müraciətlər</h2>
        <div className="relative w-full sm:w-64">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mist"
          />
          <Input
            aria-label="Müraciət axtarışı"
            placeholder="Nömrə və ya ad"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-10 pl-9 text-[13px]"
          />
        </div>
      </div>

      {filtered.map((r) => (
        <Card key={r.id} className="p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-mono text-[11px] text-stone">{r.id}</p>
              <h3 className="mt-1 text-[15px] font-medium text-ink">{r.title}</h3>
            </div>
            <Badge tone={r.status === "Tamamlandı" ? "success" : "gold"}>{r.status}</Badge>
          </div>

          <p className="mt-2 whitespace-pre-wrap text-[13.5px] leading-relaxed text-graphite">
            {r.detail}
          </p>

          {r.total !== undefined && (
            <p className="mt-2 text-[15px] font-semibold tabular-nums text-ink">
              {formatPrice(r.total)}
            </p>
          )}
          {r.technician && <p className="mt-2 text-[13px] text-graphite">Usta: {r.technician}</p>}

          <ol className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t border-line pt-3 text-[11.5px] text-stone">
            {r.history.map((h, i) => (
              <li key={i}>
                {h.status} · {formatDateTime(h.date)}
              </li>
            ))}
          </ol>

          {manage && (
            <div className="mt-4 grid gap-2 border-t border-line pt-4 sm:grid-cols-2">
              <Select
                aria-label={`${r.id} statusu`}
                value={r.status}
                onChange={(e) => update(r.id, e.target.value)}
                className="h-10 text-[13px]"
              >
                {statuses.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </Select>
              <Select
                aria-label={`${r.id} üçün usta`}
                value={r.technician ?? ""}
                onChange={(e) => update(r.id, "Planlaşdırıldı", e.target.value)}
                className="h-10 text-[13px]"
              >
                <option value="" disabled>
                  Usta təyin et
                </option>
                {technicians.map((t) => (
                  <option key={t.id}>{t.name}</option>
                ))}
              </Select>
            </div>
          )}
        </Card>
      ))}

      {filtered.length === 0 && (
        <p className="py-4 text-[14px] text-stone">Axtarışa uyğun müraciət yoxdur.</p>
      )}
    </section>
  );
}
