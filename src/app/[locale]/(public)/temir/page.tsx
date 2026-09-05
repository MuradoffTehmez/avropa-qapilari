import type { Metadata } from "next";
import { getDictionary, isLocale } from "@/i18n";
import type { Locale } from "@/types";
import { routes } from "@/lib/routes";
import { Breadcrumbs } from "@/components/ui/primitives";
import { RepairWizard } from "@/components/repair/RepairWizard";

export const metadata: Metadata = {
  title: "Təmir müraciəti",
  description: "Qapı təmiri üçün onlayn müraciət: problem, foto, ünvan və uyğun vaxt. Usta 24 saat içində.",
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
          <Breadcrumbs items={[{ label: dict.nav.home, href: r.home }, { label: dict.repair.wizardTitle }]} />
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-ink sm:text-3xl lg:text-[2.35rem]">
            {dict.repair.wizardTitle}
          </h1>
          <p className="mt-2 max-w-xl text-[15px] text-stone">{dict.repair.subtitle}</p>
        </div>
      </div>
      <RepairWizard locale={locale} dict={dict} />
    </>
  );
}
