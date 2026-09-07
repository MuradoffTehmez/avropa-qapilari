import type {
  ConfigurationSelection,
  OptionGroupKey,
  OptionGroupMeta,
  Product,
} from "@/types";
import { productOptionsForGroup } from "./product-options";

/**
 * Konfiquratorun başlanğıc seçimləri.
 *
 * Nəticə `pruneIncompatible` ilə təmizlənməlidir: bəzi qruplarda bütün
 * dəyərlər ilkin şərt tələb edir (məsələn şüşə naxışı şüşə tələb edir).
 *
 * `groups` qrup qaydalarıdır — bazadan (`catalogOptionGroups`) gəlir.
 */
export function defaultChoices(
  product: Product,
  groups: Partial<Record<OptionGroupKey, OptionGroupMeta>>,
): ConfigurationSelection["choices"] {
  const choices: ConfigurationSelection["choices"] = {};

  for (const key of product.optionGroups) {
    if (key === "SIZE") continue;
    const group = groups[key];
    if (!group) continue;
    const values = productOptionsForGroup(product, key);

    if (group.multi) {
      choices[key] = [];
      continue;
    }

    // Xarici rəng üçün məhsulun öz palitrasına uyğun dəyəri seçirik
    // Panel naxışı məhsulun öz stilindən başlayır
    if (key === "PANEL_STYLE") {
      const match = values.find((v) => v.code === product.style);
      if (match) {
        choices[key] = match.id;
        continue;
      }
    }

    if (key === "OUTSIDE_COLOR") {
      const match = values.find((v) => v.hex === product.panelHexes[0]);
      if (match) {
        choices[key] = match.id;
        continue;
      }
    }

    const first = values.find((v) => v.priceDelta === 0 && !v.requires) ?? values[0];
    if (first) choices[key] = first.id;
  }

  return choices;
}
