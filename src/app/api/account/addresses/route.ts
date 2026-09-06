import { requireUser } from "@/server/auth";
import { db } from "@/server/db";
import { handle, ok } from "@/server/http";
import { userAddresses } from "@/server/account";
import { addressSchema } from "@/server/validation";

/** GET /api/account/addresses — yalnız cari istifadəçinin ünvanları. */
export async function GET() {
  return handle(async () => {
    const user = await requireUser();
    return ok(await userAddresses(user.id));
  });
}

/** POST /api/account/addresses — yeni ünvan. */
export async function POST(request: Request) {
  return handle(async () => {
    const user = await requireUser();
    const input = addressSchema.parse(await request.json());

    // İlk ünvan avtomatik əsas olur; sonrakılar açıq seçimlə.
    const count = await db.address.count({ where: { userId: user.id } });
    const isDefault = input.isDefault ?? count === 0;

    if (isDefault) {
      await db.address.updateMany({ where: { userId: user.id }, data: { isDefault: false } });
    }

    await db.address.create({
      data: {
        userId: user.id,
        label: input.label,
        city: input.city,
        district: input.district ?? "",
        street: input.street ?? "",
        building: input.building ?? "",
        apartment: input.apartment ?? "",
        floor: input.floor ?? "",
        isDefault,
      },
    });

    return ok(await userAddresses(user.id), { status: 201 });
  });
}
