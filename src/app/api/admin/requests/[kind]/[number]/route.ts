import { requireStaff } from "@/server/auth";
import { changeDetail, recordAudit } from "@/server/audit";
import { db } from "@/server/db";
import { fail, handle, ok } from "@/server/http";
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
      const row = await db.repairRequest.findUnique({ where: { number } });
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

    const row = await db.quoteRequest.findUnique({ where: { number } });
    if (!row) return fail("NOT_FOUND", "Müraciət tapılmadı", 404);

    const updated = await db.quoteRequest.update({
      where: { number },
      data: { status: input.status ?? row.status },
    });

    await recordAudit(
      actor,
      "quote.update",
      number,
      changeDetail({ status: [row.status, updated.status] }),
    );

    return ok({ number: updated.number, status: updated.status });
  });
}
