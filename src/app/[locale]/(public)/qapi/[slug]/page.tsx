import { DocumentPreview } from "@/components/product/DocumentPreview";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Award,
  FileText,
  Flame,
  Hammer,
  Package,
  Ruler,
  ShieldCheck,
  Truck,
  Volume2,
} from "lucide-react";

import { getDictionary, isLocale, locales } from "@/i18n";
import type { Locale } from "@/types";
import { localeAlternates, routes } from "@/lib/routes";
import { formatDate, formatDimensions, formatPrice } from "@/lib/utils";
import { brand } from "@/config/brand";
import {
  Badge,
  Breadcrumbs,
  Card,
  DataRow,
  Rating,
  Section,
  SectionHeading,
} from "@/components/ui/primitives";
import { Accordion, Tabs } from "@/components/ui/disclosure";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductActions } from "@/components/product/ProductActions";
import { CertificateBadges } from "@/components/product/CertificateBadges";
import { StickyBuyBar } from "@/components/product/StickyBuyBar";
import { ProductCard } from "@/components/product/ProductCard";
import {
  catalogBrand,
  catalogCategories,
  catalogProduct,
  catalogProducts,
  relatedCatalogProducts,
} from "@/server/catalog";
import { localizedFaq } from "@/mock/content.i18n";
import { publishedReviews } from "@/server/reviews";
import { productOptionsForGroup } from "@/features/configurator/product-options";
import { optionText } from "@/mock/options.i18n";
import { categoryName, materialName, priceFrom, productDescription, productShort, styleName } from "@/lib/i18n-format";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, productSchema } from "@/lib/structured-data";

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
  const product = await catalogProduct(slug);
  if (!product) return {};

  const dict = getDictionary(locale);

  return {
    alternates: localeAlternates(`/qapi/${slug}`, locale),
    title: product.name,
    description: productShort(product, dict),
    openGraph: {
      title: `${product.name} — ${brand.name}`,
      description: productShort(product, dict),
    },
  };
}

/**
 * Səhifə statik qurulur, amma rəylər bazadan gəlir — moderasiya
 * dəyişikliyi bir dəqiqə ərzində özü görünsün deyə ISR.
 */
