import type { Metadata } from "next";
import { getDictionary, isLocale } from "@/i18n";
import type { Locale } from "@/types";
import { localeAlternates, routes } from "@/lib/routes";
import { Accordion } from "@/components/ui/disclosure";
import { Breadcrumbs, Section } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/Button";
import { localizedFaq } from "@/mock/content.i18n";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqSchema } from "@/lib/structured-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "az");

  return {
    alternates: localeAlternates("/faq", isLocale(locale) ? locale : "az"),
    title: dict.pageMeta.faq.title,
    description: dict.pageMeta.faq.description,
  };
}


export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "az") as Locale;
  const dict = getDictionary(locale);
  const r = routes(locale);

  const groups = Array.from(new Set(localizedFaq(locale).map((f) => f.group)));


  return (
    <>
      <JsonLd
        data={[
          faqSchema(localizedFaq(locale)),
          breadcrumbSchema([
            { label: dict.nav.home, href: r.home },
            { label: dict.nav.faq, href: r.faq },
          ]),
        ]}
      />

      <div className="border-b border-line bg-bone">
        <div className="container-page py-8 sm:py-10">
          <Breadcrumbs items={[{ label: dict.nav.home, href: r.home }, { label: dict.nav.faq }]} />
          <h1 className="font-display mt-4 text-2xl font-semibold tracking-tight text-ink sm:text-3xl lg:text-[2.35rem]">
            {dict.home.faqTitle}
          </h1>
        </div>
      </div>

      <Section>
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <div className="desktop-sticky-panel">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone">
              {dict.common.sections}
            </p>
            <ul className="space-y-2 text-[14px] text-graphite">
              {groups.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>

            <div className="mt-8 border border-line bg-bone p-5">
              <p className="text-[14px] font-medium text-ink">{dict.common.noAnswerFound}</p>
              <p className="mt-1.5 text-[13px] text-stone">{dict.common.operatorHelp}</p>
              <ButtonLink href={r.contact} size="sm" className="mt-4">
                {dict.nav.contact}
              </ButtonLink>
            </div>
          </div>

          <div className="space-y-10">
            {groups.map((group) => (
              <div key={group}>
                <h2 className="mb-4 text-lg font-semibold tracking-tight text-ink">{group}</h2>
                <Accordion
                  items={localizedFaq(locale)
                    .filter((f) => f.group === group)
                    .map((f) => ({ id: f.id, title: f.question, content: f.answer }))}
                />
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
