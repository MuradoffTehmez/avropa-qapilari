import { parseSharedDesign } from "@/features/configurator/shared";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, locales } from "@/i18n";
import type { Locale } from "@/types";
import { Configurator } from "@/components/configurator/Configurator";
import {
  catalogOptionGroups,
  catalogProduct,
  catalogProducts,
  catalogSizePresets,
} from "@/server/catalog";

export async function generateStaticParams() {
  const products = await catalogProducts();
  return locales.flatMap((locale) => products.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = (isLocale(raw) ? raw : "az") as Locale;
  const dict = getDictionary(locale);
  const product = await catalogProduct(slug);
  if (!product) return {};

  return {
    title: `${product.name} — ${dict.configurator.title}`,
    description: dict.pageMeta.configurator.description,
    robots: { index: false, follow: true },
  };
}

export default async function ConfiguratorProductPage({
  params, searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ design?: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale = (isLocale(raw) ? raw : "az") as Locale;
  const dict = getDictionary(locale);

  const [product, groups, sizePresets] = await Promise.all([
    catalogProduct(slug),
    catalogOptionGroups(),
    catalogSizePresets(),
  ]);
  if (!product) notFound();

  const query = await searchParams;
  return (
    <Configurator
      initialSelection={parseSharedDesign(query.design, product)}
      product={product}
      groups={groups}
      sizePresets={sizePresets}
      locale={locale}
      dict={dict}
    />
  );
}
