import type { Locale } from "@/types";
import { isLocale, locales, routeSegments } from "@/i18n/config";

type SegmentKey = keyof typeof routeSegments;

function seg(key: SegmentKey, locale: Locale): string {
  return routeSegments[key][locale];
}

/**
 * Lokalizə olunmuş URL-lər.
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

    showroom: `${base}/showroom`,
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

    login: `${base}/${seg("login", locale)}`,
    technician: `${base}/${seg("technician", locale)}`,

    account: `${base}/${seg("account", locale)}`,
    accountSection: (section: string) => `${base}/${seg("account", locale)}/${section}`,

    doorPassport: (serial: string) => `${base}/service/door/${serial}`,

    admin: `/admin`,
    adminSection: (section: string) => `/admin/${section}`,

    legal: (page: string) => `${base}/legal/${page}`,
  };
}

export type Routes = ReturnType<typeof routes>;

/**
 * Locale dəyişdirərkən eyni səhifədə qalmaq üçün path-i yenidən yazır.
 *
 * Yalnız prefiksi dəyişmək kifayət etmir: route seqmentləri də lokalizə
 * olunub (`/en/doors` ↔ `/ru/dveri`). Seqment tərcümə edilməsə hədəf
 * dildə belə ünvan olmur və 404 qayıdır.
 */
export function swapLocaleInPath(pathname: string, next: Locale): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return `/${next}`;

  const current = parts[0];
  parts[0] = next;

  if (parts.length > 1 && isLocale(current)) {
    parts[1] = translateSegment(parts[1], current, next);
  }

  return `/${parts.join("/")}`;
}

/** `doors` (en) → `dveri` (ru). Tanınmayan seqment dəyişmir. */
function translateSegment(segment: string, from: Locale, to: Locale): string {
  for (const group of Object.values(routeSegments)) {
    if (group[from] === segment) return group[to];
  }
  return segment;
}

/**
 * Səhifənin bütün dillərdəki ünvanları — `alternates` (hreflang) üçün.
 * `azPath` fayl sistemindəki yoldur, məs. "/qapilar" və ya "" (ana səhifə).
 */
export function localeAlternates(azPath: string, locale: Locale) {
  const languages = Object.fromEntries(
    locales.map((l) => [l, swapLocaleInPath(`/az${azPath}`, l)]),
  ) as Record<Locale, string>;

  return { canonical: languages[locale], languages };
}
