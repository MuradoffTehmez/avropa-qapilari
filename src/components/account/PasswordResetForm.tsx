"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, MailCheck } from "lucide-react";

import type { Dictionary } from "@/i18n";
import type { Locale } from "@/types";
import { routes } from "@/lib/routes";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/form";
import { AuthHeading, AuthShell } from "@/components/account/AuthShell";
import type { DoorState } from "@/components/account/DoorKeyAnimation";
import { ApiRequestError, apiFetch } from "@/lib/api";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Parol bərpası iki addımlıdır: e-poçt sorğusu, sonra linkdəki token
 * ilə yeni parol. Token URL-də `?token=` kimi gəlir.
 */
export function PasswordResetForm({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const r = routes(locale);
  const params = useSearchParams();
  const token = params.get("token");

  return token ? (
    <NewPasswordStep locale={locale} dict={dict} token={token} />
  ) : (
    <RequestStep dict={dict} loginHref={r.login} />
  );
}

/* ------------------------------------------------------ 1. sorğu addımı */

function RequestStep({
  dict,
  loginHref,
}: {
  dict: Dictionary;
  loginHref: string;
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [door, setDoor] = useState<DoorState>("locked");
  const [sent, setSent] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!EMAIL.test(email)) {
      setError(dict.auth.errorEmail);
      return;
    }

    setError("");
    setDoor("unlocking");

    try {
      await apiFetch("/api/auth/password/request", { method: "POST", json: { email } });
      setDoor("open");
      setSent(true);
    } catch (apiError) {
      setDoor("locked");
      if (apiError instanceof ApiRequestError) setError(apiError.error.message);
    }
  }

  return (
    <AuthShell
      eyebrow={dict.auth.reset}
      title={dict.auth.resetTitle}
      text={dict.auth.resetText}
      doorState={door}
    >
      <AuthHeading label={dict.auth.reset} dict={dict} />

      {sent ? (
        <div role="status">
          <MailCheck size={34} className="text-success" />
          <h2 className="mt-4 text-lg font-semibold tracking-tight text-ink">
            {dict.auth.resetSent}
          </h2>
          <p className="mt-2 text-[14px] leading-relaxed text-stone">{dict.auth.resetSentText}</p>
          <p className="mt-4 break-all border border-line bg-bone px-3.5 py-2.5 font-mono text-[13px] text-graphite">
            {email}
          </p>
          <ButtonLink href={loginHref} variant="secondary" full className="mt-5">
            {dict.auth.backToSignIn}
          </ButtonLink>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4" noValidate>
          <Field label={dict.auth.email} required error={error}>
            <Input
              type="email"
              autoComplete="email"
              placeholder={dict.auth.emailPlaceholder}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              disabled={door !== "locked"}
            />
          </Field>

          <Button type="submit" size="lg" full disabled={door !== "locked"}>
            {door !== "locked" ? dict.auth.unlocking : dict.auth.submitReset}
          </Button>

          <Link
            href={loginHref}
            className="flex items-center justify-center gap-1.5 pt-1 text-[13px] text-stone underline-offset-4 hover:text-ink hover:underline"
          >
            <ArrowLeft size={13} /> {dict.auth.backToSignIn}
          </Link>
        </form>
      )}
    </AuthShell>
  );
}

/* -------------------------------------------------- 2. yeni parol addımı */

function NewPasswordStep({
  locale,
  dict,
  token,
}: {
  locale: Locale;
  dict: Dictionary;
  token: string;
}) {
  const r = routes(locale);
  const router = useRouter();

  const [form, setForm] = useState({ password: "", repeat: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [door, setDoor] = useState<DoorState>("locked");

  async function submit(event: React.FormEvent) {
    event.preventDefault();

    const problems: Record<string, string> = {};
    if (form.password.length < 8) problems.password = dict.auth.errorPassword;
    if (form.repeat !== form.password) problems.repeat = dict.auth.errorPasswordMatch;

    setErrors(problems);
    if (Object.keys(problems).length > 0) return;

    setDoor("unlocking");

    try {
      await apiFetch("/api/auth/password/reset", {
        method: "POST",
        json: { token, password: form.password },
      });
      setDoor("open");
      window.setTimeout(() => router.push(r.login), 850);
    } catch (error) {
      setDoor("locked");
      if (error instanceof ApiRequestError) {
        setErrors(error.error.details ?? { password: error.error.message });
      }
    }
  }

  const busy = door !== "locked";

  return (
    <AuthShell
      eyebrow={dict.auth.reset}
      title={dict.auth.passwordNew}
      text={dict.auth.resetText}
      doorState={door}
    >
      <AuthHeading label={dict.auth.reset} dict={dict} />

      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field
          label={dict.auth.passwordNew}
          required
          hint={dict.auth.passwordHint}
          error={errors.password ?? errors.token}
        >
          <Input
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => {
              setForm((f) => ({ ...f, password: e.target.value }));
              setErrors({});
            }}
            disabled={busy}
          />
        </Field>

        <Field label={dict.auth.passwordRepeat} required error={errors.repeat}>
          <Input
            type="password"
            autoComplete="new-password"
            value={form.repeat}
            onChange={(e) => {
              setForm((f) => ({ ...f, repeat: e.target.value }));
              setErrors((x) => ({ ...x, repeat: "" }));
            }}
            disabled={busy}
          />
        </Field>

        <Button type="submit" size="lg" full disabled={busy}>
          {busy ? dict.auth.unlocking : dict.actions.save}
        </Button>

        <Link
          href={r.login}
          className="flex items-center justify-center gap-1.5 pt-1 text-[13px] text-stone underline-offset-4 hover:text-ink hover:underline"
        >
          <ArrowLeft size={13} /> {dict.auth.backToSignIn}
        </Link>
      </form>
    </AuthShell>
  );
}
