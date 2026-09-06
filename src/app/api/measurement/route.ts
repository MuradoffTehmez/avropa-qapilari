import { currentUser } from "@/server/auth";
import { db } from "@/server/db";
import { handle, ok } from "@/server/http";
import { nextNumber } from "@/server/numbering";
import { measurementSchema } from "@/server/validation";

/** POST /api/measurement — ölçü ustası sifarişi (PRD §67). */
export async function POST(request: Request) {
  return handle(async () => {
    const input = measurementSchema.parse(await request.json());
    const user = await currentUser();

    const created = await db.$transaction(async (tx) => {
      const number = await nextNumber(tx, "MSR");
      return tx.measurementRequest.create({
        data: { ...input, number, userId: user?.id ?? null },
      });
    });

    return ok({ number: created.number }, { status: 201 });
  });
}
