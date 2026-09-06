import { db } from "@/server/db";
import { fail, handle, ok } from "@/server/http";

/** GET /api/products/:slug — məhsul detalı və konfiqurator qrupları. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  return handle(async () => {
    const { slug } = await params;
    const product = await db.product.findUnique({
      where: { slug },
      include: { category: true, brand: true },
    });

    if (!product) return fail("NOT_FOUND", "Məhsul tapılmadı", 404);

    return ok({
      ...product,
      optionGroups: JSON.parse(product.optionGroups) as string[],
      panelHexes: JSON.parse(product.panelHexes) as string[],
      deliveryDays: [product.deliveryDaysMin, product.deliveryDaysMax],
    });
  });
}
