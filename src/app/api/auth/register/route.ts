import { createSession, hashPassword } from "@/server/auth";
import { db } from "@/server/db";
import { fail, handle, ok } from "@/server/http";
import { registerSchema } from "@/server/validation";

/** POST /api/auth/register — hesab yaradır və sessiya açır (PRD §88). */
export async function POST(request: Request) {
  return handle(async () => {
    const input = registerSchema.parse(await request.json());
    const email = input.email.toLowerCase();

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) return fail("EMAIL_TAKEN", "Bu e-poçt artıq qeydiyyatdadır", 409);

    const user = await db.user.create({
      data: {
        email,
        name: input.name,
        phone: input.phone || null,
        password: await hashPassword(input.password),
        role: "CUSTOMER",
      },
    });

    await createSession(user.id);

    return ok(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      { status: 201 },
    );
  });
}
