import type { ConfigurationSelection, Product } from "@/types";
import { pruneIncompatible } from "./compatibility";
import { withinSizeLimits } from "./limits";
import { resolveProductOption } from "./product-options";

export function parseSharedDesign(raw: string | undefined, product: Product): ConfigurationSelection | undefined {
  if (!raw || raw.length > 8000) return;
  try {
    const input = JSON.parse(raw);
    if (!withinSizeLimits(input.width, input.height)) return;
    if (!input.choices || typeof input.choices !== "object") return;
    const choices: ConfigurationSelection["choices"] = {};
    for (const group of product.optionGroups) {
      const value = input.choices[group];
      if (!value) continue;
      const values = Array.isArray(value) ? value : [value];
      if (!values.every((id: unknown) => typeof id === "string" && resolveProductOption(product, id)?.groupKey === group)) return;
      choices[group] = value;
    }
    return pruneIncompatible(
      { width: input.width, height: input.height, choices },
      (id) => resolveProductOption(product, id),
    );
  } catch { return; }
}
