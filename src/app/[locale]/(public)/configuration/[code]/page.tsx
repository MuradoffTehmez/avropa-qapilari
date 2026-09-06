import type { Metadata } from "next";
import { Suspense } from "react";
import { getDictionary, isLocale } from "@/i18n";
import type { Locale } from "@/types";
import { routes } from "@/lib/routes";
import { Breadcrumbs, Skeleton } from "@/components/ui/primitives";
import { SharedConfiguration } from "@/components/configurator/SharedConfiguration";
import { db } from "@/server/db";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "az");

  return {
    title: dict.pageMeta.sharedConfiguration.title,
    robots: { index: false, follow: false },
  };
}


export default async function SharedConfigurationPage({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}) {
  const { locale: raw, code } = await params;
  const locale = (isLocale(raw) ? raw : "az") as Locale;
  const dict = getDictionary(locale);
  const r = routes(locale);

  // Kod bazada varsa seçimlər və məbləğ serverdən gəlir; yoxdursa
  // komponent köhnə sorğu-parametrli linki oxumağa çalışır.
  const record = await db.configuration.findUnique({
    where: { code },
    include: { product: true },
  });

  const saved = record
    ? {
        productSlug: record.product.slug,
        width: record.width,
        height: record.height,
        choices: JSON.parse(record.choices) as Record<string, string | string[]>,
        total: record.total,
      }
    : null;

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
        <SharedConfiguration code={code} locale={locale} dict={dict} saved={saved} />
      </Suspense>
    </>
  );
}
