import { requireUser } from "@/server/auth";
import { db } from "@/server/db";
import { fail, handle, ok } from "@/server/http";
import { orderStatusSchema } from "@/server/validation";

/**
 * PATCH /api/admin/orders/:number — sifariş statusunu dəyişir.
 *
 * Yalnız ADMIN. Hər dəyişiklik `OrderStatusHistory`-yə yazılır ki,
 * müştəri kabinetindəki vaxt xətti düzgün qursun (PRD §63).
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ number: string }> },
) {
  return handle(async () => {
    await requireUser("ADMIN");
    const { number } = await params;
    const input = orderStatusSchema.parse(await request.json());

    const order = await db.order.findUnique({ where: { number } });
    if (!order) return fail("NOT_FOUND", "Sifariş tapılmadı", 404);

    const status = input.status ?? order.status;
    const paymentStatus = input.paymentStatus ?? order.paymentStatus;
    const statusChanged = status !== order.status;

    await db.$transaction([
      db.order.update({ where: { id: order.id }, data: { status, paymentStatus } }),
      // Ödəniş qeydi varsa o da eyni vəziyyətə gətirilir.
      db.payment.updateMany({ where: { orderId: order.id }, data: { status: paymentStatus } }),
      ...(statusChanged
        ? [db.orderStatusHistory.create({ data: { orderId: order.id, status } })]
        : []),
    ]);

    return ok({ number, status, paymentStatus, changed: statusChanged });
  });
}
