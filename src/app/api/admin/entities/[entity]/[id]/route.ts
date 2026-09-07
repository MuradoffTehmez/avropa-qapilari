import { z } from "zod";
import { revalidatePath } from "next/cache";

import { requireStaff } from "@/server/auth";
import { recordAudit } from "@/server/audit";
import { db } from "@/server/db";
import { fail, handle, ok } from "@/server/http";

const categorySchema = z.object({ slug: z.string().trim().min(2), name: z.string().trim().min(2) });
const brandSchema = z.object({ slug: z.string().trim().min(2), name: z.string().trim().min(2), country: z.string().trim().min(2), founded: z.number().int().min(1000).max(2200) });
const productSchema = z.object({ slug: z.string().trim().min(2), sku: z.string().trim().min(2), name: z.string().trim().min(2), categorySlug: z.string().trim().min(2), brandSlug: z.string().trim().min(2), material: z.string().trim().min(2), securityClass: z.string().trim().min(2), basePrice: z.number().int().min(0), inStock: z.boolean() });
const optionSchema = z.object({ groupKey: z.string().trim().min(2), code: z.string().trim().min(1), label: z.string().trim().min(1), priceDelta: z.number().int(), hex: z.string().trim().optional() });
const appointmentSchema = z.object({ reference: z.string().trim().min(2), type: z.string().trim().min(2), date: z.string().trim().min(10), startTime: z.string().trim().min(4), endTime: z.string().trim().min(4), address: z.string().trim().min(3), technicianId: z.string().optional(), status: z.string().trim().min(2) });
const technicianSchema = z.object({ name: z.string().trim().min(2), phone: z.string().trim(), specialization: z.string().default(""), serviceAreas: z.string().default(""), status: z.string().trim().min(2) });
const userSchema = z.object({ name: z.string().trim().min(2), email: z.email(), phone: z.string().trim().optional() });
const warrantySchema = z.object({ number: z.string().trim().min(2), serialNumber: z.string().trim().min(2), productName: z.string().trim().min(2), orderNumber: z.string().trim().optional(), installationDate: z.string().trim().min(10), startDate: z.string().trim().min(10), endDate: z.string().trim().min(10), status: z.string().trim().min(2) });

export async function PATCH(request: Request, { params }: { params: Promise<{ entity: string; id: string }> }) {
  return handle(async () => {
    const actor = await requireStaff("ADMIN");
    const { entity, id } = await params;
    const raw: unknown = await request.json();

    switch (entity) {
      case "categories": await db.category.update({ where: { id }, data: categorySchema.parse(raw) }); break;
      case "brands": await db.brand.update({ where: { id }, data: brandSchema.parse(raw) }); break;
      case "products": {
        const input = productSchema.parse(raw);
        const [category, brand] = await Promise.all([db.category.findUnique({ where: { slug: input.categorySlug } }), db.brand.findUnique({ where: { slug: input.brandSlug } })]);
        if (!category || !brand) return fail("RELATION_NOT_FOUND", "Kateqoriya və ya brend tapılmadı", 422);
        await db.product.update({ where: { id }, data: { slug: input.slug, sku: input.sku, name: input.name, categoryId: category.id, brandId: brand.id, material: input.material, securityClass: input.securityClass, basePrice: input.basePrice, inStock: input.inStock } });
        break;
      }
      case "options": { const input = optionSchema.parse(raw); await db.optionValue.update({ where: { id }, data: { ...input, hex: input.hex || null } }); break; }
      case "appointments": {
        const input = appointmentSchema.parse(raw);
        if (input.technicianId) {
          const conflict = await db.appointment.findFirst({ where: { id: { not: id }, technicianId: input.technicianId, date: input.date, startTime: { lt: input.endTime }, endTime: { gt: input.startTime } } });
          if (conflict) return fail("TIME_CONFLICT", "Ustanın bu saatda başqa görüşü var", 409);
        }
        await db.appointment.update({ where: { id }, data: { ...input, technicianId: input.technicianId || null } });
        break;
      }
      case "technicians": {
        const input = technicianSchema.parse(raw);
        const technician = await db.technician.findUnique({ where: { id } });
        if (!technician) return fail("NOT_FOUND", "Usta tapılmadı", 404);
        await db.$transaction(async (tx) => {
          await tx.technician.update({ where: { id }, data: { ...input, specialization: jsonList(input.specialization), serviceAreas: jsonList(input.serviceAreas) } });
          if (technician.userId) await tx.user.update({ where: { id: technician.userId }, data: { name: input.name, phone: input.phone || null } });
        });
        break;
      }
      case "users": { const input = userSchema.parse(raw); await db.user.update({ where: { id }, data: { ...input, email: input.email.toLowerCase(), phone: input.phone || null } }); break; }
      case "warranties": {
        const input = warrantySchema.parse(raw);
        const order = input.orderNumber ? await db.order.findUnique({ where: { number: input.orderNumber } }) : null;
        if (input.orderNumber && !order) return fail("ORDER_NOT_FOUND", "Sifariş tapılmadı", 422);
        await db.warranty.update({ where: { id }, data: { number: input.number, serialNumber: input.serialNumber, productName: input.productName, orderId: order?.id ?? null, userId: order?.userId ?? null, installationDate: input.installationDate, startDate: input.startDate, endDate: input.endDate, status: input.status } });
        break;
      }
      default: return fail("NOT_FOUND", "Belə idarəetmə bölməsi yoxdur", 404);
    }

    await recordAudit(actor, `${entity}.update`, id);
    revalidatePath("/", "layout");
    return ok({ ok: true });
  });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ entity: string; id: string }> }) {
  return handle(async () => {
    const actor = await requireStaff("ADMIN");
    const { entity, id } = await params;

    if (entity === "users" && id === actor.id) return fail("SELF_DELETE", "Öz hesabınızı silə bilməzsiniz", 422);

    switch (entity) {
      case "categories": await db.category.delete({ where: { id } }); break;
      case "brands": await db.brand.delete({ where: { id } }); break;
      case "products": await db.product.delete({ where: { id } }); break;
      case "options": await db.optionValue.delete({ where: { id } }); break;
      case "appointments": await db.appointment.delete({ where: { id } }); break;
      case "technicians": {
        const technician = await db.technician.findUnique({ where: { id } });
        if (!technician) return fail("NOT_FOUND", "Usta tapılmadı", 404);
        await db.$transaction(async (tx) => {
          await tx.technician.delete({ where: { id } });
          if (technician.userId) await tx.user.delete({ where: { id: technician.userId } });
        });
        break;
      }
      case "users": await db.user.delete({ where: { id } }); break;
      case "warranties": await db.warranty.delete({ where: { id } }); break;
      case "orders": await db.order.delete({ where: { id } }); break;
      case "quotes": await db.quoteRequest.delete({ where: { id } }); break;
      case "repairs": await db.repairRequest.delete({ where: { id } }); break;
      case "measurements": await db.measurementRequest.delete({ where: { id } }); break;
      case "reviews": await db.review.delete({ where: { id } }); break;
      default: return fail("NOT_FOUND", "Belə idarəetmə bölməsi yoxdur", 404);
    }

    await recordAudit(actor, `${entity}.delete`, id);
    revalidatePath("/", "layout");
    return ok({ ok: true });
  });
}

function jsonList(value: string): string {
  return JSON.stringify(value.split(",").map((item) => item.trim()).filter(Boolean));
}
