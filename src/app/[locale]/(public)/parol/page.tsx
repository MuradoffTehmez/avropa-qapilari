import type { Metadata } from "next";

import { getDictionary, isLocale } from "@/i18n";
import type { Locale } from "@/types";
import { localeAlternates } from "@/lib/routes";
import { PasswordResetForm } from "@/components/account/PasswordResetForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "az");

  return {
    title: dict.auth.reset,
    description: dict.auth.resetText,
    alternates: localeAlternates("/parol", isLocale(locale) ? locale : "az"),
    robots: { index: false, follow: false },
  };
}

export default async function PasswordResetPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "az") as Locale;
  return <PasswordResetForm locale={locale} dict={getDictionary(locale)} />;
}
