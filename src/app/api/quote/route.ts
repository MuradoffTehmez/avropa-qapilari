import { currentUser } from "@/server/auth";
import { db } from "@/server/db";
import { handle, ok } from "@/server/http";
import { nextNumber } from "@/server/numbering";
import { quoteSchema } from "@/server/validation";
import { idempotentResponse } from "@/server/idempotency";

/** POST /api/quote — qiymət təklifi sorğusu (PRD §66). */
export async function POST(request: Request) {
  return handle(async () => {
    const user = await currentUser();
    return idempotentResponse(request, "quote.create", user?.id ?? "anonymous", async () => {
      const input = quoteSchema.parse(await request.json());

    const product = input.productSlug
      ? await db.product.findFirst({ where: { slug: input.productSlug, archivedAt: null, status: "PUBLISHED" } })
      : null;

    const created = await db.$transaction(async (tx) => {
      const number = await nextNumber(tx, "QTE");
      return tx.quoteRequest.create({
        data: {
          number,
          userId: user?.id ?? null,
          name: input.name,
          phone: input.phone,
          email: input.email || null,
          productId: product?.id ?? null,
          width: input.width ?? null,
          height: input.height ?? null,
          message: input.message,
        },
      });
    });

      return ok({ number: created.number }, { status: 201 });
    });
  });
}
