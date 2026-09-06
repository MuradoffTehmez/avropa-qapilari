import { z } from "zod";

/** Giriş validasiyası — bütün API route-ları bu sxemlərdən keçir. */

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
  width: z.number().int().min(400, "En çox kiçikdir").max(3000, "En çox böyükdür"),
  height: z.number().int().min(1200, "Hündürlük çox kiçikdir").max(3500, "Hündürlük çox böyükdür"),
  choices: choicesSchema.default({}),
});

export const configurationSchema = priceSchema;

export const orderItemSchema = z.object({
  productSlug: z.string().min(1),
  quantity: z.number().int().min(1, "Say ən azı 1").max(50, "Say çox böyükdür").default(1),
  width: z.number().int().min(400, "En çox kiçikdir").max(3000, "En çox böyükdür"),
  height: z.number().int().min(1200, "Hündürlük çox kiçikdir").max(3500, "Hündürlük çox böyükdür"),
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
  phone: z.string().trim().optional(),
  password: z.string().min(8, "Parol ən azı 8 simvol olmalıdır"),
});

export const loginSchema = z.object({
  email: z.email("E-poçt düzgün deyil"),
  password: z.string().min(1, "Parol tələb olunur"),
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
