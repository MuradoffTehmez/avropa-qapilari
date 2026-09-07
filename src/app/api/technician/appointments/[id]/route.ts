import { requireStaff } from "@/server/auth";
import { fail, handle, ok } from "@/server/http";
import { JobError, updateAppointment } from "@/server/jobs";
import { appointmentActionSchema } from "@/server/validation";

/**
 * PATCH /api/technician/appointments/:id — usta görüşü qəbul edir, rədd
 * edir və ya yenidən planlaşdırır. Rədd səbəbsiz qəbul edilmir, yeni
 * saat isə ustanın digər görüşü ilə üst-üstə düşə bilməz.
 */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    const user = await requireStaff("TECHNICIAN");
    const { id } = await params;
    const input = appointmentActionSchema.parse(await request.json());

    try {
      return ok(await updateAppointment(id, input, user.id, user.id));
    } catch (error) {
      if (error instanceof JobError) {
        return fail(error.code, error.message, error.status, error.details);
      }
      throw error;
    }
  });
}
