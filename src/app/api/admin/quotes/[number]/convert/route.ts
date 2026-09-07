import { revalidatePath } from "next/cache";

import { requireStaff } from "@/server/auth";
import { fail, handle, ok } from "@/server/http";
import { idempotentResponse } from "@/server/idempotency";
import { convertQuoteToOrder, QuoteError } from "@/server/quotes";
import { quoteConvertSchema } from "@/server/validation";

/**
 * POST /api/admin/quotes/:number/convert — qəbul edilmiş təklifdən
 * sifariş yaradır. Məbləğ təklifin razılaşdırılmış qiymətidir.
 */
export async function POST(request: Request, { params }: { params: Promise<{ number: string }> }) {
  return handle(async () => {
    const actor = await requireStaff("ADMIN");
    const { number } = await params;

    return idempotentResponse(request, `admin.quote.convert:${number}`, actor.id, async () => {
      const input = quoteConvertSchema.parse(await request.json());
      try {
        const result = await convertQuoteToOrder(actor, number, input);
        revalidatePath("/", "layout");
        return ok(result, { status: 201 });
      } catch (error) {
        if (error instanceof QuoteError) return fail(error.code, error.message, error.status);
        throw error;
      }
    });
  });
}
