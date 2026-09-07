import { z } from "zod";
import { revalidatePath } from "next/cache";

import { requireStaff } from "@/server/auth";
import { recordAudit } from "@/server/audit";
import { db } from "@/server/db";
import { fail, handle, ok } from "@/server/http";
import { idempotentResponse } from "@/server/idempotency";

const productOptionOrder = ["OPENING_DIRECTION", "PANEL_STYLE", "OUTSIDE_COLOR", "INSIDE_COLOR", "FRAME", "SIDELIGHT", "GLASS", "GLASS_PATTERN", "HANDLE", "HINGE", "LOCK", "CYLINDER", "SMART_LOCK", "THRESHOLD", "INSULATION", "ACCESSORY", "INSTALLATION", "DELIVERY"];

const categorySchema = z.object({ slug: z.string().trim().min(2), name: z.string().trim().min(2) });
const brandSchema = z.object({ slug: z.string().trim().min(2), name: z.string().trim().min(2), country: z.string().trim().min(2), founded: z.number().int().min(1000).max(2200) });
const productSchema = z.object({
  slug: z.string().trim().min(2), sku: z.string().trim().min(2), name: z.string().trim().min(2),
  categorySlug: z.string().trim().min(2), brandSlug: z.string().trim().min(2), collection: z.string().trim().min(1),
  material: z.enum(["STEEL", "SOLID_WOOD", "MDF", "ALUMINIUM", "COMPOSITE", "GLASS"]),
  securityClass: z.string().trim().min(1), style: z.enum(["MODERN", "CLASSIC", "MINIMAL", "LOFT", "NEOCLASSIC"]),
  status: z.enum(["DRAFT", "PUBLISHED"]), basePrice: z.number().int().min(0),
  warrantyYears: z.number().int().min(0).max(30), soundInsulationDb: z.number().int().min(0).max(100),
  defaultWidth: z.number().int().min(300).max(5000), defaultHeight: z.number().int().min(1000).max(5000),
  minWidth: z.number().int().min(300).max(5000), maxWidth: z.number().int().min(300).max(5000),
  minHeight: z.number().int().min(1000).max(5000), maxHeight: z.number().int().min(1000).max(5000),
  deliveryDaysMin: z.number().int().min(0).max(365), deliveryDaysMax: z.number().int().min(0).max(365),
  inStock: z.boolean(), isBestseller: z.boolean(), optionValueIds: z.array(z.string().min(1)).min(1),
}).superRefine((value, context) => {
  if (value.minWidth > value.defaultWidth || value.defaultWidth > value.maxWidth) context.addIssue({ code: "custom", path: ["defaultWidth"], message: "Standart en minimum və maksimum aralığında olmalıdır" });
  if (value.minHeight > value.defaultHeight || value.defaultHeight > value.maxHeight) context.addIssue({ code: "custom", path: ["defaultHeight"], message: "Standart hündürlük minimum və maksimum aralığında olmalıdır" });
  if (value.deliveryDaysMin > value.deliveryDaysMax) context.addIssue({ code: "custom", path: ["deliveryDaysMax"], message: "Maksimum müddət minimumdan az ola bilməz" });
});
const optionSchema = z.object({
  code: z.string().trim().min(1), label: z.string().trim().min(1), description: z.string().trim().optional(),
  priceDelta: z.number().int(), hex: z.string().trim().optional(),
  requires: z.array(z.string()).default([]), excludes: z.array(z.string()).default([]),
});
const appointmentSchema = z.object({ reference: z.string().trim().min(2), type: z.string().trim().min(2), date: z.string().trim().min(10), startTime: z.string().trim().min(4), endTime: z.string().trim().min(4), address: z.string().trim().min(3), technicianId: z.string().optional(), status: z.string().trim().min(2) });
const technicianSchema = z.object({ name: z.string().trim().min(2), phone: z.string().trim(), specialization: z.string().default(""), serviceAreas: z.string().default(""), status: z.string().trim().min(2) });
const userSchema = z.object({ name: z.string().trim().min(2), email: z.email(), phone: z.string().trim().optional() });
const warrantySchema = z.object({ number: z.string().trim().min(2), serialNumber: z.string().trim().min(2), productName: z.string().trim().min(2), orderNumber: z.string().trim().optional(), installationDate: z.string().trim().min(10), startDate: z.string().trim().min(10), endDate: z.string().trim().min(10), status: z.string().trim().min(2) });

