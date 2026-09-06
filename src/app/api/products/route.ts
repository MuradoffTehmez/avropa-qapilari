import { db } from "@/server/db";
import { handle, ok } from "@/server/http";

/** GET /api/products — kataloq siyahısı, sadə filtrlərlə. */
export async function GET(request: Request) {
  return handle(async () => {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const brand = url.searchParams.get("brand");
    const limit = Math.min(Number(url.searchParams.get("limit") ?? 50), 100);

    const products = await db.product.findMany({
      where: {
        ...(category ? { category: { slug: category } } : {}),
        ...(brand ? { brand: { slug: brand } } : {}),
      },
      include: { category: true, brand: true },
      orderBy: { basePrice: "asc" },
      take: limit,
    });

    return ok(products.map(serialize));
  });
}

function serialize(p: Awaited<ReturnType<typeof db.product.findMany>>[number] & {
  category?: { slug: string; name: string };
  brand?: { slug: string; name: string };
}) {
  return {
    slug: p.slug,
    sku: p.sku,
    name: p.name,
    basePrice: p.basePrice,
    oldPrice: p.oldPrice,
    material: p.material,
    securityClass: p.securityClass,
    inStock: p.inStock,
    rating: p.rating,
    reviewCount: p.reviewCount,
    categorySlug: p.category?.slug,
    brandSlug: p.brand?.slug,
    panelHexes: JSON.parse(p.panelHexes) as string[],
  };
}
