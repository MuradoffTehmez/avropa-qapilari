import { currentUser } from "@/server/auth";
import { handle, ok } from "@/server/http";

/** GET /api/auth/me — cari sessiya; giriş yoxdursa `null`. */
export async function GET() {
  return handle(async () => ok(await currentUser()));
}
