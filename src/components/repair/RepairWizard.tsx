"use client";

import { useWorkflow } from "@/store/workflow";
import { useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  DoorOpen,
  Image as ImageIcon,
  X,
} from "lucide-react";

import type { Dictionary } from "@/i18n";
import type { Locale, RepairCategoryKey } from "@/types";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card, Notice } from "@/components/ui/primitives";
import { Stepper } from "@/components/ui/disclosure";
import { Field, Input, RadioCard, Select, Textarea } from "@/components/ui/form";
import { bakuDistricts, cities } from "@/mock/content";
import { ApiRequestError, apiFetch } from "@/lib/api";

const stepIds = [
  "problem",
  "doorType",
  "describe",
  "media",
  "address",
  "schedule",
  "contact",
  "confirm",
] as const;

type StepId = (typeof stepIds)[number];

const doorTypes = ["entrance", "villa", "interior", "glass", "metal", "other"] as const;

type DoorTypeId = (typeof doorTypes)[number];

function doorTypeLabel(id: string, dict: Dictionary): string {
  const t = dict.repair.doorTypes;
  return id in t ? t[id as DoorTypeId] : "—";
}

function doorTypeHint(id: string, dict: Dictionary): string | undefined {
  const key = `${id}Hint` as keyof Dictionary["repair"]["doorTypes"];
  return dict.repair.doorTypes[key];
}

const timeSlots = ["09:00 – 12:00", "12:00 – 15:00", "15:00 – 18:00", "18:00 – 20:00"];

interface RepairForm {
  category: RepairCategoryKey | "";
  doorType: string;
  boughtFromUs: string;
  description: string;
  files: string[];
  city: string;
  district: string;
  street: string;
  building: string;
  apartment: string;
  date: string;
  slot: string;
  name: string;
  phone: string;
  email: string;
}

const initial: RepairForm = {
  category: "",
  doorType: "",
  boughtFromUs: "unknown",
  description: "",
  files: [],
  city: "Bakı",
  district: "",
  street: "",
  building: "",
  apartment: "",
  date: "",
  slot: timeSlots[0],
  name: "",
  phone: "",
  email: "",
};

