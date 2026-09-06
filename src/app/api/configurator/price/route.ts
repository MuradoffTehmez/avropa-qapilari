import { calculatePrice, PricingError } from "@/server/pricing";
import { fail, handle, ok } from "@/server/http";
import { priceSchema } from "@/server/validation";

/**
 * POST /api/configurator/price
 *
 * Qiyməti SERVER hesablayır (PRD §130). Client-in göndərdiyi hər hansı
 * qiymət dəyəri nəzərə alınmır — yalnız slug, ölçü və seçim id-ləri.
 */
export async function POST(request: Request) {
  return handle(async () => {
    const input = priceSchema.parse(await request.json());

    try {
      return ok(await calculatePrice(input));
    } catch (error) {
      if (error instanceof PricingError) {
        const status = error.code === "PRODUCT_NOT_FOUND" ? 404 : 422;
        return fail(error.code, error.message, status);
      }
      throw error;
    }
  });
}
