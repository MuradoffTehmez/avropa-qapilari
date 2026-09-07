import { z } from "zod";

import { SIZE_LIMITS } from "@/features/configurator/limits";

/** Giriş validasiyası — bütün API route-ları bu sxemlərdən keçir. */

/** Ölçü sahələri client ilə eyni hüdudlardan qurulur. */
const widthField = z
  .number()
  .int()
  .min(SIZE_LIMITS.minWidth, "En çox kiçikdir")
  .max(SIZE_LIMITS.maxWidth, "En çox böyükdür");
const heightField = z
  .number()
  .int()
  .min(SIZE_LIMITS.minHeight, "Hündürlük çox kiçikdir")
  .max(SIZE_LIMITS.maxHeight, "Hündürlük çox böyükdür");

const phone = z
  .string()
  .trim()
  .refine((v) => v.replace(/\D/g, "").length >= 9, "Telefon nömrəsi düzgün deyil");

export const choicesSchema = z.record(
  z.string(),
  z.union([z.string(), z.array(z.string())]),
);

export const priceSchema = z.object({
  productSlug: z.string().min(1, "Məhsul seçilməlidir"),
  width: widthField,
  height: heightField,
  choices: choicesSchema.default({}),
});

export const configurationSchema = priceSchema;

export const orderItemSchema = z.object({
  productSlug: z.string().min(1),
  quantity: z.number().int().min(1, "Say ən azı 1").max(50, "Say çox böyükdür").default(1),
  width: widthField,
  height: heightField,
  choices: choicesSchema.default({}),
});

export const orderSchema = z.object({
  customerName: z.string().trim().min(2, "Ad ən azı 2 simvol olmalıdır"),
  customerPhone: phone,
  customerEmail: z.email("E-poçt düzgün deyil"),
  address: z.string().trim().min(5, "Ünvan çox qısadır"),
  items: z.array(orderItemSchema).min(1, "Səbət boşdur"),
});

export const repairSchema = z.object({
  category: z.string().min(1, "Problem seçilməlidir"),
  doorType: z.string().min(1, "Qapı növü seçilməlidir"),
  description: z.string().trim().min(10, "Ən azı 10 simvol yazın"),
  city: z.string().trim().min(2, "Şəhər seçilməlidir"),
  address: z.string().trim().min(3, "Ünvan çox qısadır"),
  preferredAt: z.string().optional(),
  name: z.string().trim().min(2, "Ad ən azı 2 simvol olmalıdır"),
  phone,
});

export const measurementSchema = z.object({
  propertyType: z.string().min(1, "Obyekt növü seçilməlidir"),
  doorCount: z.number().int().min(1, "Ən azı bir qapı").max(200, "Çox böyük say"),
  city: z.string().trim().min(2, "Şəhər seçilməlidir"),
  address: z.string().trim().min(3, "Ünvan çox qısadır"),
  preferredAt: z.string().optional(),
  name: z.string().trim().min(2, "Ad ən azı 2 simvol olmalıdır"),
  phone,
  note: z.string().trim().max(1000).optional(),
});

export const quoteSchema = z.object({
  name: z.string().trim().min(2, "Ad ən azı 2 simvol olmalıdır"),
  phone,
  email: z.email().optional().or(z.literal("")),
  productSlug: z.string().optional(),
  width: z.number().int().optional(),
  height: z.number().int().optional(),
  message: z.string().trim().min(10, "Ən azı 10 simvol yazın"),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Ad ən azı 2 simvol olmalıdır"),
  email: z.email("E-poçt düzgün deyil"),
  phone,
  password: z.string().min(8, "Parol ən azı 8 simvol olmalıdır"),
  language: z.enum(["az", "en", "ru"]).default("az"),
  marketingConsent: z.boolean().default(false),
});

export const loginSchema = z.object({
  email: z.email("E-poçt düzgün deyil"),
  password: z.string().min(1, "Parol tələb olunur"),
});

export const staffLoginSchema = loginSchema.extend({
  role: z.enum(["ADMIN", "TECHNICIAN"]),
});

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Ad ən azı 2 simvol olmalıdır"),
  phone: z.string().trim().optional(),
  language: z.enum(["az", "en", "ru"]),
  marketingConsent: z.boolean(),
});

export const addressSchema = z.object({
  label: z.string().trim().min(1, "Ad tələb olunur").max(60),
  city: z.string().trim().min(2, "Şəhər seçilməlidir"),
  district: z.string().trim().max(80).optional(),
  street: z.string().trim().max(120).optional(),
  building: z.string().trim().max(40).optional(),
  apartment: z.string().trim().max(40).optional(),
  floor: z.string().trim().max(20).optional(),
  isDefault: z.boolean().optional(),
});

