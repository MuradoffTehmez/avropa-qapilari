import { requireUser } from "@/server/auth";
import { fail, handle, ok } from "@/server/http";
import { CartSyncError, setUserCart, userCart } from "@/server/lists";
import { cartSyncSchema } from "@/server/validation";

/** GET /api/account/cart — yalnız cari istifadəçinin səbəti. */
export async function GET() {
  return handle(async () => {
    const user = await requireUser();
    return ok(await userCart(user.id));
  });
}

/**
 * PUT /api/account/cart — səbəti tam əvəz edir.
 * Vahid qiymət client-dən qəbul edilmir, hər sətir üçün yenidən
 * hesablanır (PRD §130).
 */
export async function PUT(request: Request) {
  return handle(async () => {
    const user = await requireUser();
    const input = cartSyncSchema.parse(await request.json());

    try {
      return ok(await setUserCart(user.id, input.items));
    } catch (error) {
      if (error instanceof CartSyncError) {
        return fail(error.code, error.message, 422, { productSlug: error.productSlug });
      }
      throw error;
    }
  });
}
