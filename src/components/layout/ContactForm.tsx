"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import type { Dictionary } from "@/i18n";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/primitives";
import { Field, Input, Select, Textarea } from "@/components/ui/form";

export function ContactForm({ dict }: { dict: Dictionary }) {
  const subjects = dict.common.contactSubjects;
  const [form, setForm] = useState({ name: "", phone: "", email: "", subject: subjects[0], message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = dict.errors.required;
    if (form.phone.replace(/\D/g, "").length < 9) next.phone = dict.errors.invalidPhone;
    if (form.message.trim().length < 5) next.message = dict.errors.minLength;

    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setSent(true);
  }

  if (sent) {
    return (
      <Card className="flex flex-col items-center justify-center p-10 text-center">
        <CheckCircle2 size={40} className="text-success" />
        <h2 className="mt-4 text-xl font-semibold tracking-tight text-ink">{dict.common.messageSent}</h2>
        <p className="mt-2 max-w-sm text-[14px] text-stone">
          Operatorumuz 1 iş günü ərzində sizinlə əlaqə saxlayacaq.
        </p>
      </Card>
    );
  }

  return (
    <form onSubmit={submit}>
      <h2 className="mb-5 text-lg font-semibold tracking-tight text-ink">{dict.common.writeToUs}</h2>

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
        <Field label={dict.common.email}>
          <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
        </Field>
        <Field label={dict.quote.subject}>
          <Select value={form.subject} onChange={(e) => set("subject", e.target.value)}>
            {subjects.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
        </Field>
        <Field label={dict.quote.message} required error={errors.message} className="sm:col-span-2">
          <Textarea rows={6} value={form.message} onChange={(e) => set("message", e.target.value)} />
        </Field>
      </div>

      <Button type="submit" size="lg" className="mt-5">
        {dict.actions.submit}
      </Button>

    </form>
  );
}
