import { requireUser } from "@/server/auth";
import { handle, ok } from "@/server/http";
import { setUserFavorites, userFavorites } from "@/server/lists";
import { favoritesSyncSchema } from "@/server/validation";

/** GET /api/account/favorites — yalnız cari istifadəçinin favoritləri. */
export async function GET() {
  return handle(async () => {
    const user = await requireUser();
    return ok({ productIds: await userFavorites(user.id) });
  });
}

/**
 * PUT /api/account/favorites — siyahını yazır.
 * `merge: true` girişdən sonra brauzerdəki siyahını itirmədən birləşdirir.
 */
export async function PUT(request: Request) {
  return handle(async () => {
    const user = await requireUser();
    const input = favoritesSyncSchema.parse(await request.json());
    return ok({ productIds: await setUserFavorites(user.id, input.productIds, input.merge) });
  });
}
