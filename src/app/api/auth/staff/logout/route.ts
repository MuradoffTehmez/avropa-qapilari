import { destroyStaffSession } from "@/server/auth";
import { handle, ok } from "@/server/http";

export async function POST() {
  return handle(async () => {
    await destroyStaffSession();
    return ok({ ok: true });
  });
}
