import type { Prisma } from "@prisma/client";

import { db } from "@/server/db";
import type {
  Brand,
  Category,
  DoorMaterial,
  OptionGroupKey,
  OptionGroupMeta,
  OptionValue,
  Product,
  ProductDocument,
  ProductImage,
  ProductSpec,
  SecurityClass,
  SizePreset,
  SurfaceStyle,
} from "@/types";

type ProductRow = Prisma.ProductGetPayload<{
  include: { category: true; brand: true; productOptions: { include: { optionValue: true } } };
}>;

const productInclude = {
  category: true,
  brand: true,
  productOptions: { include: { optionValue: true } },
} satisfies Prisma.ProductInclude;

/** Kataloq və konfiqurator yalnız dərc olunmuş, arxivlənməmiş məhsulları görür. */
const visible = { archivedAt: null, status: "PUBLISHED" } satisfies Prisma.ProductWhereInput;

const materials = new Set<DoorMaterial>([
  "STEEL",
  "SOLID_WOOD",
  "MDF",
  "ALUMINIUM",
  "COMPOSITE",
  "GLASS",
]);
const securityClasses = new Set<SecurityClass>(["RC2", "RC3", "RC4", "RC5", "—"]);
const surfaceStyles = new Set<SurfaceStyle>(["MODERN", "CLASSIC", "MINIMAL", "LOFT", "NEOCLASSIC"]);
const optionGroupKeys = new Set<OptionGroupKey>([
  "SIZE",
  "OPENING_DIRECTION",
  "PANEL_STYLE",
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
]);
const documentTypes = new Set<ProductDocument["type"]>([
  "TECH_SHEET",
  "CERTIFICATE",
  "INSTALLATION",
  "WARRANTY",
]);

export function isOptionGroupKey(value: string): value is OptionGroupKey {
  return optionGroupKeys.has(value as OptionGroupKey);
}

function jsonArray(value: string): unknown[] {
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function jsonStrings(value: string): string[] {
  return jsonArray(value).filter((item): item is string => typeof item === "string");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseImages(value: string): ProductImage[] {
  return jsonArray(value).flatMap((item) => {
    if (!isRecord(item) || typeof item.src !== "string" || typeof item.alt !== "string") return [];
    return [
      {
        src: item.src,
        alt: item.alt,
        primary: typeof item.primary === "boolean" ? item.primary : undefined,
        colorOptionId: typeof item.colorOptionId === "string" ? item.colorOptionId : undefined,
        width: typeof item.width === "number" ? item.width : undefined,
        height: typeof item.height === "number" ? item.height : undefined,
      },
    ];
  });
}

function parseSpecs(value: string): ProductSpec[] {
  return jsonArray(value).flatMap((item) => {
    if (
      !isRecord(item) ||
      typeof item.group !== "string" ||
      typeof item.label !== "string" ||
      typeof item.value !== "string"
    ) {
      return [];
    }
    return [{ group: item.group, label: item.label, value: item.value }];
  });
}

function parseDocuments(value: string): ProductDocument[] {
  return jsonArray(value).flatMap((item) => {
    if (
      !isRecord(item) ||
      typeof item.id !== "string" ||
      typeof item.title !== "string" ||
      typeof item.sizeKb !== "number" ||
      typeof item.type !== "string" ||
      !documentTypes.has(item.type as ProductDocument["type"])
    ) {
      return [];
    }
    return [
      {
        id: item.id,
        type: item.type as ProductDocument["type"],
        title: item.title,
        sizeKb: item.sizeKb,
      },
    ];
  });
}

function mapOption(row: ProductRow["productOptions"][number]["optionValue"]): OptionValue | null {
  if (!isOptionGroupKey(row.groupKey)) return null;
  return {
    id: row.id,
    groupKey: row.groupKey,
    code: row.code,
    label: row.label,
    description: row.description ?? undefined,
    priceDelta: row.priceDelta,
    hex: row.hex ?? undefined,
    swatch: row.swatch ?? undefined,
    badge: row.badge ?? undefined,
    requiresGroup:
      row.requiresGroup && isOptionGroupKey(row.requiresGroup) ? row.requiresGroup : undefined,
    requires: row.requires ? jsonStrings(row.requires) : undefined,
    excludes: row.excludes ? jsonStrings(row.excludes) : undefined,
  };
}

function mapProduct(row: ProductRow): Product {
  const groups = jsonStrings(row.optionGroups).filter(isOptionGroupKey);
  const panelHexes = jsonStrings(row.panelHexes);
  const material = materials.has(row.material as DoorMaterial)
    ? (row.material as DoorMaterial)
    : "STEEL";
  const securityClass = securityClasses.has(row.securityClass as SecurityClass)
    ? (row.securityClass as SecurityClass)
    : "—";
  const style = surfaceStyles.has(row.style as SurfaceStyle) ? (row.style as SurfaceStyle) : "MODERN";
  const enabled = row.productOptions.filter((option) => option.enabled);

  return {
    id: row.id,
    slug: row.slug,
    sku: row.sku,
    name: row.name,
    categorySlug: row.category.slug,
    brandSlug: row.brand.slug,
    collection: row.collection,
    shortDescription: row.shortDescription,
    description: row.description,
    basePrice: row.basePrice,
    oldPrice: row.oldPrice ?? undefined,
    currency: "AZN",
    rating: row.rating,
    reviewCount: row.reviewCount,
    material,
    securityClass,
    soundInsulationDb: row.soundInsulationDb,
    thermalW: row.thermalW,
    fireRating: row.fireRating,
    warrantyYears: row.warrantyYears,
    defaultWidth: row.defaultWidth,
    defaultHeight: row.defaultHeight,
    minWidth: row.minWidth,
    maxWidth: row.maxWidth,
    minHeight: row.minHeight,
    maxHeight: row.maxHeight,
    style,
    hasGlass: row.hasGlass,
    smartLockReady: row.smartLockReady,
    customSizeAvailable: row.customSizeAvailable,
    installationAvailable: row.installationAvailable,
    madeToOrder: row.madeToOrder,
    inStock: row.inStock,
    isNew: row.isNew,
    isBestseller: row.isBestseller,
    onSale: row.onSale,
    deliveryDays: [row.deliveryDaysMin, row.deliveryDaysMax],
    panelHexes: panelHexes.length > 0 ? panelHexes : ["#383e42"],
    images: parseImages(row.images),
    specs: parseSpecs(row.specs),
    documents: parseDocuments(row.documents),
    optionGroups: groups,
    optionValueIds: enabled.map((option) => option.optionValueId),
    optionValues: enabled
      .map((option) => mapOption(option.optionValue))
      .filter((option): option is OptionValue => option !== null),
  };
}

export async function catalogProducts(): Promise<Product[]> {
  const rows = await db.product.findMany({
    where: visible,
    include: productInclude,
    orderBy: [{ isBestseller: "desc" }, { rating: "desc" }, { name: "asc" }],
  });
  return rows.map(mapProduct);
}

export async function catalogProduct(slug: string): Promise<Product | null> {
  const row = await db.product.findFirst({ where: { slug, ...visible }, include: productInclude });
  return row ? mapProduct(row) : null;
}

/** Səbət, favorit və müqayisə siyahıları id-lərlə gəlir. */
export async function catalogProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  const rows = await db.product.findMany({
    where: { id: { in: ids }, ...visible },
    include: productInclude,
  });
  return rows.map(mapProduct);
}

export async function featuredCatalogProducts(limit = 8): Promise<Product[]> {
  return (await catalogProducts()).slice(0, limit);
}

export async function relatedCatalogProducts(product: Product, limit = 4): Promise<Product[]> {
  const rows = await db.product.findMany({
    where: { category: { slug: product.categorySlug }, id: { not: product.id }, ...visible },
    include: productInclude,
    orderBy: [{ isBestseller: "desc" }, { rating: "desc" }],
    take: limit,
  });
  return rows.map(mapProduct);
}

export async function catalogCategories(): Promise<Category[]> {
  const rows = await db.category.findMany({
    include: { _count: { select: { products: { where: visible } } } },
    orderBy: { name: "asc" },
  });
  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortName: row.shortName || row.name,
    description: row.description,
    productCount: row._count.products,
    featured: row.featured,
    accent: row.accent,
  }));
}

