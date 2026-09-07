import { requireStaff } from "@/server/auth";
import { fail, handle, ok } from "@/server/http";
import { idempotentResponse } from "@/server/idempotency";
import {
  priceQuote,
  QuoteError,
  quoteDetail,
  sendQuote,
  setQuoteStatus,
} from "@/server/quotes";
import { quotePriceSchema, quoteStatusSchema } from "@/server/validation";

/** GET /api/admin/quotes/:number — təklifin tam vəziyyəti və tarixçəsi. */
export async function GET(_request: Request, { params }: { params: Promise<{ number: string }> }) {
  return handle(async () => {
    await requireStaff("ADMIN");
    const { number } = await params;
    try {
      return ok(await quoteDetail(number));
    } catch (error) {
      if (error instanceof QuoteError) return fail(error.code, error.message, error.status);
      throw error;
    }
  });
}

/**
 * PATCH /api/admin/quotes/:number
 *
 * `action`:
 *  - `price`  — məbləği və etibarlılıq tarixini qoyur (→ PRICED)
 *  - `send`   — hazır təklifi müştəriyə göndərir (→ SENT)
 *  - `status` — icazə verilən digər keçidlər
 *
 * Status sərbəst yazılmır: hər keçid `QUOTE_TRANSITIONS`-dan keçir.
 */
export async function PATCH(request: Request, { params }: { params: Promise<{ number: string }> }) {
  return handle(async () => {
    const actor = await requireStaff("ADMIN");
    const { number } = await params;

    return idempotentResponse(request, `admin.quote.update:${number}`, actor.id, async () => {
      const raw: unknown = await request.json();
      const action =
        typeof raw === "object" && raw !== null && "action" in raw
          ? String((raw as { action: unknown }).action)
          : "status";

      try {
        if (action === "price") {
          return ok(await priceQuote(actor, number, quotePriceSchema.parse(raw)));
        }
        if (action === "send") {
          return ok(await sendQuote(actor, number));
        }
        if (action === "status") {
          const input = quoteStatusSchema.parse(raw);
          return ok(await setQuoteStatus(actor, number, input.status, input.note));
        }
        return fail("UNKNOWN_ACTION", "Belə əməliyyat yoxdur", 422);
      } catch (error) {
        if (error instanceof QuoteError) return fail(error.code, error.message, error.status);
        throw error;
      }
    });
  });
}
