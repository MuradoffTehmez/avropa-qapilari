import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, locales } from "@/i18n";
import type { Locale } from "@/types";
import { Configurator } from "@/components/configurator/Configurator";
import { getProduct, products } from "@/mock/products";

export function generateStaticParams() {
  return locales.flatMap((locale) => products.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};

  return {
    title: `${product.name} — konfiqurator`,
    description: `${product.name} modelini ölçü, rəng, kilid və aksesuarlarla konfiqurasiya edin.`,
    robots: { index: false, follow: true },
  };
}

export default async function ConfiguratorProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale = (isLocale(raw) ? raw : "az") as Locale;
  const dict = getDictionary(locale);

  const product = getProduct(slug);
  if (!product) notFound();

  return <Configurator product={product} locale={locale} dict={dict} />;
}
