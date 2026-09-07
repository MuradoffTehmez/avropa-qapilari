import type { MeasurementStatus, RepairStatus } from "@/types";

/**
 * İŞ AXINININ KEÇİD CƏDVƏLLƏRİ.
 *
 * Saf məntiqdir — nə baza, nə UI asılılığı var. Server (`src/server/jobs.ts`)
 * keçidi məcbur edir, usta paneli isə eyni cədvəldən yalnız icazə verilən
 * düymələri göstərir; beləliklə interfeys serverin rədd edəcəyi əməliyyatı
 * təklif etmir.
 */

export type AppointmentStatus = "SCHEDULED" | "CONFIRMED" | "DONE" | "CANCELLED";

export const REPAIR_TRANSITIONS: Record<RepairStatus, RepairStatus[]> = {
  NEW: ["REVIEWING", "QUOTE_REQUIRED", "CANCELLED"],
  REVIEWING: ["QUOTE_REQUIRED", "WAITING_CUSTOMER", "TECHNICIAN_ASSIGNED", "SCHEDULED", "CANCELLED"],
  QUOTE_REQUIRED: ["WAITING_CUSTOMER", "CANCELLED"],
  WAITING_CUSTOMER: ["SCHEDULED", "TECHNICIAN_ASSIGNED", "CANCELLED"],
  SCHEDULED: ["TECHNICIAN_ASSIGNED", "ON_THE_WAY", "CANCELLED"],
  TECHNICIAN_ASSIGNED: ["SCHEDULED", "ON_THE_WAY", "CANCELLED"],
  ON_THE_WAY: ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["WAITING_FOR_PART", "COMPLETED", "CANCELLED"],
  WAITING_FOR_PART: ["IN_PROGRESS", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

export const MEASUREMENT_TRANSITIONS: Record<MeasurementStatus, MeasurementStatus[]> = {
  NEW: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["TECHNICIAN_ASSIGNED", "SCHEDULED", "CANCELLED"],
  TECHNICIAN_ASSIGNED: ["SCHEDULED", "CANCELLED"],
  SCHEDULED: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

export const APPOINTMENT_TRANSITIONS: Record<AppointmentStatus, AppointmentStatus[]> = {
  SCHEDULED: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["DONE", "CANCELLED"],
  DONE: [],
  CANCELLED: [],
};

export function isRepairStatus(value: string): value is RepairStatus {
  return value in REPAIR_TRANSITIONS;
}

export function isMeasurementStatus(value: string): value is MeasurementStatus {
  return value in MEASUREMENT_TRANSITIONS;
}

export function isAppointmentStatus(value: string): value is AppointmentStatus {
  return value in APPOINTMENT_TRANSITIONS;
}

/** Cari mərhələdən hədəf mərhələyə keçmək mümkündürmü. */
export function canTransition<T extends string>(
  table: Record<T, T[]>,
  from: T,
  to: T,
): boolean {
  return from === to || (table[from]?.includes(to) ?? false);
}
