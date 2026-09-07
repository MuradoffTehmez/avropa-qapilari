import { requireStaff } from "@/server/auth";
import { changeDetail, recordAudit } from "@/server/audit";
import { db } from "@/server/db";
import { fail, handle, ok } from "@/server/http";
import {
  isMeasurementStatus,
  isRepairStatus,
  JobError,
  updateMeasurementJob,
  updateRepairJob,
} from "@/server/jobs";
import { isQuoteStatus, QuoteError, setQuoteStatus } from "@/server/quotes";
import { requestUpdateSchema } from "@/server/validation";

const KINDS = ["repair", "measurement", "quote"] as const;
type Kind = (typeof KINDS)[number];

function isKind(value: string): value is Kind {
  return (KINDS as readonly string[]).includes(value);
}

/**
 * PATCH /api/admin/requests/:kind/:number
 *
 * Təmir, ölçü və qiymət təklifi müraciətlərinin statusunu dəyişir,
 * usta təyin edir. Yalnız ADMIN (PRD §93).
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ kind: string; number: string }> },
) {
  return handle(async () => {
    const actor = await requireStaff("ADMIN");
    const { kind, number } = await params;
    if (!isKind(kind)) return fail("NOT_FOUND", "Belə müraciət növü yoxdur", 404);

    const input = requestUpdateSchema.parse(await request.json());

    // Usta id-si verilibsə həqiqətən mövcud olmalıdır.
    if (input.technicianId) {
      const technician = await db.technician.findUnique({ where: { id: input.technicianId } });
      if (!technician) return fail("INVALID_TECHNICIAN", "Usta tapılmadı", 422);
    }

    if (kind === "repair") {
      const row = await db.repairRequest.findFirst({ where: { number, archivedAt: null } });
      if (!row) return fail("NOT_FOUND", "Müraciət tapılmadı", 404);

      // Təyinat və planlaşdırma sahələri sərbəst yenilənir, status isə
      // usta paneli ilə eyni keçid qaydalarından keçir (src/server/jobs.ts).
      const updated = await db.repairRequest.update({
        where: { number },
        data: {
          technicianId: input.technicianId === undefined ? row.technicianId : input.technicianId,
          scheduledAt: input.scheduledAt ?? row.scheduledAt,
          estimatedCost: input.estimatedCost ?? row.estimatedCost,
        },
      });

      let status = updated.status;
      if (input.status && input.status !== row.status) {
        if (!isRepairStatus(input.status)) {
          return fail("INVALID_STATUS", "Təmir müraciəti üçün belə status yoxdur", 422);
        }
        try {
          status = (await updateRepairJob(number, { status: input.status }, actor.id, null)).status;
        } catch (error) {
          if (error instanceof JobError) {
            return fail(error.code, error.message, error.status, error.details);
          }
          throw error;
        }
      }

      await recordAudit(
        actor,
        input.technicianId !== undefined ? "repair.assign" : "repair.update",
        number,
        changeDetail({
          status: [row.status, status],
          technicianId: [row.technicianId ?? "—", updated.technicianId ?? "—"],
        }),
      );

      return ok({ number: updated.number, status });
    }

    if (kind === "measurement") {
      const row = await db.measurementRequest.findFirst({ where: { number, archivedAt: null } });
      if (!row) return fail("NOT_FOUND", "Müraciət tapılmadı", 404);

      const updated = await db.measurementRequest.update({
        where: { number },
        data: {
          technicianId: input.technicianId === undefined ? row.technicianId : input.technicianId,
        },
      });

      let status = updated.status;
      if (input.status && input.status !== row.status) {
        if (!isMeasurementStatus(input.status)) {
          return fail("INVALID_STATUS", "Ölçü müraciəti üçün belə status yoxdur", 422);
        }
        try {
          status = (await updateMeasurementJob(number, { status: input.status }, actor.id, null)).status;
        } catch (error) {
          if (error instanceof JobError) {
            return fail(error.code, error.message, error.status, error.details);
          }
          throw error;
        }
      }

      await recordAudit(
        actor,
        input.technicianId !== undefined ? "measurement.assign" : "measurement.update",
        number,
        changeDetail({
          status: [row.status, status],
          technicianId: [row.technicianId ?? "—", updated.technicianId ?? "—"],
        }),
      );

      return ok({ number: updated.number, status });
    }

    // Təklifin statusu sərbəst yazılmır — icazə verilən keçidlərdən keçir
    // və tarixçəyə düşür (src/server/quotes.ts).
    if (!input.status) return fail("STATUS_REQUIRED", "Status göstərilməlidir", 422);
    if (!isQuoteStatus(input.status)) return fail("INVALID_STATUS", "Belə status yoxdur", 422);

    try {
      const quote = await setQuoteStatus(actor, number, input.status);
      return ok({ number: quote.number, status: quote.status });
    } catch (error) {
      if (error instanceof QuoteError) return fail(error.code, error.message, error.status);
      throw error;
    }
  });
}
