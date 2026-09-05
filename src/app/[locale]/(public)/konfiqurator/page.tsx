import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getDictionary, isLocale } from "@/i18n";
import type { Locale } from "@/types";
import { routes } from "@/lib/routes";
import { Breadcrumbs, Section, SectionHeading } from "@/components/ui/primitives";
import { DoorVisual } from "@/components/product/DoorVisual";
import { products } from "@/mock/products";
import { categories } from "@/mock/taxonomy";
import { categoryName, priceFrom } from "@/lib/i18n-format";

export const metadata: Metadata = {
  title: "Qapı konfiquratoru",
  description:
    "Qapını addım-addım konfiqurasiya edin: ölçü, rəng, çərçivə, şüşə, dəstək, kilid, smart lock və aksesuar. Qiymət real vaxtda hesablanır.",
};

export default async function ConfiguratorIndexPage({
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
            items={[{ label: dict.nav.home, href: r.home }, { label: dict.configurator.title }]}
          />
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-ink sm:text-3xl lg:text-[2.35rem]">
            {dict.configurator.title}
          </h1>
          <p className="mt-2 max-w-xl text-[15px] text-stone">{dict.configurator.subtitle}</p>
        </div>
      </div>

      <Section className="!pt-10">
        <div className="container-page">
          <SectionHeading
            eyebrow="Addım 1"
            title={dict.configurator.chooseModel}
            text="Konfiqurasiyaya başlamaq üçün model seçin. Sonrakı addımlarda ölçü, rəng, kilid və aksesuarları seçəcəksiniz."
          />

          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={r.category(c.slug)}
                className="border border-line px-3 py-1.5 text-[13px] text-graphite transition-colors hover:border-ink hover:text-ink"
              >
                {categoryName(c, dict)}
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => (
              <Link
                key={p.id}
                href={r.configuratorFor(p.slug)}
                className="group flex flex-col border border-line bg-paper transition-colors hover:border-mist"
              >
                <div className="door-frame border-b border-line">
                  <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.03]">
                    <DoorVisual
                      panelHex={p.panelHexes[0]}
                      style={p.style}
                      glass={p.hasGlass ? "SATIN" : "NONE"}
                      widthMm={p.defaultWidth}
                      heightMm={p.defaultHeight}
                    />
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-stone">
                    {p.collection}
                  </p>
                  <h3 className="mt-1 text-[15px] font-medium text-ink">{p.name}</h3>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <span className="text-sm font-semibold text-ink">
                      {priceFrom(p.basePrice, locale, dict)}
                    </span>
                    <span className="flex items-center gap-1 text-[12px] font-medium text-gold-600">
                      {dict.actions.configure} <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
