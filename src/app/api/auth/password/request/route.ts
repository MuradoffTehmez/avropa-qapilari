import { handle, ok } from "@/server/http";
import { requestPasswordReset } from "@/server/password-reset";
import { passwordResetRequestSchema } from "@/server/validation";

/**
 * POST /api/auth/password/request — bərpa linki sorğusu.
 *
 * Hesabın olub-olmamasından asılı olmayaraq eyni cavab qaytarılır ki,
 * forma qeydiyyatda olan e-poçtları açıqlamasın (PRD §89).
 */
export async function POST(request: Request) {
  return handle(async () => {
    const { email } = passwordResetRequestSchema.parse(await request.json());
    await requestPasswordReset(email);
    return ok({ accepted: true });
  });
}
