import { getDictionary, isLocale } from "@/i18n";
import type { Metadata } from "next";
import { AuthPanel } from "@/components/account/AuthPanel";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "az");

  return {
    title: dict.pageMeta.login.title,
    robots: { index: false, follow: false },
  };
}

export default async function Page({params}: {params:Promise<{locale:string}>}) {const {locale}=await params;return <AuthPanel locale={locale}/>;}
