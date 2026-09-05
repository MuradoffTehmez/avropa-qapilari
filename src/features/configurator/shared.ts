import type { ConfigurationSelection, Product } from "@/types";
import { findOptionValue } from "@/mock/options";
import { pruneIncompatible } from "./compatibility";

export function parseSharedDesign(raw: string | undefined, product: Product): ConfigurationSelection | undefined {
  if (!raw || raw.length > 8000) return;
  try {
    const input = JSON.parse(raw);
    if (!Number.isFinite(input.width) || !Number.isFinite(input.height) || input.width < 400 || input.width > 3000 || input.height < 1200 || input.height > 3000 || !input.choices || typeof input.choices !== "object") return;
    const choices: ConfigurationSelection["choices"] = {};
    for (const group of product.optionGroups) {
      const value = input.choices[group];
      if (!value) continue;
      const values = Array.isArray(value) ? value : [value];
      if (!values.every((id: unknown) => typeof id === "string" && findOptionValue(id)?.groupKey === group)) return;
      choices[group] = value;
    }
    return pruneIncompatible({ width: input.width, height: input.height, choices }, findOptionValue);
  } catch { return; }
}
