import { createHash, randomBytes } from "node:crypto";

import { db } from "@/server/db";
import { hashPassword } from "@/server/password";

/**
 * PAROL BƏRPASI (PRD §89).
 *
 * Token bazada yalnız SHA-256 hash kimi qalır, 30 dəqiqə yaşayır və
 * bir dəfə işlənir. E-poçt provayderi hələ konfiqurasiya olunmayıb:
 * `deliverResetLink` linki server jurnalına yazır. SMTP açarı gələndə
 * yalnız bu funksiya dəyişir — axının qalan hissəsi hazırdır.
 */

const TOKEN_MINUTES = 30;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export interface ResetRequest {
  /** İstifadəçi tapılmasa da `true` qaytarılır — e-poçt sızmasın. */
  accepted: true;
}

export async function requestPasswordReset(email: string): Promise<ResetRequest> {
  const user = await db.user.findUnique({ where: { email } });

  // Hesab yoxdursa da eyni cavab verilir: əks halda forma hansı
  // e-poçtların qeydiyyatda olduğunu açıqlayardı.
  if (!user) return { accepted: true };

  // Köhnə istifadə olunmamış tokenlər ləğv edilir.
  await db.passwordResetToken.deleteMany({ where: { userId: user.id, usedAt: null } });

  const token = randomBytes(32).toString("hex");
  await db.passwordResetToken.create({
    data: {
      tokenHash: hashToken(token),
      userId: user.id,
      expiresAt: new Date(Date.now() + TOKEN_MINUTES * 60 * 1000),
    },
  });

  await deliverResetLink(user.email, token);
  return { accepted: true };
}

/**
 * Bərpa linkinin çatdırılması.
 *
 * Provayder qoşulmayıb, ona görə link server jurnalına yazılır —
 * lokal inkişafda axını yoxlamaq üçün. Production-da bu funksiya
 * e-poçt göndərən adapterlə əvəzlənməlidir.
 */
async function deliverResetLink(email: string, token: string): Promise<void> {
  const base = process.env.APP_URL ?? "http://localhost:3000";
  console.info(`[password-reset] ${email} → ${base}/az/parol?token=${token}`);
}

export type ResetOutcome = "OK" | "INVALID" | "EXPIRED" | "USED";

export async function completePasswordReset(
  token: string,
  password: string,
): Promise<ResetOutcome> {
  const record = await db.passwordResetToken.findUnique({
    where: { tokenHash: hashToken(token) },
  });

  if (!record) return "INVALID";
  if (record.usedAt) return "USED";
  if (record.expiresAt.getTime() < Date.now()) return "EXPIRED";

  await db.$transaction([
    db.user.update({
      where: { id: record.userId },
      data: { password: await hashPassword(password) },
    }),
    db.passwordResetToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    }),
    // Parol dəyişəndə bütün sessiyalar bağlanır.
    db.session.deleteMany({ where: { userId: record.userId } }),
  ]);

  return "OK";
}
