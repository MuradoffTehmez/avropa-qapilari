import type {
  ConfigurationSelection,
  OptionGroupKey,
  OptionValue,
  PriceBreakdown,
  PriceLine,
  Product,
} from "@/types";
import { findOptionValue, optionGroups } from "@/mock/options";

/**
 * PRICING ENGINE — PRD §53, §54, §55.
 *
 * DİQQƏT: PRD §130 (price security) tələb edir ki, yekun qiymət SERVER-də
 * hesablansın. Bu modul UI-də anlıq göstərmə üçündür və backend qoşulduqda
 * eyni qayda dəsti server-side pricing service-ə köçürüləcək; client nəticəsi
 * yalnız optimistik göstərici kimi qalacaq.
 */

export interface PriceRule {
  id: string;
  label: string;
  priority: number;
  applies: (ctx: { product: Product; selection: ConfigurationSelection }) => boolean;
  amount: (ctx: { product: Product; selection: ConfigurationSelection }) => number;
}

/** Ölçü modifikatoru: standart sahədən artıq hər 0.1 m² üçün əlavə. */
function sizeModifier(product: Product, width: number, height: number): number {
  const baseArea = (product.defaultWidth * product.defaultHeight) / 1_000_000;
  const area = (width * height) / 1_000_000;
  const delta = area - baseArea;
  if (delta <= 0.001) return 0;
  return Math.round((delta / 0.1) * 55);
}

export const priceRules: PriceRule[] = [
  {
    id: "rule-wide-panel",
    label: "Geniş panel əlavəsi (en > 1000 mm)",
    priority: 10,
    applies: ({ selection }) => selection.width > 1000,
    amount: () => 150,
  },
  {
    id: "rule-tall-panel",
    label: "Yüksək panel əlavəsi (hündürlük > 2100 mm)",
    priority: 20,
    applies: ({ selection }) => selection.height > 2100,
    amount: () => 120,
  },
  {
    id: "rule-rc4-reinforce",
    label: "RC4+ gücləndirmə paketi",
    priority: 30,
    applies: ({ product }) => product.securityClass === "RC4" || product.securityClass === "RC5",
    amount: () => 0,
  },
];

function collectSelected(selection: ConfigurationSelection): OptionValue[] {
  const out: OptionValue[] = [];
  for (const raw of Object.values(selection.choices)) {
    if (!raw) continue;
    const ids = Array.isArray(raw) ? raw : [raw];
    for (const id of ids) {
      const v = findOptionValue(id);
      if (v) out.push(v);
    }
  }
  return out;
}

const groupOrder: OptionGroupKey[] = [
  "OUTSIDE_COLOR",
  "INSIDE_COLOR",
  "FRAME",
  "GLASS",
  "HANDLE",
  "LOCK",
  "SMART_LOCK",
  "ACCESSORY",
  "INSTALLATION",
  "DELIVERY",
];

export function calculatePrice(
  product: Product,
  selection: ConfigurationSelection,
): PriceBreakdown {
  const lines: PriceLine[] = [
    { key: "base", label: "Baza qiyməti", amount: product.basePrice },
  ];

  const size = sizeModifier(product, selection.width, selection.height);
  if (size > 0) {
    lines.push({ key: "size", label: "Ölçü düzəlişi", amount: size });
  }

  const selected = collectSelected(selection);

  for (const key of groupOrder) {
    const values = selected.filter((v) => v.groupKey === key && v.priceDelta !== 0);
    for (const v of values) {
      lines.push({
        key: `opt-${v.id}`,
        label: `${optionGroups[key].title}: ${v.label}`,
        amount: v.priceDelta,
      });
    }
  }

  for (const rule of [...priceRules].sort((a, b) => a.priority - b.priority)) {
    if (!rule.applies({ product, selection })) continue;
    const amount = rule.amount({ product, selection });
    if (amount !== 0) lines.push({ key: rule.id, label: rule.label, amount });
  }

  const subtotal = lines.reduce((sum, l) => sum + l.amount, 0);

  // Demo endirim: kampaniyalı məhsullarda köhnə/yeni qiymət fərqi nisbətində.
  const discount =
    product.oldPrice && product.oldPrice > product.basePrice
      ? Math.round(subtotal * 0.05)
      : 0;

  const outOfRange =
    selection.width < product.minWidth ||
    selection.width > product.maxWidth ||
    selection.height < product.minHeight ||
    selection.height > product.maxHeight;

  return {
    lines,
    subtotal,
    discount,
    total: Math.max(0, subtotal - discount),
    requiresQuote: outOfRange,
    quoteReason: outOfRange
      ? "Bu ölçü üçün fərdi qiymət təklifi tələb olunur."
      : undefined,
  };
}

export function sizeRangeLabel(product: Product): string {
  return `${product.minWidth}–${product.maxWidth} × ${product.minHeight}–${product.maxHeight} mm`;
}
