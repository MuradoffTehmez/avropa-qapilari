"use client";

import { useWorkflow } from "@/store/workflow";
import { useRef, useState } from "react";
import { CheckCircle2, FileText } from "lucide-react";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/types";
import { routes } from "@/lib/routes";

import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/primitives";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { products } from "@/mock/products";
import { ApiRequestError, apiFetch } from "@/lib/api";

/** Quote Request. */
export function QuoteForm({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const r = routes(locale);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    product: "",
    width: "",
    height: "",
    quantity: "1",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const idempotencyKey = useRef(crypto.randomUUID());

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = dict.errors.required;
    if (form.phone.replace(/\D/g, "").length < 9) next.phone = dict.errors.invalidPhone;
    if (form.message.trim().length < 10) next.message = dict.quote.minChars;

    setErrors(next);
    if (Object.keys(next).length > 0) return;
    void send();
  }

  async function send() {
    setSending(true);
    try {
      const { number } = await apiFetch<{ number: string }>("/api/quote", {
        method: "POST",
        headers: { "Idempotency-Key": idempotencyKey.current },
        json: {
          name: form.name,
          phone: form.phone,
          email: form.email || undefined,
          productSlug: form.product || undefined,
          width: Number(form.width) || undefined,
          height: Number(form.height) || undefined,
          message: form.message,
        },
      });

      useWorkflow.getState().add({
        id: number,
        kind: "quotes",
        title: dict.quote.title,
        detail: `${form.message} · ${form.quantity} ${dict.common.piece} · ${form.width} × ${form.height} mm`,
      });
      setSubmitted(number);
    } catch (error) {
      if (error instanceof ApiRequestError) setErrors(error.error.details ?? {});
    } finally {
      setSending(false);
    }
  }

  if (submitted) {
    return (
      <div className="container-page py-14">
        <div className="mx-auto max-w-lg text-center">
          <CheckCircle2 size={44} className="mx-auto text-success" />
          <h1 className="mt-5 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            {dict.quote.successTitle}
          </h1>
          <p className="mt-3 text-[15px] text-stone">{dict.quote.successText}</p>
          <div className="mt-6 border border-line bg-bone px-5 py-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-stone">{dict.quote.requestNumber}</p>
            <p className="mt-1 font-mono text-lg font-semibold text-ink">{submitted}</p>
          </div>
          <ButtonLink href={r.home} variant="secondary" className="mt-7">
            {dict.nav.home}
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="container-page grid gap-8 py-8 lg:grid-cols-[1.6fr_1fr] lg:gap-12 lg:py-10"
    >
      <div className="space-y-6">
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

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={dict.common.model} className="sm:col-span-2">
            <Select value={form.product} onChange={(e) => set("product", e.target.value)}>
              <option value="">{dict.quote.noModel}</option>
              {products.map((p) => (
                <option key={p.id} value={p.slug}>
                  {p.name} ({p.sku})
                </option>
              ))}
            </Select>
          </Field>
          <Field label={dict.quote.widthMm}>
            <Input
              type="number"
              inputMode="numeric"
              value={form.width}
              onChange={(e) => set("width", e.target.value)}
            />
          </Field>
          <Field label={dict.quote.heightMm}>
            <Input
              type="number"
              inputMode="numeric"
              value={form.height}
              onChange={(e) => set("height", e.target.value)}
            />
          </Field>
          <Field label={dict.common.quantity}>
            <Input
              type="number"
              inputMode="numeric"
              min={1}
              value={form.quantity}
              onChange={(e) => set("quantity", e.target.value)}
            />
          </Field>
        </div>

        <Field label={dict.quote.message} required error={errors.message}>
          <Textarea
            rows={6}
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
            placeholder={dict.quote.messagePlaceholder}
          />
        </Field>

        <Button type="submit" size="lg" disabled={sending}>
          {dict.actions.submit}
        </Button>
      </div>

      <aside className="desktop-sticky-panel">
        <Card className="p-5">
          <div className="flex items-center gap-2.5">
            <FileText size={18} className="text-gold-500" />
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone">
              {dict.quote.whenNeeded}
            </h2>
          </div>
          <ul className="mt-4 space-y-3 text-[13.5px] leading-relaxed text-graphite">
            {dict.quote.useCases.map((u) => (
              <li key={u}>{u}</li>
            ))}
          </ul>
        </Card>
      </aside>
    </form>
  );
}
