import { requireStaff } from "@/server/auth";
import { adminContentPages } from "@/server/admin";
import { changeDetail, recordAudit } from "@/server/audit";
import { db } from "@/server/db";
import { fail, handle, ok } from "@/server/http";
import { contentPageSchema } from "@/server/validation";
import { idempotentResponse } from "@/server/idempotency";

/** PATCH /api/admin/content/:id */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return handle(async () => {
    const actor = await requireStaff("ADMIN");
    const { id } = await params;
    return idempotentResponse(request, `admin.content.update:${id}`, actor.id, async () => {

    const current = await db.contentPage.findUnique({ where: { id } });
    if (!current) return fail("NOT_FOUND", "Səhifə tapılmadı", 404);

    const input = contentPageSchema.parse(await request.json());
    await db.contentPage.update({ where: { id }, data: input });

    await recordAudit(
      actor,
      "content.update",
      current.path,
      changeDetail({
        title: [current.title, input.title],
        published: [current.published, input.published],
      }),
    );

      return ok(await adminContentPages());
    });
  });
}

/** DELETE /api/admin/content/:id */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return handle(async () => {
    const actor = await requireStaff("ADMIN");
    const { id } = await params;
    return idempotentResponse(request, `admin.content.delete:${id}`, actor.id, async () => {

    const current = await db.contentPage.findUnique({ where: { id } });
    if (!current) return fail("NOT_FOUND", "Səhifə tapılmadı", 404);

    await db.contentPage.delete({ where: { id } });
    await recordAudit(actor, "content.delete", current.path);

      return ok(await adminContentPages());
    });
  });
}
