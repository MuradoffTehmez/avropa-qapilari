import type { Metadata } from "next";
import { getDictionary, isLocale } from "@/i18n";
import type { Locale } from "@/types";
import { routes } from "@/lib/routes";
import { Breadcrumbs } from "@/components/ui/primitives";
import { MeasurementForm } from "@/components/repair/MeasurementForm";

export const metadata: Metadata = {
  title: "Ölçü ustası sifarişi",
  description: "Pulsuz ölçü xidməti. Usta ünvana gəlir və dəqiq ölçü götürür.",
};

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
          <Breadcrumbs items={[{ label: "Ana səhifə", href: r.home }, { label: dict.measurement.title }]} />
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-ink sm:text-3xl lg:text-[2.35rem]">
            {dict.measurement.title}
          </h1>
          <p className="mt-2 max-w-xl text-[15px] text-stone">{dict.measurement.subtitle}</p>
        </div>
      </div>
      <MeasurementForm locale={locale} dict={dict} />
    </>
  );
}
