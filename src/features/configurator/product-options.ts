import type { OptionGroupKey, OptionValue, Product } from "@/types";

/** Konfiqurator dəyərləri məhsulla birlikdə bazadan gəlir (Product.optionValues). */
export function resolveProductOption(product: Product, id: string): OptionValue | undefined {
  return product.optionValues?.find((value) => value.id === id);
}

export function productOptionsForGroup(product: Product, group: OptionGroupKey): OptionValue[] {
  return (product.optionValues ?? []).filter((value) => value.groupKey === group);
}
