import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Award, Hammer, RefreshCw, Ruler, Truck, Wrench } from "lucide-react";

import { getDictionary, isLocale } from "@/i18n";
import type { Locale } from "@/types";
import { routes } from "@/lib/routes";
import { Breadcrumbs, Section, SectionHeading } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/Button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "az");

  return {
    title: dict.pageMeta.services.title,
    description: dict.pageMeta.services.description,
  };
}


export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "az") as Locale;
  const dict = getDictionary(locale);
  const r = routes(locale);

  const services = [
    {
      icon: Ruler,
      title: dict.services.measurement,
      text: dict.services.measurementText,
      href: r.serviceMeasurement,
      cta: dict.actions.bookMeasurement,
      ctaHref: r.measurement,
      price: "Sifarişlə pulsuz",
    },
    {
      icon: Truck,
      title: dict.services.delivery,
      text: dict.services.deliveryText,
      href: r.services,
      cta: dict.actions.details,
      ctaHref: r.services,
      price: "40 AZN-dən",
    },
    {
      icon: Hammer,
      title: dict.services.installation,
      text: dict.services.installationText,
      href: r.serviceInstallation,
      cta: dict.actions.details,
      ctaHref: r.serviceInstallation,
      price: "120 AZN-dən",
    },
    {
      icon: Wrench,
      title: dict.services.repair,
      text: dict.services.repairText,
      href: r.serviceRepair,
      cta: dict.actions.callTechnician,
      ctaHref: r.repair,
      price: "Diaqnostika 25 AZN",
    },
    {
      icon: RefreshCw,
      title: dict.services.maintenance,
      text: dict.services.maintenanceText,
      href: r.serviceMaintenance,
      cta: dict.actions.details,
      ctaHref: r.serviceMaintenance,
      price: "60 AZN-dən",
    },
    {
      icon: Award,
      title: dict.services.warranty,
      text: dict.services.warrantyText,
      href: r.services,
      cta: dict.actions.details,
      ctaHref: r.faq,
      price: "3–10 il",
    },
  ];

  return (
    <>
      <div className="border-b border-line bg-bone">
        <div className="container-page py-8 sm:py-10">
          <Breadcrumbs items={[{ label: dict.nav.home, href: r.home }, { label: dict.nav.services }]} />
          <h1 className="font-display mt-4 text-2xl font-semibold tracking-tight text-ink sm:text-3xl lg:text-[2.35rem]">
            {dict.nav.services}
          </h1>
          <p className="mt-2 max-w-xl text-[15px] text-stone">{dict.home.servicesText}</p>
        </div>
      </div>

      <Section>
        <div className="container-page grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map(({ icon: Icon, title, text, cta, ctaHref, price }) => (
            <div key={title} className="flex flex-col border border-line bg-paper p-6">
              <Icon size={24} className="text-gold-500" />
              <h2 className="mt-5 text-lg font-medium text-ink">{title}</h2>
              <p className="mt-2 flex-1 text-[14px] leading-relaxed text-stone">{text}</p>
              <p className="mt-4 text-[13px] font-medium text-graphite">{price}</p>
              <Link
                href={ctaHref}
                className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-gold-600 underline-offset-4 hover:underline"
              >
                {cta} <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="ink" className="!py-14">
        <div className="container-page flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <SectionHeading
              invert
              title="Prosesi bilmirsiniz? Biz aparaq."
              text="Ölçüdən quraşdırmaya, zəmanətdən təmirə qədər bütün mərhələni tək kanaldan idarə edirik."
              className="!mb-0"
            />
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <ButtonLink href={r.measurement} variant="gold" size="lg">
              {dict.actions.bookMeasurement}
            </ButtonLink>
            <ButtonLink
              href={r.contact}
              size="lg"
              className="border-paper/25 bg-transparent text-paper hover:border-paper hover:bg-paper/5"
            >
              {dict.nav.contact}
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
