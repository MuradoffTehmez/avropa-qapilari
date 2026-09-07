import type { Prisma } from "@prisma/client";

import type { QuoteStatus } from "@/types";
import { db } from "@/server/db";
import { nextNumber } from "@/server/numbering";
import type { SessionUser } from "@/server/auth";
import { recordAudit } from "@/server/audit";

/**
 * QİYMƏT TƏKLİFİ İŞ AXINI (PRD §67).
 *
 * NEW → REVIEWING → PRICED → SENT → ACCEPTED → CONVERTED
 * İstənilən mərhələdən REJECTED və ya EXPIRED mümkündür.
 *
 * Status sərbəst mətn kimi qəbul edilmir: hər keçid `QUOTE_TRANSITIONS`
 * cədvəlindən keçir və `QuoteStatusHistory`-yə yazılır.
 */

export const QUOTE_STATUSES: QuoteStatus[] = [
  "NEW",
  "REVIEWING",
  "PRICED",
  "SENT",
  "ACCEPTED",
  "REJECTED",
  "EXPIRED",
  "CONVERTED",
];

export const QUOTE_TRANSITIONS: Record<QuoteStatus, QuoteStatus[]> = {
  NEW: ["REVIEWING", "REJECTED", "EXPIRED"],
  REVIEWING: ["PRICED", "REJECTED", "EXPIRED"],
  // Hazırlanmış təklif yenidən işlənə bilər, ona görə REVIEWING-ə qayıdış var.
  PRICED: ["SENT", "REVIEWING", "REJECTED", "EXPIRED"],
  SENT: ["ACCEPTED", "REJECTED", "EXPIRED"],
  ACCEPTED: ["CONVERTED", "EXPIRED"],
  REJECTED: [],
  // Vaxtı keçmiş təklif yenidən qiymətləndirilə bilər.
  EXPIRED: ["REVIEWING"],
  CONVERTED: [],
};

export function isQuoteStatus(value: string): value is QuoteStatus {
  return (QUOTE_STATUSES as string[]).includes(value);
}

export function canTransition(from: QuoteStatus, to: QuoteStatus): boolean {
  return QUOTE_TRANSITIONS[from].includes(to);
}

export class QuoteError extends Error {
  constructor(
    readonly code:
      | "NOT_FOUND"
      | "INVALID_TRANSITION"
      | "AMOUNT_REQUIRED"
      | "PRODUCT_REQUIRED"
      | "ALREADY_CONVERTED"
      | "FORBIDDEN",
    message: string,
    readonly status = 422,
  ) {
    super(message);
  }
}

const quoteInclude = {
  product: true,
  history: { orderBy: { createdAt: "asc" } },
} satisfies Prisma.QuoteRequestInclude;

type QuoteRow = Prisma.QuoteRequestGetPayload<{ include: typeof quoteInclude }>;

export interface QuoteDetail {
  id: string;
  number: string;
  status: QuoteStatus;
  customerName: string;
  phone: string;
  email: string | null;
  message: string;
  productSlug: string | null;
  productName: string | null;
  width: number | null;
  height: number | null;
  amount: number | null;
  validUntil: string | null;
  adminNote: string | null;
  sentAt: string | null;
  respondedAt: string | null;
  orderNumber: string | null;
  createdAt: string;
  /** Növbəti mümkün statuslar — interfeys yalnız icazə verilənləri göstərir. */
  nextStatuses: QuoteStatus[];
  history: { status: QuoteStatus; note: string | null; createdAt: string }[];
}

function statusOf(row: { status: string }): QuoteStatus {
  return isQuoteStatus(row.status) ? row.status : "NEW";
}

