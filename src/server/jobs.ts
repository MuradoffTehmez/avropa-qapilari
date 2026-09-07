import type { Prisma } from "@prisma/client";

import type { MeasurementStatus, RepairStatus } from "@/types";
import {
  APPOINTMENT_TRANSITIONS,
  isAppointmentStatus,
  isMeasurementStatus,
  isRepairStatus,
  MEASUREMENT_TRANSITIONS,
  REPAIR_TRANSITIONS,
  type AppointmentStatus,
} from "@/features/service/transitions";
import { db } from "@/server/db";

/**
 * İŞ AXINI VƏ STATUS QAYDALARI (PRD §75–§84).
 *
 * Status sərbəst mətn kimi qəbul edilmir: usta və admin yalnız cari
 * mərhələdən icazə verilən növbəti mərhələyə keçə bilir. Hər keçid
 * `JobEvent`-ə yazılır — kim, nə vaxt, hansı qeydlə.
 */

export type { AppointmentStatus } from "@/features/service/transitions";
export {
  APPOINTMENT_TRANSITIONS,
  isAppointmentStatus,
  isMeasurementStatus,
  isRepairStatus,
  MEASUREMENT_TRANSITIONS,
  REPAIR_TRANSITIONS,
} from "@/features/service/transitions";

export type JobKind = "REPAIR" | "MEASUREMENT" | "APPOINTMENT";

export class JobError extends Error {
  constructor(
    readonly code:
      | "NOT_FOUND"
      | "FORBIDDEN"
      | "INVALID_TRANSITION"
      | "RESOLUTION_REQUIRED"
      | "RESULT_REQUIRED"
      | "REASON_REQUIRED",
    message: string,
    readonly status = 422,
    readonly details?: Record<string, string>,
  ) {
    super(message);
  }
}

function assertTransition<T extends string>(
  table: Record<T, T[]>,
  from: T,
  to: T,
): void {
  if (from === to) return;
  if (!table[from]?.includes(to)) {
    throw new JobError(
      "INVALID_TRANSITION",
      `"${from}" mərhələsindən "${to}" mərhələsinə keçmək olmaz`,
    );
  }
}

export async function recordJobEvent(
  tx: Prisma.TransactionClient,
  kind: JobKind,
  reference: string,
  status: string,
  actorId: string | null,
  note?: string | null,
): Promise<void> {
  await tx.jobEvent.create({ data: { kind, reference, status, actorId, note: note ?? null } });
}

/** Müraciətin status tarixçəsi — usta və müştəri panelində göstərilir. */
export async function jobEvents(kind: JobKind, reference: string) {
  const rows = await db.jobEvent.findMany({
    where: { kind, reference },
    orderBy: { createdAt: "asc" },
  });
  return rows.map((row) => ({
    status: row.status,
    note: row.note,
    createdAt: row.createdAt.toISOString(),
  }));
}

/* -------------------------------- Təmir -------------------------------- */

export interface RepairUpdate {
  status?: RepairStatus;
  diagnosis?: string;
  resolution?: string;
  usedParts?: string;
  partsCost?: number;
  labourCost?: number;
  customerNote?: string;
  /** Müştəri işi qəbul etdi — təhvil təsdiqi. */
  handover?: boolean;
}

/**
 * Təmir müraciətini yeniləyir.
 *
 * `technicianUserId` verilibsə yalnız ona təyin edilmiş iş dəyişdirilə
 * bilər; admin üçün `null` ötürülür (PRD §93).
 */
export async function updateRepairJob(
  number: string,
  input: RepairUpdate,
  actorId: string,
  technicianUserId: string | null,
) {
  const job = await db.repairRequest.findFirst({
    where: { number, archivedAt: null },
    include: { technician: true },
  });
  if (!job) throw new JobError("NOT_FOUND", "Müraciət tapılmadı", 404);
  if (technicianUserId && job.technician?.userId !== technicianUserId) {
    throw new JobError("FORBIDDEN", "Bu müraciət sizə təyin edilməyib", 403);
  }

  const current = isRepairStatus(job.status) ? job.status : "NEW";
  const next = input.status ?? current;
  assertTransition(REPAIR_TRANSITIONS, current, next);

  const resolution = input.resolution ?? job.resolution;
  if (next === "COMPLETED" && !resolution) {
    throw new JobError("RESOLUTION_REQUIRED", "Servis qeydi olmadan bağlamaq olmaz", 422, {
      resolution: "Görülən işi yazın",
    });
  }

  const closing = next === "COMPLETED" && current !== "COMPLETED";
  const starting = next === "IN_PROGRESS" && job.startedAt === null;

  await db.$transaction(async (tx) => {
    await tx.repairRequest.update({
      where: { number },
      data: {
        status: next,
        diagnosis: input.diagnosis ?? job.diagnosis,
        resolution,
        usedParts: input.usedParts ?? job.usedParts,
        partsCost: input.partsCost ?? job.partsCost,
        labourCost: input.labourCost ?? job.labourCost,
        customerNote: input.customerNote ?? job.customerNote,
        startedAt: starting ? new Date() : job.startedAt,
        completedAt: closing ? new Date() : job.completedAt,
        handoverAt: input.handover ? new Date() : job.handoverAt,
      },
    });

    if (next !== current) {
      await recordJobEvent(tx, "REPAIR", number, next, actorId, input.diagnosis ?? null);
    }

    // Tamamlanmış iş sayğacı ustanın profilində göstərilir.
    if (closing && job.technicianId) {
      await tx.technician.update({
        where: { id: job.technicianId },
        data: { completedJobs: { increment: 1 } },
      });
    }
  });

  return { number, status: next, nextStatuses: REPAIR_TRANSITIONS[next] };
}

