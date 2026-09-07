import { currentStaffUser, currentUser } from "@/server/auth";
import { db } from "@/server/db";
import { fail, handle, ok } from "@/server/http";
import { nextNumber } from "@/server/numbering";
import { calculatePrice, PricingError, type PriceResult } from "@/server/pricing";
import { orderSchema } from "@/server/validation";
import { startPayment } from "@/server/payments";

/**
 * POST /api/orders — sifariş yaradır.
 *
 * - Yekun məbləğ serverdə yenidən hesablanır; client-in `total`-ı
 *   ümumiyyətlə qəbul edilmir (PRD §130).
 * - `Idempotency-Key` başlığı verilibsə təkrar göndəriş eyni sifarişi
 *   qaytarır, yenisini yaratmır (PRD §137).
 * - Nömrə ORD-2026-000001 formatındadır (PRD §62).
 */
export async function POST(request: Request) {
  return handle(async () => {
    const idempotencyKey = request.headers.get("Idempotency-Key");

    if (idempotencyKey) {
      const existing = await db.order.findUnique({
        where: { idempotencyKey },
        include: { items: true },
      });
      if (existing) {
        return ok({
          number: existing.number,
          total: existing.total,
          repeated: true,
          payment: {
            reference: null,
            status: existing.paymentStatus,
            redirectUrl: null,
          },
        });
      }
    }

    const input = orderSchema.parse(await request.json());
    const customer = await currentUser();
    const staff = customer ? null : await currentStaffUser();
    const user = customer ?? (staff?.role === "TECHNICIAN" ? staff : null);

    // Hər sətir üçün qiymət serverdə hesablanır.
    const priced: { item: (typeof input.items)[number]; price: PriceResult }[] = [];
    try {
      for (const item of input.items) {
        const price = await calculatePrice({
          productSlug: item.productSlug,
          width: item.width,
          height: item.height,
          choices: item.choices,
        });
        if (price.requiresQuote) {
          return fail(
            "REQUIRES_QUOTE",
            "Bu ölçü üçün fərdi qiymət təklifi tələb olunur",
            422,
            { productSlug: item.productSlug },
          );
        }
        priced.push({ item, price });
      }
    } catch (error) {
      if (error instanceof PricingError) {
        const status = error.code === "PRODUCT_NOT_FOUND" ? 404 : 422;
        return fail(error.code, error.message, status);
      }
      throw error;
    }

    const subtotal = priced.reduce((s, p) => s + p.price.subtotal * p.item.quantity, 0);
    const discount = priced.reduce((s, p) => s + p.price.discount * p.item.quantity, 0);
    const total = Math.max(0, subtotal - discount);

    const order = await db.$transaction(async (tx) => {
      const number = await nextNumber(tx, "ORD");

      const created = await tx.order.create({
        data: {
          number,
          userId: user?.id ?? null,
          status: "CONFIRMED",
          customerName: input.customerName,
          customerPhone: input.customerPhone,
          customerEmail: input.customerEmail,
          address: input.address,
          subtotal,
          discount,
          total,
          idempotencyKey,
        },
      });

      for (const { item, price } of priced) {
        const product = await tx.product.findUnique({ where: { slug: item.productSlug } });
        if (!product) throw new Error(`Məhsul itdi: ${item.productSlug}`);

        await tx.orderItem.create({
          data: {
            orderId: created.id,
            productId: product.id,
            quantity: item.quantity,
            unitPrice: price.total,
            width: item.width,
            height: item.height,
            snapshot: JSON.stringify(item.choices),
          },
        });
      }

      await tx.orderStatusHistory.create({
        data: { orderId: created.id, status: "CONFIRMED" },
      });

      return created;
    });

    // Ödəniş provayderdən asılı deyil: adapter yoxdursa qeyd `PENDING`
    // qalır və ödəniş sahədə alınır (src/server/payments.ts).
    const payment = await startPayment({
      orderId: order.id,
      orderNumber: order.number,
      amount: order.total,
      currency: "AZN",
    });

    return ok(
      {
        number: order.number,
        total: order.total,
        repeated: false,
        payment: {
          reference: payment.reference,
          status: payment.status,
          redirectUrl: payment.redirectUrl ?? null,
        },
      },
      { status: 201 },
    );
  });
}

/** GET /api/orders — cari istifadəçinin sifarişləri. */
export async function GET() {
  return handle(async () => {
    const user = await currentUser();
    if (!user) return fail("UNAUTHENTICATED", "Giriş tələb olunur", 401);

    const orders = await db.order.findMany({
      where: { userId: user.id, archivedAt: null },
      include: { items: { include: { product: true } }, history: true },
      orderBy: { createdAt: "desc" },
    });

    return ok(
      orders.map((o) => ({
        number: o.number,
        status: o.status,
        total: o.total,
        createdAt: o.createdAt.toISOString(),
        itemCount: o.items.length,
        items: o.items.map((i) => ({
          productSlug: i.product.slug,
          productName: i.product.name,
          sku: i.product.sku,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          width: i.width,
          height: i.height,
          choices: JSON.parse(i.snapshot) as Record<string, string | string[]>,
        })),
        history: o.history.map((h) => ({
          status: h.status,
          createdAt: h.createdAt.toISOString(),
        })),
      })),
    );
  });
}
