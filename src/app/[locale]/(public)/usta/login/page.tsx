import type { Metadata } from "next";
import { Suspense } from "react";

import { getDictionary, isLocale } from "@/i18n";
import type { Locale } from "@/types";
import { StaffSignInForm } from "@/components/account/StaffSignInForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "az");
  return { title: dict.auth.technicianTitle, robots: { index: false, follow: false } };
}

export default async function TechnicianLoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "az") as Locale;
  return (
    <Suspense fallback={<div className="min-h-[60dvh]" />}>
      <StaffSignInForm locale={locale} dict={getDictionary(locale)} role="TECHNICIAN" />
    </Suspense>
  );
}