/* --------------------------------- Ölçü -------------------------------- */

export interface MeasurementUpdate {
  status?: MeasurementStatus;
  resultWidth?: number;
  resultHeight?: number;
  frameDepth?: number;
  openingDirection?: string;
  resultNote?: string;
}

/** Ustanın yerində götürdüyü ölçünü yazır və mərhələni dəyişir. */
export async function updateMeasurementJob(
  number: string,
  input: MeasurementUpdate,
  actorId: string,
  technicianUserId: string | null,
) {
  const job = await db.measurementRequest.findFirst({
    where: { number, archivedAt: null },
    include: { technician: true },
  });
  if (!job) throw new JobError("NOT_FOUND", "Müraciət tapılmadı", 404);
  if (technicianUserId && job.technician?.userId !== technicianUserId) {
    throw new JobError("FORBIDDEN", "Bu müraciət sizə təyin edilməyib", 403);
  }

  const current = isMeasurementStatus(job.status) ? job.status : "NEW";
  const next = input.status ?? current;
  assertTransition(MEASUREMENT_TRANSITIONS, current, next);

  const width = input.resultWidth ?? job.resultWidth;
  const height = input.resultHeight ?? job.resultHeight;
  if (next === "COMPLETED" && (!width || !height)) {
    throw new JobError("RESULT_REQUIRED", "Ölçü nəticəsi olmadan bağlamaq olmaz", 422, {
      resultWidth: "En və hündürlüyü yazın",
    });
  }

  const measured = width !== null && height !== null;

  await db.$transaction(async (tx) => {
    await tx.measurementRequest.update({
      where: { number },
      data: {
        status: next,
        resultWidth: width,
        resultHeight: height,
        frameDepth: input.frameDepth ?? job.frameDepth,
        openingDirection: input.openingDirection ?? job.openingDirection,
        resultNote: input.resultNote ?? job.resultNote,
        measuredAt: measured ? (job.measuredAt ?? new Date()) : job.measuredAt,
      },
    });

    if (next !== current) {
      await recordJobEvent(tx, "MEASUREMENT", number, next, actorId, input.resultNote ?? null);
    }
  });

  return { number, status: next, nextStatuses: MEASUREMENT_TRANSITIONS[next] };
}

/* -------------------------------- Görüş -------------------------------- */

export interface AppointmentUpdate {
  status?: AppointmentStatus;
  /** Rədd və ya ləğv səbəbi — CANCELLED üçün məcburidir. */
  reason?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
}

/** Ustanın görüşü qəbul, rədd və ya yenidən planlaşdırması. */
export async function updateAppointment(
  id: string,
  input: AppointmentUpdate,
  actorId: string,
  technicianUserId: string | null,
) {
  const appointment = await db.appointment.findFirst({
    where: { id, archivedAt: null },
    include: { technician: true },
  });
  if (!appointment) throw new JobError("NOT_FOUND", "Görüş tapılmadı", 404);
  if (technicianUserId && appointment.technician?.userId !== technicianUserId) {
    throw new JobError("FORBIDDEN", "Bu görüş sizə təyin edilməyib", 403);
  }

  const current = isAppointmentStatus(appointment.status) ? appointment.status : "SCHEDULED";
  const next = input.status ?? current;
  assertTransition(APPOINTMENT_TRANSITIONS, current, next);

  if (next === "CANCELLED" && !input.reason) {
    throw new JobError("REASON_REQUIRED", "Ləğv səbəbini yazın", 422, { reason: "Səbəb tələb olunur" });
  }

  const date = input.date ?? appointment.date;
  const startTime = input.startTime ?? appointment.startTime;
  const endTime = input.endTime ?? appointment.endTime;

  // Yenidən planlaşdırma ustanın başqa görüşü ilə üst-üstə düşməməlidir.
  if (appointment.technicianId && (input.date || input.startTime || input.endTime)) {
    const clash = await db.appointment.findFirst({
      where: {
        id: { not: id },
        technicianId: appointment.technicianId,
        archivedAt: null,
        status: { not: "CANCELLED" },
        date,
        startTime: { lt: endTime },
        endTime: { gt: startTime },
      },
    });
    if (clash) {
      throw new JobError("INVALID_TRANSITION", "Bu saatda başqa görüş var", 409);
    }
  }

  await db.$transaction(async (tx) => {
    await tx.appointment.update({
      where: { id },
      data: {
        status: next,
        date,
        startTime,
        endTime,
        declineReason: next === "CANCELLED" ? (input.reason ?? null) : appointment.declineReason,
      },
    });

    if (next !== current || input.date || input.startTime || input.endTime) {
      await recordJobEvent(
        tx,
        "APPOINTMENT",
        appointment.reference,
        next,
        actorId,
        input.reason ?? `${date} ${startTime}–${endTime}`,
      );
    }
  });

  return { id, status: next, nextStatuses: APPOINTMENT_TRANSITIONS[next] };
}
