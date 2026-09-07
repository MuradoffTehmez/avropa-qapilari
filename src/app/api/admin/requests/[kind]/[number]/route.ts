import { requireStaff } from "@/server/auth";
import { changeDetail, recordAudit } from "@/server/audit";
import { db } from "@/server/db";
import { fail, handle, ok } from "@/server/http";
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

      const updated = await db.repairRequest.update({
        where: { number },
        data: {
          status: input.status ?? row.status,
          technicianId: input.technicianId === undefined ? row.technicianId : input.technicianId,
          scheduledAt: input.scheduledAt ?? row.scheduledAt,
          estimatedCost: input.estimatedCost ?? row.estimatedCost,
        },
      });

      await recordAudit(
        actor,
        input.technicianId !== undefined ? "repair.assign" : "repair.update",
        number,
        changeDetail({
          status: [row.status, updated.status],
          technicianId: [row.technicianId ?? "—", updated.technicianId ?? "—"],
        }),
      );

      return ok({ number: updated.number, status: updated.status });
    }

    if (kind === "measurement") {
      const row = await db.measurementRequest.findUnique({ where: { number } });
      if (!row) return fail("NOT_FOUND", "Müraciət tapılmadı", 404);

      const updated = await db.measurementRequest.update({
        where: { number },
        data: {
          status: input.status ?? row.status,
          technicianId: input.technicianId === undefined ? row.technicianId : input.technicianId,
        },
      });

      await recordAudit(
        actor,
        input.technicianId !== undefined ? "measurement.assign" : "measurement.update",
        number,
        changeDetail({
          status: [row.status, updated.status],
          technicianId: [row.technicianId ?? "—", updated.technicianId ?? "—"],
        }),
      );

      return ok({ number: updated.number, status: updated.status });
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
