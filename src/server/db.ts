import { PrismaClient } from "@/generated/prisma";

/**
 * Prisma client singleton.
 *
 * Next.js inkişaf rejimində modulları təkrar yükləyir; qlobal saxlamasaq
 * hər dəyişiklikdə yeni bağlantı hovuzu yaranır və SQLite kilidlənir.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
