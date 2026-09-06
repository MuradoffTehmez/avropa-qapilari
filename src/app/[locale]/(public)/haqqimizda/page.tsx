import type { Metadata } from "next";
import { Award, Factory, Users, Wrench } from "lucide-react";

import { getDictionary, isLocale } from "@/i18n";
import type { Locale } from "@/types";
import { localeAlternates, routes } from "@/lib/routes";
import { brandDescription, countryName, specializationName } from "@/lib/i18n-format";
import { Breadcrumbs, Section, SectionHeading, Stat } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/Button";
import { brands } from "@/mock/taxonomy";
import { technicians } from "@/mock/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "az");

  return {
    alternates: localeAlternates("/haqqimizda", isLocale(locale) ? locale : "az"),
    title: dict.pageMeta.about.title,
    description: dict.pageMeta.about.description,
  };
}


export default async function AboutPage({
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
          <Breadcrumbs items={[{ label: dict.nav.home, href: r.home }, { label: dict.nav.about }]} />
          <h1 className="font-display mt-4 max-w-3xl text-balance-heading text-2xl font-semibold leading-tight tracking-tight text-ink sm:text-3xl lg:text-[2.5rem]">
            {dict.about.heroTitle}
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-stone">
            {dict.about.heroText}
          </p>
        </div>
      </div>

      <Section>
        <div className="container-page grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label={dict.about.statDoors} value="4 200+" hint={dict.about.statDoorsHint} />
          <Stat label={dict.about.statYears} value="18" hint={dict.about.statYearsHint} />
          <Stat label={dict.about.statBrands} value="12" hint={dict.about.statBrandsHint} />
          <Stat label={dict.about.statTechnicians} value="24" hint={dict.about.statTechniciansHint} />
        </div>
      </Section>

      <Section tone="bone" className="border-y border-line">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              eyebrow={dict.about.approachEyebrow}
              title={dict.about.approachTitle}
              className="!mb-6"
            />
            <div className="space-y-5 text-[15px] leading-relaxed text-graphite">
              <p>{dict.about.approach1}</p>
              <p>{dict.about.approach2}</p>
              <p>{dict.about.approach3}</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { icon: Factory, title: dict.about.valueSupply, text: dict.about.valueSupplyText },
              { icon: Wrench, title: dict.about.valueTeam, text: dict.about.valueTeamText },
              { icon: Award, title: dict.about.valueWarranty, text: dict.about.valueWarrantyText },
              { icon: Users, title: dict.about.valueSupport, text: dict.about.valueSupportText },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="border border-line bg-paper p-5">
                <Icon size={20} className="text-gold-500" />
                <h3 className="mt-4 text-[15px] font-medium text-ink">{title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-stone">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div className="container-page">
          <SectionHeading eyebrow={dict.about.partnersEyebrow} title={dict.about.partnersTitle} />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {brands.map((b) => (
              <div key={b.id} className="border border-line bg-paper p-5">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-[16px] font-semibold tracking-tight text-ink">{b.name}</h3>
                  <span className="text-[11px] uppercase tracking-[0.14em] text-stone">
                    {countryName(b, dict)}
                  </span>
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-stone">{brandDescription(b, dict)}</p>
                <p className="mt-3 text-xs text-mist">
                  {dict.about.since.replace("{year}", String(b.founded))}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="bone" className="border-y border-line">
        <div className="container-page">
          <SectionHeading
            eyebrow={dict.about.teamEyebrow}
            title={dict.about.teamTitle}
            text={dict.about.teamText}
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {technicians.map((t) => (
              <div key={t.id} className="border border-line bg-paper p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sand text-sm font-semibold text-graphite">
                  {t.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")}
                </div>
                <h3 className="mt-4 text-[15px] font-medium text-ink">{t.name}</h3>
                <p className="mt-1 text-[13px] text-stone">{t.specialization.map((k) => specializationName(k, dict)).join(" · ")}</p>
                <p className="mt-3 text-xs text-mist">
                  {t.completedJobs} {dict.about.jobs} · ★ {t.rating}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div className="container-page">

          <div className="mt-8 flex flex-wrap gap-2">
            <ButtonLink href={r.contact}>{dict.nav.contact}</ButtonLink>
            <ButtonLink href={r.projects} variant="secondary">
              {dict.nav.projects}
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
