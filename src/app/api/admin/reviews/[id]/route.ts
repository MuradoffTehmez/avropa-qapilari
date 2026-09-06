import { revalidatePath } from "next/cache";

import { requireUser } from "@/server/auth";
import { adminReviews } from "@/server/admin";
import { recordAudit } from "@/server/audit";
import { db } from "@/server/db";
import { fail, handle, ok } from "@/server/http";
import { reviewStatusSchema } from "@/server/validation";

/**
 * PATCH /api/admin/reviews/:id — rəy moderasiyası (PRD §103).
 * Yalnız APPROVED statuslu rəy saytda göstərilir.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return handle(async () => {
    const actor = await requireUser("ADMIN");
    const { id } = await params;

    const current = await db.review.findUnique({ where: { id } });
    if (!current) return fail("NOT_FOUND", "Rəy tapılmadı", 404);

    const { status } = reviewStatusSchema.parse(await request.json());
    await db.review.update({ where: { id }, data: { status } });
    await recordAudit(actor, "review.moderate", current.author, `${current.status} → ${status}`);

    // Rəylər statik səhifələrdə göstərilir; moderasiya dərhal əks olunsun.
    revalidatePath("/", "layout");

    return ok(await adminReviews());
  });
}

/** DELETE /api/admin/reviews/:id */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return handle(async () => {
    const actor = await requireUser("ADMIN");
    const { id } = await params;

    const current = await db.review.findUnique({ where: { id } });
    if (!current) return fail("NOT_FOUND", "Rəy tapılmadı", 404);

    await db.review.delete({ where: { id } });
    await recordAudit(actor, "review.delete", current.author);
    revalidatePath("/", "layout");

    return ok(await adminReviews());
  });
}
