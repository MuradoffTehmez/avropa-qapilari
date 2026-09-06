import { getDictionary, isLocale } from "@/i18n";
import type { Metadata } from "next";
import { TechnicianPanel } from "@/components/account/TechnicianPanel";
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

export default async function Page({params}: {params:Promise<{locale:string}>}) {const {locale}=await params;return <TechnicianPanel locale={locale}/>;}
