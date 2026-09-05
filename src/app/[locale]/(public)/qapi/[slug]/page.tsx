import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Award,
  Download,
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
import { routes } from "@/lib/routes";
import { formatDate, formatDimensions, formatPrice, formatPriceFrom } from "@/lib/utils";
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
import { ProductCard } from "@/components/product/ProductCard";
import { getProduct, getRelatedProducts, materialLabels, products, styleLabels } from "@/mock/products";
import { getBrand, getCategory } from "@/mock/taxonomy";
import { faq, reviews } from "@/mock/content";
import { optionGroups } from "@/mock/options";

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
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} — ${brand.name}`,
      description: product.shortDescription,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale = (isLocale(raw) ? raw : "az") as Locale;
  const dict = getDictionary(locale);
  const r = routes(locale);

  const product = getProduct(slug);
  if (!product) notFound();

  const category = getCategory(product.categorySlug);
  const productBrand = getBrand(product.brandSlug);
  const related = getRelatedProducts(product);
  const productReviews = reviews.filter((rv) => rv.productName === product.name);

  const specGroups = Array.from(new Set(product.specs.map((s) => s.group)));

  /** PRD §108 — structured data */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    description: product.shortDescription,
    brand: { "@type": "Brand", name: productBrand?.name ?? brand.name },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
    offers: {
      "@type": "Offer",
      price: product.basePrice,
      priceCurrency: "AZN",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/PreOrder",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="border-b border-line bg-bone">
        <div className="container-page py-5">
          <Breadcrumbs
            items={[
              { label: "Ana səhifə", href: r.home },
              { label: dict.catalog.title, href: r.doors },
              ...(category ? [{ label: category.name, href: r.category(category.slug) }] : []),
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
            {product.isNew && <Badge tone="dark">Yeni</Badge>}
            {product.onSale && <Badge tone="brass">Endirim</Badge>}
            {product.isBestseller && <Badge tone="outline">Bestseller</Badge>}
            <Badge tone={product.inStock ? "success" : "neutral"}>
              {product.inStock ? dict.common.inStock : dict.common.madeToOrder}
            </Badge>
          </div>

          <h1 className="mt-4 text-balance-heading text-2xl font-semibold leading-tight tracking-tight text-ink sm:text-3xl lg:text-[2.35rem]">
            {product.name}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-[13px] text-stone">
            <Rating value={product.rating} count={product.reviewCount} />
            <span>
              {dict.product.sku}: <span className="text-graphite">{product.sku}</span>
            </span>
            {productBrand && (
              <Link href={r.brand(productBrand.slug)} className="text-brass-600 hover:underline">
                {productBrand.name}
              </Link>
            )}
          </div>

          <p className="mt-5 text-[15px] leading-relaxed text-graphite">
            {product.shortDescription}
          </p>

          <div className="mt-6 flex items-end gap-3 border-y border-line py-5">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-stone">
                {dict.product.startingPrice}
              </p>
              <p className="mt-1 text-3xl font-semibold tracking-tight text-ink">
                {formatPriceFrom(product.basePrice)}
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
              <KeySpec icon={ShieldCheck} label="Təhlükəsizlik" value={product.securityClass} />
            )}
            <KeySpec icon={Volume2} label="Səs izolyasiyası" value={`${product.soundInsulationDb} dB`} />
            <KeySpec icon={Package} label="Material" value={materialLabels[product.material]} />
            {product.fireRating && <KeySpec icon={Flame} label="Yanğın" value={product.fireRating} />}
            <KeySpec icon={Award} label="Zəmanət" value={`${product.warrantyYears} il`} />
            <KeySpec
              icon={Truck}
              label="Çatdırılma"
              value={`${product.deliveryDays[0]}–${product.deliveryDays[1]} gün`}
            />
          </div>

          <div className="mt-7">
            <ProductActions product={product} locale={locale} dict={dict} />
          </div>

          <div className="mt-6 space-y-2 border-t border-line pt-5 text-[13px] text-stone">
            <p className="flex items-center gap-2">
              <Ruler size={14} className="text-brass-500" />
              Pulsuz ölçü xidməti —{" "}
              <Link href={r.measurement} className="text-brass-600 underline-offset-2 hover:underline">
                usta çağır
              </Link>
            </p>
            <p className="flex items-center gap-2">
              <Hammer size={14} className="text-brass-500" />
              Sertifikatlı quraşdırma 120 AZN-dən
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
                    <p>{product.description}</p>
                    <p>
                      Model {styleLabels[product.style].toLowerCase()} stildə hazırlanıb və{" "}
                      {category?.name.toLowerCase()} qrupuna aiddir. Konfiquratorda xarici və daxili
                      rəngi ayrıca seçmək, kilid sistemini gücləndirmək və smart lock əlavə etmək
                      mümkündür.
                    </p>
                  </div>
                  <Card className="h-fit p-5">
                    <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone">
                      Qısa məlumat
                    </h3>
                    <dl>
                      <DataRow label={dict.product.brand} value={productBrand?.name ?? "—"} />
                      <DataRow label="Kolleksiya" value={product.collection} />
                      <DataRow label="Stil" value={styleLabels[product.style]} />
                      <DataRow label={dict.product.availability} value={product.inStock ? dict.common.inStock : dict.common.madeToOrder} />
                      <DataRow label={dict.product.warrantyPeriod} value={`${product.warrantyYears} il`} />
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
                      <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone">
                        {group}
                      </h3>
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
                    <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone">
                      Standart ölçü
                    </h3>
                    <p className="text-2xl font-semibold tracking-tight text-ink">
                      {formatDimensions(product.defaultWidth, product.defaultHeight)}
                    </p>
                    <p className="mt-2 text-[13px] text-stone">Anbarda saxlanılan ölçü.</p>
                  </Card>
                  <Card className="p-5">
                    <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone">
                      Fərdi ölçü aralığı
                    </h3>
                    <dl>
                      <DataRow label="En" value={`${product.minWidth}–${product.maxWidth} mm`} />
                      <DataRow label="Hündürlük" value={`${product.minHeight}–${product.maxHeight} mm`} />
                    </dl>
                    <p className="mt-3 text-[13px] text-stone">
                      Aralıqdan kənar ölçülər üçün{" "}
                      <Link href={r.quote} className="text-brass-600 underline-offset-2 hover:underline">
                        fərdi qiymət təklifi
                      </Link>{" "}
                      tələb olunur.
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
                    Xarici və daxili rəng ayrıca seçilir. Aşağıdakı rənglər konfiquratorda mövcuddur.
                  </p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
                    {optionGroups.OUTSIDE_COLOR.values.map((c) => (
                      <div key={c.id} className="border border-line">
                        <div className="h-20" style={{ background: c.swatch ?? c.hex }} />
                        <div className="p-2.5">
                          <p className="text-[13px] font-medium text-ink">{c.label}</p>
                          <p className="text-xs text-stone">
                            {c.priceDelta === 0 ? "Baza" : `+${formatPrice(c.priceDelta)}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            },
            {
              id: "locks",
              label: dict.product.tabs.locks,
              content: (
                <div className="grid gap-4 sm:grid-cols-2 lg:max-w-4xl">
                  {[...optionGroups.LOCK.values, ...optionGroups.SMART_LOCK.values]
                    .filter((v) => v.code !== "NONE")
                    .map((lock) => (
                      <Card key={lock.id} className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-[15px] font-medium text-ink">{lock.label}</h3>
                            {lock.description && (
                              <p className="mt-1 text-[13px] text-stone">{lock.description}</p>
                            )}
                          </div>
                          <p className="shrink-0 text-sm font-medium tabular-nums text-graphite">
                            {lock.priceDelta === 0 ? "Baza" : `+${formatPrice(lock.priceDelta)}`}
                          </p>
                        </div>
                      </Card>
                    ))}
                </div>
              ),
            },
            {
              id: "installation",
              label: dict.product.tabs.installation,
              content: (
                <div className="grid gap-4 sm:grid-cols-3 lg:max-w-4xl">
                  {optionGroups.INSTALLATION.values.map((v) => (
                    <Card key={v.id} className="p-5">
                      <h3 className="text-[15px] font-medium text-ink">{v.label}</h3>
                      {v.description && <p className="mt-1.5 text-[13px] text-stone">{v.description}</p>}
                      <p className="mt-4 text-lg font-semibold text-ink">
                        {v.priceDelta === 0 ? dict.common.free : formatPrice(v.priceDelta)}
                      </p>
                    </Card>
                  ))}
                </div>
              ),
            },
            {
              id: "delivery",
              label: dict.product.tabs.delivery,
              content: (
                <div className="max-w-2xl space-y-4 text-[15px] leading-relaxed text-graphite">
                  <p>
                    Bu model üçün təxmini çatdırılma müddəti{" "}
                    <strong className="text-ink">
                      {product.deliveryDays[0]}–{product.deliveryDays[1]} iş günü
                    </strong>
                    dir.
                  </p>
                  <dl className="border-t border-line">
                    {optionGroups.DELIVERY.values.map((v) => (
                      <DataRow
                        key={v.id}
                        label={v.label}
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
                    Zəmanət müddəti{" "}
                    <strong className="text-ink">{product.warrantyYears} il</strong> təşkil edir və
                    quraşdırma tarixindən başlayır.
                  </p>
                  <p>
                    Hər qapıya unikal serial nömrə verilir. Serial nömrə üzərindəki QR kod vasitəsilə
                    zəmanət statusunu və servis tarixçəsini istənilən vaxt yoxlaya bilərsiniz.
                  </p>
                  <p className="text-[13px] text-stone">
                    Zəmanət mexaniki zədələr, düzgün olmayan istismar və üçüncü tərəf müdaxiləsini
                    əhatə etmir.
                  </p>
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
                        <FileText size={18} className="shrink-0 text-brass-500" />
                        <div className="min-w-0">
                          <p className="truncate text-[14px] font-medium text-ink">{doc.title}</p>
                          <p className="text-xs text-stone">PDF · {doc.sizeKb} KB</p>
                        </div>
                      </div>
                      <span
                        title="Sənədlər backend mərhələsində R2-dən veriləcək"
                        className="flex shrink-0 items-center gap-1.5 text-[13px] text-mist"
                      >
                        <Download size={14} /> {dict.actions.download}
                      </span>
                    </div>
                  ))}
                  <p className="text-xs text-stone sm:col-span-2">
                    Sənədlər backend mərhələsində Cloudflare R2-dən signed link ilə veriləcək.
                  </p>
                </div>
              ),
            },
            {
              id: "reviews",
              label: `${dict.product.tabs.reviews}${productReviews.length ? ` (${productReviews.length})` : ""}`,
              content:
                productReviews.length > 0 ? (
                  <div className="grid gap-4 lg:max-w-4xl lg:grid-cols-2">
                    {productReviews.map((rv) => (
                      <Card key={rv.id} className="p-5">
                        <div className="flex items-center justify-between">
                          <Rating value={rv.rating} />
                          {rv.verified && <Badge tone="success">Təsdiqlənib</Badge>}
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
                    Bu model üçün hələ təsdiqlənmiş rəy yoxdur.
                  </p>
                ),
            },
            {
              id: "faq",
              label: dict.product.tabs.faq,
              content: (
                <Accordion
                  className="lg:max-w-3xl"
                  items={faq.slice(0, 5).map((f) => ({ id: f.id, title: f.question, content: f.answer }))}
                />
              ),
            },
          ]}
        />
      </div>

      {/* ---------------------------------------------------- RELATED */}
      {related.length > 0 && (
        <Section tone="bone" className="border-t border-line">
          <div className="container-page">
            <SectionHeading title={dict.product.similar} />
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} locale={locale} />
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
