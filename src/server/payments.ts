import { randomBytes } from "node:crypto";

import { db } from "@/server/db";

/**
 * ÖDƏNİŞ PROVAYDERİ ABSTRAKSİYASI.
 *
 * Sifariş axını provayderdən asılı deyil: `Payment` sətri həmişə eyni
 * formada yaranır, yalnız adapter dəyişir. Real provayder (bank ekvayrinqi,
 * Stripe və s.) qoşulanda burada yeni `PaymentProvider` yazılır və
 * `resolveProvider` onu qaytarır — sxem və route dəyişmir (PRD §67).
 */

export type PaymentStatus = "PENDING" | "AUTHORIZED" | "PAID" | "FAILED" | "REFUNDED";

export interface PaymentIntent {
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: "AZN";
}

export interface PaymentResult {
  reference: string;
  status: PaymentStatus;
  /** Provayder öz səhifəsinə yönləndirirsə. */
  redirectUrl?: string;
}

export interface PaymentProvider {
  readonly id: string;
  create(intent: PaymentIntent): Promise<PaymentResult>;
  /** Provayderin bildirişini emal edir; adapter yoxdursa `null`. */
  capture?(reference: string): Promise<PaymentResult | null>;
}

/**
 * Daxili adapter: onlayn ödəniş provayderi qoşulmayıb, ödəniş sahədə
 * və ya köçürmə ilə alınır. Sifariş dərhal təsdiqlənir, ödəniş
 * vəziyyəti `PENDING` qalır və admin panelindən dəyişdirilir.
 */
const manualProvider: PaymentProvider = {
  id: "MANUAL",

  async create(intent) {
    return {
      reference: `PAY-${intent.orderNumber}-${randomBytes(3).toString("hex")}`,
      status: "PENDING",
    };
  },
};

const providers: Record<string, PaymentProvider> = {
  [manualProvider.id]: manualProvider,
};

/**
 * İşlək provayderi seçir. `PAYMENT_PROVIDER` mühit dəyişəni qoyulmayıbsa
 * və ya naməlum dəyər verilibsə daxili adapter işləyir.
 */
export function resolveProvider(): PaymentProvider {
  const id = process.env.PAYMENT_PROVIDER ?? manualProvider.id;
  return providers[id] ?? manualProvider;
}

/** Sifariş üçün ödəniş qeydi yaradır və sifarişin vəziyyətini yeniləyir. */
export async function startPayment(intent: PaymentIntent): Promise<PaymentResult> {
  const provider = resolveProvider();
  const result = await provider.create(intent);

  await db.payment.create({
    data: {
      orderId: intent.orderId,
      provider: provider.id,
      status: result.status,
      amount: intent.amount,
      currency: intent.currency,
      reference: result.reference,
      redirectUrl: result.redirectUrl ?? null,
    },
  });

  await db.order.update({
    where: { id: intent.orderId },
    data: { paymentProvider: provider.id, paymentStatus: result.status },
  });

  return result;
}

/** Ödəniş vəziyyətini dəyişir (admin və ya provayder bildirişi). */
export async function setPaymentStatus(
  reference: string,
  status: PaymentStatus,
): Promise<boolean> {
  const payment = await db.payment.findUnique({ where: { reference } });
  if (!payment) return false;

  await db.$transaction([
    db.payment.update({ where: { id: payment.id }, data: { status } }),
    db.order.update({ where: { id: payment.orderId }, data: { paymentStatus: status } }),
  ]);

  return true;
}
