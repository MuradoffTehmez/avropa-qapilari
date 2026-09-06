import { requireUser } from "@/server/auth";
import { userAddresses } from "@/server/account";
import { db } from "@/server/db";
import { fail, handle, ok } from "@/server/http";
import { addressSchema } from "@/server/validation";

/** Ünvanın cari istifadəçiyə aid olduğunu təsdiqləyir (PRD §93). */
async function ownAddress(id: string, userId: string) {
  const address = await db.address.findUnique({ where: { id } });
  return address && address.userId === userId ? address : null;
}

/** PATCH /api/account/addresses/:id */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return handle(async () => {
    const user = await requireUser();
    const { id } = await params;

    if (!(await ownAddress(id, user.id))) {
      return fail("NOT_FOUND", "Ünvan tapılmadı", 404);
    }

    const input = addressSchema.parse(await request.json());

    if (input.isDefault) {
      await db.address.updateMany({ where: { userId: user.id }, data: { isDefault: false } });
    }

    await db.address.update({
      where: { id },
      data: {
        label: input.label,
        city: input.city,
        district: input.district ?? "",
        street: input.street ?? "",
        building: input.building ?? "",
        apartment: input.apartment ?? "",
        floor: input.floor ?? "",
        isDefault: input.isDefault ?? false,
      },
    });

    return ok(await userAddresses(user.id));
  });
}

/** DELETE /api/account/addresses/:id */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return handle(async () => {
    const user = await requireUser();
    const { id } = await params;

    if (!(await ownAddress(id, user.id))) {
      return fail("NOT_FOUND", "Ünvan tapılmadı", 404);
    }

    await db.address.delete({ where: { id } });
    return ok(await userAddresses(user.id));
  });
}
