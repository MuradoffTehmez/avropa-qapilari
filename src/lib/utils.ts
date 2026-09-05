import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Rəqəm formatlaması Intl-siz aparılır: Node və brauzerin ICU verilənləri
 * fərqli boşluq simvolu verə bilir və bu, hydration mismatch yaradır.
 */
const NBSP = " ";

export function formatNumber(value: number): string {
  const rounded = Math.round(value);
  const sign = rounded < 0 ? "-" : "";
  const digits = Math.abs(rounded).toString();
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
  return sign + grouped;
}

/** 1450 -> "1 450 AZN" */
export function formatPrice(value: number, withCurrency = true): string {
  const n = formatNumber(value);
  return withCurrency ? `${n}${NBSP}AZN` : n;
}

/** 1450 -> "1 450 AZN-dən" */
export function formatPriceFrom(value: number): string {
  return `${formatPrice(value)}-dən`;
}

const monthsShort = [
  "yan", "fev", "mar", "apr", "may", "iyn",
  "iyl", "avq", "sen", "okt", "noy", "dek",
];

const monthsLong = [
  "yanvar", "fevral", "mart", "aprel", "may", "iyun",
  "iyul", "avqust", "sentyabr", "oktyabr", "noyabr", "dekabr",
];

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

/** 2026-06-04 -> "04 iyn 2026" */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${pad(d.getDate())} ${monthsShort[d.getMonth()]} ${d.getFullYear()}`;
}

/** 2026-06-04 -> "4 iyun 2026" */
export function formatDateLong(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getDate()} ${monthsLong[d.getMonth()]} ${d.getFullYear()}`;
}

/** 2026-06-04T09:30 -> "04 iyn, 09:30" */
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${pad(d.getDate())} ${monthsShort[d.getMonth()]}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function monthShort(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : monthsShort[d.getMonth()];
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

/** Müraciət nömrəsi generatoru — backend qoşulanda serverdə veriləcək. */
export function createReference(prefix: string, year = 2026): string {
  const n = Math.floor(Math.random() * 899_999) + 100_000;
  return `${prefix}-${year}-${String(n).padStart(6, "0")}`;
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function pluralAz(count: number, one: string, many: string): string {
  return count === 1 ? one : many;
}
