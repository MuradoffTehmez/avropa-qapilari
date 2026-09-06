import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { AuthError } from "@/server/auth";

/**
 * Vahid API cavab formatı (PRD §136).
 * Uğur:  { data }
 * Xəta:  { error: { code, message, details? } }
 */
export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ data }, init);
}

export function fail(
  code: string,
  message: string,
  status: number,
  details?: unknown,
) {
  return NextResponse.json({ error: { code, message, details } }, { status });
}

/** Zod xətasını sahə → mesaj formasına çevirir. */
export function validationError(error: ZodError) {
  const details: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.join(".") || "_";
    if (!details[path]) details[path] = issue.message;
  }
  return fail("VALIDATION_ERROR", "Göndərilən məlumat düzgün deyil", 422, details);
}

/** Route handler-ləri üçün ortaq xəta tutucusu. */
export async function handle(fn: () => Promise<Response>): Promise<Response> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof ZodError) return validationError(error);
    if (error instanceof AuthError) {
      return fail(error.code, error.message, error.code === "UNAUTHENTICATED" ? 401 : 403);
    }
    console.error("[api]", error);
    return fail("INTERNAL_ERROR", "Gözlənilməz xəta baş verdi", 500);
  }
}
