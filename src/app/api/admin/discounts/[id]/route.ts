import { requireStaff } from "@/server/auth";
import { adminDiscounts } from "@/server/admin";
import { changeDetail, recordAudit } from "@/server/audit";
import { db } from "@/server/db";
import { fail, handle, ok } from "@/server/http";
import { discountSchema } from "@/server/validation";

/** PATCH /api/admin/discounts/:id */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return handle(async () => {
    const actor = await requireStaff("ADMIN");
    const { id } = await params;

    const current = await db.discount.findUnique({ where: { id } });
    if (!current) return fail("NOT_FOUND", "Endirim tapılmadı", 404);

    const input = discountSchema.parse(await request.json());
    await db.discount.update({ where: { id }, data: input });

    await recordAudit(
      actor,
      "discount.update",
      current.code,
      changeDetail({
        value: [current.value, input.value],
        active: [current.active, input.active],
        endsAt: [current.endsAt, input.endsAt],
      }),
    );

    return ok(await adminDiscounts());
  });
}

/** DELETE /api/admin/discounts/:id */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return handle(async () => {
    const actor = await requireStaff("ADMIN");
    const { id } = await params;

    const current = await db.discount.findUnique({ where: { id } });
    if (!current) return fail("NOT_FOUND", "Endirim tapılmadı", 404);

    await db.discount.delete({ where: { id } });
    await recordAudit(actor, "discount.delete", current.code);

    return ok(await adminDiscounts());
  });
}
