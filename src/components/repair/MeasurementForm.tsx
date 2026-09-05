"use client";

import { useState } from "react";
import { CheckCircle2, Ruler } from "lucide-react";
import type { Dictionary } from "@/i18n";
import type { Locale, PropertyType } from "@/types";
import { routes } from "@/lib/routes";
import { demoReference } from "@/lib/utils";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card, Notice } from "@/components/ui/primitives";
import { Field, Input, RadioCard, Select, Textarea } from "@/components/ui/form";
import { bakuDistricts, cities } from "@/mock/content";

const timeSlots = ["09:00 – 12:00", "12:00 – 15:00", "15:00 – 18:00"];

/** PRD §67 — ölçü ustası sifarişi. */
export function MeasurementForm({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const r = routes(locale);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "Bakı",
    district: "",
    street: "",
    building: "",
    apartment: "",
    propertyType: "APARTMENT" as PropertyType,
    doorCount: "1",
    date: "",
    slot: timeSlots[0],
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<string | null>(null);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = dict.errors.required;
    if (form.phone.replace(/\D/g, "").length < 9) next.phone = dict.errors.invalidPhone;
    if (!form.street.trim()) next.street = dict.errors.required;
    if (!form.date) next.date = dict.errors.required;

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitted(demoReference("MSR"));
  }

  if (submitted) {
    return (
      <div className="container-page py-14">
        <div className="mx-auto max-w-lg text-center">
          <CheckCircle2 size={44} className="mx-auto text-success" />
          <h1 className="mt-5 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            {dict.measurement.successTitle}
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-stone">
            {dict.measurement.successText}
          </p>
          <div className="mt-6 border border-line bg-bone px-5 py-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-stone">Sifariş nömrəsi</p>
            <p className="mt-1 font-mono text-lg font-semibold text-ink">{submitted}</p>
          </div>
          <div className="mt-7 flex flex-wrap justify-center gap-2">
            <ButtonLink href={r.accountSection("appointments")}>{dict.account.appointments}</ButtonLink>
            <ButtonLink href={r.doors} variant="secondary">
              {dict.actions.selectDoor}
            </ButtonLink>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="container-page grid gap-8 py-8 lg:grid-cols-[1.6fr_1fr] lg:gap-12 lg:py-10"
    >
      <div className="space-y-8">
        <section>
          <h2 className="mb-4 text-lg font-semibold tracking-tight text-ink">Əlaqə</h2>
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
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold tracking-tight text-ink">
            {dict.common.address}
          </h2>
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
            <Field label={dict.checkout.building}>
              <Input value={form.building} onChange={(e) => set("building", e.target.value)} />
            </Field>
            <Field label={dict.checkout.apartment}>
              <Input value={form.apartment} onChange={(e) => set("apartment", e.target.value)} />
            </Field>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold tracking-tight text-ink">
            {dict.measurement.propertyType}
          </h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {(Object.keys(dict.measurement.property) as PropertyType[]).map((key) => (
              <RadioCard
                key={key}
                name="propertyType"
                label={dict.measurement.property[key]}
                checked={form.propertyType === key}
                onChange={() => set("propertyType", key)}
              />
            ))}
          </div>

          <div className="mt-4 max-w-xs">
            <Field label={dict.measurement.doorCount}>
              <Select value={form.doorCount} onChange={(e) => set("doorCount", e.target.value)}>
                {["1", "2", "3", "4", "5", "6-10", "10+"].map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </Select>
            </Field>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold tracking-tight text-ink">Vaxt</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={dict.measurement.preferredDate} required error={errors.date}>
              <Input
                type="date"
                min={new Date().toISOString().slice(0, 10)}
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
              />
            </Field>
            <Field label={dict.measurement.preferredTime}>
              <Select value={form.slot} onChange={(e) => set("slot", e.target.value)}>
                {timeSlots.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </Select>
            </Field>
            <Field label={dict.common.note} className="sm:col-span-2">
              <Textarea
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                placeholder="Hansı otaqlar, xüsusi tələblər…"
              />
            </Field>
          </div>
        </section>

        <Button type="submit" size="lg">
          {dict.actions.submit}
        </Button>
      </div>

      <aside className="lg:sticky lg:top-24 lg:h-fit">
        <Card className="p-5">
          <div className="flex items-center gap-2.5">
            <Ruler size={18} className="text-brass-500" />
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone">
              Ölçü xidməti
            </h2>
          </div>
          <ul className="mt-4 space-y-3 text-[13.5px] leading-relaxed text-graphite">
            <li>Usta ünvana gəlir və açırımın dəqiq ölçülərini götürür.</li>
            <li>Divar qalınlığı, çərçivə dərinliyi və açılma istiqaməti qeyd olunur.</li>
            <li>Uyğun modellər və qiymət aralığı yerində təklif edilir.</li>
            <li>Sifariş verildiyi halda ölçü xidməti pulsuzdur.</li>
          </ul>
          <Notice className="mt-5">
            Ustanın gəliş vaxtı təsdiqləndikdən sonra SMS və e-poçt bildirişi göndərilir.
          </Notice>
        </Card>
      </aside>
    </form>
  );
}
