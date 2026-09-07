import { requireStaff } from "@/server/auth";
import { adminSeoEntries } from "@/server/admin";
import { changeDetail, recordAudit } from "@/server/audit";
import { db } from "@/server/db";
import { fail, handle, ok } from "@/server/http";
import { seoEntrySchema } from "@/server/validation";

/** PATCH /api/admin/seo/:id */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return handle(async () => {
    const actor = await requireStaff("ADMIN");
    const { id } = await params;

    const current = await db.seoEntry.findUnique({ where: { id } });
    if (!current) return fail("NOT_FOUND", "Qeyd tapılmadı", 404);

    const input = seoEntrySchema.parse(await request.json());
    await db.seoEntry.update({
      where: { id },
      data: { ...input, canonical: input.canonical || null },
    });

    await recordAudit(
      actor,
      "seo.update",
      current.path,
      changeDetail({ title: [current.title, input.title] }),
    );

    return ok(await adminSeoEntries());
  });
}

/** DELETE /api/admin/seo/:id */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return handle(async () => {
    const actor = await requireStaff("ADMIN");
    const { id } = await params;

    const current = await db.seoEntry.findUnique({ where: { id } });
    if (!current) return fail("NOT_FOUND", "Qeyd tapılmadı", 404);

    await db.seoEntry.delete({ where: { id } });
    await recordAudit(actor, "seo.delete", current.path);

    return ok(await adminSeoEntries());
  });
}