function mapQuote(row: QuoteRow, orderNumber: string | null): QuoteDetail {
  const status = statusOf(row);
  return {
    id: row.id,
    number: row.number,
    status,
    customerName: row.name,
    phone: row.phone,
    email: row.email,
    message: row.message,
    productSlug: row.product?.slug ?? null,
    productName: row.product?.name ?? null,
    width: row.width,
    height: row.height,
    amount: row.amount,
    validUntil: row.validUntil,
    adminNote: row.adminNote,
    sentAt: row.sentAt?.toISOString() ?? null,
    respondedAt: row.respondedAt?.toISOString() ?? null,
    orderNumber,
    createdAt: row.createdAt.toISOString(),
    nextStatuses: QUOTE_TRANSITIONS[status],
    history: row.history.map((entry) => ({
      status: statusOf(entry),
      note: entry.note,
      createdAt: entry.createdAt.toISOString(),
    })),
  };
}

async function loadQuote(number: string): Promise<QuoteRow> {
  const row = await db.quoteRequest.findFirst({
    where: { number, archivedAt: null },
    include: quoteInclude,
  });
  if (!row) throw new QuoteError("NOT_FOUND", "Qiymət təklifi tapılmadı", 404);
  return row;
}

async function orderNumberOf(orderId: string | null): Promise<string | null> {
  if (!orderId) return null;
  const order = await db.order.findUnique({ where: { id: orderId }, select: { number: true } });
  return order?.number ?? null;
}

export async function quoteDetail(number: string): Promise<QuoteDetail> {
  const row = await loadQuote(number);
  return mapQuote(row, await orderNumberOf(row.orderId));
}

/** Müştəri yalnız öz təklifini görür (PRD §93). */
export async function userQuoteDetail(userId: string, number: string): Promise<QuoteDetail> {
  const row = await loadQuote(number);
  if (row.userId !== userId) throw new QuoteError("FORBIDDEN", "Bu təklif sizə aid deyil", 403);
  return mapQuote(row, await orderNumberOf(row.orderId));
}

function assertTransition(row: QuoteRow, next: QuoteStatus) {
  const current = statusOf(row);
  if (current === next) return;
  if (!canTransition(current, next)) {
    throw new QuoteError(
      "INVALID_TRANSITION",
      `"${current}" statusundan "${next}" statusuna keçmək olmaz`,
    );
  }
}

async function applyStatus(
  quoteId: string,
  status: QuoteStatus,
  note: string | null,
  data: Prisma.QuoteRequestUpdateInput = {},
) {
  await db.$transaction(async (tx) => {
    await tx.quoteRequest.update({ where: { id: quoteId }, data: { ...data, status } });
    await tx.quoteStatusHistory.create({ data: { quoteId, status, note } });
  });
}

/* ------------------------------ Əməliyyatlar --------------------------- */

/** Ümumi status keçidi — sərbəst mətn qəbul edilmir. */
export async function setQuoteStatus(
  actor: SessionUser,
  number: string,
  status: QuoteStatus,
  note?: string,
): Promise<QuoteDetail> {
  const row = await loadQuote(number);
  assertTransition(row, status);
  await applyStatus(row.id, status, note ?? null);
  await recordAudit(actor, "quote.status", number, `${row.status} → ${status}`);
  return quoteDetail(number);
}

export interface QuotePriceInput {
  amount: number;
  validUntil?: string;
  adminNote?: string;
}

/** Təklifi hazırlayır: məbləğ, etibarlılıq tarixi və daxili qeyd. */
export async function priceQuote(
  actor: SessionUser,
  number: string,
  input: QuotePriceInput,
): Promise<QuoteDetail> {
  const row = await loadQuote(number);
  assertTransition(row, "PRICED");
  await applyStatus(row.id, "PRICED", input.adminNote ?? null, {
    amount: input.amount,
    validUntil: input.validUntil ?? null,
    adminNote: input.adminNote ?? null,
  });
  await recordAudit(actor, "quote.price", number, `${input.amount} AZN`);
  return quoteDetail(number);
}

/** Hazır təklifi müştəriyə göndərir. */
export async function sendQuote(actor: SessionUser, number: string): Promise<QuoteDetail> {
  const row = await loadQuote(number);
  if (row.amount === null) {
    throw new QuoteError("AMOUNT_REQUIRED", "Təklif göndərilməzdən əvvəl məbləğ qoyulmalıdır");
  }
  assertTransition(row, "SENT");
  await applyStatus(row.id, "SENT", null, { sentAt: new Date() });
  await recordAudit(actor, "quote.send", number);
  return quoteDetail(number);
}

