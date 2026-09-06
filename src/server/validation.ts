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
