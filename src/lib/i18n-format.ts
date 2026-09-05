import type { Dictionary } from "@/i18n";
import type { Brand, Category, DoorMaterial, Locale, SurfaceStyle } from "@/types";
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
