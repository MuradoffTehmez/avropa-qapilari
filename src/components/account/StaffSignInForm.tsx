"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, ScrollText } from "lucide-react";

import type { Dictionary } from "@/i18n";
import type { Locale } from "@/types";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/form";
import { AuthHeading, AuthShell } from "@/components/account/AuthShell";
import type { DoorState } from "@/components/account/DoorKeyAnimation";
import { useSession, type Role } from "@/store/session";
import { ApiRequestError, apiFetch } from "@/lib/api";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Əməkdaş girişi — admin və usta üçün.
 * Müştəri formasından ayrıdır: tünd tema, əlavə səlahiyyət qeydi
 * və müştəri linkləri (qeydiyyat, sosial giriş) yoxdur.
 */
export function StaffSignInForm({
  locale,
  dict,
  role,
}: {
  locale: Locale;
  dict: Dictionary;
  role: Extract<Role, "ADMIN" | "TECHNICIAN">;
}) {
  const r = routes(locale);
  const router = useRouter();
  const params = useSearchParams();
  const setUser = useSession((s) => s.setUser);

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [door, setDoor] = useState<DoorState>("locked");

  const admin = role === "ADMIN";
  const target = params.get("next") ?? (admin ? r.admin : r.technician);

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

    void submitStaffLogin();
  }

  async function submitStaffLogin() {
    setDoor("unlocking");
    try {
      const user = await apiFetch<{ id: string; name: string; email: string; role: Role }>(
        "/api/auth/login",
        { method: "POST", json: { email: form.email, password: form.password } },
      );

      // Rol kifayət etmirsə panelə buraxmırıq — server də hər sorğuda
      // ayrıca yoxlayır, bu yalnız erkən geri bildirişdir.
      if (user.role !== role && user.role !== "ADMIN") {
        setDoor("locked");
        setErrors({ password: dict.auth.guardAdminText });
        return;
      }

      setUser(user);
      setDoor("open");
      window.setTimeout(() => router.push(target), 850);
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
      tone="ink"
      eyebrow={admin ? dict.auth.roleAdmin : dict.auth.roleTechnician}
      title={admin ? dict.auth.adminTitle : dict.auth.technicianTitle}
      text={admin ? dict.auth.adminText : dict.auth.technicianText}
      doorState={door}
      aside={
        admin ? (
          <p className="mt-6 flex items-start gap-2.5 text-[13px] leading-relaxed text-paper/50">
            <ScrollText size={15} className="mt-0.5 shrink-0 text-gold-300" />
            {dict.auth.adminNote}
          </p>
        ) : null
      }
    >
      <AuthHeading
        label={admin ? dict.auth.adminTitle : dict.auth.technicianTitle}
        dict={dict}
        tone="ink"
      />

      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label={dict.auth.email} required error={errors.email} className="[&>span]:text-paper/70">
          <Input
            type="email"
            autoComplete="username"
            placeholder={dict.auth.emailPlaceholder}
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            disabled={busy}
            className={darkControl}
          />
        </Field>

        <Field
          label={dict.auth.password}
          required
          error={errors.password}
          className="[&>span]:text-paper/70"
        >
          <Input
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => set("password", e.target.value)}
            disabled={busy}
            className={darkControl}
          />
        </Field>

        <Button type="submit" variant="gold" size="lg" full disabled={busy}>
          {busy ? dict.auth.unlocking : dict.auth.submitAdmin}
        </Button>

        <Link
          href={r.login}
          className="flex items-center justify-center gap-1.5 pt-1 text-[13px] text-paper/45 underline-offset-4 transition-colors hover:text-paper hover:underline"
        >
          <ArrowLeft size={13} /> {dict.account.title}
        </Link>
      </form>
    </AuthShell>
  );
}

const darkControl = cn(
  "border-paper/15 bg-paper/[0.04] text-paper placeholder:text-paper/30",
  "hover:border-paper/30 focus:border-gold-400",
);
