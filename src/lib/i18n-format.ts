import type { Dictionary } from "@/i18n";
import type { Brand, Category, DoorMaterial, Locale, Product, SurfaceStyle } from "@/types";
import { formatPrice } from "@/lib/utils";

/**
 * "620 AZN-dən" / "from 620 AZN" / "от 620 AZN"
 * Azərbaycan dilində şəkilçi sözdən sonra gəlir, digərlərində ön söz.
 */
export function priceFrom(value: number, locale: Locale, dict: Dictionary): string {
  const price = formatPrice(value);
  return locale === "az" ? `${price}${dict.common.from}` : `${dict.common.from} ${price}`;
}

/** Kateqoriya adı — dilə uyğun. */
export function categoryName(category: Category, dict: Dictionary): string {
  return dict.taxonomy.categories[category.slug as keyof Dictionary["taxonomy"]["categories"]] ?? category.name;
}

export function categoryNameBySlug(slug: string, dict: Dictionary, fallback = ""): string {
  return dict.taxonomy.categories[slug as keyof Dictionary["taxonomy"]["categories"]] ?? fallback;
}

export function materialName(material: DoorMaterial, dict: Dictionary): string {
  return dict.taxonomy.materials[material];
}

export function styleName(style: SurfaceStyle, dict: Dictionary): string {
  return dict.taxonomy.styles[style];
}

export function countryName(brand: Brand, dict: Dictionary): string {
  return dict.taxonomy.countries[brand.country as keyof Dictionary["taxonomy"]["countries"]] ?? brand.country;
}

export function countryNameByCode(code: string, dict: Dictionary): string {
  return dict.taxonomy.countries[code as keyof Dictionary["taxonomy"]["countries"]] ?? code;
}

/** Kateqoriya təsviri — dilə uyğun. */
export function categoryDescription(category: Category, dict: Dictionary): string {
  const key = category.slug as keyof Dictionary["taxonomy"]["categoryDescriptions"];
  return dict.taxonomy.categoryDescriptions[key] ?? category.description;
}

/** Brend təsviri — dilə uyğun. */
export function brandDescription(brand: Brand, dict: Dictionary): string {
  const key = brand.slug as keyof Dictionary["taxonomy"]["brandDescriptions"];
  return dict.taxonomy.brandDescriptions[key] ?? brand.description;
}

/** Məhsulun qısa təsviri — dilə uyğun. */
export function productShort(product: Product, dict: Dictionary): string {
  const key = product.sku as keyof Dictionary["taxonomy"]["productShort"];
  return dict.taxonomy.productShort[key] ?? product.shortDescription;
}

/** Məhsulun tam təsviri: qısa təsvir + ümumi mətn. */
export function productDescription(product: Product, dict: Dictionary): string {
  return `${productShort(product, dict)} ${dict.taxonomy.productLong.replace("{name}", product.name)}`;
}

/** Ustanın ixtisas sahəsi — dilə uyğun. */
export function specializationName(key: string, dict: Dictionary): string {
  const map = dict.about.specializations;
  return key in map ? map[key as keyof typeof map] : key;
}
