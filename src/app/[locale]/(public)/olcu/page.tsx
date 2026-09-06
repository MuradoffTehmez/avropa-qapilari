import type { Metadata } from "next";
import { getDictionary, isLocale } from "@/i18n";
import type { Locale } from "@/types";
import { localeAlternates, routes } from "@/lib/routes";
import { Breadcrumbs } from "@/components/ui/primitives";
import { MeasurementForm } from "@/components/repair/MeasurementForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "az");

  return {
    alternates: localeAlternates("/olcu", isLocale(locale) ? locale : "az"),
    title: dict.pageMeta.measurement.title,
    description: dict.pageMeta.measurement.description,
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
  const r = routes(locale);

  return (
    <>
      <div className="border-b border-line bg-bone">
        <div className="container-page py-8 sm:py-10">
          <Breadcrumbs items={[{ label: dict.nav.home, href: r.home }, { label: dict.measurement.title }]} />
          <h1 className="font-display mt-4 text-2xl font-semibold tracking-tight text-ink sm:text-3xl lg:text-[2.35rem]">
            {dict.measurement.title}
          </h1>
          <p className="mt-2 max-w-xl text-[15px] text-stone">{dict.measurement.subtitle}</p>
        </div>
      </div>
      <MeasurementForm locale={locale} dict={dict} />
    </>
  );
}
