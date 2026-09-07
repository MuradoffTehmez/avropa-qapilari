import { currentStaffUser } from "@/server/auth";
import { handle, ok } from "@/server/http";

export async function GET() {
  return handle(async () => ok(await currentStaffUser()));
}
