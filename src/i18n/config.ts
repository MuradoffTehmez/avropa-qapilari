import type { Locale } from "@/types";

export const locales = ["az", "en", "ru"] as const;
export const defaultLocale: Locale = "az";

export const localeNames: Record<Locale, string> = {
  az: "Azərbaycan",
  en: "English",
  ru: "Русский",
};

export const localeShort: Record<Locale, string> = {
  az: "AZ",
  en: "EN",
  ru: "RU",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * lokalizə olunmuş URL seqmentləri.
 * DB translation gələnə qədər statik map.
 */
export const routeSegments = {
  doors: { az: "qapilar", en: "doors", ru: "dveri" },
  door: { az: "qapi", en: "door", ru: "dver" },
  configurator: { az: "konfiqurator", en: "configurator", ru: "konfigurator" },
  services: { az: "xidmetler", en: "services", ru: "uslugi" },
  repair: { az: "temir", en: "repair", ru: "remont" },
  measurement: { az: "olcu", en: "measurement", ru: "zamer" },
  projects: { az: "layiheler", en: "projects", ru: "proekty" },
  about: { az: "haqqimizda", en: "about", ru: "o-nas" },
  contact: { az: "elaqe", en: "contact", ru: "kontakty" },
  cart: { az: "sebet", en: "cart", ru: "korzina" },
  checkout: { az: "sifaris", en: "checkout", ru: "oformlenie" },
  favorites: { az: "favoritler", en: "favorites", ru: "izbrannoe" },
  compare: { az: "muqayise", en: "compare", ru: "sravnenie" },
  account: { az: "hesab", en: "account", ru: "kabinet" },
  login: { az: "giris", en: "login", ru: "vhod" },
  technician: { az: "usta", en: "technician", ru: "master" },
} as const;
