/**
 * Hər məhsulun başlanğıc konfiqurasiyasını server qiymətləndirməsindən
 * keçirir. Uyğunsuz default seçim varsa burada aşkarlanır — istifadəçi
 * konfiquratoru açan kimi 422 almasın.
 */
import { products } from "../src/mock/products";
import { findOptionValue } from "../src/mock/options";
import { defaultChoices } from "../src/features/configurator/defaults";
import { pruneIncompatible } from "../src/features/configurator/compatibility";
import { calculatePrice, PricingError } from "../src/server/pricing";
import { db } from "../src/server/db";

async function main() {
  let failed = 0;

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

  console.log(failed === 0 ? "\nBütün başlanğıc konfiqurasiyalar keçərlidir." : `\n${failed} məhsulda problem var.`);
  process.exitCode = failed === 0 ? 0 : 1;
}

main().finally(() => db.$disconnect());
