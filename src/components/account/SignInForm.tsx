"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";

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

export function SignInForm({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const r = routes(locale);
  const router = useRouter();
  const params = useSearchParams();
  const setUser = useSession((s) => s.setUser);

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [door, setDoor] = useState<DoorState>("locked");

  const next = params.get("next");

  function set(key: "email" | "password", value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const problems: Record<string, string> = {};
    if (!EMAIL.test(form.email)) problems.email = dict.auth.errorEmail;
    if (form.password.length < 8) problems.password = dict.auth.errorPassword;

    setErrors(problems);
    if (Object.keys(problems).length > 0) return;

    void submitLogin();
  }

  async function submitLogin() {
    setDoor("unlocking");
    try {
      const user = await apiFetch<{ id: string; name: string; email: string; role: "CUSTOMER" | "TECHNICIAN" | "ADMIN" }>(
        "/api/auth/login",
        { method: "POST", json: { email: form.email, password: form.password } },
      );
      setUser(user);
      setDoor("open");
      // Qapının açılma animasiyası bitsin, sonra keçid.
      window.setTimeout(() => router.push(next ?? r.account), 850);
    } catch (error) {
      setDoor("locked");
      if (error instanceof ApiRequestError) {
        setErrors(
          error.error.details ?? { password: error.error.message },
        );
      }
    }
  }

  const busy = door !== "locked";

  return (
    <AuthShell
      eyebrow={dict.account.title}
      title={dict.auth.signInTitle}
      text={dict.auth.signInText}
      doorState={door}
      aside={
        <ul className="mt-6 space-y-2.5">
          {[
            dict.auth.benefitOrders,
            dict.auth.benefitConfigs,
            dict.auth.benefitWarranty,
            dict.auth.benefitAppointments,
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-[14px] text-graphite">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-gold-500" />
              {item}
            </li>
          ))}
        </ul>
      }
    >
      <AuthHeading label={dict.auth.signIn} dict={dict} />

      <form onSubmit={submit} className="space-y-4" noValidate>
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

        <Field label={dict.auth.password} required error={errors.password}>
          <Input
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => set("password", e.target.value)}
            disabled={busy}
          />
        </Field>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <Checkbox label={dict.auth.remember} defaultChecked />
          <Link
            href={r.passwordReset}
            className="text-[13px] text-gold-600 underline-offset-4 hover:underline"
          >
            {dict.auth.forgot}
          </Link>
        </div>

        <Button type="submit" size="lg" full disabled={busy}>
          {busy ? dict.auth.unlocking : dict.auth.submitSignIn}
        </Button>

        <p className="pt-1 text-center text-[13px] text-stone">
          {dict.auth.noAccount}{" "}
          <Link href={r.register} className="font-medium text-gold-600 underline-offset-4 hover:underline">
            {dict.auth.register}
          </Link>
        </p>

        <p className="flex items-start gap-2 border-t border-line pt-4 text-xs leading-relaxed text-stone">
          <ShieldCheck size={14} className="mt-0.5 shrink-0 text-gold-500" />
          {dict.auth.securityNote}
        </p>

        <p className="flex items-center justify-center gap-1.5 text-[12px] text-mist">
          <Link href={r.adminLogin} className="underline-offset-4 hover:underline">
            {dict.auth.adminTitle}
          </Link>
          <ArrowRight size={11} />
          <Link href={r.technicianLogin} className="underline-offset-4 hover:underline">
            {dict.auth.technicianTitle}
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
