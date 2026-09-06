"use client";
import { useState, type ReactNode } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useHydrated } from "@/lib/hooks";
import { Modal, toast } from "@/components/ui/overlays";
import { Button } from "@/components/ui/Button";
import { Download, Search } from "lucide-react";
import { Card } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";
import { useDict } from "@/i18n/provider";

const useTables = create<{ tables: Record<string, unknown[]>; save: (key: string, rows: unknown[]) => void }>()(persist((set) => ({ tables: {}, save: (key, rows) => set((s) => ({ tables: { ...s.tables, [key]: rows } })) }), { name: "ep-admin-tables-v1" }));
export interface Column<T> {
  key: string;
  header: string;
  align?: "left" | "right" | "center";
  className?: string;
  render: (row: T) => ReactNode;
}

export function DataTable<T>({
  title,
  description,
  columns,
  rows,
  actions,
  minWidth = 720,
  empty,
}: {
  title: string;
  description?: string;
  columns: Column<T>[];
  rows: T[];
  actions?: ReactNode;
  minWidth?: number;
  empty?: string;
}) {
  const dict = useDict();
  const state = useTables();
  const hydrated = useHydrated();
  const data = hydrated && state.tables[title] ? state.tables[title] as T[] : rows;
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<Record<string, unknown>>({});
  const filtered = data.map((row, index) => ({ row, index })).filter(({ row }) => JSON.stringify(row).toLowerCase().includes(query.toLowerCase()));
  const visible = filtered.slice(page * 8, page * 8 + 8);
  const editable = !/audit|əməliyyatların|konversiya|permission|icazə|RBAC/i.test(title);
  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3.5 sm:px-5">
        <div className="min-w-0">
          <h2 className="text-[13px] font-semibold text-ink">{title}</h2>
          {description && <p className="mt-0.5 text-[12px] text-stone">{description}</p>}
        </div>
        {actions}
      </div>

      <div className="flex items-center gap-2 border-b border-line px-4 py-3 sm:px-5">
        <div className="relative min-w-0 flex-1">
          <Search
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mist"
          />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            aria-label={`${title} ${dict.adminUi.searchSuffix}`}
            placeholder={dict.adminUi.searchTable}
            className="h-11 w-full rounded-[3px] border border-line bg-bone pl-8 pr-3 text-[13px] text-ink outline-none placeholder:text-mist focus:border-ink sm:h-9"
          />
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="shrink-0"
          onClick={() => {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.json`;
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          <Download size={14} />
          <span className="hidden sm:inline">{dict.adminUi.export}</span>
        </Button>
      </div>

      {filtered.length === 0 ? (
        <p className="px-5 py-10 text-center text-[13px] text-stone">{empty ?? dict.adminUi.empty}</p>
      ) : (
        <div className="hidden overflow-x-auto md:block" tabIndex={0} role="region" aria-label={title}>
          <table className="w-full text-[13px]" style={{ minWidth }}>
            <thead>
              <tr className="border-b border-line bg-bone/60 text-xs uppercase tracking-[0.1em] text-graphite">
                {columns.map((c) => (
                  <th
                    key={c.key}
                    className={cn(
                      "px-5 py-2.5 font-medium",
                      c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : "text-left",
                    )}
                  >
                    {c.header}
                  </th>
                ))}
                {editable && <th className="px-4">{dict.adminUi.operation}</th>}
              </tr>
            </thead>
            <tbody>
              {visible.map(({row, index}) => (
                <tr key={index} className="border-b border-line last:border-b-0 hover:bg-bone/40">
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      className={cn(
                        "px-5 py-3",
                        c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : "text-left",
                        c.className,
                      )}
                    >
                      {c.render(row)}
                    </td>
                  ))}
                  {editable && <td className="px-4"><Button size="sm" variant="ghost" onClick={() => { setEditIndex(index); setDraft({ ...row } as Record<string, unknown>); }}>{dict.adminUi.viewEdit}</Button></td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="grid gap-3 p-3 md:hidden">{visible.map(({row,index}) => <article key={index} className="rounded-[3px] border bg-bone p-4"><dl className="space-y-3">{columns.filter(c=>c.header).map(c=><div key={c.key} className="flex flex-wrap items-start justify-between gap-2 border-b pb-2 last:border-0"><dt className="text-xs text-graphite">{c.header}</dt><dd className="max-w-full text-sm">{c.render(row)}</dd></div>)}</dl>{editable && <Button full variant="secondary" className="mt-3" onClick={()=>{setEditIndex(index);setDraft({...row} as Record<string,unknown>);}}>{dict.adminUi.viewEdit}</Button>}</article>)}</div>
      <div className="flex items-center justify-between gap-3 border-t p-3 text-xs"><span>{filtered.length} {dict.adminUi.records} · {dict.adminUi.page} {page + 1}</span><div className="flex gap-2"><Button size="sm" variant="ghost" disabled={page===0} onClick={() => setPage(page-1)}>{dict.adminUi.previous}</Button><Button size="sm" variant="ghost" disabled={(page+1)*8>=filtered.length} onClick={() => setPage(page+1)}>{dict.adminUi.next}</Button></div></div>
      <Modal open={editIndex!==null} onClose={() => setEditIndex(null)} title={dict.adminUi.editRecord}><form className="space-y-3" onSubmit={(e) => { e.preventDefault(); state.save(title, data.map((r,i) => i===editIndex ? draft : r)); setEditIndex(null); toast(dict.adminUi.changesSaved); }}>{Object.entries(draft).filter(([key,value]) => key!=="id" && (typeof value==="string" || typeof value==="number" || typeof value==="boolean")).map(([key,value]) => <label key={key} className="block text-sm">{dict.adminUi.fields[key as keyof typeof dict.adminUi.fields] ?? key}{typeof value==="boolean" ? <input className="ml-3" type="checkbox" checked={value} onChange={(e) => setDraft({...draft,[key]:e.target.checked})}/> : <input className="mt-1 h-11 w-full rounded-[3px] border border-line px-3" type={typeof value==="number" ? "number" : "text"} step="any" value={String(value)} onChange={(e) => setDraft({...draft,[key]:typeof value==="number" ? Number(e.target.value) : e.target.value})}/>}</label>)}<Button type="submit">{dict.actions.save}</Button></form></Modal>
    </Card>
  );
}

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">{title}</h1>
        {description && <p className="mt-1 text-[13px] text-stone">{description}</p>}
      </div>
      {action}
    </div>
  );
}
