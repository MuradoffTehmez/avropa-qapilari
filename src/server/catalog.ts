import type { Prisma } from "@prisma/client";

import { db } from "@/server/db";
import type {
  Brand,
  Category,
  DoorMaterial,
  OptionGroupKey,
  Product,
  SecurityClass,
  SurfaceStyle,
} from "@/types";
import { products as seedProducts } from "@/mock/products";
import { brands as seedBrands, categories as seedCategories } from "@/mock/taxonomy";

type ProductRow = Prisma.ProductGetPayload<{
  include: { category: true; brand: true };
}>;

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

function jsonStrings(value: string): string[] {
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function mapProduct(row: ProductRow): Product {
  // Bazada hələ ayrıca media/specification cədvəlləri olmayan sahələr üçün
  // mövcud seed metadatası yalnız təqdimat fallback-ı kimi saxlanılır. Siyahının
  // özü, qiymət, stok, ölçü və konfiqurator qrupları həmişə bazadan gəlir.
  const fallback = seedProducts.find((product) => product.slug === row.slug);
  const groups = jsonStrings(row.optionGroups).filter((key): key is OptionGroupKey =>
    optionGroupKeys.has(key as OptionGroupKey),
  );
  const panelHexes = jsonStrings(row.panelHexes);
  const material = materials.has(row.material as DoorMaterial)
    ? (row.material as DoorMaterial)
    : "STEEL";
  const securityClass = securityClasses.has(row.securityClass as SecurityClass)
    ? (row.securityClass as SecurityClass)
    : "—";
  const style = surfaceStyles.has(row.style as SurfaceStyle)
    ? (row.style as SurfaceStyle)
    : "MODERN";

  return {
    id: row.id,
    slug: row.slug,
    sku: row.sku,
    name: row.name,
    categorySlug: row.category.slug,
    brandSlug: row.brand.slug,
    collection: row.collection,
    shortDescription: fallback?.shortDescription ?? "",
    description: fallback?.description ?? "",
    basePrice: row.basePrice,
    oldPrice: row.oldPrice ?? undefined,
    currency: "AZN",
    rating: row.rating,
    reviewCount: row.reviewCount,
    material,
    securityClass,
    soundInsulationDb: row.soundInsulationDb,
    thermalW: fallback?.thermalW ?? 0,
    fireRating: row.fireRating,
    warrantyYears: row.warrantyYears,
    defaultWidth: row.defaultWidth,
    defaultHeight: row.defaultHeight,
    minWidth: row.minWidth,
    maxWidth: row.maxWidth,
    minHeight: row.minHeight,
    maxHeight: row.maxHeight,
    style,
    hasGlass: fallback?.hasGlass ?? groups.includes("GLASS"),
    smartLockReady: fallback?.smartLockReady ?? groups.includes("SMART_LOCK"),
    customSizeAvailable: fallback?.customSizeAvailable ?? true,
    installationAvailable: fallback?.installationAvailable ?? groups.includes("INSTALLATION"),
    madeToOrder: fallback?.madeToOrder ?? !row.inStock,
    inStock: row.inStock,
    isNew: row.isNew,
    isBestseller: row.isBestseller,
    onSale: row.onSale,
    deliveryDays: [row.deliveryDaysMin, row.deliveryDaysMax],
    panelHexes: panelHexes.length > 0 ? panelHexes : (fallback?.panelHexes ?? ["#383e42"]),
    images: fallback?.images ?? [],
    specs: fallback?.specs ?? [],
    documents: fallback?.documents ?? [],
    optionGroups: groups.length > 0 ? groups : (fallback?.optionGroups ?? ["SIZE"]),
  };
}

export async function catalogProducts(): Promise<Product[]> {
  const rows = await db.product.findMany({
    include: { category: true, brand: true },
    orderBy: [{ isBestseller: "desc" }, { rating: "desc" }, { name: "asc" }],
  });
  return rows.map(mapProduct);
}

export async function catalogProduct(slug: string): Promise<Product | null> {
  const row = await db.product.findUnique({
    where: { slug },
    include: { category: true, brand: true },
  });
  return row ? mapProduct(row) : null;
}

export async function featuredCatalogProducts(limit = 8): Promise<Product[]> {
  return (await catalogProducts()).slice(0, limit);
}

export async function relatedCatalogProducts(product: Product, limit = 4): Promise<Product[]> {
  const rows = await db.product.findMany({
    where: { category: { slug: product.categorySlug }, id: { not: product.id } },
    include: { category: true, brand: true },
    orderBy: [{ isBestseller: "desc" }, { rating: "desc" }],
    take: limit,
  });
  return rows.map(mapProduct);
}

export async function catalogCategories(): Promise<Category[]> {
  const rows = await db.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
  return rows.map((row) => {
    const fallback = seedCategories.find((category) => category.slug === row.slug);
    return {
      id: row.id,
      slug: row.slug,
      name: row.name,
      shortName: fallback?.shortName ?? row.name,
      description: fallback?.description ?? "",
      productCount: row._count.products,
      featured: fallback?.featured ?? row._count.products > 0,
      accent: fallback?.accent ?? "var(--color-graphite)",
    };
  });
}

export async function catalogCategory(slug: string): Promise<Category | null> {
  return (await catalogCategories()).find((category) => category.slug === slug) ?? null;
}

export async function catalogBrands(): Promise<Brand[]> {
  const rows = await db.brand.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
  return rows.map((row) => {
    const fallback = seedBrands.find((brand) => brand.slug === row.slug);
    return {
      id: row.id,
      slug: row.slug,
      name: row.name,
      country: row.country,
      founded: row.founded,
      description: fallback?.description ?? "",
      productCount: row._count.products,
    };
  });
}

export async function catalogBrand(slug: string): Promise<Brand | null> {
  return (await catalogBrands()).find((brand) => brand.slug === slug) ?? null;
}
