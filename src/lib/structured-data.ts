import type { Dictionary } from "@/i18n";
import type { Brand, Locale, Product, Review } from "@/types";
import { brand, hasContact, hasSocial } from "@/config/brand";
import { productShort } from "@/lib/i18n-format";

/**
 * PRD §108 — schema.org strukturlaşdırılmış data.
 *
 * Qayda: yalnız səhifədə faktiki olan məlumat yazılır. Şirkət əlaqə
 * məlumatları hələ boş olduğu üçün telefon/ünvan sahələri şərtlidir —
 * uydurma dəyər verilmir.
 */

type Json = Record<string, unknown>;

const SITE = brand.siteUrl;

function absolute(path: string): string {
  return path.startsWith("http") ? path : `${SITE}${path}`;
}

/** Şirkət — bütün səhifələrdə eyni. */
export function organizationSchema(locale: Locale, dict: Dictionary): Json {
  const social = Object.values(brand.social).filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE}#organization`,
    name: brand.name,
    legalName: brand.legalName,
    url: `${SITE}/${locale}`,
    description: dict.meta.description,
    logo: absolute("/brand/europorta-mark.png"),
    slogan: dict.meta.slogan,
    ...(hasSocial && social.length > 0 ? { sameAs: social } : {}),
    ...(brand.contact.phone
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            telephone: brand.contact.phone,
            contactType: "customer service",
            availableLanguage: ["az", "en", "ru"],
          },
        }
      : {}),
  };
}

/** Showroom / servis mərkəzi. Ünvan boş olduqca yaradılmır. */
export function localBusinessSchema(locale: Locale, dict: Dictionary): Json | null {
  if (!hasContact || !brand.contact.address) return null;

  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${SITE}#localbusiness`,
    name: brand.name,
    url: `${SITE}/${locale}`,
    description: dict.meta.description,
    image: absolute("/brand/europorta-mark.png"),
    address: { "@type": "PostalAddress", streetAddress: brand.contact.address },
    ...(brand.contact.phone ? { telephone: brand.contact.phone } : {}),
    ...(brand.contact.workingHours ? { openingHours: brand.contact.workingHours } : {}),
  };
}

/** Sayt daxili axtarış — Google sitelinks searchbox. */
export function websiteSchema(locale: Locale): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE}#website`,
    url: `${SITE}/${locale}`,
    name: brand.name,
    inLanguage: locale,
    publisher: { "@id": `${SITE}#organization` },
  };
}

export function breadcrumbSchema(items: { label: string; href?: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: absolute(item.href) } : {}),
    })),
  };
}

export function productSchema(
  product: Product,
  productBrand: Brand | undefined,
  reviews: Review[],
  locale: Locale,
  dict: Dictionary,
): Json {
  const productReviews = reviews.filter((r) => r.productName === product.name);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    mpn: product.sku,
    description: productShort(product, dict),
    url: absolute(`/${locale}/qapi/${product.slug}`),
    brand: { "@type": "Brand", name: productBrand?.name ?? brand.name },
    ...(productBrand?.country ? { countryOfOrigin: productBrand.country } : {}),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    ...(productReviews.length > 0
      ? {
          review: productReviews.map((r) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.author },
            datePublished: r.date,
            reviewBody: r.text,
            reviewRating: {
              "@type": "Rating",
              ratingValue: r.rating,
              bestRating: 5,
              worstRating: 1,
            },
          })),
        }
      : {}),
    offers: {
      "@type": "Offer",
      price: product.basePrice,
      priceCurrency: "AZN",
      url: absolute(`/${locale}/qapi/${product.slug}`),
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/PreOrder",
      seller: { "@id": `${SITE}#organization` },
      ...(product.warrantyYears
        ? {
            warranty: {
              "@type": "WarrantyPromise",
              durationOfWarranty: {
                "@type": "QuantitativeValue",
                value: product.warrantyYears,
                unitCode: "ANN",
              },
            },
          }
        : {}),
    },
  };
}

export function serviceSchema(
  name: string,
  description: string,
  url: string,
  areaServed?: string,
): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: absolute(url),
    provider: { "@id": `${SITE}#organization` },
    ...(areaServed ? { areaServed } : {}),
  };
}

export function articleSchema(post: {
  title: string;
  excerpt: string;
  date: string;
  slug: string;
}, locale: Locale): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: locale,
    url: absolute(`/${locale}/blog/${post.slug}`),
    author: { "@id": `${SITE}#organization` },
    publisher: { "@id": `${SITE}#organization` },
  };
}

export function faqSchema(items: { question: string; answer: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
