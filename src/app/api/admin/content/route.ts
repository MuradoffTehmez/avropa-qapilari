import { requireStaff } from "@/server/auth";
import { adminContentPages } from "@/server/admin";
import { recordAudit } from "@/server/audit";
import { db } from "@/server/db";
import { fail, handle, ok } from "@/server/http";
import { contentPageSchema } from "@/server/validation";
import { idempotentResponse } from "@/server/idempotency";

/** GET /api/admin/content */
export async function GET() {
  return handle(async () => {
    await requireStaff("ADMIN");
    return ok(await adminContentPages());
  });
}

/** POST /api/admin/content — yeni məzmun səhifəsi. */
export async function POST(request: Request) {
  return handle(async () => {
    const actor = await requireStaff("ADMIN");
    return idempotentResponse(request, "admin.content.create", actor.id, async () => {
      const input = contentPageSchema.parse(await request.json());

    const exists = await db.contentPage.findUnique({ where: { path: input.path } });
    if (exists) {
      return fail("DUPLICATE_PATH", "Bu yol artıq mövcuddur", 422, {
        path: "Bu yol artıq mövcuddur",
      });
    }

    await db.contentPage.create({ data: input });
    await recordAudit(actor, "content.create", input.path, input.title);

      return ok(await adminContentPages(), { status: 201 });
    });
  });
}
