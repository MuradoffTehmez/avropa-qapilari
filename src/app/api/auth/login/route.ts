import { createSession, verifyPassword } from "@/server/auth";
import { db } from "@/server/db";
import { fail, handle, ok } from "@/server/http";
import { loginSchema } from "@/server/validation";

/** POST /api/auth/login */
export async function POST(request: Request) {
  return handle(async () => {
    const input = loginSchema.parse(await request.json());
    const user = await db.user.findUnique({ where: { email: input.email.toLowerCase() } });

    // İstifadəçi yoxdursa da eyni cavab qaytarılır — hansı e-poçtun
    // qeydiyyatda olduğu sızmasın.
    const valid = user ? await verifyPassword(input.password, user.password) : false;
    if (!user || !valid) {
      return fail("INVALID_CREDENTIALS", "E-poçt və ya parol yanlışdır", 401);
    }

    if (user.deactivatedAt) {
      return fail("ACCOUNT_DISABLED", "Hesab deaktiv edilib", 403);
    }

    if (user.role === "ADMIN") {
      return fail("ADMIN_ACCOUNT", "Bu hesab idarəetmə panelinə aiddir", 403);
    }
    if (user.role === "TECHNICIAN") {
      return fail("TECHNICIAN_ACCOUNT", "Bu hesab usta kabinetinə aiddir", 403);
    }

    await createSession(user.id);

    return ok({ id: user.id, name: user.name, email: user.email, role: user.role });
  });
}
