import { fail, handle, ok } from "@/server/http";
import { completePasswordReset } from "@/server/password-reset";
import { passwordResetSchema } from "@/server/validation";

const MESSAGES: Record<string, string> = {
  INVALID: "Bərpa linki keçərli deyil",
  EXPIRED: "Bərpa linkinin müddəti bitib",
  USED: "Bu link artıq işlədilib",
};

/** POST /api/auth/password/reset — yeni parolun təyini. */
export async function POST(request: Request) {
  return handle(async () => {
    const input = passwordResetSchema.parse(await request.json());
    const outcome = await completePasswordReset(input.token, input.password);

    if (outcome !== "OK") {
      return fail(outcome, MESSAGES[outcome], 422, { token: MESSAGES[outcome] });
    }

    return ok({ changed: true });
  });
}
