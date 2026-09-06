"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/primitives";
import { Checkbox, Field, Input } from "@/components/ui/form";
import { LogoMark } from "@/components/layout/Logo";
import { cn } from "@/lib/utils";
import { getDictionary, isLocale } from "@/i18n";

type Mode = "login" | "register" | "reset";

export function AuthPanel({ locale }: { locale: string }) {
  const dict = getDictionary(isLocale(locale) ? locale : "az");
  const modes: { id: Mode; label: string }[] = [
    { id: "login", label: dict.auth.signIn },
    { id: "register", label: dict.auth.register },
    { id: "reset", label: dict.auth.reset },
  ];
  const [mode, setMode] = useState<Mode>("login");
  const [done, setDone] = useState(false);

  const active = modes.find((m) => m.id === mode)!;

  return (
    <div className="container-page grid gap-10 py-10 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-16">
      {/* Sol tərəf — dəyər təklifi */}
      <div className="order-2 lg:order-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-600">
          {dict.account.title}
        </p>
        <h1 className="mt-4 text-balance-heading text-2xl font-semibold leading-tight tracking-tight text-ink sm:text-3xl lg:text-[2.5rem]">
          {dict.auth.signInTitle}
        </h1>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-stone">
          {dict.auth.signInText}
        </p>

        <ul className="mt-8 space-y-3">
          {[dict.auth.benefitOrders, dict.auth.benefitConfigs, dict.auth.benefitWarranty, dict.auth.benefitAppointments].map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-[14.5px] text-graphite">
              <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-gold-500" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Sağ tərəf — forma */}
      <Card className="order-1 p-5 sm:p-7 lg:order-2">
        <div className="mb-6 flex items-center gap-3">
          <LogoMark size={30} />
          <div>
            <p className="text-[15px] font-semibold text-ink">{active.label}</p>
            <p className="text-xs text-stone">EuroPorta · {dict.actions.account}</p>
          </div>
        </div>

        <div
          role="tablist"
          aria-label={dict.auth.signInTitle}
          className="mb-6 grid grid-cols-3 gap-1 border border-line p-1"
        >
          {modes.map((m) => (
            <button
              key={m.id}
              role="tab"
              aria-selected={mode === m.id}
              type="button"
              onClick={() => {
                setMode(m.id);
                setDone(false);
              }}
              className={cn(
                "px-2 py-2 text-[12px] font-medium leading-tight transition-colors sm:text-[13px]",
                mode === m.id ? "bg-ink text-paper" : "text-graphite hover:bg-bone",
              )}
            >
              {m.label}
            </button>
          ))}
        </div>

        {done ? (
          <div role="status" className="py-2">
            <CheckCircle2 size={34} className="text-success" />
            <h2 className="mt-4 text-lg font-semibold tracking-tight text-ink">
              {mode === "reset" ? dict.auth.resetSent : mode === "register" ? dict.auth.accountCreated : dict.auth.welcomeBack}
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-stone">
              {mode === "reset"
                ? dict.auth.resetSentText
                : dict.auth.signInText}
            </p>
            <Link
              href={`/${locale}/hesab`}
              className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-medium text-gold-600 underline-offset-4 hover:underline"
            >
              {dict.auth.goToAccount} <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setDone(true);
            }}
          >
            {mode === "register" && (
              <Field label={dict.auth.fullName} required>
                <Input required autoComplete="name" placeholder={dict.auth.fullNamePlaceholder} />
              </Field>
            )}

            <Field label={dict.auth.email} required>
              <Input required type="email" autoComplete="email" placeholder={dict.auth.emailPlaceholder} />
            </Field>

            {mode !== "reset" && (
              <Field label={dict.auth.password} required hint={dict.auth.passwordHint}>
                <Input
                  required
                  type="password"
                  minLength={8}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                />
              </Field>
            )}

            {mode === "register" && (
              <Checkbox
                required
                label={dict.auth.termsAccept}
              />
            )}

            <Button type="submit" size="lg" full>
              {active.label}
            </Button>

            <p className="flex items-start gap-2 pt-1 text-xs leading-relaxed text-stone">
              <ShieldCheck size={14} className="mt-0.5 shrink-0 text-gold-500" />
              {dict.auth.securityNote}
            </p>
          </form>
        )}
      </Card>
    </div>
  );
}