export const revalidate = 60;

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale = (isLocale(raw) ? raw : "az") as Locale;
  const dict = getDictionary(locale);
  const r = routes(locale);

  const product = await catalogProduct(slug);
  if (!product) notFound();

  const [categories, productBrand, related, allReviews] = await Promise.all([
    catalogCategories(),
    catalogBrand(product.brandSlug),
    relatedCatalogProducts(product),
    publishedReviews(locale),
  ]);
  const category = categories.find((item) => item.slug === product.categorySlug);
  const productReviews = allReviews.filter((rv) => rv.productName === product.name);

  const specGroups = Array.from(new Set(product.specs.map((s) => s.group)));


  return (
    <>
      <JsonLd
        data={[
          productSchema(product, productBrand ?? undefined, allReviews, locale, dict),
          breadcrumbSchema([
            { label: dict.nav.home, href: r.home },
            { label: dict.catalog.title, href: r.doors },
            ...(category
              ? [{ label: categoryName(category, dict), href: r.category(category.slug) }]
              : []),
            { label: product.name, href: r.product(product.slug) },
          ]),
        ]}
      />

      <div className="border-b border-line bg-bone">
        <div className="container-page py-5">
          <Breadcrumbs
            items={[
              { label: dict.nav.home, href: r.home },
              { label: dict.catalog.title, href: r.doors },
              ...(category
                ? [{ label: categoryName(category, dict), href: r.category(category.slug) }]
                : []),
              { label: product.name },
            ]}
          />
        </div>
      </div>

      {/* --------------------------------------------------- HERO BLOCK */}
      <div className="container-page grid gap-8 py-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14 lg:py-12">
        <ProductGallery product={product} />

        <div>
          <div className="flex flex-wrap items-center gap-2">
            {product.isNew && <Badge tone="dark">{dict.common.new}</Badge>}
            {product.onSale && <Badge tone="gold">{dict.common.sale}</Badge>}
            {product.isBestseller && <Badge tone="outline">{dict.common.bestseller}</Badge>}
            <Badge tone={product.inStock ? "success" : "neutral"}>
              {product.inStock ? dict.common.inStock : dict.common.madeToOrder}
            </Badge>
          </div>

          <h1 className="font-display mt-4 text-balance-heading text-2xl font-semibold leading-tight tracking-tight text-ink sm:text-3xl lg:text-[2.35rem]">
            {product.name}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-[13px] text-stone">
            <Rating value={product.rating} count={product.reviewCount} />
            <span>
              {dict.product.sku}: <span className="text-graphite">{product.sku}</span>
            </span>
            {productBrand && (
              <Link href={r.brand(productBrand.slug)} className="text-gold-600 hover:underline">
                {productBrand.name}
              </Link>
            )}
          </div>

          <p className="mt-5 text-[15px] leading-relaxed text-graphite">
            {productShort(product, dict)}
          </p>

          <div className="mt-6 flex items-end gap-3 border-y border-line py-5">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-stone">
                {dict.product.startingPrice}
              </p>
              <p className="mt-1 text-3xl font-semibold tracking-tight text-ink">
                {priceFrom(product.basePrice, locale, dict)}
              </p>
            </div>
            {product.oldPrice && (
              <p className="pb-1.5 text-base text-mist line-through">
                {formatPrice(product.oldPrice)}
              </p>
            )}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-[13px] sm:grid-cols-3">
            {product.securityClass !== "—" && (
              <KeySpec icon={ShieldCheck} label={dict.product.security} value={product.securityClass} />
            )}
            <KeySpec icon={Volume2} label={dict.product.soundInsulation} value={`${product.soundInsulationDb} dB`} />
            <KeySpec icon={Package} label={dict.catalog.material} value={materialName(product.material, dict)} />
            {product.fireRating && <KeySpec icon={Flame} label={dict.product.fireRating} value={product.fireRating} />}
            <KeySpec icon={Award} label={dict.product.warrantyPeriod} value={`${product.warrantyYears} ${dict.common.years}`} />
            <KeySpec
              icon={Truck}
              label={dict.product.delivery}
              value={`${product.deliveryDays[0]}–${product.deliveryDays[1]} ${dict.common.days}`}
            />
          </div>

          <CertificateBadges product={product} dict={dict} className="mt-6" />

          <div id="product-actions" className="mt-7 scroll-mt-24">
            <ProductActions product={product} locale={locale} dict={dict} />
          </div>

          <div className="mt-6 space-y-2 border-t border-line pt-5 text-[13px] text-stone">
            <p className="flex items-center gap-2">
              <Ruler size={14} className="text-gold-500" />
              {dict.product.freeMeasurement}{" "}
              <Link href={r.measurement} className="text-gold-600 underline-offset-2 hover:underline">
                {dict.product.freeMeasurementLink}
              </Link>
            </p>
            <p className="flex items-center gap-2">
              <Hammer size={14} className="text-gold-500" />
              {dict.product.certifiedInstallation}
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------- TABS */}
      <div className="container-page pb-14">
        <Tabs
          tabs={[
            {
              id: "overview",
              label: dict.product.tabs.overview,
              content: (
                <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
                  <div className="max-w-2xl space-y-4 text-[15px] leading-relaxed text-graphite">
                    <p>{productDescription(product, dict)}</p>
                    <p>
                      {dict.product.styleAndCategory
                        .replace("{style}", styleName(product.style, dict).toLowerCase())
                        .replace(
                          "{category}",
                          category ? categoryName(category, dict).toLowerCase() : "",
                        )}
                    </p>
                  </div>
                  <Card className="h-fit p-5">
                    <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone">
                      {dict.product.quickFacts}
                    </h2>
                    <dl>
                      <DataRow label={dict.product.brand} value={productBrand?.name ?? "—"} />
                      <DataRow label={dict.product.collection} value={product.collection} />
                      <DataRow label={dict.product.style} value={styleName(product.style, dict)} />
                      <DataRow label={dict.product.availability} value={product.inStock ? dict.common.inStock : dict.common.madeToOrder} />
                      <DataRow label={dict.product.warrantyPeriod} value={`${product.warrantyYears} ${dict.common.years}`} />
                    </dl>
                  </Card>
                </div>
              ),
            },
            {
              id: "specs",
              label: dict.product.tabs.specs,
              content: (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {specGroups.map((group) => (
                    <div key={group}>
                      <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone">
                        {group}
                      </h2>
                      <dl>
                        {product.specs
                          .filter((s) => s.group === group)
                          .map((s) => (
                            <DataRow key={s.label} label={s.label} value={s.value} />
                          ))}
                      </dl>
                    </div>
                  ))}
                </div>
              ),
            },
            {
              id: "dimensions",
              label: dict.product.tabs.dimensions,
              content: (
                <div className="grid gap-6 sm:grid-cols-2 lg:max-w-3xl">
                  <Card className="p-5">
                    <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone">
                      {dict.product.standardSize}
                    </h2>
                    <p className="text-2xl font-semibold tracking-tight text-ink">
                      {formatDimensions(product.defaultWidth, product.defaultHeight)}
                    </p>
                    <p className="mt-2 text-[13px] text-stone">{dict.product.stockSize}</p>
                  </Card>
                  <Card className="p-5">
                    <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone">
                      {dict.product.customSizeRange}
                    </h2>
                    <dl>
                      <DataRow label={dict.product.width} value={`${product.minWidth}–${product.maxWidth} mm`} />
                      <DataRow label={dict.product.height} value={`${product.minHeight}–${product.maxHeight} mm`} />
                    </dl>
                    <p className="mt-3 text-[13px] text-stone">
                      {dict.product.outOfRangeBefore}{" "}
                      <Link href={r.quote} className="text-gold-600 underline-offset-2 hover:underline">
                        {dict.product.outOfRangeLink}
                      </Link>{" "}
                      {dict.product.outOfRangeAfter}
                    </p>
                  </Card>
                </div>
              ),
            },
            {
              id: "colors",
              label: dict.product.tabs.colors,
              content: (
                <div>
                  <p className="mb-5 max-w-xl text-[15px] text-graphite">
                    {dict.product.colorsHint}
                  </p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
                    {productOptionsForGroup(product, "OUTSIDE_COLOR").map((c) => {
                      const text = optionText(c, locale);
                      return <div key={c.id} className="border border-line">
                        <div className="h-20" style={{ background: c.swatch ?? c.hex }} />
                        <div className="p-2.5">
                          <p className="text-[13px] font-medium text-ink">{text.label}</p>
                          <p className="text-xs text-stone">
                            {c.priceDelta === 0 ? dict.common.base : `+${formatPrice(c.priceDelta)}`}
                          </p>
                        </div>
                      </div>;
                    })}
                  </div>
                </div>
              ),
            },
            {
              id: "locks",
              label: dict.product.tabs.locks,
              content: (
                <div className="grid gap-4 sm:grid-cols-2 lg:max-w-4xl">
                  {[...productOptionsForGroup(product, "LOCK"), ...productOptionsForGroup(product, "SMART_LOCK")]
                    .filter((v) => v.code !== "NONE")
                    .map((lock) => {
                      const text = optionText(lock, locale);
                      return <Card key={lock.id} className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-[15px] font-medium text-ink">{text.label}</h3>
                            {text.description && (
                              <p className="mt-1 text-[13px] text-stone">{text.description}</p>
                            )}
                          </div>
                          <p className="shrink-0 text-sm font-medium tabular-nums text-graphite">
                            {lock.priceDelta === 0 ? dict.common.base : `+${formatPrice(lock.priceDelta)}`}
                          </p>
                        </div>
                      </Card>;
                    })}
                </div>
              ),
            },
            {
              id: "installation",
              label: dict.product.tabs.installation,
              content: (
                <div className="grid gap-4 sm:grid-cols-3 lg:max-w-4xl">
                  {productOptionsForGroup(product, "INSTALLATION").map((v) => {
                    const text = optionText(v, locale);
                    return <Card key={v.id} className="p-5">
                      <h3 className="text-[15px] font-medium text-ink">{text.label}</h3>
                      {text.description && <p className="mt-1.5 text-[13px] text-stone">{text.description}</p>}
                      <p className="mt-4 text-lg font-semibold text-ink">
                        {v.priceDelta === 0 ? dict.common.free : formatPrice(v.priceDelta)}
                      </p>
                    </Card>;
                  })}
                </div>
              ),
            },
            {
              id: "delivery",
              label: dict.product.tabs.delivery,
              content: (
                <div className="max-w-2xl space-y-4 text-[15px] leading-relaxed text-graphite">
                  <p>
                    {dict.product.deliveryBefore}{" "}
                    <strong className="text-ink">
                      {product.deliveryDays[0]}–{product.deliveryDays[1]} {dict.common.businessDays}
                    </strong>
                    {" "}{dict.product.deliveryAfter}
                  </p>
                  <dl className="border-t border-line">
                    {productOptionsForGroup(product, "DELIVERY").map((v) => (
                      <DataRow
                        key={v.id}
                        label={optionText(v, locale).label}
                        value={v.priceDelta === 0 ? dict.common.free : formatPrice(v.priceDelta)}
                      />
                    ))}
                  </dl>
                </div>
              ),
            },
            {
              id: "warranty",
              label: dict.product.tabs.warranty,
              content: (
                <div className="max-w-2xl space-y-4 text-[15px] leading-relaxed text-graphite">
                  <p>
                    {dict.product.warrantyBefore}{" "}
                    <strong className="text-ink">{product.warrantyYears} {dict.common.years}</strong>{" "}
                    {dict.product.warrantyAfter}
                  </p>
                  <p>{dict.product.warrantyQr}</p>
                  <p className="text-[13px] text-stone">{dict.product.warrantyExclusions}</p>
                </div>
              ),
            },
            {
              id: "documents",
              label: dict.product.tabs.documents,
              content: (
                <div className="grid gap-3 sm:grid-cols-2 lg:max-w-3xl">
                  {product.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between gap-4 border border-line bg-paper p-4"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <FileText size={18} className="shrink-0 text-gold-500" />
                        <div className="min-w-0">
                          <p className="truncate text-[14px] font-medium text-ink">{doc.title}</p>
                          <p className="text-xs text-stone">PDF · {doc.sizeKb} KB</p>
                        </div>
                      </div>
                      <DocumentPreview
                        title={doc.title}
                        model={product.name}
                        details={`${product.sku} · ${product.defaultWidth}×${product.defaultHeight} mm · ${product.securityClass} · ${product.warrantyYears} ${dict.common.years} ${dict.common.warranty}`}
                        downloadLabel={dict.actions.download}
                      />
                    </div>
                  ))}
                  <p className="text-xs text-stone sm:col-span-2">
                  </p>
                </div>
              ),
            },
            {
              id: "localizedReviews(locale)",
              label: `${dict.product.tabs.reviews}${productReviews.length ? ` (${productReviews.length})` : ""}`,
              content:
                productReviews.length > 0 ? (
                  <div className="grid gap-4 lg:max-w-4xl lg:grid-cols-2">
                    {productReviews.map((rv) => (
                      <Card key={rv.id} className="p-5">
                        <div className="flex items-center justify-between">
                          <Rating value={rv.rating} />
                          {rv.verified && <Badge tone="success">{dict.product.verifiedReview}</Badge>}
                        </div>
                        <p className="mt-3 text-[14px] leading-relaxed text-graphite">{rv.text}</p>
                        <p className="mt-4 text-xs text-stone">
                          {rv.author} · {rv.city} · {formatDate(rv.date)}
                        </p>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-[15px] text-stone">
                    {dict.product.noVerifiedReviews}
                  </p>
                ),
            },
            {
              id: "localizedFaq(locale)",
              label: dict.product.tabs.faq,
              content: (
                <Accordion
                  className="lg:max-w-3xl"
                  items={localizedFaq(locale).slice(0, 5).map((f) => ({ id: f.id, title: f.question, content: f.answer }))}
                />
              ),
            },
          ]}
        />
      </div>

      <StickyBuyBar product={product} locale={locale} dict={dict} />

      {/* ---------------------------------------------------- RELATED */}
      {related.length > 0 && (
        <Section tone="bone" className="border-t border-line">
          <div className="container-page">
            <SectionHeading title={dict.product.similar} />
            <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} locale={locale} dict={dict} />
              ))}
            </div>
          </div>
        </Section>
      )}
    </>
  );
}

function KeySpec({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon size={15} className="mt-0.5 shrink-0 text-stone" />
      <div>
        <p className="text-[11px] uppercase tracking-[0.1em] text-stone">{label}</p>
        <p className="font-medium text-ink">{value}</p>
      </div>
    </div>
  );
}
