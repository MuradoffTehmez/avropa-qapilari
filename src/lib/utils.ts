import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const azn = new Intl.NumberFormat("az-AZ", {
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

/** 1450 -> "1 450 AZN" */
export function formatPrice(value: number, withCurrency = true): string {
  const n = azn.format(Math.round(value)).replace(/ /g, " ");
  return withCurrency ? `${n} AZN` : n;
}

/** 1450 -> "1 450 AZN-dən" (PRD §29) */
export function formatPriceFrom(value: number): string {
  return `${formatPrice(value)}-dən`;
}

export function formatDate(iso: string, locale = "az-AZ"): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function formatDateTime(iso: string, locale = "az-AZ"): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function formatDimensions(width: number, height: number): string {
  return `${width} × ${height} mm`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function slugify(value: string): string {
  const map: Record<string, string> = {
    ə: "e", ı: "i", İ: "i", ğ: "g", ş: "s", ç: "c", ö: "o", ü: "u",
  };
  return value
    .toLowerCase()
    .replace(/[əıİğşçöü]/g, (c) => map[c] ?? c)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Demo identifikator generatoru — real nömrələr backend-də veriləcək (PRD §62). */
export function demoReference(prefix: string, year = 2026): string {
  const n = Math.floor(Math.random() * 899_999) + 100_000;
  return `${prefix}-${year}-${String(n).padStart(6, "0")}`;
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function pluralAz(count: number, one: string, many: string): string {
  return count === 1 ? one : many;
}
