import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

import { getDictionary, isLocale, locales } from "@/i18n";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/types";
import { localeAlternates, routes } from "@/lib/routes";
import { Accordion } from "@/components/ui/disclosure";
import { Breadcrumbs, Card, DataRow, Section, SectionHeading } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/Button";
import { localizedFaq } from "@/mock/content.i18n";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/structured-data";

type ServiceSlug = "measurement" | "installation" | "repair" | "maintenance";

/** Yalnız struktur — bütün mətn `serviceDetail` lüğət blokundadır. */
const services: { slug: ServiceSlug; cta: "measurement" | "repair" }[] = [
  { slug: "measurement", cta: "measurement" },
  { slug: "installation", cta: "measurement" },
  { slug: "repair", cta: "repair" },
  { slug: "maintenance", cta: "repair" },
];

function content(slug: ServiceSlug, dict: Dictionary) {
  return dict.serviceDetail[slug];
}

export function generateStaticParams() {
  return locales.flatMap((locale) => services.map((s) => ({ locale, service: s.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; service: string }>;
}): Promise<Metadata> {
  const { locale, service } = await params;
  const item = services.find((s) => s.slug === service);
  if (!item) return {};

  const dict = getDictionary(isLocale(locale) ? locale : "az");
  const text = content(item.slug, dict);
  return {
    title: text.title,
    description: text.lead,
    alternates: localeAlternates(`/xidmetler/${item.slug}`, isLocale(locale) ? locale : "az"),
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; service: string }>;
}) {
  const { locale: raw, service } = await params;
  const locale = (isLocale(raw) ? raw : "az") as Locale;
  const dict = getDictionary(locale);
  const r = routes(locale);

  const item = services.find((s) => s.slug === service);
  if (!item) notFound();

  const text = content(item.slug, dict);
  const ctaHref = item.cta === "measurement" ? r.measurement : r.repair;
  const ctaLabel =
    item.cta === "measurement" ? dict.actions.bookMeasurement : dict.actions.callTechnician;

  return (
    <>
      <JsonLd
        data={[
          serviceSchema(text.title, text.lead, `/${locale}/${item.slug}`),
          breadcrumbSchema([
            { label: dict.nav.home, href: r.home },
            { label: dict.nav.services, href: r.services },
            { label: text.title },
          ]),
          faqSchema(localizedFaq(locale).slice(0, 5)),
        ]}
      />

      <div className="border-b border-line bg-bone">
        <div className="container-page py-8 sm:py-10">
          <Breadcrumbs
            items={[
              { label: dict.nav.home, href: r.home },
              { label: dict.nav.services, href: r.services },
              { label: text.title },
            ]}
          />
          <h1 className="font-display mt-4 text-2xl font-semibold tracking-tight text-ink sm:text-3xl lg:text-[2.35rem]">
            {text.title}
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-stone">{text.lead}</p>
          <ButtonLink href={ctaHref} size="lg" className="mt-6">
            {ctaLabel}
          </ButtonLink>
        </div>
      </div>

      <Section>
        <div className="container-page grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            <SectionHeading title={dict.serviceDetail.process} className="!mb-6" />
            <ol className="border-t border-line">
              {text.steps.map((step, i) => (
                <li key={step} className="flex items-start gap-4 border-b border-line py-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-line text-xs font-semibold tabular-nums text-graphite">
                    {i + 1}
                  </span>
                  <span className="pt-0.5 text-[15px] text-ink">{step}</span>
                </li>
              ))}
            </ol>

            <h2 className="mb-4 mt-10 text-lg font-semibold tracking-tight text-ink">
              {dict.serviceDetail.included}
            </h2>
            <ul className="space-y-2.5">
              {text.includes.map((inc) => (
                <li key={inc} className="flex items-start gap-2.5 text-[14.5px] text-graphite">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-gold-500" />
                  {inc}
                </li>
              ))}
            </ul>
          </div>

          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <Card className="p-5">
              <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone">
                {dict.serviceDetail.prices}
              </h2>
              <dl>
                {text.pricing.map((p) => (
                  <DataRow key={p.label} label={p.label} value={p.value} />
                ))}
              </dl>
              <ButtonLink href={ctaHref} full className="mt-5">
                {ctaLabel}
              </ButtonLink>
              <p className="mt-3 text-xs leading-relaxed text-stone">
                {dict.serviceDetail.priceNote}
              </p>
            </Card>
          </aside>
        </div>
      </Section>

      <Section tone="bone" className="border-t border-line">
        <div className="container-page">
          <SectionHeading title={dict.home.faqTitle} />
          <Accordion
            className="lg:max-w-3xl"
            items={localizedFaq(locale).slice(0, 5).map((f) => ({ id: f.id, title: f.question, content: f.answer }))}
          />
        </div>
      </Section>
    </>
  );
}
