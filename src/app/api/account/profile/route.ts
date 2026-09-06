import { requireUser } from "@/server/auth";
import { db } from "@/server/db";
import { handle, ok } from "@/server/http";
import { profileSchema } from "@/server/validation";

/**
 * GET /api/account/profile — cari istifadəçinin profili.
 * E-poçt burada dəyişdirilmir: dəyişikliyi təsdiqləmək üçün ayrıca
 * axın lazımdır, ona görə yalnız oxunur.
 */
export async function GET() {
  return handle(async () => {
    const session = await requireUser();
    const user = await db.user.findUniqueOrThrow({ where: { id: session.id } });

    return ok({
      name: user.name,
      email: user.email,
      phone: user.phone ?? "",
      language: user.language,
      marketingConsent: user.marketingConsent,
    });
  });
}

/** PATCH /api/account/profile — ad, telefon, dil və razılıq. */
export async function PATCH(request: Request) {
  return handle(async () => {
    const session = await requireUser();
    const input = profileSchema.parse(await request.json());

    const user = await db.user.update({
      where: { id: session.id },
      data: {
        name: input.name,
        phone: input.phone ?? "",
        language: input.language,
        marketingConsent: input.marketingConsent,
      },
    });

    return ok({
      name: user.name,
      email: user.email,
      phone: user.phone ?? "",
      language: user.language,
      marketingConsent: user.marketingConsent,
    });
  });
}
