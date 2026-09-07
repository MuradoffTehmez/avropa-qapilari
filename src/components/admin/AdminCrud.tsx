"use client";

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Checkbox, Field, Input, Select, Textarea } from "@/components/ui/form";
import { Modal, toast } from "@/components/ui/overlays";
import { ApiRequestError, apiFetch } from "@/lib/api";
import { useDict } from "@/i18n/provider";

/**
 * Admin bölmələri üçün ortaq yaratma/redaktə/silmə.
 *
 * Sətirlər serverdən gəlir, dəyişiklik dərhal API-ya yazılır — lokal
 * yaddaşda nüsxə saxlanılmır. Səlahiyyət hər sorğuda serverdə yoxlanılır.
 */
export type CrudFieldType = "text" | "number" | "textarea" | "checkbox" | "select" | "date";

export interface CrudField {
  name: string;
  label: string;
  type?: CrudFieldType;
  required?: boolean;
  hint?: string;
  options?: { value: string; label: string }[];
  /** Yalnız yeni qeyd formasında göstərilir. */
  createOnly?: boolean;
}

export interface CrudRow {
  id: string;
}

export function AdminCrud<T extends CrudRow>({
  endpoint,
  fields,
  onRows,
  createLabel,
  editTitle,
  children,
}: {
  /** Məsələn "/api/admin/discounts". */
  endpoint: string;
  fields: CrudField[];
  /** Server yenilənmiş siyahını qaytarır. */
  onRows: (rows: T[]) => void;
  createLabel: string;
  editTitle: string;
  /** Cədvəli özü render edir; hər sətirdə `actions` göstərilir. */
  children: (actions: (row: T) => ReactNode) => ReactNode;
}) {
  const dict = useDict();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [values, setValues] = useState<Record<string, string | boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  function begin(row?: T) {
    const next: Record<string, string | boolean> = {};
    for (const field of fields) {
      const raw = row ? (row as unknown as Record<string, unknown>)[field.name] : undefined;
      next[field.name] =
        field.type === "checkbox" ? Boolean(raw) : raw === undefined || raw === null ? "" : String(raw);
    }
    setValues(next);
    setEditing(row ?? null);
    setErrors({});
    setOpen(true);
  }

  function payload() {
    const body: Record<string, unknown> = {};
    for (const field of fields) {
      const raw = values[field.name];
      body[field.name] = field.type === "number" ? Number(raw || 0) : raw;
    }
    return body;
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);

    try {
      const next = await apiFetch<T[]>(editing ? `${endpoint}/${editing.id}` : endpoint, {
        method: editing ? "PATCH" : "POST",
        json: payload(),
      });
      onRows(next);
      setOpen(false);
      router.refresh();
    } catch (error) {
      if (error instanceof ApiRequestError) {
        setErrors(error.error.details ?? { [fields[0].name]: error.error.message });
      }
    } finally {
      setBusy(false);
    }
  }

  async function remove(row: T) {
    if (!window.confirm(dict.adminUi.deleteConfirm)) return;
    try {
      onRows(await apiFetch<T[]>(`${endpoint}/${row.id}`, { method: "DELETE" }));
      router.refresh();
    } catch (error) {
      if (error instanceof ApiRequestError) toast(error.error.message);
    }
  }

  const actions = (row: T) => (
    <span className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => begin(row)}
        aria-label={`${dict.adminUi.viewEdit}: ${row.id}`}
        className="flex size-11 items-center justify-center text-stone transition-colors hover:text-ink sm:size-9"
      >
        <Pencil size={15} />
      </button>
      <button
        type="button"
        onClick={() => void remove(row)}
        aria-label={`${dict.actions.remove}: ${row.id}`}
        className="flex size-11 items-center justify-center text-stone transition-colors hover:text-danger sm:size-9"
      >
        <Trash2 size={15} />
      </button>
    </span>
  );

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button size="sm" onClick={() => begin()}>
          <Plus size={15} /> {createLabel}
        </Button>
      </div>

      {children(actions)}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? editTitle : createLabel}>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2" noValidate>
          {fields.map((field) => {
            const span = field.type === "textarea" ? "sm:col-span-2" : "";
            const value = values[field.name];

            if (field.type === "checkbox") {
              return (
                <div key={field.name} className="sm:col-span-2">
                  <Checkbox
                    label={field.label}
                    checked={Boolean(value)}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [field.name]: e.target.checked }))
                    }
                  />
                </div>
              );
            }

            return (
              <Field
                key={field.name}
                label={field.label}
                required={field.required}
                hint={field.hint}
                error={errors[field.name]}
                className={span}
              >
                {field.type === "textarea" ? (
                  <Textarea
                    rows={5}
                    value={String(value ?? "")}
                    onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
                  />
                ) : field.type === "select" ? (
                  <Select
                    value={String(value ?? "")}
                    onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
                  >
                    {(field.options ?? []).map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </Select>
                ) : (
                  <Input
                    type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                    value={String(value ?? "")}
                    onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
                  />
                )}
              </Field>
            );
          })}

          <div className="sm:col-span-2">
            <Button type="submit" disabled={busy}>
              {dict.actions.save}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
