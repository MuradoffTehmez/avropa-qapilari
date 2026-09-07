import { requireStaff } from "@/server/auth";
import { fail, handle, ok } from "@/server/http";
import { isRepairStatus, jobEvents, JobError, updateRepairJob } from "@/server/jobs";
import { technicianJobSchema } from "@/server/validation";

/** GET /api/technician/jobs/:number — işin status tarixçəsi. */
export async function GET(_request: Request, { params }: { params: Promise<{ number: string }> }) {
  return handle(async () => {
    await requireStaff("TECHNICIAN");
    const { number } = await params;
    return ok(await jobEvents("REPAIR", number));
  });
}

/**
 * PATCH /api/technician/jobs/:number
 *
 * Usta yalnız ona təyin edilmiş müraciəti yeniləyir (PRD §93) və yalnız
 * cari mərhələdən icazə verilən mərhələyə keçir — "yoldadır" olmadan
 * birbaşa "tamamlandı"ya keçmək mümkün deyil. "Tamamlandı" servis qeydi
 * tələb edir.
 */
export async function PATCH(request: Request, { params }: { params: Promise<{ number: string }> }) {
  return handle(async () => {
    const user = await requireStaff("TECHNICIAN");
    const { number } = await params;
    const { status, ...rest } = technicianJobSchema.parse(await request.json());
    if (status && !isRepairStatus(status)) {
      return fail("INVALID_STATUS", "Təmir müraciəti üçün belə status yoxdur", 422);
    }

    try {
      return ok(await updateRepairJob(number, { ...rest, status }, user.id, user.id));
    } catch (error) {
      if (error instanceof JobError) {
        return fail(error.code, error.message, error.status, error.details);
      }
      throw error;
    }
  });
}
