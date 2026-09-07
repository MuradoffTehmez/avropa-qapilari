import { requireUser } from "@/server/auth";
import { fail, handle, ok } from "@/server/http";
import { idempotentResponse } from "@/server/idempotency";
import { QuoteError, respondToQuote } from "@/server/quotes";
import { quoteRespondSchema } from "@/server/validation";

/**
 * POST /api/account/quotes/:number/respond — müştəri təklifi qəbul edir
 * və ya rədd edir. Yalnız göndərilmiş təklifə cavab verilə bilər.
 */
export async function POST(request: Request, { params }: { params: Promise<{ number: string }> }) {
  return handle(async () => {
    const user = await requireUser();
    const { number } = await params;

    return idempotentResponse(request, `account.quote.respond:${number}`, user.id, async () => {
      const input = quoteRespondSchema.parse(await request.json());
      try {
        return ok(await respondToQuote(user.id, number, input.decision));
      } catch (error) {
        if (error instanceof QuoteError) return fail(error.code, error.message, error.status);
        throw error;
      }
    });
  });
}
