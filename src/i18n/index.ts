import type { Locale } from "@/types";
import { az, type Dictionary } from "@/i18n/dictionaries/az";
import { en } from "@/i18n/dictionaries/en";
import { ru } from "@/i18n/dictionaries/ru";

const dictionaries: Record<Locale, Dictionary> = { az, en, ru };

/** Hər dil üçün tam dictionary — fallback tələb olunmur. */
export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? az;
}

export type { Dictionary };
export { locales, defaultLocale, isLocale, localeNames, localeShort } from "@/i18n/config";
