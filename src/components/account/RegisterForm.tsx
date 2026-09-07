"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";

import type { Dictionary } from "@/i18n";
import type { Locale } from "@/types";
import { routes } from "@/lib/routes";
import { Button } from "@/components/ui/Button";
import { Checkbox, Field, Input } from "@/components/ui/form";
import { AuthHeading, AuthShell } from "@/components/account/AuthShell";
import type { DoorState } from "@/components/account/DoorKeyAnimation";
import { useSession } from "@/store/session";
import { ApiRequestError, apiFetch } from "@/lib/api";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function RegisterForm({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const r = routes(locale);
  const router = useRouter();
  const setUser = useSession((s) => s.setUser);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    repeat: "",
  });
  const [terms, setTerms] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [door, setDoor] = useState<DoorState>("locked");

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const problems: Record<string, string> = {};
    if (!form.name.trim()) problems.name = dict.errors.required;
    if (!EMAIL.test(form.email)) problems.email = dict.auth.errorEmail;
    if (form.phone.replace(/\D/g, "").length < 9) problems.phone = dict.errors.invalidPhone;
    if (form.password.length < 8) problems.password = dict.auth.errorPassword;
    if (form.repeat !== form.password) problems.repeat = dict.auth.errorPasswordMatch;
    if (!terms) problems.terms = dict.auth.errorTerms;

    setErrors(problems);
    if (Object.keys(problems).length > 0) return;

    void submitRegister();
  }

  async function submitRegister() {
    setDoor("unlocking");
    try {
      const user = await apiFetch<{ id: string; name: string; email: string; role: "CUSTOMER" | "TECHNICIAN" | "ADMIN" }>(
        "/api/auth/register",
        {
          method: "POST",
          json: {
            name: form.name.trim(),
            email: form.email,
            phone: form.phone,
            password: form.password,
            language: locale,
            marketingConsent,
          },
        },
      );
      setUser(user);
      setDoor("open");
      window.setTimeout(() => router.push(r.account), 850);
    } catch (error) {
      setDoor("locked");
      if (error instanceof ApiRequestError) {
        setErrors(error.error.details ?? { email: error.error.message });
      }
    }
  }

  const busy = door !== "locked";

  return (
    <AuthShell
      eyebrow={dict.auth.register}
      title={dict.auth.registerTitle}
      text={dict.auth.registerText}
      doorState={door}
    >
      <AuthHeading label={dict.auth.register} dict={dict} />

      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label={dict.auth.fullName} required error={errors.name}>
          <Input
            autoComplete="name"
            placeholder={dict.auth.fullNamePlaceholder}
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            disabled={busy}
          />
        </Field>

        <Field label={dict.auth.email} required error={errors.email}>
          <Input
            type="email"
            autoComplete="email"
            placeholder={dict.auth.emailPlaceholder}
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            disabled={busy}
          />
        </Field>

        <Field label={dict.auth.phone} required error={errors.phone}>
          <Input
            type="tel"
            autoComplete="tel"
            placeholder="+994 00 000 00 00"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            disabled={busy}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={dict.auth.password} required hint={dict.auth.passwordHint} error={errors.password}>
            <Input
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              disabled={busy}
            />
          </Field>
          <Field label={dict.auth.passwordRepeat} required error={errors.repeat}>
            <Input
              type="password"
              autoComplete="new-password"
              value={form.repeat}
              onChange={(e) => set("repeat", e.target.value)}
              disabled={busy}
            />
          </Field>
        </div>

        <div>
          <Checkbox
            checked={terms}
            onChange={(e) => {
              setTerms(e.target.checked);
              setErrors((x) => ({ ...x, terms: "" }));
            }}
            label={
              <>
                <Link href={r.legal("terms")} className="underline underline-offset-2">
                  {dict.footer.terms}
                </Link>{" "}
                — {dict.auth.termsAccept}
              </>
            }
          />
          {errors.terms && <p className="mt-1.5 text-xs text-danger">{errors.terms}</p>}
        </div>

        <Checkbox
          checked={marketingConsent}
          onChange={(e) => setMarketingConsent(e.target.checked)}
          label={dict.auth.marketingOptional}
        />

        <Button type="submit" size="lg" full disabled={busy}>
          {busy ? dict.auth.unlocking : dict.auth.submitRegister}
        </Button>

        <p className="pt-1 text-center text-[13px] text-stone">
          {dict.auth.haveAccount}{" "}
          <Link href={r.login} className="font-medium text-gold-600 underline-offset-4 hover:underline">
            {dict.auth.signIn}
          </Link>
        </p>

        <p className="flex items-start gap-2 border-t border-line pt-4 text-xs leading-relaxed text-stone">
          <ShieldCheck size={14} className="mt-0.5 shrink-0 text-gold-500" />
          {dict.auth.securityNote}
        </p>
      </form>
    </AuthShell>
  );
}
