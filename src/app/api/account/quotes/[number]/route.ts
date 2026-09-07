import { requireUser } from "@/server/auth";
import { fail, handle, ok } from "@/server/http";
import { QuoteError, userQuoteDetail } from "@/server/quotes";

/** GET /api/account/quotes/:number — yalnız öz təklifi (PRD §93). */
export async function GET(_request: Request, { params }: { params: Promise<{ number: string }> }) {
  return handle(async () => {
    const user = await requireUser();
    const { number } = await params;
    try {
      return ok(await userQuoteDetail(user.id, number));
    } catch (error) {
      if (error instanceof QuoteError) return fail(error.code, error.message, error.status);
      throw error;
    }
  });
}