export function RepairWizard({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const r = routes(locale);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [form, setForm] = useState<RepairForm>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof RepairForm, string>>>({});
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const idempotencyKey = useRef(crypto.randomUUID());

  function set<K extends keyof RepairForm>(key: K, value: RepairForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(id: StepId): boolean {
    const next: Partial<Record<keyof RepairForm, string>> = {};

    if (id === "problem" && !form.category) next.category = dict.repair.selectProblem;
    if (id === "doorType" && !form.doorType) next.doorType = dict.repair.selectDoorType;
    if (id === "describe" && form.description.trim().length < 10)
      next.description = dict.quote.minChars;
    if (id === "address") {
      if (!form.street.trim()) next.street = dict.errors.required;
      if (!form.building.trim()) next.building = dict.errors.required;
    }
    if (id === "schedule" && !form.date) next.date = dict.errors.required;
    if (id === "contact") {
      if (!form.name.trim()) next.name = dict.errors.required;
      if (form.phone.replace(/\D/g, "").length < 9) next.phone = dict.errors.invalidPhone;
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  /** Müraciəti serverə göndərir; nömrəni server verir (PRD §62). */
  async function send() {
    setSending(true);
    try {
      const { number } = await apiFetch<{ number: string }>("/api/repair", {
        method: "POST",
        headers: { "Idempotency-Key": idempotencyKey.current },
        json: {
          category: form.category,
          doorType: form.doorType,
          description: form.description,
          city: form.city,
          address: `${form.street} ${form.building}`.trim(),
          preferredAt: form.date ? `${form.date} ${form.slot}` : undefined,
          name: form.name,
          phone: form.phone,
        },
      });

      useWorkflow.getState().add({
        id: number,
        kind: "repairs",
        title: dict.repair.title,
        detail: `${form.description} · ${form.city}, ${form.street} ${form.building}`,
      });
      setSubmitted(number);
    } catch (error) {
      if (error instanceof ApiRequestError) setErrors(error.error.details ?? {});
    } finally {
      setSending(false);
    }
  }

  function goNext() {
    const id = stepIds[step];
    if (!validate(id)) return;

    if (id === "confirm") {
      void send();
      return;
    }
    setDirection("forward");
    setStep((s) => s + 1);
  }

  if (submitted) {
    return (
      <div className="container-page py-14">
        <div className="mx-auto max-w-lg text-center">
          <CheckCircle2 size={44} className="mx-auto text-success" />
          <h1 className="mt-5 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            {dict.repair.successTitle}
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-stone">{dict.repair.successText}</p>

          <div className="mt-6 border border-line bg-bone px-5 py-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-stone">
              {dict.repair.requestNumber}
            </p>
            <p className="mt-1 font-mono text-lg font-semibold text-ink">{submitted}</p>
          </div>

          <div className="mt-7 flex flex-wrap justify-center gap-2">
            <ButtonLink href={r.accountSection("repairs")}>{dict.account.repairs}</ButtonLink>
            <ButtonLink href={r.home} variant="secondary">
              {dict.nav.home}
            </ButtonLink>
          </div>
        </div>
      </div>
    );
  }

  const id = stepIds[step];

  return (
    <div className="container-page grid gap-8 py-8 lg:grid-cols-[1.6fr_1fr] lg:gap-12 lg:py-10">
      <div>
        <Stepper
          className="mb-8 border-b border-line"
          steps={stepIds.map((s) => dict.repair.steps[s])}
          current={step}
          onSelect={(next) => {
            setDirection(next < step ? "back" : "forward");
            setStep(next);
          }}
        />

        <div key={id} className={direction === "forward" ? "motion-step-forward" : "motion-step-back"}>

        {id === "problem" && (
          <div>
            <StepTitle title={dict.repair.problemQuestion} />
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {(Object.keys(dict.repair.categories) as RepairCategoryKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => set("category", key)}
                  aria-pressed={form.category === key}
                  className={cn(
                    "border p-3.5 text-left text-[13.5px] font-medium transition-colors",
                    form.category === key
                      ? "border-ink bg-ink text-paper"
                      : "border-line text-graphite hover:border-mist",
                  )}
                >
                  {dict.repair.categories[key]}
                </button>
              ))}
            </div>
            {errors.category && <p className="mt-2 text-xs text-danger">{errors.category}</p>}
          </div>
        )}

        {id === "doorType" && (
          <div>
            <StepTitle title={dict.repair.doorTypeQuestion} />
            <div className="grid gap-2 sm:grid-cols-2">
              {doorTypes.map((id) => (
                <RadioCard
                  key={id}
                  name="doorType"
                  label={doorTypeLabel(id, dict)}
                  description={doorTypeHint(id, dict)}
                  checked={form.doorType === id}
                  onChange={() => set("doorType", id)}
                />
              ))}
            </div>
            {errors.doorType && <p className="mt-2 text-xs text-danger">{errors.doorType}</p>}

            <div className="mt-6 max-w-md">
              <Field label={dict.repair.boughtFromUs}>
                <Select
                  value={form.boughtFromUs}
                  onChange={(e) => set("boughtFromUs", e.target.value)}
                >
                  <option value="unknown">{dict.repair.boughtUnknown}</option>
                  <option value="yes">{dict.repair.boughtYesWarranty}</option>
                  <option value="expired">{dict.repair.boughtYesExpired}</option>
                  <option value="no">{dict.repair.boughtNo}</option>
                </Select>
              </Field>
            </div>
          </div>
        )}

        {id === "describe" && (
          <div className="max-w-xl">
            <StepTitle title={dict.repair.describeQuestion} />
            <Field error={errors.description}>
              <Textarea
                rows={6}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder={dict.repair.describePlaceholder}
              />
            </Field>
            <p className="mt-2 text-xs text-stone">{form.description.length} {dict.common.characterUnit}</p>
          </div>
        )}

        {id === "media" && (
          <div className="max-w-xl">
            <StepTitle title={dict.repair.mediaQuestion} />

            <label className="flex cursor-pointer flex-col items-center justify-center border border-dashed border-line bg-bone/50 px-6 py-10 text-center transition-colors hover:border-mist">
              <ImageIcon size={26} className="text-mist" />
              <span className="mt-3 text-sm font-medium text-ink">{dict.repair.chooseFile}</span>
              <span className="mt-1 text-xs text-stone">{dict.repair.mediaHint}</span>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,video/mp4"
                className="sr-only"
                onChange={(e) => {
                  const names = Array.from(e.target.files ?? []).map((f) => f.name);
                  set("files", [...form.files, ...names].slice(0, 5));
                }}
              />
            </label>

            {form.files.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {form.files.map((f, i) => (
                  <li
                    key={`${f}-${i}`}
                    className="flex items-center justify-between border border-line px-3 py-2 text-[13px] text-graphite"
                  >
                    <span className="truncate">{f}</span>
                    <button
                      type="button"
                      onClick={() => set("files", form.files.filter((_, x) => x !== i))}
                      aria-label={dict.repair.removeFile}
                      className="shrink-0 text-stone hover:text-danger"
                    >
                      <X size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}

          </div>
        )}

        {id === "address" && (
          <div className="max-w-xl">
            <StepTitle title={dict.repair.addressQuestion} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={dict.checkout.city}>
                <Select value={form.city} onChange={(e) => set("city", e.target.value)}>
                  {cities.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </Select>
              </Field>
              <Field label={dict.checkout.district}>
                <Select value={form.district} onChange={(e) => set("district", e.target.value)}>
                  <option value="">—</option>
                  {bakuDistricts.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </Select>
              </Field>
              <Field label={dict.checkout.street} required error={errors.street} className="sm:col-span-2">
                <Input value={form.street} onChange={(e) => set("street", e.target.value)} />
              </Field>
              <Field label={dict.checkout.building} required error={errors.building}>
                <Input value={form.building} onChange={(e) => set("building", e.target.value)} />
              </Field>
              <Field label={dict.checkout.apartment}>
                <Input value={form.apartment} onChange={(e) => set("apartment", e.target.value)} />
              </Field>
            </div>
          </div>
        )}

        {id === "schedule" && (
          <div className="max-w-xl">
            <StepTitle title={dict.repair.scheduleQuestion} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={dict.common.date} required error={errors.date}>
                <Input
                  type="date"
                  value={form.date}
                  min={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => set("date", e.target.value)}
                />
              </Field>
              <Field label={dict.repair.timeSlot}>
                <Select value={form.slot} onChange={(e) => set("slot", e.target.value)}>
                  {timeSlots.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </Select>
              </Field>
            </div>
            <Notice className="mt-4">{dict.repair.exactTimeNotice}</Notice>
          </div>
        )}

        {id === "contact" && (
          <div className="max-w-xl">
            <StepTitle title={dict.repair.contactQuestion} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={dict.common.name} required error={errors.name}>
                <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
              </Field>
              <Field label={dict.common.phone} required error={errors.phone}>
                <Input
                  type="tel"
                  placeholder="+994 50 000 00 00"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                />
              </Field>
              <Field label={dict.common.email} className="sm:col-span-2">
                <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
              </Field>
            </div>
          </div>
        )}

        {id === "confirm" && (
          <div className="max-w-xl">
            <StepTitle title={dict.repair.confirmQuestion} />
            <Card className="divide-y divide-line">
              <Row label={dict.repair.steps.problem} value={form.category ? dict.repair.categories[form.category] : "—"} />
              <Row label={dict.repair.steps.doorType} value={doorTypeLabel(form.doorType, dict)} />
              <Row label={dict.repair.steps.describe} value={form.description || "—"} />
              <Row label={dict.repair.files} value={form.files.length ? `${form.files.length} ${dict.repair.fileUnit}` : "—"} />
              <Row
                label={dict.common.address}
                value={[form.city, form.district, form.street, form.building, form.apartment]
                  .filter(Boolean)
                  .join(", ")}
              />
              <Row label={dict.common.date} value={`${form.date} · ${form.slot}`} />
              <Row label={dict.repair.steps.contact} value={`${form.name} · ${form.phone}`} />
            </Card>

          </div>
        )}

        </div>

        <div className="mt-8 flex gap-2">
          {step > 0 && (
            <Button variant="secondary" onClick={() => { setDirection("back"); setStep((s) => s - 1); }}>
              <ArrowLeft size={16} /> {dict.actions.back}
            </Button>
          )}
          <Button size="lg" onClick={goNext} disabled={sending}>
            {id === "confirm" ? dict.actions.submit : dict.actions.continue}
            {id !== "confirm" && <ArrowRight size={16} />}
          </Button>
        </div>
      </div>

      <aside className="desktop-sticky-panel">
        <Card className="p-5">
          <div className="flex items-center gap-2.5">
            <DoorOpen size={18} className="text-gold-500" />
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone">
              {dict.repair.request}
            </h2>
          </div>

          <dl className="mt-4 space-y-2.5 text-[13px]">
            <Mini label={dict.repair.steps.problem} value={form.category ? dict.repair.categories[form.category] : "—"} />
            <Mini label={dict.repair.door} value={doorTypeLabel(form.doorType, dict)} />
            <Mini label={dict.common.date} value={form.date || "—"} />
            <Mini label={dict.repair.steps.address} value={form.street ? `${form.city}, ${form.street}` : "—"} />
          </dl>

          <div className="mt-5 border-t border-line pt-4 text-[13px] text-stone">
            <p>{dict.repair.diagnosticNote}</p>
          </div>
        </Card>
      </aside>
    </div>
  );
}

function StepTitle({ title }: { title: string }) {
  return <h2 className="mb-5 text-xl font-semibold tracking-tight text-ink sm:text-2xl">{title}</h2>;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 p-4 text-sm">
      <span className="shrink-0 text-stone">{label}</span>
      <span className="text-right font-medium text-ink">{value}</span>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-stone">{label}</dt>
      <dd className="text-right font-medium text-ink">{value}</dd>
    </div>
  );
}
