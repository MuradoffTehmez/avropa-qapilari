import type { SessionUser } from "@/server/auth";
import { db } from "@/server/db";

/**
 * AUDIT LOG (PRD §128).
 *
 * Hər admin yazma əməliyyatı burada qeyd olunur. Sətirlər silinmir və
 * redaktə edilmir — admin panelində yalnız oxunur.
 */
export async function recordAudit(
  actor: SessionUser,
  action: string,
  target: string,
  detail = "",
): Promise<void> {
  // Audit yazısı əsas əməliyyatı bloklamamalıdır.
  try {
    await db.auditLog.create({
      data: {
        actorId: actor.id,
        actorEmail: actor.email,
        actorRole: actor.role,
        action,
        target,
        detail,
      },
    });
  } catch (error) {
    console.error("[audit]", error);
  }
}

/** Dəyişikliyi "sahə: köhnə → yeni" şəklində yazır. */
export function changeDetail(
  changes: Record<string, [unknown, unknown] | undefined>,
): string {
  return Object.entries(changes)
    .filter((entry): entry is [string, [unknown, unknown]] => {
      const pair = entry[1];
      return Array.isArray(pair) && pair[0] !== pair[1];
    })
    .map(([field, [before, after]]) => `${field}: ${String(before)} → ${String(after)}`)
    .join(", ");
}
