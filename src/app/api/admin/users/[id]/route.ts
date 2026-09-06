import { requireUser } from "@/server/auth";
import { adminCustomers } from "@/server/admin";
import { recordAudit } from "@/server/audit";
import { db } from "@/server/db";
import { fail, handle, ok } from "@/server/http";
import { roleSchema } from "@/server/validation";

/**
 * PATCH /api/admin/users/:id — rol dəyişməsi (PRD §93, §94).
 *
 * Admin öz rolunu aşağı sala bilməz: əks halda paneldən özünü
 * kilidləyər və sistemdə adminsiz qalmaq riski yaranar.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return handle(async () => {
    const actor = await requireUser("ADMIN");
    const { id } = await params;

    const user = await db.user.findUnique({ where: { id } });
    if (!user) return fail("NOT_FOUND", "İstifadəçi tapılmadı", 404);

    const { role } = roleSchema.parse(await request.json());

    if (user.id === actor.id && role !== "ADMIN") {
      return fail("SELF_DEMOTION", "Öz rolunuzu dəyişə bilməzsiniz", 422, {
        role: "Öz rolunuzu dəyişə bilməzsiniz",
      });
    }

    if (user.role === "ADMIN" && role !== "ADMIN") {
      const admins = await db.user.count({ where: { role: "ADMIN" } });
      if (admins <= 1) {
        return fail("LAST_ADMIN", "Sistemdə ən azı bir admin qalmalıdır", 422, {
          role: "Sistemdə ən azı bir admin qalmalıdır",
        });
      }
    }

    await db.user.update({ where: { id }, data: { role } });
    await recordAudit(actor, "user.manage", user.email, `${user.role} → ${role}`);

    return ok(await adminCustomers());
  });
}
