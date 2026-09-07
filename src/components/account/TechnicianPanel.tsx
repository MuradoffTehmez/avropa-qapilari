"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CalendarClock, CheckCircle2, LogOut, Package, Phone, Ruler, Wrench } from "lucide-react";

import { Button, ButtonLink } from "@/components/ui/Button";
import { Card, DataRow, EmptyState } from "@/components/ui/primitives";
import { Field, Input, Textarea } from "@/components/ui/form";
import { toast } from "@/components/ui/overlays";
import { RepairStatusPill } from "@/components/account/StatusPill";
import { formatDate, formatPrice } from "@/lib/utils";
import { routes } from "@/lib/routes";
import type { Locale } from "@/types";
import { useStaffSession } from "@/store/session";
import { ApiRequestError, apiFetch } from "@/lib/api";
import { useDict } from "@/i18n/provider";
import type { TechnicianWorkspace } from "@/server/technician";
import { REPAIR_TRANSITIONS } from "@/features/service/transitions";

/**
 * Usta kabineti — yalnız ustaya təyin edilmiş müraciətlər.
 *
 * Status və servis qeydi `/api/technician/jobs/:number`-ə yazılır;
 * server orada müraciətin həmin ustaya aid olduğunu yoxlayır.
 */
export function TechnicianPanel({
  workspace,
  locale,
}: {
  workspace: TechnicianWorkspace | null;
  locale: Locale;
}) {
  const dict = useDict();
  const r = routes(locale);
  const router = useRouter();
  const signOut = useStaffSession((state) => state.signOut);

  if (!workspace) {
    return (
      <div className="container-page max-w-3xl py-12">
        <EmptyState
          icon={<Wrench size={30} />}
          title={dict.accountUi.technicianWorkspace}
          text={dict.accountUi.noTechnicianProfile}
        />
      </div>
    );
  }

  return (
    <div className="container-page max-w-5xl py-8 lg:py-12">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-600">
        {dict.accountUi.technicianWorkspace}
      </p>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{workspace.name}</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => void signOut().then(() => router.push(r.technicianLogin))}
        >
          <LogOut size={15} /> {dict.account.logout}
        </Button>
      </div>
      <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-stone">
        {dict.accountUi.technicianIntro}
      </p>
      <p className="mt-1 text-[13px] text-mist">
        {dict.adminUi.labels.job}: {workspace.completedJobs}
      </p>

      <section className="mt-8">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight text-ink">
            <Package size={17} className="text-gold-500" />
            {dict.accountUi.personalOrders}
          </h2>
          <ButtonLink href={r.doors} size="sm">
            {dict.accountUi.shopForMyself}
          </ButtonLink>
        </div>

        {workspace.orders.length === 0 ? (
          <EmptyState
            icon={<Package size={30} />}
            title={dict.account.noOrders}
            action={<ButtonLink href={r.doors}>{dict.accountUi.shopForMyself}</ButtonLink>}
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {workspace.orders.map((order) => (
              <Card key={order.id} className="flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="font-mono text-[12px] text-graphite">{order.number}</p>
                  <p className="mt-1 text-[12px] text-stone">{formatDate(order.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold tabular-nums text-ink">{formatPrice(order.total)}</p>
                  <p className="mt-1 text-[11px] text-stone">{order.status}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold tracking-tight text-ink">
          <Wrench size={17} className="text-gold-500" />
          {dict.account.repairs}
        </h2>

        {workspace.jobs.length === 0 ? (
          <EmptyState icon={<Wrench size={30} />} title={dict.account.noRepairs} />
        ) : (
          <div className="space-y-4">
            {workspace.jobs.map((job) => (
              <JobCard key={job.number} job={job} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold tracking-tight text-ink">
          <CalendarClock size={17} className="text-gold-500" />
          {dict.account.appointments}
        </h2>
        {workspace.appointments.length === 0 ? (
          <EmptyState icon={<CalendarClock size={30} />} title={dict.accountUi.noAppointments} />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {workspace.appointments.map((appointment) => (
              <Card key={appointment.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-mono text-[12px] text-graphite">{appointment.reference}</p>
                  <p className="text-[12px] text-stone">{appointment.status}</p>
                </div>
                <p className="mt-2 text-[14px] font-medium text-ink">
                  {formatDate(appointment.date)} · {appointment.startTime}–{appointment.endTime}
                </p>
                <p className="mt-1 text-[13px] text-stone">{appointment.address}</p>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold tracking-tight text-ink">
          <Ruler size={17} className="text-gold-500" />
          {dict.admin.measurements}
        </h2>

        {workspace.visits.length === 0 ? (
          <EmptyState icon={<Ruler size={30} />} title={dict.accountUi.noMeasurements} />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {workspace.visits.map((visit) => (
              <Card key={visit.number} className="p-4">
                <p className="font-mono text-[12px] text-graphite">{visit.number}</p>
                <p className="mt-1 text-[14.5px] text-ink">
                  {dict.measurement.property[visit.propertyType as keyof typeof dict.measurement.property]} ·{" "}
                  {visit.doorCount} {dict.common.doorUnit}
                </p>
                <p className="mt-0.5 text-[13px] text-stone">{visit.address}</p>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function JobCard({ job }: { job: TechnicianWorkspace["jobs"][number] }) {
  const dict = useDict();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    resolution: job.resolution ?? "",
    usedParts: job.usedParts ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  async function send(payload: Record<string, unknown>) {
    setBusy(true);
    try {
      await apiFetch(`/api/technician/jobs/${job.number}`, { method: "PATCH", json: payload });
      router.refresh();
      return true;
    } catch (error) {
      if (error instanceof ApiRequestError) {
        setErrors(error.error.details ?? { resolution: error.error.message });
      }
      return false;
    } finally {
      setBusy(false);
    }
  }

  // Server keçidləri məcbur edir; panel yalnız icazə verilənləri göstərir
  // ki, istifadəçiyə rədd ediləcək düymə təklif olunmasın.
  const allowed = REPAIR_TRANSITIONS[job.status] ?? [];
  const closed = allowed.length === 0;

  return (
    <Card className="p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[12.5px] text-graphite">{job.number}</p>
          <p className="mt-1 text-[15px] font-medium text-ink">
            {dict.repair.categories[job.category]}
          </p>
          <p className="mt-1 text-[13.5px] leading-relaxed text-stone">{job.description}</p>
        </div>
        <RepairStatusPill status={job.status} label={dict.repairStatus[job.status]} />
      </div>

      <dl className="mt-4 border-t border-line pt-3">
        <DataRow label={dict.common.address} value={job.address} />
        <DataRow label={dict.common.date} value={formatDate(job.createdAt)} />
        <DataRow
          label={dict.common.phone}
          value={
            job.phone ? (
              <a href={`tel:${job.phone}`} className="flex items-center gap-1.5 hover:underline">
                <Phone size={13} /> {job.phone}
              </a>
            ) : (
              "—"
            )
          }
        />
        {job.resolution && <DataRow label={dict.accountUi.workDone} value={job.resolution} />}
        {job.usedParts && <DataRow label={dict.accountUi.usedParts} value={job.usedParts} />}
      </dl>

      {!closed && (
        <div className="mt-4 flex flex-wrap gap-2">
          {allowed.includes("ON_THE_WAY") && (
            <Button
              size="sm"
              variant="secondary"
              disabled={busy}
              onClick={() => void send({ status: "ON_THE_WAY" })}
            >
              {dict.repairStatus.ON_THE_WAY}
            </Button>
          )}
          {allowed.includes("IN_PROGRESS") && (
            <Button
              size="sm"
              variant="secondary"
              disabled={busy}
              onClick={() => void send({ status: "IN_PROGRESS" })}
            >
              {dict.repairStatus.IN_PROGRESS}
            </Button>
          )}
          {allowed.includes("COMPLETED") && (
            <Button size="sm" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
              <CheckCircle2 size={15} /> {dict.accountUi.jobCompletion}
            </Button>
          )}
        </div>
      )}

      {open && !closed && (
        <form
          className="mt-4 space-y-4 border-t border-line pt-4"
          noValidate
          onSubmit={async (event) => {
            event.preventDefault();
            const done = await send({
              status: "COMPLETED",
              resolution: form.resolution,
              usedParts: form.usedParts || undefined,
            });
            if (done) {
              setOpen(false);
              toast(dict.accountUi.serviceHistoryAdded);
            }
          }}
        >
          <Field label={dict.accountUi.diagnosisAndWork} required error={errors.resolution}>
            <Textarea
              rows={4}
              value={form.resolution}
              onChange={(e) => {
                setForm((f) => ({ ...f, resolution: e.target.value }));
                setErrors((x) => ({ ...x, resolution: "" }));
              }}
              placeholder={dict.accountUi.diagnosisPlaceholder}
            />
          </Field>

          <Field label={dict.accountUi.spareParts} error={errors.usedParts}>
            <Input
              value={form.usedParts}
              onChange={(e) => setForm((f) => ({ ...f, usedParts: e.target.value }))}
              placeholder={dict.accountUi.sparePartsPlaceholder}
            />
          </Field>

          <Button type="submit" disabled={busy}>
            {dict.accountUi.saveServiceNote}
          </Button>
        </form>
      )}
    </Card>
  );
}
