"use client";

import { useState } from "react";
import { CalendarCheck, CheckCircle2 } from "lucide-react";

import type { Dictionary } from "@/i18n";
import type { Locale } from "@/types";
import { routes } from "@/lib/routes";
import { createReference } from "@/lib/utils";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/primitives";
import { Field, Input, RadioCard, Select, Textarea } from "@/components/ui/form";
import { useWorkflow } from "@/store/workflow";

const times = ["10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

export function ShowroomBooking({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const r = routes(locale);
  const add = useWorkflow((s) => s.add);

  const interests = [
    { id: "entrance", label: dict.showroom.interestEntrance },
    { id: "interior", label: dict.showroom.interestInterior },
    { id: "villa", label: dict.showroom.interestVilla },
    { id: "smart", label: dict.showroom.interestSmart },
    { id: "project", label: dict.showroom.interestProject },
  ];

  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    time: times[0],
    people: "2",
    interest: "entrance",
    note: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [booked, setBooked] = useState<string | null>(null);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = dict.errors.required;
    if (form.phone.replace(/\D/g, "").length < 9) next.phone = dict.errors.invalidPhone;
    if (!form.date) next.date = dict.errors.required;

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const reference = createReference("SHW");
    const interest = interests.find((i) => i.id === form.interest)?.label ?? "";
    add({
      id: reference,
      kind: "measurements",
      title: dict.showroom.title,
      detail: `${form.date} ${form.time} · ${form.people} nəfər · ${interest}${form.note ? `\n${form.note}` : ""}`,
    });
    setBooked(reference);
  }

  if (booked) {
    return (
      <Card className="p-6 text-center sm:p-8">
        <CheckCircle2 size={40} className="mx-auto text-success" />
        <h2 className="mt-4 text-xl font-semibold tracking-tight text-ink">
          {dict.showroom.bookSuccess}
        </h2>
        <p className="mt-2 text-[14.5px] leading-relaxed text-stone">
          {dict.showroom.bookSuccessText}
        </p>
        <div className="mt-5 border border-line bg-bone px-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.16em] text-stone">
            {dict.showroom.bookNumber}
          </p>
          <p className="mt-1 font-mono text-[15px] font-semibold text-ink">{booked}</p>
        </div>
        <ButtonLink href={r.accountSection("appointments")} variant="secondary" className="mt-5">
          {dict.account.appointments}
        </ButtonLink>
      </Card>
    );
  }

  return (
    <Card className="p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-2.5">
        <CalendarCheck size={19} className="shrink-0 text-gold-500" />
        <div>
          <h2 className="text-[16px] font-semibold tracking-tight text-ink">
            {dict.showroom.bookTitle}
          </h2>
          <p className="text-[13px] text-stone">{dict.showroom.bookText}</p>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={dict.common.name} required error={errors.name}>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
          </Field>
          <Field label={dict.common.phone} required error={errors.phone}>
            <Input
              type="tel"
              placeholder="+994 00 000 00 00"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
          </Field>
          <Field label={dict.showroom.bookDate} required error={errors.date}>
            <Input
              type="date"
              min={new Date().toISOString().slice(0, 10)}
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
            />
          </Field>
          <Field label={dict.showroom.bookTime}>
            <Select value={form.time} onChange={(e) => set("time", e.target.value)}>
              {times.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </Select>
          </Field>
          <Field label={dict.showroom.bookPeople}>
            <Select value={form.people} onChange={(e) => set("people", e.target.value)}>
              {["1", "2", "3", "4", "5+"].map((n) => (
                <option key={n}>{n}</option>
              ))}
            </Select>
          </Field>
        </div>

        <fieldset>
          <legend className="mb-2 text-[13px] font-medium text-graphite">
            {dict.showroom.bookInterest}
          </legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {interests.map((i) => (
              <RadioCard
                key={i.id}
                name="interest"
                label={i.label}
                checked={form.interest === i.id}
                onChange={() => set("interest", i.id)}
              />
            ))}
          </div>
        </fieldset>

        <Field label={dict.common.note}>
          <Textarea
            rows={3}
            value={form.note}
            onChange={(e) => set("note", e.target.value)}
            placeholder={dict.showroom.bringValue}
          />
        </Field>

        <Button type="submit" size="lg" full>
          {dict.showroom.bookSubmit}
        </Button>
      </form>
    </Card>
  );
}
