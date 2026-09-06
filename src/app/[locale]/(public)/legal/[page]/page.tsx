import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getDictionary, isLocale, locales } from "@/i18n";
import type { Locale } from "@/types";
import { localeAlternates, routes } from "@/lib/routes";
import { formatDateLong } from "@/lib/utils";
import { Breadcrumbs, Section } from "@/components/ui/primitives";
import { legalPages, legalSlugs } from "@/mock/legal";

export function generateStaticParams() {
  return locales.flatMap((locale) => legalSlugs.map((slug) => ({ locale, page: slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; page: string }>;
}): Promise<Metadata> {
  const { locale: raw, page } = await params;
  const locale = (isLocale(raw) ? raw : "az") as Locale;
  const item = legalPages(locale).find((p) => p.slug === page);
  if (!item) return {};
  return {
    title: item.title,
    alternates: localeAlternates(`/legal/${page}`, locale),
  };
}

export default async function LegalPageView({
  params,
}: {
  params: Promise<{ locale: string; page: string }>;
}) {
  const { locale: raw, page } = await params;
  const locale = (isLocale(raw) ? raw : "az") as Locale;
  const dict = getDictionary(locale);
  const r = routes(locale);

  const item = legalPages(locale).find((p) => p.slug === page);
  if (!item) notFound();

  return (
    <>
      <div className="border-b border-line bg-bone">
        <div className="container-page py-8 sm:py-10">
          <Breadcrumbs
            items={[{ label: dict.nav.home, href: r.home }, { label: dict.footer.legal }, { label: item.title }]}
          />
          <h1 className="font-display mt-4 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            {item.title}
          </h1>
          <p className="mt-2 text-[13px] text-stone">
            {dict.common.lastUpdated}: {formatDateLong(item.updated)}
          </p>
        </div>
      </div>

      <Section>
        <div className="container-page">
          <article className="max-w-2xl space-y-8">
            {item.sections.map((s) => (
              <section key={s.heading}>
                <h2 className="text-lg font-semibold tracking-tight text-ink">{s.heading}</h2>
                <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-graphite">
                  {s.body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </section>
            ))}

          </article>
        </div>
      </Section>
    </>
  );
}
