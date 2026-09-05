import type { MetadataRoute } from "next";
import { brand } from "@/config/brand";
import { locales } from "@/i18n/config";
import { products } from "@/mock/products";
import { brands, categories } from "@/mock/taxonomy";
import { blogPosts } from "@/mock/content";

/** PRD §109 — sitemap. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = brand.siteUrl;
  const now = new Date();

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

  return locales.flatMap((locale) =>
    all.map((path) => ({
      url: `${base}/${locale}${path}`,
      lastModified: now,
      changeFrequency: path === "" ? ("daily" as const) : ("weekly" as const),
      priority: path === "" ? 1 : path.startsWith("/qapi/") ? 0.8 : 0.6,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${base}/${l}${path}`])),
      },
    })),
  );
}
