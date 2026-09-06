"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, MailCheck } from "lucide-react";

import type { Dictionary } from "@/i18n";
import type { Locale } from "@/types";
import { routes } from "@/lib/routes";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/form";
import { AuthHeading, AuthShell } from "@/components/account/AuthShell";
import type { DoorState } from "@/components/account/DoorKeyAnimation";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function PasswordResetForm({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const r = routes(locale);

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [door, setDoor] = useState<DoorState>("locked");
  const [sent, setSent] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!EMAIL.test(email)) {
      setError(dict.auth.errorEmail);
      return;
    }
    setError("");
    setDoor("unlocking");
    window.setTimeout(() => {
      setDoor("open");
      setSent(true);
    }, 700);
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
          <ButtonLink href={r.login} variant="secondary" full className="mt-5">
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
            href={r.login}
            className="flex items-center justify-center gap-1.5 pt-1 text-[13px] text-stone underline-offset-4 hover:text-ink hover:underline"
          >
            <ArrowLeft size={13} /> {dict.auth.backToSignIn}
          </Link>
        </form>
      )}
    </AuthShell>
  );
}
