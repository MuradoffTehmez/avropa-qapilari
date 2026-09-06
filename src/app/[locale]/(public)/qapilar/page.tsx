import type { Metadata } from "next";
import { getDictionary, isLocale } from "@/i18n";
import type { Locale } from "@/types";
import { routes } from "@/lib/routes";
import { Breadcrumbs } from "@/components/ui/primitives";
import { CatalogView } from "@/components/product/CatalogView";
import { products } from "@/mock/products";

export const metadata: Metadata = {
  title: "Qapı kataloqu",
  description:
    "Avropa istehsalı giriş, villa, otaq, təhlükəsizlik və smart qapılar. Filtr, müqayisə və onlayn konfiqurasiya.",
};

export default async function CatalogPage({
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
          <Breadcrumbs
            items={[{ label: dict.nav.home, href: r.home }, { label: dict.catalog.title }]}
          />
          <h1 className="font-display mt-4 text-2xl font-semibold tracking-tight text-ink sm:text-3xl lg:text-[2.35rem]">
            {dict.catalog.title}
          </h1>
          <p className="mt-2 max-w-xl text-[15px] text-stone">{dict.catalog.subtitle}</p>
        </div>
      </div>

      <div className="pt-8">
        <CatalogView products={products} locale={locale} dict={dict} />
      </div>
    </>
  );
}
