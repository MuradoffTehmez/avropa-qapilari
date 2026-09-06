import type { Metadata } from "next";

import { getDictionary, isLocale } from "@/i18n";
import type { Locale } from "@/types";
import { localeAlternates } from "@/lib/routes";
import { RegisterForm } from "@/components/account/RegisterForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "az");

  return {
    title: dict.auth.register,
    description: dict.auth.registerText,
    alternates: localeAlternates("/qeydiyyat", isLocale(locale) ? locale : "az"),
    robots: { index: false, follow: true },
  };
}

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "az") as Locale;
  return <RegisterForm locale={locale} dict={getDictionary(locale)} />;
}
