import { requireStaff } from "@/server/auth";
import { adminSeoEntries } from "@/server/admin";
import { recordAudit } from "@/server/audit";
import { db } from "@/server/db";
import { fail, handle, ok } from "@/server/http";
import { seoEntrySchema } from "@/server/validation";

/** GET /api/admin/seo */
export async function GET() {
  return handle(async () => {
    await requireStaff("ADMIN");
    return ok(await adminSeoEntries());
  });
}

/** POST /api/admin/seo — səhifə üçün meta mətnlər. */
export async function POST(request: Request) {
  return handle(async () => {
    const actor = await requireStaff("ADMIN");
    const input = seoEntrySchema.parse(await request.json());

    const exists = await db.seoEntry.findUnique({ where: { path: input.path } });
    if (exists) {
      return fail("DUPLICATE_PATH", "Bu yol üçün qeyd artıq var", 422, {
        path: "Bu yol üçün qeyd artıq var",
      });
    }

    await db.seoEntry.create({ data: { ...input, canonical: input.canonical || null } });
    await recordAudit(actor, "seo.create", input.path, input.title);

    return ok(await adminSeoEntries(), { status: 201 });
  });
}