export async function PATCH(request: Request, { params }: { params: Promise<{ entity: string; id: string }> }) {
  return handle(async () => {
    const actor = await requireStaff("ADMIN");
    const { entity, id } = await params;
    return idempotentResponse(request, `admin.${entity}.update:${id}`, actor.id, async () => {
      const raw: unknown = await request.json();

    switch (entity) {
      case "categories": await db.category.update({ where: { id }, data: categorySchema.parse(raw) }); break;
      case "brands": await db.brand.update({ where: { id }, data: brandSchema.parse(raw) }); break;
      case "products": {
        const input = productSchema.parse(raw);
        const optionIds = [...new Set(input.optionValueIds)];
        const [category, brand, options] = await Promise.all([
          db.category.findUnique({ where: { slug: input.categorySlug } }),
          db.brand.findUnique({ where: { slug: input.brandSlug } }),
          db.optionValue.findMany({ where: { id: { in: optionIds } } }),
        ]);
        if (!category || !brand) return fail("RELATION_NOT_FOUND", "Kateqoriya və ya brend tapılmadı", 422);
        if (options.length !== optionIds.length) return fail("OPTION_NOT_FOUND", "Seçilən option dəyərlərindən biri tapılmadı", 422);
        const selectedGroups = new Set(options.map((option) => option.groupKey));
        const optionGroups = ["SIZE", ...productOptionOrder.filter((group) => selectedGroups.has(group))];
        const panelHexes = options.filter((option) => option.groupKey === "OUTSIDE_COLOR" && option.hex).map((option) => option.hex!);
        await db.$transaction(async (tx) => {
          await tx.product.update({ where: { id }, data: {
            slug: input.slug, sku: input.sku, name: input.name, collection: input.collection,
            basePrice: input.basePrice, material: input.material, securityClass: input.securityClass,
            soundInsulationDb: input.soundInsulationDb, warrantyYears: input.warrantyYears,
            style: input.style, status: input.status, inStock: input.inStock, isBestseller: input.isBestseller,
            defaultWidth: input.defaultWidth, defaultHeight: input.defaultHeight,
            minWidth: input.minWidth, maxWidth: input.maxWidth, minHeight: input.minHeight, maxHeight: input.maxHeight,
            deliveryDaysMin: input.deliveryDaysMin, deliveryDaysMax: input.deliveryDaysMax,
            optionGroups: JSON.stringify(optionGroups), panelHexes: JSON.stringify(panelHexes),
            categoryId: category.id, brandId: brand.id,
          } });
          await tx.productOption.deleteMany({ where: { productId: id } });
          await tx.productOption.createMany({ data: optionIds.map((optionValueId) => ({ productId: id, optionValueId })) });
        });
        break;
      }
      case "options": {
        const input = optionSchema.parse(raw);
        const dependencyIds = [...new Set([...input.requires, ...input.excludes])];
        if (dependencyIds.includes(id)) return fail("SELF_REFERENCE", "Option özü ilə uyğunluq qaydası yarada bilməz", 422);
        const dependencyCount = await db.optionValue.count({ where: { id: { in: dependencyIds } } });
        if (dependencyCount !== dependencyIds.length) return fail("OPTION_NOT_FOUND", "Uyğunluq qaydasındakı option tapılmadı", 422);
        await db.optionValue.update({ where: { id }, data: {
          code: input.code, label: input.label, description: input.description || null,
          priceDelta: input.priceDelta, hex: input.hex || null,
          requires: input.requires.length ? JSON.stringify([...new Set(input.requires)]) : null,
          excludes: input.excludes.length ? JSON.stringify([...new Set(input.excludes)]) : null,
        } });
        break;
      }
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
        const order = input.orderNumber ? await db.order.findFirst({ where: { number: input.orderNumber, archivedAt: null } }) : null;
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
  });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ entity: string; id: string }> }) {
  return handle(async () => {
    const actor = await requireStaff("ADMIN");
    const { entity, id } = await params;
    return idempotentResponse(request, `admin.${entity}.delete:${id}`, actor.id, async () => {

    if (entity === "users" && id === actor.id) return fail("SELF_DELETE", "Öz hesabınızı deaktiv edə bilməzsiniz", 422);

    // Biznes və audit qeydləri fiziki silinmir — arxivlənir (PRD §160).
    const archivedAt = new Date();

    switch (entity) {
      case "categories": {
        const used = await db.product.count({ where: { categoryId: id } });
        if (used > 0) return fail("CATEGORY_IN_USE", "Kateqoriyaya bağlı məhsul var", 409);
        await db.category.delete({ where: { id } });
        break;
      }
      case "brands": {
        const used = await db.product.count({ where: { brandId: id } });
        if (used > 0) return fail("BRAND_IN_USE", "Brendə bağlı məhsul var", 409);
        await db.brand.delete({ where: { id } });
        break;
      }
      case "products": await db.product.update({ where: { id }, data: { archivedAt: new Date() } }); break;
      case "options": {
        const [productLinks, rules] = await Promise.all([
          db.productOption.count({ where: { optionValueId: id } }),
          db.optionValue.findMany({
            where: { id: { not: id }, OR: [{ requires: { not: null } }, { excludes: { not: null } }] },
            select: { requires: true, excludes: true },
          }),
        ]);
        const ruleLinks = rules.some((rule) => [...jsonIds(rule.requires), ...jsonIds(rule.excludes)].includes(id));
        if (productLinks > 0 || ruleLinks) {
          return fail("OPTION_IN_USE", "Option məhsuldan və uyğunluq qaydalarından ayrılmadan silinə bilməz", 409);
        }
        await db.optionValue.delete({ where: { id } });
        break;
      }
      case "appointments": await db.appointment.update({ where: { id }, data: { archivedAt } }); break;
      case "technicians": {
        const technician = await db.technician.findUnique({ where: { id } });
        if (!technician) return fail("NOT_FOUND", "Usta tapılmadı", 404);
        // Usta arxivlənir: görülmüş işlərin icraçısı qeydlərdə qalır,
        // panelə girişi isə hesab deaktiv edilərək bağlanır.
        await db.$transaction(async (tx) => {
          await tx.technician.update({ where: { id }, data: { archivedAt, status: "OFF" } });
          if (technician.userId) {
            await tx.user.update({ where: { id: technician.userId }, data: { deactivatedAt: archivedAt } });
            await tx.session.deleteMany({ where: { userId: technician.userId } });
          }
        });
        break;
      }
      case "users": {
        const user = await db.user.findUnique({ where: { id } });
        if (!user) return fail("NOT_FOUND", "İstifadəçi tapılmadı", 404);
        await db.$transaction(async (tx) => {
          await tx.user.update({ where: { id }, data: { deactivatedAt: archivedAt } });
          await tx.session.deleteMany({ where: { userId: id } });
        });
        break;
      }
      case "warranties": await db.warranty.update({ where: { id }, data: { archivedAt } }); break;
      case "orders": await db.order.update({ where: { id }, data: { archivedAt } }); break;
      case "quotes": await db.quoteRequest.update({ where: { id }, data: { archivedAt } }); break;
      case "repairs": await db.repairRequest.update({ where: { id }, data: { archivedAt } }); break;
      case "measurements": await db.measurementRequest.update({ where: { id }, data: { archivedAt } }); break;
      case "reviews": await db.review.update({ where: { id }, data: { archivedAt } }); break;
      default: return fail("NOT_FOUND", "Belə idarəetmə bölməsi yoxdur", 404);
    }

    // Yalnız taksonomiya fiziki silinir; qalanı arxiv və ya deaktivdir.
    const action = entity === "users" || entity === "technicians"
      ? "deactivate"
      : ["categories", "brands", "options"].includes(entity)
        ? "delete"
        : "archive";
    await recordAudit(actor, `${entity}.${action}`, id);
    revalidatePath("/", "layout");
      return ok({ ok: true });
    });
  });
}

function jsonList(value: string): string {
  return JSON.stringify(value.split(",").map((item) => item.trim()).filter(Boolean));
}

function jsonIds(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}
