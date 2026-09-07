import type { Prisma } from "@prisma/client";
import { db } from "@/server/db";
import { optionGroups } from "@/mock/options";
import type { OptionGroupKey } from "@/types";

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
    readonly code:
      | "PRODUCT_NOT_FOUND"
      | "INVALID_OPTION"
      | "INCOMPATIBLE"
      | "OPTION_NOT_AVAILABLE"
      | "INVALID_OPTION_GROUP"
      | "OPTION_GROUP_NOT_AVAILABLE"
      | "INVALID_OPTION_CARDINALITY"
      | "DUPLICATE_OPTION"
      | "REQUIRED_OPTION_MISSING",
  ) {
    super(message);
  }
}

export async function calculatePrice(input: PriceInput): Promise<PriceResult> {
  const product = await db.product.findFirst({
    where: { slug: input.productSlug, archivedAt: null, status: "PUBLISHED" },
    include: {
      productOptions: {
        where: { enabled: true },
        select: { optionValueId: true },
      },
    },
  });
  if (!product) throw new PricingError("Məhsul tapılmadı", "PRODUCT_NOT_FOUND");

  const configuredGroups = parseConfiguredGroups(product.optionGroups);
  assertSelectionShape(input.choices, configuredGroups);

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


  const allowedOptionIds = new Set(product.productOptions.map((entry) => entry.optionValueId));
  const disallowed = values.filter((value) => !allowedOptionIds.has(value.id));
  if (disallowed.length > 0) {
    throw new PricingError(
      `Məhsula aid olmayan seçim: ${disallowed.map((value) => value.id).join(", ")}`,
      "OPTION_NOT_AVAILABLE",
    );
  }

  for (const [groupKey, raw] of Object.entries(input.choices)) {
    const ids = Array.isArray(raw) ? raw : [raw];
    const wrongGroup = ids.find((id) => values.find((value) => value.id === id)?.groupKey !== groupKey);
    if (wrongGroup) {
      throw new PricingError(`Seçim yanlış qrupda göndərilib: ${wrongGroup}`, "INVALID_OPTION_GROUP");
    }
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

function parseConfiguredGroups(raw: string): OptionGroupKey[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((key): key is OptionGroupKey =>
      typeof key === "string" && key in optionGroups,
    );
  } catch {
    return [];
  }
}

function assertSelectionShape(
  choices: PriceInput["choices"],
  configuredGroups: OptionGroupKey[],
) {
  const allowedGroups: Set<OptionGroupKey> = new Set(
    configuredGroups.filter((key) => key !== "SIZE"),
  );
  const sentIds = new Set<string>();

  for (const [rawGroup, raw] of Object.entries(choices)) {
    if (!allowedGroups.has(rawGroup as OptionGroupKey)) {
      throw new PricingError(`Məhsula aid olmayan seçim qrupu: ${rawGroup}`, "OPTION_GROUP_NOT_AVAILABLE");
    }

    const group = optionGroups[rawGroup as OptionGroupKey];
    if (Array.isArray(raw) !== group.multi) {
      throw new PricingError(`Seçim qrupunun formatı yanlışdır: ${rawGroup}`, "INVALID_OPTION_CARDINALITY");
    }

    for (const id of Array.isArray(raw) ? raw : [raw]) {
      if (sentIds.has(id)) {
        throw new PricingError(`Seçim təkrarlanıb: ${id}`, "DUPLICATE_OPTION");
      }
      sentIds.add(id);
    }
  }

  for (const groupKey of allowedGroups) {
    const group = optionGroups[groupKey];
    if (!group.required) continue;
    const raw = choices[groupKey];
    if (typeof raw !== "string" || raw.length === 0) {
      throw new PricingError(`Məcburi seçim yoxdur: ${groupKey}`, "REQUIRED_OPTION_MISSING");
    }
  }
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
