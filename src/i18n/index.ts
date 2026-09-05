import type { Locale } from "@/types";
import { az, type Dictionary } from "@/i18n/dictionaries/az";
import { en } from "@/i18n/dictionaries/en";
import { ru } from "@/i18n/dictionaries/ru";
import { deepMerge } from "@/i18n/merge";

const cache = new Map<Locale, Dictionary>();

/** AZ baza dictionary-dir; EN/RU onun üzərinə merge olunur (PRD §24, §175). */
export function getDictionary(locale: Locale): Dictionary {
  const cached = cache.get(locale);
  if (cached) return cached;

  const dict =
    locale === "en" ? deepMerge(az, en) : locale === "ru" ? deepMerge(az, ru) : az;

  cache.set(locale, dict as Dictionary);
  return dict as Dictionary;
}

export type { Dictionary };
export { locales, defaultLocale, isLocale, localeNames, localeShort } from "@/i18n/config";
