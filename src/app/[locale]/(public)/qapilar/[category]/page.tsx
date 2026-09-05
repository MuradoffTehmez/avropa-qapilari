import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, locales } from "@/i18n";
import type { Locale } from "@/types";
import { routes } from "@/lib/routes";
import { Breadcrumbs } from "@/components/ui/primitives";
import { CatalogView } from "@/components/product/CatalogView";
import { products } from "@/mock/products";
import { categories, getCategory } from "@/mock/taxonomy";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    categories.map((c) => ({ locale, category: c.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) return {};

  return {
    title: cat.name,
    description: cat.description,
    alternates: { canonical: `/az/qapilar/${cat.slug}` },
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
              { label: cat.name },
            ]}
          />
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-ink sm:text-3xl lg:text-[2.35rem]">
            {cat.name}
          </h1>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-stone">
            {cat.description}
          </p>
        </div>
      </div>

      <div className="pt-8">
        <CatalogView products={list} locale={locale} dict={dict} lockedCategory={cat.slug} />
      </div>
    </>
  );
}
