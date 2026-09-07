import { fail, handle, ok } from "@/server/http";
import { catalogProduct } from "@/server/catalog";

/** GET /api/products/:slug — məhsul detalı və konfiqurator qrupları. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  return handle(async () => {
    const { slug } = await params;
    const product = await catalogProduct(slug);

    if (!product) return fail("NOT_FOUND", "Məhsul tapılmadı", 404);

    return ok(product);
  });
}
