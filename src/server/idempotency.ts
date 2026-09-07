import { createHash } from "node:crypto";
import { Prisma } from "@prisma/client";

import { db } from "@/server/db";
import { fail } from "@/server/http";

function digest(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

/**
 * Kritik yazma sorğusunu eyni actor/scope/açar üçün yalnız bir dəfə icra edir.
 * Uğurlu JSON cavab sonrakı eyni sorğuya olduğu kimi qaytarılır; xam açar bazaya yazılmır.
 */
export async function idempotentResponse(
  request: Request,
  scope: string,
  actorId: string,
  operation: () => Promise<Response>,
): Promise<Response> {
  const key = request.headers.get("Idempotency-Key")?.trim();
  if (!key || key.length < 8 || key.length > 200) {
    return fail("IDEMPOTENCY_KEY_REQUIRED", "Bu əməliyyat üçün etibarlı Idempotency-Key tələb olunur", 400);
  }

  const requestHash = digest(await request.clone().text());
  const id = digest(`${actorId}:${scope}:${key}`);

  try {
    await db.idempotencyRecord.create({ data: { id, scope, requestHash } });
  } catch (error) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== "P2002") throw error;
    const existing = await db.idempotencyRecord.findUnique({ where: { id } });
    if (!existing || existing.scope !== scope || existing.requestHash !== requestHash) {
      return fail("IDEMPOTENCY_KEY_REUSED", "Bu Idempotency-Key başqa sorğu üçün istifadə olunub", 409);
    }
    if (existing.status !== null && existing.responseBody !== null) {
      return new Response(existing.responseBody, {
        status: existing.status,
        headers: { "content-type": "application/json", "x-idempotent-replay": "true" },
      });
    }
    return fail("REQUEST_IN_PROGRESS", "Bu sorğu artıq icra olunur", 409);
  }

  try {
    const response = await operation();
    if (!response.ok) {
      await db.idempotencyRecord.delete({ where: { id } });
      return response;
    }

    const responseBody = await response.clone().text();
    await db.idempotencyRecord.update({
      where: { id },
      data: { status: response.status, responseBody, completedAt: new Date() },
    });
    return response;
  } catch (error) {
    await db.idempotencyRecord.deleteMany({ where: { id, completedAt: null } });
    throw error;
  }
}
