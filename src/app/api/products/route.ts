import { handle, ok } from "@/server/http";
import { catalogProducts } from "@/server/catalog";

/** GET /api/products — kataloq siyahısı, sadə filtrlərlə. */
export async function GET(request: Request) {
  return handle(async () => {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const brand = url.searchParams.get("brand");
    const limit = Math.min(Number(url.searchParams.get("limit") ?? 50), 100);

    const products = (await catalogProducts())
      .filter((product) => !category || product.categorySlug === category)
      .filter((product) => !brand || product.brandSlug === brand)
      .sort((a, b) => a.basePrice - b.basePrice)
      .slice(0, limit);

    return ok(products);
  });
}
