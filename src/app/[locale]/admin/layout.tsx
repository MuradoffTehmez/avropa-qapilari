import type { Metadata } from "next";
import { getDictionary, isLocale } from "@/i18n";
import type { Locale } from "@/types";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "İdarəetmə paneli",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typed = (isLocale(locale) ? locale : "az") as Locale;
  const dict = getDictionary(typed);

  return (
    <AdminShell locale={typed} dict={dict}>
      {children}
    </AdminShell>
  );
}
