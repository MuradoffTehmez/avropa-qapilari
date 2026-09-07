import type { CartItem } from "@/types";
import { db } from "@/server/db";
import { calculatePrice, PricingError } from "@/server/pricing";

/**
 * FAVORİT VƏ SƏBƏT — hesaba bağlı siyahılar.
 *
 * Anonim istifadəçinin siyahısı brauzerdə saxlanılır; giriş edəndə
 * `merge` rejimi ilə serverə yüklənir və bundan sonra cihazlar arasında
 * eyni qalır. Səbətdə vahid qiymət heç vaxt client-dən qəbul edilmir —
 * hər sinxronizasiyada `calculatePrice` ilə yenidən hesablanır (PRD §130).
 */

const visible = { archivedAt: null, status: "PUBLISHED" } as const;

/* ------------------------------ Favoritlər ----------------------------- */

export async function userFavorites(userId: string): Promise<string[]> {
  const rows = await db.favorite.findMany({
    where: { userId, product: visible },
    orderBy: { createdAt: "desc" },
    select: { productId: true },
  });
  return rows.map((row) => row.productId);
}

/**
 * Favorit siyahısını yazır.
 *
 * `merge` — girişdən sonra brauzerdəki siyahını itirməmək üçün mövcud
 * qeydlərin üstünə əlavə edir; əks halda siyahı tam əvəz olunur.
 */
export async function setUserFavorites(
  userId: string,
  productIds: string[],
  merge = false,
): Promise<string[]> {
  const wanted = [...new Set(productIds)];
  const known = wanted.length
    ? await db.product.findMany({ where: { id: { in: wanted }, ...visible }, select: { id: true } })
    : [];
  const valid = known.map((product) => product.id);

  await db.$transaction(async (tx) => {
    if (merge) {
      const existing = await tx.favorite.findMany({ where: { userId }, select: { productId: true } });
      const have = new Set(existing.map((row) => row.productId));
      const missing = valid.filter((id) => !have.has(id));
      if (missing.length > 0) {
        await tx.favorite.createMany({ data: missing.map((productId) => ({ userId, productId })) });
      }
      return;
    }

    await tx.favorite.deleteMany({ where: { userId, productId: { notIn: valid.length ? valid : [""] } } });
    const existing = await tx.favorite.findMany({ where: { userId }, select: { productId: true } });
    const have = new Set(existing.map((row) => row.productId));
    const missing = valid.filter((id) => !have.has(id));
    if (missing.length > 0) {
      await tx.favorite.createMany({ data: missing.map((productId) => ({ userId, productId })) });
    }
  });

  return userFavorites(userId);
}

/* -------------------------------- Səbət -------------------------------- */

export interface CartInput {
  productSlug: string;
  quantity: number;
  width: number;
  height: number;
  choices: Record<string, string | string[]>;
}

type ChoiceMap = Record<string, string | string[]>;

function parseChoices(raw: string): ChoiceMap {
  try {
    const parsed: unknown = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? (parsed as ChoiceMap) : {};
  } catch {
    return {};
  }
}

function choiceIds(choices: ChoiceMap): string[] {
  return Object.values(choices).flatMap((value) => (Array.isArray(value) ? value : [value]));
}

/** Snapshot sətirləri: qrup açarı + option id, dil-müstəqil. */
function snapshotLines(choices: ChoiceMap, known: Set<string>) {
  const lines: { group: string; value: string }[] = [];
  for (const [group, raw] of Object.entries(choices)) {
    if (!raw) continue;
    for (const id of Array.isArray(raw) ? raw : [raw]) {
      if (known.has(id)) lines.push({ group, value: id });
    }
  }
  return lines;
}

export async function userCart(userId: string): Promise<CartItem[]> {
  const rows = await db.cartItem.findMany({
    where: { userId, product: visible },
    include: { product: true },
    orderBy: { createdAt: "asc" },
  });
  if (rows.length === 0) return [];

  const allChoices = rows.map((row) => parseChoices(row.choices));
  const ids = [...new Set(allChoices.flatMap(choiceIds))];
  const options = ids.length
    ? await db.optionValue.findMany({ where: { id: { in: ids } }, select: { id: true, hex: true } })
    : [];
  const byId = new Map(options.map((option) => [option.id, option]));
  const known = new Set(byId.keys());

  return rows.map((row, index) => {
    const choices = allChoices[index];
    const outside = choices.OUTSIDE_COLOR;
    const hexes = parseHexes(row.product.panelHexes);
    const panelHex =
      (typeof outside === "string" ? byId.get(outside)?.hex : null) ?? hexes[0] ?? "#383e42";

    return {
      id: row.id,
      productId: row.productId,
      productSlug: row.product.slug,
      productName: row.product.name,
      sku: row.product.sku,
      panelHex,
      quantity: row.quantity,
      unitPrice: row.unitPrice,
      snapshot: { width: row.width, height: row.height, lines: snapshotLines(choices, known) },
    };
  });
}

function parseHexes(raw: string): string[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export class CartSyncError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly productSlug: string,
  ) {
    super(message);
  }
}

/**
 * Səbəti tam əvəz edir. Hər sətrin qiyməti serverdə yenidən hesablanır;
 * qiymətləndirmədən keçməyən sətir (arxivlənmiş məhsul, uyğunsuz seçim)
 * sükutla atılmır — sorğu rədd edilir ki, müştəri səbətin niyə
 * dəyişdiyini bilsin.
 */
export async function setUserCart(userId: string, items: CartInput[]): Promise<CartItem[]> {
  // Səbət snapshot-ı tək seçimi massiv kimi saxlamır; qrupun çoxseçimli
  // olub-olmadığını baza bilir, ona görə forma burada bərpa olunur.
  const groups = await db.optionGroup.findMany({ select: { key: true, multi: true } });
  const isMulti = new Map(groups.map((group) => [group.key, group.multi]));
  const normalize = (choices: Record<string, string | string[]>) =>
    Object.fromEntries(
      Object.entries(choices).map(([group, value]) => [
        group,
        isMulti.get(group) && !Array.isArray(value) ? [value] : value,
      ]),
    );

  const priced: {
    productId: string;
    quantity: number;
    width: number;
    height: number;
    choices: string;
    unitPrice: number;
  }[] = [];

  for (const item of items) {
    const product = await db.product.findFirst({
      where: { slug: item.productSlug, ...visible },
      select: { id: true },
    });
    if (!product) {
      throw new CartSyncError("PRODUCT_NOT_AVAILABLE", "Məhsul artıq mövcud deyil", item.productSlug);
    }

    try {
      const choices = normalize(item.choices);
      const price = await calculatePrice({
        productSlug: item.productSlug,
        width: item.width,
        height: item.height,
        choices,
      });
      priced.push({
        productId: product.id,
        quantity: item.quantity,
        width: item.width,
        height: item.height,
        choices: JSON.stringify(choices),
        unitPrice: price.total,
      });
    } catch (error) {
      if (error instanceof PricingError) {
        throw new CartSyncError(error.code, error.message, item.productSlug);
      }
      throw error;
    }
  }

  await db.$transaction(async (tx) => {
    await tx.cartItem.deleteMany({ where: { userId } });
    for (const row of priced) {
      await tx.cartItem.create({ data: { userId, ...row } });
    }
  });

  return userCart(userId);
}
