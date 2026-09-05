import type { Metadata } from "next";
import { getDictionary, isLocale } from "@/i18n";
import type { Locale } from "@/types";
import { routes } from "@/lib/routes";
import { Breadcrumbs } from "@/components/ui/primitives";
import { CheckoutView } from "@/components/cart/CheckoutView";

export const metadata: Metadata = {
  title: "Sifarişin rəsmiləşdirilməsi",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage({
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
        <div className="container-page py-8">
          <Breadcrumbs
            items={[
              { label: dict.nav.home, href: r.home },
              { label: dict.cart.title, href: r.cart },
              { label: dict.checkout.title },
            ]}
          />
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            {dict.checkout.title}
          </h1>
        </div>
      </div>
      <CheckoutView locale={locale} dict={dict} />
    </>
  );
}
