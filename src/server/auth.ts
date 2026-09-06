import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";

import { db } from "@/server/db";

// Parol emalı ayrıca moduldadır ki, seed və CLI skriptləri onu
// `next/headers` asılılığı olmadan işlədə bilsin.
export { hashPassword, verifyPassword } from "@/server/password";

export const SESSION_COOKIE = "ep_session";
const SESSION_DAYS = 30;

/* ------------------------------- Sessiya ------------------------------- */

/** Kukidəki token bazada yalnız hash şəklində saxlanılır. */
function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: string): Promise<void> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await db.session.create({
    data: { tokenHash: hashToken(token), userId, expiresAt },
  });

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;

  if (token) {
    await db.session.deleteMany({ where: { tokenHash: hashToken(token) } });
  }
  store.delete(SESSION_COOKIE);
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "TECHNICIAN" | "ADMIN";
}

/** Cari istifadəçi — sessiya yoxdursa və ya bitibsə `null`. */
export async function currentUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await db.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });

  if (!session) return null;
  if (session.expiresAt.getTime() < Date.now()) {
    await db.session.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role: session.user.role as SessionUser["role"],
  };
}

/** Rol yoxlaması — ADMIN bütün səlahiyyətləri əhatə edir (PRD §93). */
export function hasRole(user: SessionUser | null, required: SessionUser["role"]): boolean {
  if (!user) return false;
  if (user.role === "ADMIN") return true;
  return user.role === required;
}

export class AuthError extends Error {
  constructor(
    readonly code: "UNAUTHENTICATED" | "FORBIDDEN",
    message: string,
  ) {
    super(message);
  }
}

/** Route handler-lərində istifadə üçün: giriş tələb edir. */
export async function requireUser(role?: SessionUser["role"]): Promise<SessionUser> {
  const user = await currentUser();
  if (!user) throw new AuthError("UNAUTHENTICATED", "Giriş tələb olunur");
  if (role && !hasRole(user, role)) throw new AuthError("FORBIDDEN", "Səlahiyyət yoxdur");
  return user;
}
