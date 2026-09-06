import { requireUser } from "@/server/auth";
import { adminSettings } from "@/server/admin";
import { recordAudit } from "@/server/audit";
import { db } from "@/server/db";
import { handle, ok } from "@/server/http";
import { settingsSchema } from "@/server/validation";

/** GET /api/admin/settings */
export async function GET() {
  return handle(async () => {
    await requireUser("ADMIN");
    return ok(await adminSettings());
  });
}

/**
 * PATCH /api/admin/settings — açar/dəyər cütləri.
 * Yalnız mövcud açarlar yenilənir; yeni açar kodla əlavə olunur.
 */
export async function PATCH(request: Request) {
  return handle(async () => {
    const actor = await requireUser("ADMIN");
    const { values } = settingsSchema.parse(await request.json());

    const existing = await db.setting.findMany({
      where: { key: { in: Object.keys(values) } },
    });
    const before = new Map(existing.map((s) => [s.key, s.value]));

    const changed: string[] = [];
    for (const [key, value] of Object.entries(values)) {
      if (before.get(key) === value) continue;
      await db.setting.upsert({ where: { key }, create: { key, value }, update: { value } });
      changed.push(`${key}: ${before.get(key) ?? "—"} → ${value || "—"}`);
    }

    if (changed.length > 0) {
      await recordAudit(actor, "setting.manage", "settings", changed.join(", "));
    }

    return ok(await adminSettings());
  });
}
