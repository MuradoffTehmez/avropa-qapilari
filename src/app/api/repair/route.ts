import { currentUser } from "@/server/auth";
import { db } from "@/server/db";
import { handle, ok } from "@/server/http";
import { nextNumber } from "@/server/numbering";
import { repairSchema } from "@/server/validation";
import { idempotentResponse } from "@/server/idempotency";

/** POST /api/repair — təmir müraciəti (PRD §71). */
export async function POST(request: Request) {
  return handle(async () => {
    const user = await currentUser();
    return idempotentResponse(request, "repair.create", user?.id ?? "anonymous", async () => {
      const input = repairSchema.parse(await request.json());

    const created = await db.$transaction(async (tx) => {
      const number = await nextNumber(tx, "REP");
      return tx.repairRequest.create({
        data: { ...input, number, userId: user?.id ?? null },
      });
    });

      return ok({ number: created.number }, { status: 201 });
    });
  });
}