export const passwordChangeSchema = z.object({
  current: z.string().min(1, "Cari parol tələb olunur"),
  next: z.string().min(8, "Parol ən azı 8 simvol olmalıdır"),
});

export const passwordResetRequestSchema = z.object({
  email: z.email("E-poçt düzgün deyil"),
});

export const passwordResetSchema = z.object({
  token: z.string().min(10, "Token düzgün deyil"),
  password: z.string().min(8, "Parol ən azı 8 simvol olmalıdır"),
});

/* --------------------------- Admin əməliyyatları ----------------------- */

export const ORDER_STATUSES = [
  "DRAFT",
  "PENDING_PAYMENT",
  "PAID",
  "CONFIRMED",
  "PROCESSING",
  "MANUFACTURING",
  "READY",
  "SHIPPED",
  "DELIVERED",
  "INSTALLATION_SCHEDULED",
  "INSTALLED",
  "COMPLETED",
  "CANCELLED",
  "REFUNDED",
] as const;

export const REQUEST_STATUSES = [
  "NEW",
  "REVIEWING",
  "QUOTE_REQUIRED",
  "WAITING_CUSTOMER",
  "CONFIRMED",
  "SCHEDULED",
  "TECHNICIAN_ASSIGNED",
  "ON_THE_WAY",
  "IN_PROGRESS",
  "WAITING_FOR_PART",
  "PRICED",
  "SENT",
  "ACCEPTED",
  "REJECTED",
  "EXPIRED",
  "CONVERTED",
  "COMPLETED",
  "CANCELLED",
] as const;

export const PAYMENT_STATUSES = [
  "PENDING",
  "AUTHORIZED",
  "PAID",
  "FAILED",
  "REFUNDED",
] as const;

export const orderStatusSchema = z
  .object({
    status: z.enum(ORDER_STATUSES, "Belə sifariş statusu yoxdur").optional(),
    paymentStatus: z.enum(PAYMENT_STATUSES, "Belə ödəniş vəziyyəti yoxdur").optional(),
  })
  .refine((v) => v.status !== undefined || v.paymentStatus !== undefined, {
    message: "Dəyişdiriləcək sahə göstərilməyib",
  });

export const requestUpdateSchema = z.object({
  status: z.enum(REQUEST_STATUSES, "Belə status yoxdur").optional(),
  technicianId: z.string().nullable().optional(),
  scheduledAt: z.string().optional(),
  estimatedCost: z.number().int().min(0).optional(),
});

export const technicianJobSchema = z.object({
  status: z.enum(REQUEST_STATUSES, "Belə status yoxdur").optional(),
  resolution: z.string().trim().min(10, "Ən azı 10 simvol yazın").optional(),
  usedParts: z.string().trim().max(500).optional(),
});

export const discountSchema = z.object({
  code: z
    .string()
    .trim()
    .min(3, "Kod ən azı 3 simvol olmalıdır")
    .max(32)
    .regex(/^[A-Z0-9-]+$/, "Yalnız böyük hərf, rəqəm və defis"),
  name: z.string().trim().min(2, "Ad tələb olunur").max(80),
  type: z.enum(["PERCENTAGE", "AMOUNT", "SERVICE"], "Belə endirim növü yoxdur"),
  value: z.number().int().min(0, "Dəyər mənfi ola bilməz").max(100000),
  scope: z.string().trim().max(80).default("ALL"),
  startsAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Tarix YYYY-MM-DD formatında olmalıdır"),
  endsAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Tarix YYYY-MM-DD formatında olmalıdır"),
  active: z.boolean().default(true),
});

export const contentPageSchema = z.object({
  path: z.string().trim().regex(/^\/[a-z0-9/-]*$/, "Yol / ilə başlamalıdır"),
  title: z.string().trim().min(2, "Başlıq tələb olunur").max(120),
  body: z.string().max(20000).default(""),
  published: z.boolean().default(false),
});

export const seoEntrySchema = z.object({
  path: z.string().trim().regex(/^\/[a-z0-9/-]*$/, "Yol / ilə başlamalıdır"),
  title: z.string().trim().min(2, "Başlıq tələb olunur").max(70, "70 simvoldan uzun olmamalıdır"),
  description: z
    .string()
    .trim()
    .max(160, "160 simvoldan uzun olmamalıdır")
    .default(""),
  canonical: z.string().trim().max(300).optional(),
});

export const reviewStatusSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"], "Belə status yoxdur"),
});

export const settingsSchema = z.object({
  values: z.record(z.string(), z.string().max(300)),
});

export const roleSchema = z.object({
  role: z.enum(["CUSTOMER", "TECHNICIAN", "ADMIN"], "Belə rol yoxdur"),
});
