import type { ReactNode } from "react";
import { Card } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

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
  empty = "Məlumat yoxdur",
}: {
  title: string;
  description?: string;
  columns: Column<T>[];
  rows: T[];
  actions?: ReactNode;
  minWidth?: number;
  empty?: string;
}) {
  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5">
        <div>
          <h2 className="text-[13px] font-semibold text-ink">{title}</h2>
          {description && <p className="mt-0.5 text-[12px] text-stone">{description}</p>}
        </div>
        {actions}
      </div>

      {rows.length === 0 ? (
        <p className="px-5 py-10 text-center text-[13px] text-stone">{empty}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]" style={{ minWidth }}>
            <thead>
              <tr className="border-b border-line bg-bone/60 text-[11px] uppercase tracking-[0.1em] text-stone">
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
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-line last:border-b-0 hover:bg-bone/40">
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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
