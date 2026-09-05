"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, ShoppingBag } from "lucide-react";

import type { Dictionary } from "@/i18n";
import type { Locale } from "@/types";
import { routes } from "@/lib/routes";
import { demoReference, formatPrice } from "@/lib/utils";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card, EmptyState, Notice, Skeleton } from "@/components/ui/primitives";
import { Stepper } from "@/components/ui/disclosure";
import { Checkbox, Field, Input, RadioCard, Select, Textarea } from "@/components/ui/form";
import { cartSubtotal, useCart } from "@/store/cart";
import { useHydrated } from "@/lib/hooks";
import { bakuDistricts, cities } from "@/mock/content";
import { optionGroups } from "@/mock/options";

type StepId = "customer" | "address" | "delivery" | "installation" | "payment" | "confirmation";

const stepOrder: StepId[] = [
  "customer",
  "address",
  "delivery",
  "installation",
  "payment",
  "confirmation",
];

interface CheckoutState {
  name: string;
  surname: string;
  email: string;
  phone: string;
  city: string;
  district: string;
  street: string;
  building: string;
  apartment: string;
  floor: string;
  note: string;
  delivery: string;
  installation: string;
  payment: string;
  terms: boolean;
}

const initial: CheckoutState = {
  name: "",
  surname: "",
  email: "",
  phone: "",
  city: "Bakı",
  district: "",
  street: "",
  building: "",
  apartment: "",
  floor: "",
  note: "",
  delivery: "dl-baku",
  installation: "in-full",
  payment: "card",
  terms: false,
};

