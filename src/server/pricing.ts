import type { Prisma } from "@/generated/prisma";
import { db } from "@/server/db";

/**
 * SERVER-SIDE QİYMƏT HESABLANMASI — PRD §130.
 *
 * Client-dən gələn qiymət heç vaxt qəbul edilmir. Yalnız məhsul slug-ı,
 * ölçü və seçilmiş option id-ləri qəbul olunur; qiymət bazadakı
 * `basePrice` və `priceDelta` dəyərləri əsasında yenidən hesablanır.
 *
 * `src/features/pricing/engine.ts` eyni qaydaları client tərəfdə
 * göstərmək üçün saxlayır — orada nəticə yalnız optimistik göstəricidir.
 */

export interface PriceLine {
  key: string;
  /** Tərcümə açarı; mətn client tərəfdə lüğətdən qoyulur. */
  labelKey: string;
  /** Option sətirlərində qrup və dəyər id-si. */
  groupKey?: string;
  valueId?: string;
  amount: number;
}

export interface PriceResult {
  lines: PriceLine[];
  subtotal: number;
  discount: number;
  total: number;
  requiresQuote: boolean;
}

export interface PriceInput {
  productSlug: string;
  width: number;
  height: number;
  /** { groupKey: optionValueId | optionValueId[] } */
  choices: Record<string, string | string[]>;
}

/** Standart sahədən artıq hər 0.1 m² üçün əlavə. */
function sizeModifier(
  base: { defaultWidth: number; defaultHeight: number },
  width: number,
  height: number,
): number {
  const baseArea = (base.defaultWidth * base.defaultHeight) / 1_000_000;
  const area = (width * height) / 1_000_000;
  const delta = area - baseArea;
  if (delta <= 0.001) return 0;
  return Math.round((delta / 0.1) * 55);
}

/** Qiymətə təsir edən qrupların sırası — hesabatda bu ardıcıllıqla görünür. */
const GROUP_ORDER = [
  "OUTSIDE_COLOR",
  "INSIDE_COLOR",
  "FRAME",
  "SIDELIGHT",
  "GLASS",
  "GLASS_PATTERN",
  "HANDLE",
  "HINGE",
  "LOCK",
  "CYLINDER",
  "SMART_LOCK",
  "THRESHOLD",
  "INSULATION",
  "ACCESSORY",
  "INSTALLATION",
  "DELIVERY",
] as const;

export class PricingError extends Error {
  constructor(
    message: string,
    readonly code: "PRODUCT_NOT_FOUND" | "INVALID_OPTION" | "INCOMPATIBLE",
  ) {
    super(message);
  }
}

export async function calculatePrice(input: PriceInput): Promise<PriceResult> {
  const product = await db.product.findUnique({ where: { slug: input.productSlug } });
  if (!product) throw new PricingError("Məhsul tapılmadı", "PRODUCT_NOT_FOUND");

  // Seçilmiş id-ləri düzləşdirib bazadan oxuyuruq — client-in göndərdiyi
  // `priceDelta` və ya `label` dəyərləri nəzərə alınmır.
  const selectedIds = Object.values(input.choices).flatMap((v) =>
    v == null ? [] : Array.isArray(v) ? v : [v],
  );

  const values = selectedIds.length
    ? await db.optionValue.findMany({ where: { id: { in: selectedIds } } })
    : [];

  // Tanınmayan id varsa sorğu rədd edilir.
  if (values.length !== new Set(selectedIds).size) {
    const known = new Set(values.map((v) => v.id));
    const unknown = selectedIds.filter((id) => !known.has(id));
    throw new PricingError(`Naməlum seçim: ${unknown.join(", ")}`, "INVALID_OPTION");
  }

  assertCompatible(values);

  const lines: PriceLine[] = [
    { key: "base", labelKey: "basePrice", amount: product.basePrice },
  ];

  const size = sizeModifier(product, input.width, input.height);
  if (size > 0) lines.push({ key: "size", labelKey: "sizeModifier", amount: size });

  const byId = new Map(values.map((v) => [v.id, v]));
  for (const groupKey of GROUP_ORDER) {
    for (const value of values.filter((v) => v.groupKey === groupKey && v.priceDelta !== 0)) {
      lines.push({
        key: `opt-${value.id}`,
        labelKey: "option",
        groupKey: value.groupKey,
        valueId: value.id,
        amount: value.priceDelta,
      });
    }
  }
  void byId;

  if (input.width > 1000) {
    lines.push({ key: "rule-wide-panel", labelKey: "widePanelRule", amount: 150 });
  }
  if (input.height > 2100) {
    lines.push({ key: "rule-tall-panel", labelKey: "tallPanelRule", amount: 120 });
  }

  const subtotal = lines.reduce((sum, l) => sum + l.amount, 0);

  // Kampaniyalı məhsullarda 5% endirim.
  const discount =
    product.oldPrice && product.oldPrice > product.basePrice ? Math.round(subtotal * 0.05) : 0;

  const requiresQuote =
    input.width < product.minWidth ||
    input.width > product.maxWidth ||
    input.height < product.minHeight ||
    input.height > product.maxHeight;

  return {
    lines,
    subtotal,
    discount,
    total: Math.max(0, subtotal - discount),
    requiresQuote,
  };
}

/** `requires` / `excludes` qaydalarını serverdə də yoxlayır (PRD §97). */
function assertCompatible(values: { id: string; requires: string | null; excludes: string | null }[]) {
  const chosen = new Set(values.map((v) => v.id));

  for (const value of values) {
    if (value.requires) {
      const requires = JSON.parse(value.requires) as string[];
      if (requires.length > 0 && !requires.some((id) => chosen.has(id))) {
        throw new PricingError(`${value.id} üçün ilkin şərt seçilməyib`, "INCOMPATIBLE");
      }
    }
    if (value.excludes) {
      const excludes = JSON.parse(value.excludes) as string[];
      const clash = excludes.find((id) => chosen.has(id));
      if (clash) {
        throw new PricingError(`${value.id} ilə ${clash} uyğun deyil`, "INCOMPATIBLE");
      }
    }
  }
}

export type PrismaTx = Prisma.TransactionClient;
