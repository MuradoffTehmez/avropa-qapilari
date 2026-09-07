"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Archive, Pencil, Plus, Trash2 } from "lucide-react";

import type { CrudField } from "@/components/admin/AdminCrud";
import { Button } from "@/components/ui/Button";
import { Checkbox, Field, Input, Select, Textarea } from "@/components/ui/form";
import { Modal, toast } from "@/components/ui/overlays";
import { ApiRequestError, apiFetch } from "@/lib/api";
import { useDict } from "@/i18n/provider";

type Values = Record<string, string | string[] | number | boolean | null | undefined>;
type FormValues = Record<string, string | string[] | boolean>;

/** Serverdə saxlanan admin sətiri üçün ortaq yaratma/redaktə/silmə düyməsi. */
export function AdminEntityAction({
  entity,
  id,
  fields,
  values: rawValues = {},
  createLabel,
  deleteOnly = false,
  archive = false,
}: {
  entity: string;
  id?: string;
  fields: CrudField[];
  values?: object;
  createLabel?: string;
  deleteOnly?: boolean;
  /** Əlaqəli biznes tarixçəsini qorumaq üçün qeydi fiziki silmək əvəzinə arxivlə. */
  archive?: boolean;
}) {
  const dict = useDict();
  const values = rawValues as Values;
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormValues>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const visibleFields = id ? fields.filter((field) => !field.createOnly) : fields;

  function begin() {
    setForm(
      Object.fromEntries(
        visibleFields.map((field) => {
          const value = values[field.name];
          return [
            field.name,
            field.type === "checkbox"
              ? Boolean(value)
              : field.type === "multiselect"
                ? Array.isArray(value) ? value : []
              : value == null
                ? field.type === "select"
                  ? field.options?.[0]?.value ?? ""
                  : ""
                : String(value),
          ];
        }),
      ),
    );
    setErrors({});
    setOpen(true);
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const payload = Object.fromEntries(
        visibleFields.map((field) => [
          field.name,
          field.type === "number" ? Number(form[field.name] || 0) : form[field.name],
        ]),
      );
      await apiFetch(id ? `/api/admin/entities/${entity}/${id}` : `/api/admin/entities/${entity}`, {
        method: id ? "PATCH" : "POST",
        headers: { "Idempotency-Key": crypto.randomUUID() },
        json: payload,
      });
      setOpen(false);
      router.refresh();
      toast(dict.adminUi.saved);
    } catch (error) {
      if (error instanceof ApiRequestError) {
        setErrors(error.error.details ?? { [visibleFields[0]?.name ?? "_"]: error.error.message });
      }
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!id) return;
    if (!window.confirm(archive ? dict.adminUi.archiveConfirm : dict.adminUi.deleteConfirm)) return;
    try {
      await apiFetch(`/api/admin/entities/${entity}/${id}`, {
        method: "DELETE",
        headers: { "Idempotency-Key": crypto.randomUUID() },
      });
      router.refresh();
      toast(archive ? dict.adminUi.archived : dict.adminUi.deleted);
    } catch (error) {
      if (error instanceof ApiRequestError) toast(error.error.message);
    }
  }

  return (
    <>
      {id ? (
        <span className="flex items-center gap-1">
          {!deleteOnly && (
            <button type="button" onClick={begin} aria-label={dict.adminUi.edit} className="flex size-11 items-center justify-center text-stone hover:text-ink sm:size-9">
              <Pencil size={15} />
            </button>
          )}
          <button type="button" onClick={() => void remove()} aria-label={archive ? dict.adminUi.archive : dict.actions.remove} className="flex size-11 items-center justify-center text-stone hover:text-danger sm:size-9">
            {archive ? <Archive size={15} /> : <Trash2 size={15} />}
          </button>
        </span>
      ) : (
        <Button size="sm" onClick={begin}>
          <Plus size={15} /> {createLabel ?? dict.adminUi.newRecord}
        </Button>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={id ? dict.adminUi.editRecord : createLabel ?? dict.adminUi.newRecord}>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2" noValidate>
          {visibleFields.map((field) => {
            if (field.type === "checkbox") {
              return (
                <div key={field.name} className="sm:col-span-2">
                  <Checkbox label={field.label} checked={Boolean(form[field.name])} onChange={(e) => setForm((v) => ({ ...v, [field.name]: e.target.checked }))} />
                </div>
              );
            }
            if (field.type === "multiselect") {
              const selected = Array.isArray(form[field.name]) ? form[field.name] as string[] : [];
              return (
                <Field key={field.name} label={field.label} required={field.required} hint={field.hint} error={errors[field.name]} className="sm:col-span-2">
                  <div className="grid max-h-72 gap-2 overflow-y-auto border border-line p-3 sm:grid-cols-2">
                    {(field.options ?? []).map((option) => (
                      <Checkbox
                        key={option.value}
                        label={option.label}
                        checked={selected.includes(option.value)}
                        onChange={(event) => setForm((current) => ({
                          ...current,
                          [field.name]: event.target.checked
                            ? [...selected, option.value]
                            : selected.filter((item) => item !== option.value),
                        }))}
                      />
                    ))}
                  </div>
                </Field>
              );
            }
            const control = field.type === "textarea" ? (
              <Textarea value={String(form[field.name] ?? "")} onChange={(e) => setForm((v) => ({ ...v, [field.name]: e.target.value }))} />
            ) : field.type === "select" ? (
              <Select value={String(form[field.name] ?? "")} onChange={(e) => setForm((v) => ({ ...v, [field.name]: e.target.value }))}>
                {(field.options ?? []).map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </Select>
            ) : (
              <Input type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"} value={String(form[field.name] ?? "")} onChange={(e) => setForm((v) => ({ ...v, [field.name]: e.target.value }))} />
            );
            return <Field key={field.name} label={field.label} required={field.required} hint={field.hint} error={errors[field.name]} className={field.type === "textarea" ? "sm:col-span-2" : ""}>{control}</Field>;
          })}
          <div className="sm:col-span-2"><Button type="submit" disabled={busy}>{dict.actions.save}</Button></div>
        </form>
      </Modal>
    </>
  );
}

export function AdminDeleteAction({ entity, id, archive = false }: { entity: string; id: string; archive?: boolean }) {
  return <AdminEntityAction entity={entity} id={id} fields={[]} deleteOnly archive={archive} />;
}
