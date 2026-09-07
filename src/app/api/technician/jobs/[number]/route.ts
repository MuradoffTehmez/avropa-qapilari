import { requireStaff } from "@/server/auth";
import { db } from "@/server/db";
import { fail, handle, ok } from "@/server/http";
import { technicianJobSchema } from "@/server/validation";

/**
 * PATCH /api/technician/jobs/:number
 *
 * Usta yalnız ona təyin edilmiş müraciəti yeniləyə bilər; ADMIN
 * istənilənini (PRD §93). "Tamamlandı" statusu servis qeydi tələb edir.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ number: string }> },
) {
  return handle(async () => {
    const user = await requireStaff("TECHNICIAN");
    const { number } = await params;
    const input = technicianJobSchema.parse(await request.json());

    const job = await db.repairRequest.findUnique({
      where: { number },
      include: { technician: true },
    });
    if (!job) return fail("NOT_FOUND", "Müraciət tapılmadı", 404);

    if (job.technician?.userId !== user.id) {
      return fail("FORBIDDEN", "Bu müraciət sizə təyin edilməyib", 403);
    }

    const status = input.status ?? job.status;
    const resolution = input.resolution ?? job.resolution;

    if (status === "COMPLETED" && !resolution) {
      return fail("RESOLUTION_REQUIRED", "Servis qeydi olmadan bağlamaq olmaz", 422, {
        resolution: "Görülən işi yazın",
      });
    }

    const closing = status === "COMPLETED" && job.status !== "COMPLETED";

    await db.$transaction(async (tx) => {
      await tx.repairRequest.update({
        where: { number },
        data: {
          status,
          resolution,
          usedParts: input.usedParts ?? job.usedParts,
          completedAt: closing ? new Date() : job.completedAt,
        },
      });

      // Tamamlanmış iş sayğacı ustanın profilində göstərilir.
      if (closing && job.technicianId) {
        await tx.technician.update({
          where: { id: job.technicianId },
          data: { completedJobs: { increment: 1 } },
        });
      }
    });

    return ok({ number, status });
  });
}