/** Müştərinin cavabı — yalnız göndərilmiş təklifə. */
export async function respondToQuote(
  userId: string,
  number: string,
  decision: "ACCEPTED" | "REJECTED",
): Promise<QuoteDetail> {
  const row = await loadQuote(number);
  if (row.userId !== userId) throw new QuoteError("FORBIDDEN", "Bu təklif sizə aid deyil", 403);
  assertTransition(row, decision);
  await applyStatus(row.id, decision, null, { respondedAt: new Date() });
  return quoteDetail(number);
}

export interface QuoteConvertInput {
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  address: string;
}

/**
 * Qəbul edilmiş təklifi sifarişə çevirir.
 *
 * Məbləğ təklifin özündən götürülür: fərdi ölçü avtomatik
 * qiymətləndirmədən keçmir, razılaşdırılmış qiymət isə məhz budur.
 */
export async function convertQuoteToOrder(
  actor: SessionUser,
  number: string,
  input: QuoteConvertInput,
): Promise<{ quote: QuoteDetail; orderNumber: string }> {
  const row = await loadQuote(number);
  if (row.orderId) throw new QuoteError("ALREADY_CONVERTED", "Təklif artıq sifarişə çevrilib");
  if (row.amount === null) throw new QuoteError("AMOUNT_REQUIRED", "Təklifin məbləği yoxdur");
  if (!row.productId || !row.width || !row.height) {
    throw new QuoteError("PRODUCT_REQUIRED", "Təklifdə məhsul və ölçü göstərilməyib");
  }
  assertTransition(row, "CONVERTED");

  const orderNumber = await db.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        number: await nextNumber(tx, "ORD"),
        userId: row.userId,
        status: "CONFIRMED",
        customerName: input.customerName ?? row.name,
        customerPhone: input.customerPhone ?? row.phone,
        customerEmail: input.customerEmail ?? row.email ?? "",
        address: input.address,
        subtotal: row.amount!,
        discount: 0,
        total: row.amount!,
      },
    });

    await tx.orderItem.create({
      data: {
        orderId: created.id,
        productId: row.productId!,
        quantity: 1,
        unitPrice: row.amount!,
        width: row.width!,
        height: row.height!,
        // Təklif konfiqurasiya daşımır; seçimlər sifariş sonrası dəqiqləşir.
        snapshot: JSON.stringify({}),
      },
    });

    await tx.orderStatusHistory.create({ data: { orderId: created.id, status: "CONFIRMED" } });
    await tx.quoteRequest.update({
      where: { id: row.id },
      data: { status: "CONVERTED", orderId: created.id },
    });
    await tx.quoteStatusHistory.create({
      data: { quoteId: row.id, status: "CONVERTED", note: created.number },
    });

    return created.number;
  });

  await recordAudit(actor, "quote.convert", number, orderNumber);
  return { quote: await quoteDetail(number), orderNumber };
}

/**
 * Etibarlılıq tarixi keçmiş göndərilmiş təklifləri bağlayır.
 * Admin siyahısı oxunanda çağırılır — ayrıca planlayıcı tələb etmir.
 */
export async function expireDueQuotes(today = new Date().toISOString().slice(0, 10)): Promise<number> {
  const due = await db.quoteRequest.findMany({
    where: { status: "SENT", archivedAt: null, validUntil: { not: null, lt: today } },
    select: { id: true },
  });
  if (due.length === 0) return 0;

  await db.$transaction(async (tx) => {
    await tx.quoteRequest.updateMany({
      where: { id: { in: due.map((row) => row.id) } },
      data: { status: "EXPIRED" },
    });
    await tx.quoteStatusHistory.createMany({
      data: due.map((row) => ({ quoteId: row.id, status: "EXPIRED", note: "validUntil" })),
    });
  });

  return due.length;
}
