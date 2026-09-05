import type { Locale } from "@/types";
import { routeSegments } from "@/i18n/config";

type SegmentKey = keyof typeof routeSegments;

function seg(key: SegmentKey, locale: Locale): string {
  return routeSegments[key][locale];
}

/**
 * Lokalizə olunmuş URL-lər (PRD §24).
 * Fayl sistemi AZ seqmentlərini istifadə edir; EN/RU seqmentləri
 * next.config.ts-dəki rewrite-lar vasitəsilə həmin route-lara yönlənir.
 */
export function routes(locale: Locale) {
  const base = `/${locale}`;

  return {
    home: base,

    doors: `${base}/${seg("doors", locale)}`,
    category: (slug: string) => `${base}/${seg("doors", locale)}/${slug}`,
    product: (slug: string) => `${base}/${seg("door", locale)}/${slug}`,

    configurator: `${base}/${seg("configurator", locale)}`,
    configuratorFor: (slug: string) => `${base}/${seg("configurator", locale)}/${slug}`,
    configuration: (code: string) => `${base}/configuration/${code}`,

    brands: `${base}/brands`,
    brand: (slug: string) => `${base}/brands/${slug}`,

    services: `${base}/${seg("services", locale)}`,
    serviceRepair: `${base}/${seg("services", locale)}/repair`,
    serviceInstallation: `${base}/${seg("services", locale)}/installation`,
    serviceMeasurement: `${base}/${seg("services", locale)}/measurement`,
    serviceMaintenance: `${base}/${seg("services", locale)}/maintenance`,

    repair: `${base}/${seg("repair", locale)}`,
    measurement: `${base}/${seg("measurement", locale)}`,
    quote: `${base}/quote`,

    projects: `${base}/${seg("projects", locale)}`,
    about: `${base}/${seg("about", locale)}`,
    blog: `${base}/blog`,
    blogPost: (slug: string) => `${base}/blog/${slug}`,
    faq: `${base}/faq`,
    contact: `${base}/${seg("contact", locale)}`,

    favorites: `${base}/${seg("favorites", locale)}`,
    compare: `${base}/${seg("compare", locale)}`,
    cart: `${base}/${seg("cart", locale)}`,
    checkout: `${base}/${seg("checkout", locale)}`,

    account: `${base}/${seg("account", locale)}`,
    accountSection: (section: string) => `${base}/${seg("account", locale)}/${section}`,

    doorPassport: (serial: string) => `${base}/service/door/${serial}`,

    admin: `/admin`,
    adminSection: (section: string) => `/admin/${section}`,

    legal: (page: string) => `${base}/legal/${page}`,
  };
}

export type Routes = ReturnType<typeof routes>;

/** Locale dəyişdirərkən eyni səhifədə qalmaq üçün path-i yenidən yazır. */
export function swapLocaleInPath(pathname: string, next: Locale): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return `/${next}`;
  parts[0] = next;
  return `/${parts.join("/")}`;
}
