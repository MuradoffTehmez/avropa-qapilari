import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getDictionary, isLocale, locales } from "@/i18n";
import type { Locale } from "@/types";
import { localeAlternates, routes } from "@/lib/routes";
import { Breadcrumbs, Section, Stat } from "@/components/ui/primitives";
import { ProductCard } from "@/components/product/ProductCard";
import { brands, getBrand } from "@/mock/taxonomy";
import { products } from "@/mock/products";
import { brandDescription, countryName } from "@/lib/i18n-format";
import { formatPrice } from "@/lib/utils";

export function generateStaticParams() {
  return locales.flatMap((locale) => brands.map((b) => ({ locale, slug: b.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = (isLocale(raw) ? raw : "az") as Locale;
  const b = getBrand(slug);
  if (!b) return {};

  const dict = getDictionary(locale);
  return {
    title: b.name,
    description: brandDescription(b, dict),
    alternates: localeAlternates(`/brands/${slug}`, locale),
  };
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale = (isLocale(raw) ? raw : "az") as Locale;
  const dict = getDictionary(locale);
  const r = routes(locale);

  const b = getBrand(slug);
  if (!b) notFound();

  const list = products.filter((p) => p.brandSlug === b.slug);
  const avgRating =
    list.length > 0 ? list.reduce((s, p) => s + p.rating, 0) / list.length : 0;
  const minPrice = list.length > 0 ? Math.min(...list.map((p) => p.basePrice)) : 0;

  return (
    <>
      <div className="border-b border-line bg-bone">
        <div className="container-page py-8 sm:py-10">
          <Breadcrumbs
            items={[
              { label: dict.nav.home, href: r.home },
              { label: dict.nav.brands, href: r.brands },
              { label: b.name },
            ]}
          />
          <h1 className="font-display mt-4 text-2xl font-semibold tracking-tight text-ink sm:text-3xl lg:text-[2.35rem]">
            {b.name}
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-stone">{brandDescription(b, dict)}</p>

          <div className="mt-8 grid grid-cols-2 gap-6 border-t border-line pt-6 sm:grid-cols-4">
            <Stat label={dict.about.country} value={countryName(b, dict)} />
            <Stat label={dict.about.founded} value={b.founded} />
            <Stat label={dict.common.model} value={list.length} />
            <Stat label={dict.projectDetail.averageRating} value={avgRating.toFixed(1)} hint={`${formatPrice(minPrice)} ${dict.common.from}`} />
          </div>
        </div>
      </div>

      <Section>
        <div className="container-page">
          <h2 className="mb-6 text-lg font-semibold tracking-tight text-ink">
            {b.name} {dict.projectDetail.models}
          </h2>
          <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            {list.map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} dict={dict} />
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