export function CheckoutView({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const r = routes(locale);
  const hydrated = useHydrated();

  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<CheckoutState>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutState, string>>>({});
  const [placedOrder, setPlacedOrder] = useState<string | null>(null);

  function set<K extends keyof CheckoutState>(key: K, value: CheckoutState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  if (!hydrated) {
    return (
      <div className="container-page grid gap-6 py-10 lg:grid-cols-[1.5fr_1fr]">
        <Skeleton className="h-96" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (placedOrder) {
    return (
      <div className="container-page py-14">
        <div className="mx-auto max-w-lg text-center">
          <CheckCircle2 size={44} className="mx-auto text-success" />
          <h1 className="mt-5 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            {dict.checkout.successTitle}
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-stone">{dict.checkout.successText}</p>

          <div className="mt-6 border border-line bg-bone px-5 py-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-stone">
              {dict.checkout.orderNumber}
            </p>
            <p className="mt-1 font-mono text-lg font-semibold text-ink">{placedOrder}</p>
          </div>

          <div className="mt-7 flex flex-wrap justify-center gap-2">
            <ButtonLink href={r.accountSection("orders")}>{dict.account.orders}</ButtonLink>
            <ButtonLink href={r.doors} variant="secondary">
              {dict.cart.continueShopping}
            </ButtonLink>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-page py-12">
        <EmptyState
          icon={<ShoppingBag size={34} />}
          title={dict.cart.empty}
          text={dict.cart.emptyHint}
          action={<ButtonLink href={r.doors}>{dict.actions.selectDoor}</ButtonLink>}
        />
      </div>
    );
  }

  const subtotal = cartSubtotal(items);
  const deliveryPrice =
    optionGroups.DELIVERY.values.find((v) => v.id === form.delivery)?.priceDelta ?? 0;
  const installationPrice =
    optionGroups.INSTALLATION.values.find((v) => v.id === form.installation)?.priceDelta ?? 0;
  const total = subtotal + deliveryPrice + installationPrice;

  function validate(current: StepId): boolean {
    const next: Partial<Record<keyof CheckoutState, string>> = {};

    if (current === "customer") {
      if (!form.name.trim()) next.name = dict.errors.required;
      if (!form.surname.trim()) next.surname = dict.errors.required;
      if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = dict.errors.invalidEmail;
      if (form.phone.replace(/\D/g, "").length < 9) next.phone = dict.errors.invalidPhone;
    }

    if (current === "address" && form.delivery !== "dl-pickup") {
      if (!form.city) next.city = dict.errors.required;
      if (!form.street.trim()) next.street = dict.errors.required;
      if (!form.building.trim()) next.building = dict.errors.required;
    }

    if (current === "confirmation" && !form.terms) {
      next.terms = dict.errors.required;
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function goNext() {
    const current = stepOrder[step];
    if (!validate(current)) return;

    if (current === "confirmation") {
      const number = demoReference("ORD");
      clear();
      setPlacedOrder(number);
      return;
    }
    setStep((s) => Math.min(s + 1, stepOrder.length - 1));
  }

  const current = stepOrder[step];

  return (
    <div className="container-page grid gap-8 py-8 lg:grid-cols-[1.5fr_1fr] lg:gap-12 lg:py-10">
      <div>
        <Stepper
          className="mb-8 border-b border-line"
          steps={stepOrder.map((s) => dict.checkout.steps[s])}
          current={step}
          onSelect={setStep}
        />

        {current === "customer" && (
          <div className="max-w-xl space-y-4">
            <SectionTitle>{dict.checkout.steps.customer}</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={dict.common.name} required error={errors.name}>
                <Input value={form.name} onChange={(e) => set("name", e.target.value)} autoComplete="given-name" />
              </Field>
              <Field label={dict.common.surname} required error={errors.surname}>
                <Input value={form.surname} onChange={(e) => set("surname", e.target.value)} autoComplete="family-name" />
              </Field>
              <Field label={dict.common.email} required error={errors.email}>
                <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" />
              </Field>
              <Field label={dict.common.phone} required error={errors.phone}>
                <Input
                  type="tel"
                  placeholder="+994 50 000 00 00"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  autoComplete="tel"
                />
              </Field>
            </div>
          </div>
        )}

        {current === "address" && (
          <div className="max-w-xl space-y-4">
            <SectionTitle>{dict.checkout.steps.address}</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={dict.checkout.city} required error={errors.city}>
                <Select value={form.city} onChange={(e) => set("city", e.target.value)}>
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label={dict.checkout.district}>
                <Select value={form.district} onChange={(e) => set("district", e.target.value)}>
                  <option value="">—</option>
                  {bakuDistricts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label={dict.checkout.street} required error={errors.street} className="sm:col-span-2">
                <Input value={form.street} onChange={(e) => set("street", e.target.value)} autoComplete="address-line1" />
              </Field>
              <Field label={dict.checkout.building} required error={errors.building}>
                <Input value={form.building} onChange={(e) => set("building", e.target.value)} />
              </Field>
              <Field label={dict.checkout.apartment}>
                <Input value={form.apartment} onChange={(e) => set("apartment", e.target.value)} />
              </Field>
              <Field label={dict.checkout.floor}>
                <Input value={form.floor} onChange={(e) => set("floor", e.target.value)} />
              </Field>
              <Field label={dict.common.note} className="sm:col-span-2">
                <Textarea
                  value={form.note}
                  onChange={(e) => set("note", e.target.value)}
                  placeholder="Domofon kodu, giriş qeydləri…"
                />
              </Field>
            </div>
          </div>
        )}

        {current === "delivery" && (
          <div className="max-w-xl space-y-4">
            <SectionTitle>{dict.checkout.steps.delivery}</SectionTitle>
            <div className="grid gap-2">
              {optionGroups.DELIVERY.values.map((v) => (
                <RadioCard
                  key={v.id}
                  name="delivery"
                  label={v.label}
                  checked={form.delivery === v.id}
                  onChange={() => set("delivery", v.id)}
                  price={v.priceDelta === 0 ? dict.common.free : formatPrice(v.priceDelta)}
                />
              ))}
            </div>
          </div>
        )}

        {current === "installation" && (
          <div className="max-w-xl space-y-4">
            <SectionTitle>{dict.checkout.steps.installation}</SectionTitle>
            <div className="grid gap-2">
              {optionGroups.INSTALLATION.values.map((v) => (
                <RadioCard
                  key={v.id}
                  name="installation"
                  label={v.label}
                  description={v.description}
                  badge={v.badge}
                  checked={form.installation === v.id}
                  onChange={() => set("installation", v.id)}
                  price={v.priceDelta === 0 ? dict.common.free : formatPrice(v.priceDelta)}
                />
              ))}
            </div>
            <Notice>
              Quraşdırma seçilərsə, sifariş çatdıqdan sonra ayrıca quraşdırma görüşü yaradılır
              (PRD §80).
            </Notice>
          </div>
        )}

        {current === "payment" && (
          <div className="max-w-xl space-y-4">
            <SectionTitle>{dict.checkout.steps.payment}</SectionTitle>
            <div className="grid gap-2">
              <RadioCard
                name="payment"
                label={dict.checkout.paymentCard}
                checked={form.payment === "card"}
                onChange={() => set("payment", "card")}
              />
              <RadioCard
                name="payment"
                label={dict.checkout.paymentCash}
                checked={form.payment === "cash"}
                onChange={() => set("payment", "cash")}
              />
              <RadioCard
                name="payment"
                label={dict.checkout.paymentTransfer}
                checked={form.payment === "transfer"}
                onChange={() => set("payment", "transfer")}
              />
            </div>
            <Notice tone="warning">{dict.checkout.paymentNote}</Notice>
          </div>
        )}

        {current === "confirmation" && (
          <div className="max-w-xl space-y-5">
            <SectionTitle>{dict.checkout.steps.confirmation}</SectionTitle>

            <Card className="divide-y divide-line">
              <SummaryRow label={dict.checkout.steps.customer} value={`${form.name} ${form.surname} · ${form.phone}`} />
              <SummaryRow
                label={dict.checkout.steps.address}
                value={
                  form.delivery === "dl-pickup"
                    ? "Anbardan götürmə"
                    : [form.city, form.district, form.street, form.building, form.apartment]
                        .filter(Boolean)
                        .join(", ")
                }
              />
              <SummaryRow
                label={dict.checkout.steps.delivery}
                value={optionGroups.DELIVERY.values.find((v) => v.id === form.delivery)?.label ?? "—"}
              />
              <SummaryRow
                label={dict.checkout.steps.installation}
                value={optionGroups.INSTALLATION.values.find((v) => v.id === form.installation)?.label ?? "—"}
              />
              <SummaryRow
                label={dict.checkout.steps.payment}
                value={
                  form.payment === "card"
                    ? dict.checkout.paymentCard
                    : form.payment === "cash"
                      ? dict.checkout.paymentCash
                      : dict.checkout.paymentTransfer
                }
              />
            </Card>

            <div>
              <Checkbox
                label={
                  <>
                    <Link href={r.legal("terms")} className="underline underline-offset-2">
                      {dict.footer.terms}
                    </Link>{" "}
                    və{" "}
                    <Link href={r.legal("privacy")} className="underline underline-offset-2">
                      {dict.footer.privacy}
                    </Link>{" "}
                    ilə razıyam
                  </>
                }
                checked={form.terms}
                onChange={(e) => set("terms", e.target.checked)}
              />
              {errors.terms && <p className="mt-1 text-xs text-danger">{errors.terms}</p>}
            </div>
          </div>
        )}

        <div className="mt-8 flex gap-2">
          {step > 0 && (
            <Button variant="secondary" onClick={() => setStep((s) => s - 1)}>
              <ArrowLeft size={16} /> {dict.actions.back}
            </Button>
          )}
          <Button onClick={goNext} size="lg">
            {current === "confirmation" ? dict.checkout.placeOrder : dict.actions.continue}
            {current !== "confirmation" && <ArrowRight size={16} />}
          </Button>
        </div>
      </div>

      {/* ---------------------------------------------------- SUMMARY */}
      <aside className="lg:sticky lg:top-24 lg:h-fit">
        <Card className="p-5">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone">
            {dict.checkout.orderSummary}
          </h2>

          <ul className="mt-4 space-y-3 border-b border-line pb-4">
            {items.map((item) => (
              <li key={item.id} className="flex items-start justify-between gap-3 text-[13px]">
                <span className="min-w-0">
                  <span className="block truncate font-medium text-ink">{item.productName}</span>
                  <span className="text-stone">
                    {item.snapshot.width}×{item.snapshot.height} · {item.quantity} əd.
                  </span>
                </span>
                <span className="shrink-0 tabular-nums text-graphite">
                  {formatPrice(item.unitPrice * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-4 space-y-2.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-stone">{dict.common.subtotal}</dt>
              <dd className="tabular-nums text-graphite">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-stone">{dict.services.delivery}</dt>
              <dd className="tabular-nums text-graphite">
                {deliveryPrice === 0 ? dict.common.free : formatPrice(deliveryPrice)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-stone">{dict.services.installation}</dt>
              <dd className="tabular-nums text-graphite">
                {installationPrice === 0 ? "—" : formatPrice(installationPrice)}
              </dd>
            </div>
          </dl>

          <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
            <span className="text-sm font-medium text-ink">{dict.common.total}</span>
            <span className="text-2xl font-semibold tracking-tight tabular-nums text-ink">
              {formatPrice(total)}
            </span>
          </div>
        </Card>
      </aside>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-semibold tracking-tight text-ink">{children}</h2>;
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 p-4 text-sm">
      <span className="text-stone">{label}</span>
      <span className="text-right font-medium text-ink">{value}</span>
    </div>
  );
}
