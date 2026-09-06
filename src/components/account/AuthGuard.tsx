"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Lock } from "lucide-react";

import type { Dictionary } from "@/i18n";
import type { Locale } from "@/types";
import { routes } from "@/lib/routes";
import { useHydrated } from "@/lib/hooks";
import { ButtonLink } from "@/components/ui/Button";
import { DoorKeyAnimation } from "@/components/account/DoorKeyAnimation";
import { hasRole, useSession, type Role } from "@/store/session";

/**
 * Rol tələb edən bölmələri qoruyur.
 *
 * DİQQƏT: bu yalnız interfeys səviyyəsindədir. Backend qoşulanda əsl
 * yoxlama proxy və API-də aparılacaq (PRD §93) — burada məqsəd
 * istifadəçini düzgün giriş formasına yönləndirməkdir.
 */
export function AuthGuard({
  locale,
  dict,
  required = "CUSTOMER",
  children,
}: {
  locale: Locale;
  dict: Dictionary;
  required?: Role;
  children: ReactNode;
}) {
  const r = routes(locale);
  const pathname = usePathname();
  const hydrated = useHydrated();
  const user = useSession((s) => s.user);

  // Serverdə və ilk render-də sessiya bilinmir; boş sahə saxlayırıq ki,
  // məzmun sıçramasın və hydration uyğunsuzluğu yaranmasın.
  if (!hydrated) return <div className="min-h-[60dvh]" aria-hidden />;

  if (hasRole(user, required)) return <>{children}</>;

  const staff = required !== "CUSTOMER";
  const admin = required === "ADMIN";
  const loginHref = admin ? r.adminLogin : required === "TECHNICIAN" ? r.technicianLogin : r.login;
  const heading = admin
    ? dict.auth.adminTitle
    : required === "TECHNICIAN"
      ? dict.auth.technicianTitle
      : dict.account.title;

  return (
    <section className="container-page flex min-h-[60dvh] items-center py-12">
      <div className="mx-auto grid max-w-2xl items-center gap-8 sm:grid-cols-[minmax(0,10rem)_1fr]">
        <DoorKeyAnimation state="locked" className="mx-auto w-32 sm:mx-0 sm:w-full" />

        <div>
          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-600">
            <Lock size={13} /> {staff ? dict.auth.guardAdminTitle : dict.auth.guardTitle}
          </p>
          <h1 className="font-display mt-3 text-[1.6rem] font-semibold leading-tight text-ink sm:text-[1.9rem]">
            {heading}
          </h1>
          <p className="mt-3 text-[14.5px] leading-relaxed text-stone">
            {staff ? dict.auth.guardAdminText : dict.auth.guardText}
          </p>

          {user && (
            <p className="mt-3 text-[13px] text-mist">
              {dict.auth.signedInAs} {user.email}
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            <ButtonLink href={`${loginHref}?next=${encodeURIComponent(pathname)}`} size="lg">
              {dict.auth.signIn}
            </ButtonLink>
            {!staff && (
              <ButtonLink href={r.register} variant="secondary" size="lg">
                {dict.auth.register}
              </ButtonLink>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
