import type { Prisma } from "@/generated/prisma";

/**
 * Ardıcıl public nömrələr: ORD-2026-000001 (PRD §62).
 *
 * Sayğac tranzaksiya daxilində artırılır — paralel sorğular eyni
 * nömrəni ala bilmir. Daxili `id` heç vaxt public göstərilmir.
 */
export type NumberPrefix = "ORD" | "REP" | "MSR" | "QTE" | "CFG";

export async function nextNumber(
  tx: Prisma.TransactionClient,
  prefix: NumberPrefix,
  year = new Date().getFullYear(),
): Promise<string> {
  const key = `${prefix}-${year}`;

  const counter = await tx.counter.upsert({
    where: { key },
    create: { key, value: 1 },
    update: { value: { increment: 1 } },
  });

  return `${prefix}-${year}-${String(counter.value).padStart(6, "0")}`;
}
