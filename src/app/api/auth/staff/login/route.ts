import { createSession, verifyPassword } from "@/server/auth";
import { db } from "@/server/db";
import { recordAudit } from "@/server/audit";
import { fail, handle, ok } from "@/server/http";
import { staffLoginSchema } from "@/server/validation";

/** POST /api/auth/staff/login — müştəri sessiyasından ayrı əməkdaş girişi. */
export async function POST(request: Request) {
  return handle(async () => {
    const input = staffLoginSchema.parse(await request.json());
    const user = await db.user.findUnique({ where: { email: input.email.toLowerCase() } });
    const valid = user ? await verifyPassword(input.password, user.password) : false;

    if (!user || !valid) {
      return fail("INVALID_CREDENTIALS", "E-poçt və ya parol yanlışdır", 401);
    }
    if (user.role !== input.role) {
      return fail("WRONG_STAFF_PANEL", "Bu hesab seçilmiş əməkdaş panelinə aid deyil", 403);
    }

    await createSession(user.id, "staff");
    await recordAudit(
      { id: user.id, name: user.name, email: user.email, role: input.role },
      "auth.staff.login",
      input.role,
    );
    return ok({ id: user.id, name: user.name, email: user.email, role: user.role });
  });
}
