import { requireUser, SESSION_COOKIE } from "@/server/auth";
import { hashPassword, verifyPassword } from "@/server/password";
import { db } from "@/server/db";
import { fail, handle, ok } from "@/server/http";
import { passwordChangeSchema } from "@/server/validation";
import { createHash } from "node:crypto";
import { cookies } from "next/headers";

/**
 * POST /api/account/password — parol dəyişmə.
 *
 * Cari parol tələb olunur; dəyişikliydən sonra digər bütün sessiyalar
 * bağlanır, yalnız bu cihaz açıq qalır (PRD §89).
 */
export async function POST(request: Request) {
  return handle(async () => {
    const session = await requireUser();
    const input = passwordChangeSchema.parse(await request.json());

    const user = await db.user.findUniqueOrThrow({ where: { id: session.id } });
    if (!(await verifyPassword(input.current, user.password))) {
      return fail("INVALID_PASSWORD", "Cari parol düzgün deyil", 422, {
        current: "Cari parol düzgün deyil",
      });
    }

    await db.user.update({
      where: { id: user.id },
      data: { password: await hashPassword(input.next) },
    });

    const store = await cookies();
    const token = store.get(SESSION_COOKIE)?.value;
    const keep = token ? createHash("sha256").update(token).digest("hex") : "";

    await db.session.deleteMany({
      where: { userId: user.id, tokenHash: { not: keep } },
    });

    return ok({ changed: true });
  });
}