export async function catalogCategory(slug: string): Promise<Category | null> {
  return (await catalogCategories()).find((category) => category.slug === slug) ?? null;
}

export async function catalogBrands(): Promise<Brand[]> {
  const rows = await db.brand.findMany({
    include: { _count: { select: { products: { where: visible } } } },
    orderBy: { name: "asc" },
  });
  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    country: row.country,
    founded: row.founded,
    description: row.description,
    productCount: row._count.products,
  }));
}

export async function catalogBrand(slug: string): Promise<Brand | null> {
  return (await catalogBrands()).find((brand) => brand.slug === slug) ?? null;
}

/**
 * Konfiqurator addımlarının metadatası. Dəyərlər məhsula bağlıdır və
 * `Product.optionValues` ilə gəlir — burada yalnız başlıq, məcburilik və
 * çoxseçim qaydası saxlanılır.
 */
export async function catalogOptionGroups(): Promise<Record<OptionGroupKey, OptionGroupMeta>> {
  const rows = await db.optionGroup.findMany({ orderBy: { sortOrder: "asc" } });
  const groups = {} as Record<OptionGroupKey, OptionGroupMeta>;
  for (const row of rows) {
    if (!isOptionGroupKey(row.key)) continue;
    groups[row.key] = {
      key: row.key,
      title: row.title,
      hint: row.hint ?? "",
      required: row.required,
      multi: row.multi,
    };
  }
  return groups;
}

/** Qrup açarına görə bütün aktiv option dəyərləri (məsələn çatdırılma və quraşdırma). */
export async function catalogOptionValues(groupKeys: OptionGroupKey[]): Promise<OptionValue[]> {
  const rows = await db.optionValue.findMany({
    where: { groupKey: { in: groupKeys } },
    orderBy: { priceDelta: "asc" },
  });
  return rows.map(mapOption).filter((value): value is OptionValue => value !== null);
}

export async function catalogSizePresets(): Promise<SizePreset[]> {
  const rows = await db.sizePreset.findMany({ orderBy: { sortOrder: "asc" } });
  return rows.map((row) => ({ label: row.label, width: row.width, height: row.height }));
}
