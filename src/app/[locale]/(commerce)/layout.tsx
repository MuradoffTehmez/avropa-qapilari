import { getDictionary, isLocale } from "@/i18n";
import type { Locale } from "@/types";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { catalogBrands, catalogCategories, catalogProducts } from "@/server/catalog";

export default async function CommerceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typed = (isLocale(locale) ? locale : "az") as Locale;
  const dict = getDictionary(typed);
  const [products, categories, brands] = await Promise.all([
    catalogProducts(),
    catalogCategories(),
    catalogBrands(),
  ]);

  return (
    <div className="flex min-h-dvh flex-col">
      <Header locale={typed} dict={dict} products={products} categories={categories} brands={brands} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer locale={typed} dict={dict} categories={categories} />
    </div>
  );
}
