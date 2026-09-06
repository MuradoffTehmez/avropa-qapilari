import { getDictionary, isLocale } from "@/i18n";
import type { Metadata } from "next";
import type { Locale } from "@/types";
import { TechnicianPanel } from "@/components/account/TechnicianPanel";
import { AuthGuard } from "@/components/account/AuthGuard";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "az");

  return {
    title: dict.pageMeta.technician.title,
    robots: { index: false, follow: false },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "az") as Locale;
  const dict = getDictionary(locale);

  return (
    <AuthGuard locale={locale} dict={dict} required="TECHNICIAN">
      <TechnicianPanel locale={locale} />
    </AuthGuard>
  );
}
