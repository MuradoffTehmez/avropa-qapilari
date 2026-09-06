import { destroySession } from "@/server/auth";
import { handle, ok } from "@/server/http";

/** POST /api/auth/logout */
export async function POST() {
  return handle(async () => {
    await destroySession();
    return ok({ ok: true });
  });
}
