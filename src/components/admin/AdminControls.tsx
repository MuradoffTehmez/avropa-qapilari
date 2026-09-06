"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { ApiRequestError, apiFetch } from "@/lib/api";
import { toast } from "@/components/ui/overlays";
import { useDict } from "@/i18n/provider";

/**
 * Admin cədvəllərində sətir üzərində dəyişiklik.
 *
 * Səlahiyyət serverdə yoxlanılır (`requireUser("ADMIN")`); bu komponent
 * yalnız sorğunu göndərir və uğurdan sonra səhifəni yeniləyir.
 */
function Control({
  value,
  options,
  label,
  onPick,
}: {
  value: string;
  options: { value: string; label: string }[];
  label: string;
  onPick: (next: string) => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);

  return (
    <select
      value={value}
      aria-label={label}
      disabled={busy}
      onChange={async (event) => {
        setBusy(true);
        await onPick(event.target.value);
        setBusy(false);
      }}
      className="h-11 max-w-[13rem] rounded-[3px] border border-line bg-paper px-2 text-[12.5px] text-ink outline-none focus:border-ink disabled:opacity-60 sm:h-9"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

/** Sifariş statusu — dəyişiklik `OrderStatusHistory`-yə də yazılır. */
export function OrderStatusControl({
  number,
  status,
}: {
  number: string;
  status: string;
}) {
  const dict = useDict();
  const router = useRouter();

  const options = Object.entries(dict.orderStatus).map(([value, label]) => ({ value, label }));

  return (
    <Control
      value={status}
      options={options}
      label={`${number} — ${dict.adminUi.labels.status}`}
      onPick={async (next) => {
        try {
          await apiFetch(`/api/admin/orders/${number}`, {
            method: "PATCH",
            json: { status: next },
          });
          router.refresh();
        } catch (error) {
          if (error instanceof ApiRequestError) toast(error.error.message);
        }
      }}
    />
  );
}

/** Təmir müraciətinin statusu. */
export function RepairStatusControl({
  number,
  status,
}: {
  number: string;
  status: string;
}) {
  const dict = useDict();
  const router = useRouter();

  const options = Object.entries(dict.repairStatus).map(([value, label]) => ({ value, label }));

  return (
    <Control
      value={status}
      options={options}
      label={`${number} — ${dict.adminUi.labels.status}`}
      onPick={async (next) => {
        try {
          await apiFetch(`/api/admin/requests/repair/${number}`, {
            method: "PATCH",
            json: { status: next },
          });
          router.refresh();
        } catch (error) {
          if (error instanceof ApiRequestError) toast(error.error.message);
        }
      }}
    />
  );
}

/** Usta təyinatı — təmir və ölçü müraciətləri üçün. */
export function TechnicianControl({
  kind,
  number,
  technicianId,
  technicians,
}: {
  kind: "repair" | "measurement";
  number: string;
  technicianId: string | null;
  technicians: { id: string; name: string }[];
}) {
  const dict = useDict();
  const router = useRouter();

  const options = [
    { value: "", label: dict.adminUi.unassigned },
    ...technicians.map((t) => ({ value: t.id, label: t.name })),
  ];

  return (
    <Control
      value={technicianId ?? ""}
      options={options}
      label={`${number} — ${dict.adminUi.labels.technician}`}
      onPick={async (next) => {
        try {
          await apiFetch(`/api/admin/requests/${kind}/${number}`, {
            method: "PATCH",
            json: { technicianId: next === "" ? null : next },
          });
          router.refresh();
        } catch (error) {
          if (error instanceof ApiRequestError) toast(error.error.message);
        }
      }}
    />
  );
}
