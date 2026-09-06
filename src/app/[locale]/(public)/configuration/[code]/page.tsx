import type { Metadata } from "next";
import { Suspense } from "react";
import { getDictionary, isLocale } from "@/i18n";
import type { Locale } from "@/types";
import { routes } from "@/lib/routes";
import { Breadcrumbs, Skeleton } from "@/components/ui/primitives";
import { SharedConfiguration } from "@/components/configurator/SharedConfiguration";

export const metadata: Metadata = {
  title: "Paylaşılan konfiqurasiya",
  robots: { index: false, follow: false },
};

export default async function SharedConfigurationPage({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}) {
  const { locale: raw, code } = await params;
  const locale = (isLocale(raw) ? raw : "az") as Locale;
  const dict = getDictionary(locale);
  const r = routes(locale);

  return (
    <>
      <div className="border-b border-line bg-bone">
        <div className="container-page py-6 sm:py-8">
          <Breadcrumbs
            items={[
              { label: dict.nav.home, href: r.home },
              { label: dict.nav.configurator, href: r.configurator },
              { label: code },
            ]}
          />
        </div>
      </div>

      <Suspense
        fallback={
          <div className="container-page grid gap-8 py-10 lg:grid-cols-2">
            <Skeleton className="aspect-3/4 max-w-sm" />
            <Skeleton className="h-80" />
          </div>
        }
      >
        <SharedConfiguration code={code} locale={locale} dict={dict} />
      </Suspense>
    </>
  );
}
