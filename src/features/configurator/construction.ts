import type { ConfigurationSelection, ConstructionLayer, Product } from "@/types";
import { constructionLayers } from "@/mock/construction";
import { resolveProductOption } from "./product-options";

/**
 * Seçimə uyğunlaşdırılmış konstruksiya yığını.
 *
 * Materialın baza qatları götürülür, sonra konfiqurasiya tətbiq olunur:
 * xarici/daxili rəng üz qatlarının rəngini, izolyasiya paketi isə ən qalın
 * nüvə qatının qalınlığını dəyişir. Həm kəsik görünüşü, həm də 360°
 * baxışdakı qapı kəsiyi eyni yığından oxuyur.
 */
export function configuredConstruction(
  product: Product,
  selection: ConfigurationSelection,
  hidden: Set<string> = new Set(),
): ConstructionLayer[] {
  const stack = constructionLayers(product.material).map((layer) => ({ ...layer }));
  const outside = resolveProductOption(product, selection.choices.OUTSIDE_COLOR as string);
  const inside = resolveProductOption(product, selection.choices.INSIDE_COLOR as string);

  if (!hidden.has("OUTSIDE_COLOR") && outside?.hex && stack[0]) {
    stack[0].color = outside.hex;
  }
  if (!hidden.has("INSIDE_COLOR") && inside?.hex && stack.at(-1)) {
    stack[stack.length - 1].color = inside.hex;
  }

  if (!hidden.has("INSULATION")) {
    const insulation = resolveProductOption(product, selection.choices.INSULATION as string);
    const extra =
      insulation?.code === "MAX"
        ? 10
        : insulation?.code === "THERMAL"
          ? 7
          : insulation?.code === "ACOUSTIC"
            ? 4
            : 0;
    if (extra > 0 && stack.length > 2) {
      const coreIndex = stack.reduce(
        (best, layer, index) => (layer.thicknessMm > stack[best].thicknessMm ? index : best),
        0,
      );
      stack[coreIndex].thicknessMm += extra;
    }
  }

  return stack;
}

export function stackThickness(stack: ConstructionLayer[]): number {
  return stack.reduce((sum, layer) => sum + layer.thicknessMm, 0);
}
