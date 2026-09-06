"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import type { Dictionary } from "@/i18n";
import type { Locale } from "@/types";
import { AuthGuard } from "@/components/account/AuthGuard";
import { AdminShell } from "@/components/admin/AdminShell";

/**
 * Admin panelini qoruyur. Giriş səhifəsi sidebar-sız açılır —
 * əks halda giriş forması panelin içində görünərdi.
 */
export function AdminBoundary({
  locale,
  dict,
  children,
}: {
  locale: Locale;
  dict: Dictionary;
  children: ReactNode;
}) {
  const pathname = usePathname();

  if (pathname.endsWith("/admin/login")) return <>{children}</>;

  // Giriş bloklandıqda AdminShell render olunmur, deməli onun `main`
  // landmark-ı da olmur — burada təmin edirik ki, səhifə ekran
  // oxuyucusu üçün landmark-sız qalmasın.
  return (
    <AuthGuard
      locale={locale}
      dict={dict}
      required="ADMIN"
      fallbackWrapper={(node) => (
        <main id="main" className="min-h-dvh bg-bone">
          {node}
        </main>
      )}
    >
      <AdminShell locale={locale} dict={dict}>
        {children}
      </AdminShell>
    </AuthGuard>
  );
}
