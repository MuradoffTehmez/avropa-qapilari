import type { MetadataRoute } from "next";
import { brand } from "@/config/brand";
import { locales } from "@/i18n/config";
import { swapLocaleInPath } from "@/lib/routes";
import { catalogBrands, catalogCategories, catalogProducts } from "@/server/catalog";
import { blogPosts } from "@/mock/content";

/** sitemap. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = brand.siteUrl;
  const [products, brands, categories] = await Promise.all([
    catalogProducts(),
    catalogBrands(),
    catalogCategories(),
  ]);

  const staticPaths = [
    "",
    "/qapilar",
    "/konfiqurator",
    "/xidmetler",
    "/xidmetler/measurement",
    "/xidmetler/installation",
    "/xidmetler/repair",
    "/xidmetler/maintenance",
    "/temir",
    "/olcu",
    "/quote",
    "/showroom",
    "/layiheler",
    "/haqqimizda",
    "/blog",
    "/faq",
    "/elaqe",
    "/brands",
    "/legal/privacy",
    "/legal/terms",
    "/legal/cookies",
    "/legal/warranty",
    "/legal/delivery",
    "/legal/returns",
  ];

  const dynamicPaths = [
    ...categories.map((c) => `/qapilar/${c.slug}`),
    ...products.map((p) => `/qapi/${p.slug}`),
    ...products.map((p) => `/konfiqurator/${p.slug}`),
    ...brands.map((b) => `/brands/${b.slug}`),
    ...blogPosts.map((p) => `/blog/${p.slug}`),
  ];

  const all = [...staticPaths, ...dynamicPaths];

  /** Yollar AZ seqmentləri ilə yazılıb; hər dil üçün tərcümə olunur. */
  const localized = (path: string, locale: string) =>
    `${base}${swapLocaleInPath(`/az${path}`, locale as (typeof locales)[number])}`;

  return locales.flatMap((locale) =>
    all.map((path) => ({
      url: localized(path, locale),
      changeFrequency: path === "" ? ("daily" as const) : ("weekly" as const),
      priority: path === "" ? 1 : path.startsWith("/qapi/") ? 0.8 : 0.6,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, localized(path, l)])),
      },
    })),
  );
}
