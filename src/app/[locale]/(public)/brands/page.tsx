import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getDictionary, isLocale } from "@/i18n";
import type { Locale } from "@/types";
import { routes } from "@/lib/routes";
import { Breadcrumbs, Section } from "@/components/ui/primitives";
import { brands } from "@/mock/taxonomy";
import { products } from "@/mock/products";
import { countryName } from "@/lib/i18n-format";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "az");

  return {
    title: dict.pageMeta.brands.title,
    description: dict.pageMeta.brands.description,
  };
}


export default async function BrandsPage({
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
          <Breadcrumbs items={[{ label: dict.nav.home, href: r.home }, { label: dict.nav.brands }]} />
          <h1 className="font-display mt-4 text-2xl font-semibold tracking-tight text-ink sm:text-3xl lg:text-[2.35rem]">
            {dict.nav.brands}
          </h1>
          <p className="mt-2 max-w-xl text-[15px] text-stone">{dict.home.brandsText}</p>
        </div>
      </div>

      <Section>
        <div className="container-page grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
          {brands.map((b) => {
            const count = products.filter((p) => p.brandSlug === b.slug).length;
            return (
              <Link
                key={b.id}
                href={r.brand(b.slug)}
                className="group flex flex-col border border-line bg-paper p-6 transition-colors hover:border-mist"
              >
                <div className="flex items-baseline justify-between">
                  <h2 className="text-xl font-semibold tracking-tight text-ink">{b.name}</h2>
                  <span className="text-[11px] uppercase tracking-[0.14em] text-stone">
                    {countryName(b, dict)}
                  </span>
                </div>
                <p className="mt-3 flex-1 text-[14px] leading-relaxed text-stone">{b.description}</p>
                <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                  <span className="text-[13px] text-graphite">
                    {count} model · {b.founded}-ci ildən
                  </span>
                  <ArrowRight size={15} className="text-gold-600" />
                </div>
              </Link>
            );
          })}
        </div>
      </Section>
    </>
  );
}
