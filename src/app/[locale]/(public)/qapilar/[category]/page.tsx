import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, locales } from "@/i18n";
import type { Locale } from "@/types";
import { localeAlternates, routes } from "@/lib/routes";
import { Breadcrumbs } from "@/components/ui/primitives";
import { CatalogView } from "@/components/product/CatalogView";
import { products } from "@/mock/products";
import { categories, getCategory } from "@/mock/taxonomy";
import { categoryDescription, categoryName } from "@/lib/i18n-format";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    categories.map((c) => ({ locale, category: c.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { locale: raw, category } = await params;
  const locale = (isLocale(raw) ? raw : "az") as Locale;
  const cat = getCategory(category);
  if (!cat) return {};

  const dict = getDictionary(locale);
  return {
    title: categoryName(cat, dict),
    description: categoryDescription(cat, dict),
    alternates: localeAlternates(`/qapilar/${category}`, locale),
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale: raw, category } = await params;
  const locale = (isLocale(raw) ? raw : "az") as Locale;
  const dict = getDictionary(locale);
  const r = routes(locale);

  const cat = getCategory(category);
  if (!cat) notFound();

  const list = products.filter((p) => p.categorySlug === cat.slug);

  return (
    <>
      <div className="border-b border-line bg-bone">
        <div className="container-page py-8 sm:py-10">
          <Breadcrumbs
            items={[
              { label: dict.nav.home, href: r.home },
              { label: dict.catalog.title, href: r.doors },
              { label: categoryName(cat, dict) },
            ]}
          />
          <h1 className="font-display mt-4 text-2xl font-semibold tracking-tight text-ink sm:text-3xl lg:text-[2.35rem]">
            {categoryName(cat, dict)}
          </h1>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-stone">
            {categoryDescription(cat, dict)}
          </p>
        </div>
      </div>

      <div className="pt-8">
        <CatalogView products={list} locale={locale} dict={dict} lockedCategory={cat.slug} />
      </div>
    </>
  );
}
