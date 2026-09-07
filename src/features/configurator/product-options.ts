import type { OptionGroupKey, OptionValue, Product } from "@/types";
import { findOptionValue, optionGroups } from "@/mock/options";

/** Məhsul bazadan gəlibsə canlı option-ları, statik data gəlirsə fallback-i qaytarır. */
export function resolveProductOption(product: Product, id: string): OptionValue | undefined {
  return product.optionValues ? product.optionValues.find((value) => value.id === id) : findOptionValue(id);
}

export function productOptionsForGroup(product: Product, group: OptionGroupKey): OptionValue[] {
  return product.optionValues
    ? product.optionValues.filter((value) => value.groupKey === group)
    : optionGroups[group].values;
}
