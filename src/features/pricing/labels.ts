import type { Dictionary } from "@/i18n";
import type { Locale, OptionGroupKey, PriceBreakdown, PriceLine } from "@/types";
import { findOptionValue } from "@/mock/options";
import { optionLabel } from "@/mock/options.i18n";

/**
 * Server qiymət sətirlərinin lokalizasiyası.
 *
 * `src/server/pricing.ts` mətn qaytarmır — yalnız `labelKey` və option
 * id-si. Beləliklə eyni cavab üç dil üçün işləyir və UI mətni sözlükdə
 * qalır.
 */
export interface ServerPriceLine {
  key: string;
  labelKey: string;
  groupKey?: string;
  valueId?: string;
  amount: number;
}

export interface ServerPrice {
  lines: ServerPriceLine[];
  subtotal: number;
  discount: number;
  total: number;
  requiresQuote: boolean;
}

function lineLabel(line: ServerPriceLine, locale: Locale, dict: Dictionary): string {
  if (line.labelKey === "option" && line.valueId) {
    const value = findOptionValue(line.valueId);
    const group = line.groupKey
      ? dict.configurator.steps[line.groupKey as OptionGroupKey]
      : "";
    const name = value ? optionLabel(value, locale) : line.valueId;
    return group ? `${group}: ${name}` : name;
  }

  const known: Record<string, string> = {
    basePrice: dict.configurator.basePrice,
    sizeModifier: dict.configurator.sizeModifier,
    widePanelRule: dict.configurator.widePanelRule,
    tallPanelRule: dict.configurator.tallPanelRule,
  };
  return known[line.labelKey] ?? line.labelKey;
}

/** Server cavabını UI-nin gözlədiyi `PriceBreakdown` formasına çevirir. */
export function toBreakdown(
  price: ServerPrice,
  locale: Locale,
  dict: Dictionary,
): PriceBreakdown {
  const lines: PriceLine[] = price.lines.map((l) => ({
    key: l.key,
    label: lineLabel(l, locale, dict),
    amount: l.amount,
  }));

  return {
    lines,
    subtotal: price.subtotal,
    discount: price.discount,
    total: price.total,
    requiresQuote: price.requiresQuote,
    quoteReason: price.requiresQuote ? dict.configurator.quoteRequired : undefined,
  };
}
