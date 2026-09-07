/**
 * Hər məhsulun başlanğıc konfiqurasiyasını server qiymətləndirməsindən
 * keçirir. Uyğunsuz default seçim varsa burada aşkarlanır — istifadəçi
 * konfiquratoru açan kimi 422 almasın.
 */
import { findOptionValue } from "../src/mock/options";
import { defaultChoices } from "../src/features/configurator/defaults";
import { pruneIncompatible } from "../src/features/configurator/compatibility";
import { calculatePrice, PricingError } from "../src/server/pricing";
import { db } from "../src/server/db";
import { catalogProducts } from "../src/server/catalog";

async function main() {
  let failed = 0;
  const products = await catalogProducts();

  for (const product of products) {
    const selection = pruneIncompatible(
      {
        width: product.defaultWidth,
        height: product.defaultHeight,
        choices: defaultChoices(product),
      },
      findOptionValue,
    );

    try {
      const price = await calculatePrice({
        productSlug: product.slug,
        width: selection.width,
        height: selection.height,
        choices: selection.choices,
      });
      console.log(`OK   ${product.slug.padEnd(26)} ${price.total} AZN`);
    } catch (error) {
      failed += 1;
      const reason = error instanceof PricingError ? `${error.code} — ${error.message}` : String(error);
      console.log(`XƏTA ${product.slug.padEnd(26)} ${reason}`);
    }
  }

  const first = products[0];
  if (first) {
    try {
      await calculatePrice({
        productSlug: first.slug,
        width: first.defaultWidth,
        height: first.defaultHeight,
        choices: {},
      });
      failed += 1;
      console.log("XƏTA məcburi seçimləri olmayan konfiqurasiya qəbul edildi");
    } catch (error) {
      if (!(error instanceof PricingError) || error.code !== "REQUIRED_OPTION_MISSING") {
        failed += 1;
        console.log(`XƏTA gözlənilməyən təhlükəsizlik cavabı: ${String(error)}`);
      }
    }

    const valid = pruneIncompatible(
      {
        width: first.defaultWidth,
        height: first.defaultHeight,
        choices: defaultChoices(first),
      },
      findOptionValue,
    );
    if (first.optionGroups.includes("HANDLE")) {
      try {
        await calculatePrice({
          productSlug: first.slug,
          width: valid.width,
          height: valid.height,
          choices: { ...valid.choices, HANDLE: "oc-ral7016" },
        });
        failed += 1;
        console.log("XƏTA başqa qrupun seçimi qəbul edildi");
      } catch (error) {
        if (!(error instanceof PricingError) || error.code !== "INVALID_OPTION_GROUP") {
          failed += 1;
          console.log(`XƏTA yanlış qrup üçün gözlənilməyən cavab: ${String(error)}`);
        }
      }
    }
  }

  console.log(failed === 0 ? "\nBütün başlanğıc konfiqurasiyalar keçərlidir." : `\n${failed} məhsulda problem var.`);
  process.exitCode = failed === 0 ? 0 : 1;
}

main().finally(() => db.$disconnect());
