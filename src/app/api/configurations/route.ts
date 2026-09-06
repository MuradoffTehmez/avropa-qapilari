import { currentUser } from "@/server/auth";
import { db } from "@/server/db";
import { fail, handle, ok } from "@/server/http";
import { nextNumber } from "@/server/numbering";
import { calculatePrice, PricingError } from "@/server/pricing";
import { configurationSchema } from "@/server/validation";

/**
 * POST /api/configurations — konfiqurasiyanı saxlayır.
 *
 * Qiymət client-dən qəbul edilmir: seçimlər bazadan oxunub yenidən
 * hesablanır (PRD §130). Nömrə CFG-2026-000001 formatındadır (PRD §62).
 * Giriş etməmiş istifadəçi də saxlaya bilir — link paylaşmaq üçün;
 * kabinetdə yalnız `userId` ilə bağlananlar görünür.
 */
export async function POST(request: Request) {
  return handle(async () => {
    const input = configurationSchema.parse(await request.json());
    const user = await currentUser();

    let total: number;
    try {
      total = (await calculatePrice(input)).total;
    } catch (error) {
      if (error instanceof PricingError) {
        return fail(error.code, error.message, error.code === "PRODUCT_NOT_FOUND" ? 404 : 422);
      }
      throw error;
    }

    const product = await db.product.findUnique({ where: { slug: input.productSlug } });
    if (!product) return fail("PRODUCT_NOT_FOUND", "Məhsul tapılmadı", 404);

    const configuration = await db.$transaction(async (tx) => {
      const code = await nextNumber(tx, "CFG");
      return tx.configuration.create({
        data: {
          code,
          productId: product.id,
          userId: user?.id ?? null,
          width: input.width,
          height: input.height,
          choices: JSON.stringify(input.choices),
          total,
        },
      });
    });

    return ok(
      { code: configuration.code, total: configuration.total },
      { status: 201 },
    );
  });
}

/** GET /api/configurations — cari istifadəçinin saxladıqları. */
export async function GET() {
  return handle(async () => {
    const user = await currentUser();
    if (!user) return fail("UNAUTHENTICATED", "Giriş tələb olunur", 401);

    const rows = await db.configuration.findMany({
      where: { userId: user.id },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });

    return ok(
      rows.map((c) => ({
        code: c.code,
        productSlug: c.product.slug,
        productName: c.product.name,
        width: c.width,
        height: c.height,
        choices: JSON.parse(c.choices) as Record<string, string | string[]>,
        total: c.total,
        createdAt: c.createdAt.toISOString(),
      })),
    );
  });
}
