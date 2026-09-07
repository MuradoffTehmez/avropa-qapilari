import { z } from "zod";
import { revalidatePath } from "next/cache";

import { hashPassword, requireStaff } from "@/server/auth";
import { recordAudit } from "@/server/audit";
import { db } from "@/server/db";
import { fail, handle, ok } from "@/server/http";

const categorySchema = z.object({ slug: z.string().trim().min(2), name: z.string().trim().min(2) });
const brandSchema = z.object({ slug: z.string().trim().min(2), name: z.string().trim().min(2), country: z.string().trim().min(2), founded: z.number().int().min(1000).max(2200) });
const productSchema = z.object({
  slug: z.string().trim().min(2), sku: z.string().trim().min(2), name: z.string().trim().min(2),
  categorySlug: z.string().trim().min(2), brandSlug: z.string().trim().min(2),
  material: z.string().trim().min(2), securityClass: z.string().trim().min(2),
  basePrice: z.number().int().min(0), inStock: z.boolean().default(true),
});
const optionSchema = z.object({ id: z.string().trim().min(2), groupKey: z.string().trim().min(2), code: z.string().trim().min(1), label: z.string().trim().min(1), priceDelta: z.number().int(), hex: z.string().trim().optional() });
const appointmentSchema = z.object({ reference: z.string().trim().min(2), type: z.string().trim().min(2), date: z.string().trim().min(10), startTime: z.string().trim().min(4), endTime: z.string().trim().min(4), address: z.string().trim().min(3), technicianId: z.string().optional(), status: z.string().trim().min(2) });
const technicianSchema = z.object({ name: z.string().trim().min(2), phone: z.string().trim(), email: z.email(), password: z.string().min(8), specialization: z.string().default(""), serviceAreas: z.string().default(""), status: z.string().trim().min(2) });
const userSchema = z.object({ name: z.string().trim().min(2), email: z.email(), phone: z.string().trim().optional(), password: z.string().min(8), role: z.enum(["CUSTOMER", "TECHNICIAN", "ADMIN"]) });
const warrantySchema = z.object({ number: z.string().trim().min(2), serialNumber: z.string().trim().min(2), productName: z.string().trim().min(2), orderNumber: z.string().trim().optional(), installationDate: z.string().trim().min(10), startDate: z.string().trim().min(10), endDate: z.string().trim().min(10), status: z.string().trim().min(2) });

export async function POST(request: Request, { params }: { params: Promise<{ entity: string }> }) {
  return handle(async () => {
    const actor = await requireStaff("ADMIN");
    const { entity } = await params;
    const raw: unknown = await request.json();

    let target = "";
    switch (entity) {
      case "categories": {
        const input = categorySchema.parse(raw);
        await db.category.create({ data: input });
        target = input.slug;
        break;
      }
      case "brands": {
        const input = brandSchema.parse(raw);
        await db.brand.create({ data: input });
        target = input.slug;
        break;
      }
      case "products": {
        const input = productSchema.parse(raw);
        const [category, brand] = await Promise.all([db.category.findUnique({ where: { slug: input.categorySlug } }), db.brand.findUnique({ where: { slug: input.brandSlug } })]);
        if (!category || !brand) return fail("RELATION_NOT_FOUND", "Kateqoriya və ya brend tapılmadı", 422);
        await db.product.create({ data: {
          slug: input.slug, sku: input.sku, name: input.name, collection: "", basePrice: input.basePrice,
          material: input.material, securityClass: input.securityClass, soundInsulationDb: 0, warrantyYears: 2,
          style: "MODERN", inStock: input.inStock, defaultWidth: 900, defaultHeight: 2100,
          minWidth: 700, maxWidth: 1400, minHeight: 1900, maxHeight: 2600,
          deliveryDaysMin: 7, deliveryDaysMax: 30, optionGroups: "[]", panelHexes: "[]",
          categoryId: category.id, brandId: brand.id,
        } });
        target = input.sku;
        break;
      }
      case "options": {
        const input = optionSchema.parse(raw);
        await db.optionValue.create({ data: { ...input, hex: input.hex || null } });
        target = input.id;
        break;
      }
      case "appointments": {
        const input = appointmentSchema.parse(raw);
        if (input.technicianId) {
          const conflict = await db.appointment.findFirst({ where: { technicianId: input.technicianId, date: input.date, startTime: { lt: input.endTime }, endTime: { gt: input.startTime } } });
          if (conflict) return fail("TIME_CONFLICT", "Ustanın bu saatda başqa görüşü var", 409);
        }
        const row = await db.appointment.create({ data: { ...input, technicianId: input.technicianId || null } });
        target = row.id;
        break;
      }
      case "technicians": {
        const input = technicianSchema.parse(raw);
        const row = await db.$transaction(async (tx) => {
          const user = await tx.user.create({ data: { name: input.name, email: input.email.toLowerCase(), phone: input.phone || null, password: await hashPassword(input.password), role: "TECHNICIAN", marketingConsent: false } });
          return tx.technician.create({ data: { name: input.name, phone: input.phone, specialization: jsonList(input.specialization), serviceAreas: jsonList(input.serviceAreas), status: input.status, userId: user.id } });
        });
        target = row.id;
        break;
      }
      case "users": {
        const input = userSchema.parse(raw);
        const row = await db.user.create({ data: { ...input, email: input.email.toLowerCase(), phone: input.phone || null, password: await hashPassword(input.password), marketingConsent: false } });
        target = row.email;
        break;
      }
      case "warranties": {
        const input = warrantySchema.parse(raw);
        const order = input.orderNumber ? await db.order.findUnique({ where: { number: input.orderNumber } }) : null;
        if (input.orderNumber && !order) return fail("ORDER_NOT_FOUND", "Sifariş tapılmadı", 422);
        await db.warranty.create({ data: { number: input.number, serialNumber: input.serialNumber, productName: input.productName, orderId: order?.id ?? null, userId: order?.userId ?? null, installationDate: input.installationDate, startDate: input.startDate, endDate: input.endDate, status: input.status } });
        target = input.number;
        break;
      }
      default:
        return fail("NOT_FOUND", "Belə idarəetmə bölməsi yoxdur", 404);
    }

    await recordAudit(actor, `${entity}.create`, target);
    revalidatePath("/", "layout");
    return ok({ ok: true }, { status: 201 });
  });
}

function jsonList(value: string): string {
  return JSON.stringify(value.split(",").map((item) => item.trim()).filter(Boolean));
}
