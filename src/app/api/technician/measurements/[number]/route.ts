import { requireStaff } from "@/server/auth";
import { fail, handle, ok } from "@/server/http";
import { jobEvents, JobError, updateMeasurementJob } from "@/server/jobs";
import { measurementResultSchema } from "@/server/validation";

/** GET /api/technician/measurements/:number — ölçü müraciətinin tarixçəsi. */
export async function GET(_request: Request, { params }: { params: Promise<{ number: string }> }) {
  return handle(async () => {
    await requireStaff("TECHNICIAN");
    const { number } = await params;
    return ok(await jobEvents("MEASUREMENT", number));
  });
}

/**
 * PATCH /api/technician/measurements/:number — ustanın yerində götürdüyü
 * ölçünü yazır. Nəticə (en və hündürlük) olmadan müraciət bağlanmır.
 */
export async function PATCH(request: Request, { params }: { params: Promise<{ number: string }> }) {
  return handle(async () => {
    const user = await requireStaff("TECHNICIAN");
    const { number } = await params;
    const input = measurementResultSchema.parse(await request.json());

    try {
      return ok(await updateMeasurementJob(number, input, user.id, user.id));
    } catch (error) {
      if (error instanceof JobError) {
        return fail(error.code, error.message, error.status, error.details);
      }
      throw error;
    }
  });
}
