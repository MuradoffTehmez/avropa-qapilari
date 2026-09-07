import type { Locale, Review } from "@/types";
import { db } from "@/server/db";
import { reviewTranslation } from "@/mock/content.i18n";

/**
 * Saytda göstərilən rəylər.
 *
 * Yalnız `APPROVED` statuslu sətirlər qaytarılır — admin panelindəki
 * moderasiya birbaşa saytda görünür (PRD §103).
 *
 * Tərcümə: seed edilmiş rəylərin id-si `src/mock/content.i18n.ts`-dəki
 * açarlarla üst-üstə düşür, ona görə EN/RU mətnləri saxlanılır. Sonradan
 * əlavə olunan rəylər öz orijinal dilində göstərilir.
 */
export async function publishedReviews(locale: Locale, productName?: string): Promise<Review[]> {
  const rows = await db.review.findMany({
    where: {
      status: "APPROVED",
      archivedAt: null,
      ...(productName ? { product: { name: productName } } : {}),
    },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  return rows.map((rv) => {
    const translated = reviewTranslation(rv.id, locale);
    return {
      id: rv.id,
      author: rv.author,
      city: translated?.city ?? rv.city,
      rating: rv.rating,
      date: rv.createdAt.toISOString(),
      productName: rv.product.name,
      text: translated?.text ?? rv.text,
      verified: rv.verified,
    };
  });
}
