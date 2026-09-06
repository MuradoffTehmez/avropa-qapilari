import { db } from "@/server/db";
import { fail, handle, ok } from "@/server/http";

/**
 * GET /api/configurations/:code — paylaşılan konfiqurasiya (PRD §57).
 *
 * Public-dir, lakin yalnız qapı seçimlərini qaytarır: sahibin adı,
 * e-poçtu və ya daxili id heç vaxt cavaba düşmür.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  return handle(async () => {
    const { code } = await params;

    const configuration = await db.configuration.findUnique({
      where: { code },
      include: { product: true },
    });

    if (!configuration) {
      return fail("NOT_FOUND", "Konfiqurasiya tapılmadı", 404);
    }

    return ok({
      code: configuration.code,
      productSlug: configuration.product.slug,
      productName: configuration.product.name,
      width: configuration.width,
      height: configuration.height,
      choices: JSON.parse(configuration.choices) as Record<string, string | string[]>,
      total: configuration.total,
      createdAt: configuration.createdAt.toISOString(),
    });
  });
}
