/**
 * Bazanı mövcud test datası ilə doldurur.
 *
 * Mənbə `src/mock/` qovluğudur — beləliklə backend qoşulandan sonra da
 * sayt eyni məzmunu göstərir və heç bir səhifə boşalmır.
 */
import { PrismaClient } from "../src/generated/prisma";
import { products } from "../src/mock/products";
import { brands, categories } from "../src/mock/taxonomy";
import { allOptionValues } from "../src/mock/options";

const db = new PrismaClient();

async function main() {
  // Təkrar seed zamanı təmiz başlanğıc — asılılıq sırası ilə silinir.
  await db.orderStatusHistory.deleteMany();
  await db.orderItem.deleteMany();
  await db.order.deleteMany();
  await db.configuration.deleteMany();
  await db.repairRequest.deleteMany();
  await db.measurementRequest.deleteMany();
  await db.quoteRequest.deleteMany();
  await db.session.deleteMany();
  await db.user.deleteMany();
  await db.optionValue.deleteMany();
  await db.product.deleteMany();
  await db.category.deleteMany();
  await db.brand.deleteMany();
  await db.counter.deleteMany();

  for (const b of brands) {
    await db.brand.create({
      data: { id: b.id, slug: b.slug, name: b.name, country: b.country, founded: b.founded },
    });
  }

  for (const c of categories) {
    await db.category.create({ data: { id: c.id, slug: c.slug, name: c.name } });
  }

  for (const p of products) {
    const category = categories.find((c) => c.slug === p.categorySlug);
    const brand = brands.find((b) => b.slug === p.brandSlug);
    if (!category || !brand) throw new Error(`Taksonomiya tapılmadı: ${p.slug}`);

    await db.product.create({
      data: {
        id: p.id,
        slug: p.slug,
        sku: p.sku,
        name: p.name,
        collection: p.collection,
        basePrice: p.basePrice,
        oldPrice: p.oldPrice ?? null,
        material: p.material,
        securityClass: p.securityClass,
        fireRating: p.fireRating ?? null,
        soundInsulationDb: p.soundInsulationDb,
        warrantyYears: p.warrantyYears,
        style: p.style,
        inStock: p.inStock,
        isNew: p.isNew ?? false,
        isBestseller: p.isBestseller ?? false,
        onSale: p.onSale ?? false,
        rating: p.rating,
        reviewCount: p.reviewCount,
        defaultWidth: p.defaultWidth,
        defaultHeight: p.defaultHeight,
        minWidth: p.minWidth,
        maxWidth: p.maxWidth,
        minHeight: p.minHeight,
        maxHeight: p.maxHeight,
        deliveryDaysMin: p.deliveryDays[0],
        deliveryDaysMax: p.deliveryDays[1],
        optionGroups: JSON.stringify(p.optionGroups),
        panelHexes: JSON.stringify(p.panelHexes),
        categoryId: category.id,
        brandId: brand.id,
      },
    });
  }

  for (const v of allOptionValues) {
    await db.optionValue.create({
      data: {
        id: v.id,
        groupKey: v.groupKey,
        code: v.code,
        label: v.label,
        description: v.description ?? null,
        priceDelta: v.priceDelta,
        hex: v.hex ?? null,
        requires: v.requires ? JSON.stringify(v.requires) : null,
        excludes: v.excludes ? JSON.stringify(v.excludes) : null,
      },
    });
  }

  const counts = {
    brands: await db.brand.count(),
    categories: await db.category.count(),
    products: await db.product.count(),
    optionValues: await db.optionValue.count(),
  };
  console.log("Seed tamamlandı:", counts);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
