"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { Dictionary } from "@/i18n/dictionaries/az";
import type { Locale } from "@/types";

type I18nValue = { locale: Locale; dict: Dictionary };

const I18nContext = createContext<I18nValue | null>(null);

/**
 * Lüğəti bütün client komponentlərinə açır.
 * Header/Footer kimi komponentlər lüğəti onsuz da prop kimi alır —
 * provider yarpaq komponentlərin (modal, toast, filtr) prop zənciri
 * qurmadan tərcüməyə çatmasını təmin edir.
 */
export function I18nProvider({
  locale,
  dict,
  children,
}: I18nValue & { children: ReactNode }) {
  return <I18nContext.Provider value={{ locale, dict }}>{children}</I18nContext.Provider>;
}

function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (!value) throw new Error("I18nProvider tapılmadı");
  return value;
}

export function useDict(): Dictionary {
  return useI18n().dict;
}

export function useLocale(): Locale {
  return useI18n().locale;
}
