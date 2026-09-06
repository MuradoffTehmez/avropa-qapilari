"use client";

import { useState } from "react";
import { MapPin, Plus, Trash2 } from "lucide-react";

import type { Dictionary } from "@/i18n";
import { Button } from "@/components/ui/Button";
import { Card, EmptyState } from "@/components/ui/primitives";
import { Checkbox, Field, Input } from "@/components/ui/form";
import { Modal, toast } from "@/components/ui/overlays";
import { ApiRequestError, apiFetch } from "@/lib/api";
import type { AddressRow } from "@/server/account";

const EMPTY = {
  label: "",
  city: "",
  district: "",
  street: "",
  building: "",
  apartment: "",
  isDefault: false,
};

/**
 * Ünvan siyahısı — `/api/account/addresses`.
 * Server hər sorğuda ünvanın sahibini yoxlayır (PRD §93).
 */
export function AddressManager({
  dict,
  initial,
}: {
  dict: Dictionary;
  initial: AddressRow[];
}) {
  const [rows, setRows] = useState(initial);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const labels = dict.adminUi.fields;

  function set<K extends keyof typeof EMPTY>(key: K, value: (typeof EMPTY)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  }

  async function create(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);

    try {
      setRows(
        await apiFetch<AddressRow[]>("/api/account/addresses", {
          method: "POST",
          json: form,
        }),
      );
      setForm(EMPTY);
      setOpen(false);
    } catch (error) {
      if (error instanceof ApiRequestError) {
        setErrors(error.error.details ?? { label: error.error.message });
      }
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    try {
      setRows(await apiFetch<AddressRow[]>(`/api/account/addresses/${id}`, { method: "DELETE" }));
    } catch (error) {
      if (error instanceof ApiRequestError) toast(error.error.message);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight text-ink">{dict.account.addresses}</h2>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus size={15} /> {dict.accountUi.newAddress}
        </Button>
      </div>

      {rows.length === 0 && (
        <EmptyState icon={<MapPin size={30} />} title={dict.accountUi.noAddresses} />
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {rows.map((a) => (
          <Card key={a.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="mt-0.5 shrink-0 text-gold-500" />
                <div>
                  <p className="text-[15px] font-medium text-ink">{a.label}</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-stone">
                    {[
                      a.city,
                      a.district,
                      a.street,
                      a.building,
                      a.apartment && `${dict.accountUi.apartment} ${a.apartment}`,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {a.isDefault && (
                  <span className="border border-line px-2 py-0.5 text-[11px] uppercase tracking-wider text-stone">
                    {dict.accountUi.defaultAddress}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => void remove(a.id)}
                  aria-label={`${dict.actions.remove}: ${a.label}`}
                  className="flex size-11 items-center justify-center text-stone transition-colors hover:text-danger"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={dict.accountUi.newAddress}>
        <form onSubmit={create} className="grid gap-4 sm:grid-cols-2" noValidate>
          <Field label={labels.addressName} required error={errors.label}>
            <Input value={form.label} onChange={(e) => set("label", e.target.value)} />
          </Field>
          <Field label={labels.city} required error={errors.city}>
            <Input value={form.city} onChange={(e) => set("city", e.target.value)} />
          </Field>
          <Field label={labels.street} error={errors.street}>
            <Input value={form.street} onChange={(e) => set("street", e.target.value)} />
          </Field>
          <Field label={labels.building} error={errors.building}>
            <Input value={form.building} onChange={(e) => set("building", e.target.value)} />
          </Field>
          <Field label={labels.apartment} error={errors.apartment}>
            <Input value={form.apartment} onChange={(e) => set("apartment", e.target.value)} />
          </Field>

          <div className="sm:col-span-2">
            <Checkbox
              label={dict.accountUi.defaultAddress}
              checked={form.isDefault}
              onChange={(e) => set("isDefault", e.target.checked)}
            />
          </div>

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
