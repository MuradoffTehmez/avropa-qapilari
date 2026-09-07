import { requireStaff } from "@/server/auth";
import { adminDiscounts } from "@/server/admin";
import { recordAudit } from "@/server/audit";
import { db } from "@/server/db";
import { fail, handle, ok } from "@/server/http";
import { discountSchema } from "@/server/validation";

/** GET /api/admin/discounts */
export async function GET() {
  return handle(async () => {
    await requireStaff("ADMIN");
    return ok(await adminDiscounts());
  });
}

/** POST /api/admin/discounts — yeni endirim kodu. */
export async function POST(request: Request) {
  return handle(async () => {
    const actor = await requireStaff("ADMIN");
    const input = discountSchema.parse(await request.json());

    if (input.endsAt < input.startsAt) {
      return fail("INVALID_PERIOD", "Bitmə tarixi başlanğıcdan əvvəl ola bilməz", 422, {
        endsAt: "Bitmə tarixi başlanğıcdan sonra olmalıdır",
      });
    }

    const exists = await db.discount.findUnique({ where: { code: input.code } });
    if (exists) {
      return fail("DUPLICATE_CODE", "Bu kod artıq mövcuddur", 422, {
        code: "Bu kod artıq mövcuddur",
      });
    }

    await db.discount.create({ data: input });
    await recordAudit(actor, "discount.create", input.code, `${input.type} ${input.value}`);

    return ok(await adminDiscounts(), { status: 201 });
  });
}
