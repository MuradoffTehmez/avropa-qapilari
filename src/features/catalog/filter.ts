import type { DoorMaterial, Product, SecurityClass, SurfaceStyle } from "@/types";

/** Kataloq filtrləri və sıralama. */

export type SortKey = "popular" | "newest" | "priceAsc" | "priceDesc" | "rating" | "discount";

export interface CatalogFilters {
  categories: string[];
  brands: string[];
  collections: string[];
  materials: DoorMaterial[];
  securityClasses: SecurityClass[];
  styles: SurfaceStyle[];
  colors: string[];
  priceMin: number | null;
  priceMax: number | null;
  minSound: number | null;
  widthMin: number | null;
  widthMax: number | null;
  hasGlass: boolean;
  smartLock: boolean;
  customSize: boolean;
  installation: boolean;
  inStock: boolean;
  madeToOrder: boolean;
  onSale: boolean;
  fireRated: boolean;
}

export const emptyFilters: CatalogFilters = {
  categories: [],
  brands: [],
  collections: [],
  materials: [],
  securityClasses: [],
  styles: [],
  colors: [],
  priceMin: null,
  priceMax: null,
  minSound: null,
  widthMin: null,
  widthMax: null,
  hasGlass: false,
  smartLock: false,
  customSize: false,
  installation: false,
  inStock: false,
  madeToOrder: false,
  onSale: false,
  fireRated: false,
};

export function countActive(f: CatalogFilters): number {
  let n = 0;
  n += f.categories.length + f.brands.length + f.collections.length;
  n += f.materials.length + f.securityClasses.length + f.styles.length + f.colors.length;
  if (f.priceMin !== null || f.priceMax !== null) n += 1;
  if (f.minSound !== null) n += 1;
  if (f.widthMin !== null || f.widthMax !== null) n += 1;
  for (const key of [
    "hasGlass",
    "smartLock",
    "customSize",
    "installation",
    "inStock",
    "madeToOrder",
    "onSale",
    "fireRated",
  ] as const) {
    if (f[key]) n += 1;
  }
  return n;
}

export function applyFilters(products: Product[], f: CatalogFilters): Product[] {
  return products.filter((p) => {
    if (f.categories.length && !f.categories.includes(p.categorySlug)) return false;
    if (f.brands.length && !f.brands.includes(p.brandSlug)) return false;
    if (f.collections.length && !f.collections.includes(p.collection)) return false;
    if (f.materials.length && !f.materials.includes(p.material)) return false;
    if (f.securityClasses.length && !f.securityClasses.includes(p.securityClass)) return false;
    if (f.styles.length && !f.styles.includes(p.style)) return false;
    if (f.colors.length && !f.colors.some((c) => p.panelHexes.includes(c))) return false;

    if (f.priceMin !== null && p.basePrice < f.priceMin) return false;
    if (f.priceMax !== null && p.basePrice > f.priceMax) return false;
    if (f.minSound !== null && p.soundInsulationDb < f.minSound) return false;

    if (f.widthMin !== null && p.maxWidth < f.widthMin) return false;
    if (f.widthMax !== null && p.minWidth > f.widthMax) return false;

    if (f.hasGlass && !p.hasGlass) return false;
    if (f.smartLock && !p.smartLockReady) return false;
    if (f.customSize && !p.customSizeAvailable) return false;
    if (f.installation && !p.installationAvailable) return false;
    if (f.inStock && !p.inStock) return false;
    if (f.madeToOrder && !p.madeToOrder) return false;
    if (f.onSale && !p.onSale) return false;
    if (f.fireRated && !p.fireRating) return false;

    return true;
  });
}

export function sortProducts(products: Product[], key: SortKey): Product[] {
  const list = [...products];

  switch (key) {
    case "newest":
      return list.sort((a, b) => Number(b.isNew) - Number(a.isNew) || b.rating - a.rating);
    case "priceAsc":
      return list.sort((a, b) => a.basePrice - b.basePrice);
    case "priceDesc":
      return list.sort((a, b) => b.basePrice - a.basePrice);
    case "rating":
      return list.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    case "discount":
      return list.sort(
        (a, b) =>
          (b.oldPrice ? b.oldPrice - b.basePrice : 0) - (a.oldPrice ? a.oldPrice - a.basePrice : 0),
      );
    case "popular":
    default:
      return list.sort(
        (a, b) =>
          Number(b.isBestseller) - Number(a.isBestseller) || b.reviewCount - a.reviewCount,
      );
  }
}

/** Filter panelində göstərilən rəng seçimləri. */
export const filterColors: { hex: string; label: string }[] = [
  { hex: "#383e42", label: "Antrasit" },
  { hex: "#0e0e10", label: "Qara" },
  { hex: "#f1f0ea", label: "Ağ" },
  { hex: "#6b665e", label: "Boz" },
  { hex: "#a9743c", label: "Qızılı palıd" },
  { hex: "#5b3a26", label: "Qoz" },
  { hex: "#33312e", label: "Antrasit ağac" },
  { hex: "#c8a678", label: "Açıq palıd" },
  { hex: "#ece4d5", label: "Fil sümüyü" },
  { hex: "#c9ced1", label: "Şüşə" },
];
