/**
 * Bazanı mövcud test datası ilə doldurur.
 *
 * Mənbə `src/mock/` qovluğudur — beləliklə backend qoşulandan sonra da
 * sayt eyni məzmunu göstərir və heç bir səhifə boşalmır.
 */
import { PrismaClient } from "@prisma/client";
import { products } from "../src/mock/products";
import { brands, categories } from "../src/mock/taxonomy";
import { allOptionValues, findOptionValue } from "../src/mock/options";
import { reviews, technicians } from "../src/mock/content";
import { az } from "../src/i18n/dictionaries/az";
import { brand } from "../src/config/brand";
import { hashPassword } from "../src/server/password";
import { defaultChoices } from "../src/features/configurator/defaults";
import { pruneIncompatible } from "../src/features/configurator/compatibility";

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
  await db.auditLog.deleteMany();
  await db.setting.deleteMany();
  await db.seoEntry.deleteMany();
  await db.contentPage.deleteMany();
  await db.discount.deleteMany();
  await db.review.deleteMany();
  await db.payment.deleteMany();
  await db.warranty.deleteMany();
  await db.appointment.deleteMany();
  await db.address.deleteMany();
  await db.passwordResetToken.deleteMany();
  await db.session.deleteMany();
  await db.technician.deleteMany();
  await db.user.deleteMany();
  await db.productOption.deleteMany();
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

  for (const product of products) {
    const allowedGroups = new Set(product.optionGroups);
    const allowedValues = allOptionValues.filter((value) => allowedGroups.has(value.groupKey));
    if (allowedValues.length > 0) {
      await db.productOption.createMany({
        data: allowedValues.map((value) => ({
          productId: product.id,
          optionValueId: value.id,
        })),
      });
    }
  }

  await seedAccounts();
  await seedEditorial();

  const counts = {
    brands: await db.brand.count(),
    categories: await db.category.count(),
    products: await db.product.count(),
    optionValues: await db.optionValue.count(),
    users: await db.user.count(),
    orders: await db.order.count(),
    requests:
      (await db.repairRequest.count()) +
      (await db.measurementRequest.count()) +
      (await db.quoteRequest.count()),
    reviews: await db.review.count(),
    pages: await db.contentPage.count(),
    seo: await db.seoEntry.count(),
    settings: await db.setting.count(),
  };
  console.log("Seed tamamlandı:", counts);
}


/**
 * Hesab qatı: hər modeldən bir qeyd (test datası siyasəti).
 *
 * Parollar `SEED_PASSWORD` mühit dəyişənindən götürülür; verilməyibsə
 * aşağıdakı sabit işlənir. Bu yalnız lokal inkişaf üçündür — production
 * bazasında seed işlədilmir.
 */
const SEED_PASSWORD = process.env.SEED_PASSWORD ?? "Europorta2026";

async function seedAccounts() {
  const password = await hashPassword(SEED_PASSWORD);

  const admin = await db.user.create({
    data: { email: "admin@europorta.az", name: "Admin", password, role: "ADMIN" },
  });

  const technicianUser = await db.user.create({
    data: { email: "usta@europorta.az", name: technicians[0].name, password, role: "TECHNICIAN" },
  });

  const customer = await db.user.create({
    data: {
      email: "test@europorta.az",
      name: "Test User",
      phone: "",
      password,
      role: "CUSTOMER",
    },
  });

  const technician = await db.technician.create({
    data: {
      name: technicians[0].name,
      phone: technicians[0].phone,
      specialization: JSON.stringify(technicians[0].specialization),
      serviceAreas: JSON.stringify(technicians[0].serviceAreas),
      rating: technicians[0].rating,
      completedJobs: technicians[0].completedJobs,
      status: technicians[0].status,
      userId: technicianUser.id,
    },
  });

  await db.address.create({
    data: {
      userId: customer.id,
      label: "Ev",
      city: "Bakı",
      district: "Yasamal",
      isDefault: true,
    },
  });

  // --------------------------------------------------------- Sifariş
  const product = products[0];
  const selection = pruneIncompatible(
    {
      width: product.defaultWidth,
      height: product.defaultHeight,
      choices: defaultChoices(product),
    },
    findOptionValue,
  );

  const unitPrice =
    product.basePrice +
    Object.values(selection.choices)
      .flatMap((raw) => (!raw ? [] : Array.isArray(raw) ? raw : [raw]))
      .reduce((sum, id) => sum + (findOptionValue(id)?.priceDelta ?? 0), 0);

  const orderNumber = await nextCounter("ORD");
  const order = await db.order.create({
    data: {
      number: orderNumber,
      userId: customer.id,
      status: "MANUFACTURING",
      paymentStatus: "PAID",
      customerName: "Test User",
      customerPhone: "",
      customerEmail: customer.email,
      address: "Bakı, Yasamal",
      subtotal: unitPrice,
      discount: 0,
      total: unitPrice,
      items: {
        create: {
          productId: product.id,
          quantity: 1,
          unitPrice,
          width: selection.width,
          height: selection.height,
          snapshot: JSON.stringify(selection.choices),
        },
      },
      history: {
        create: [
          { status: "CONFIRMED" },
          { status: "PAID" },
          { status: "MANUFACTURING" },
        ],
      },
    },
  });

  await db.payment.create({
    data: {
      orderId: order.id,
      provider: "MANUAL",
      status: "PAID",
      amount: unitPrice,
      reference: `PAY-${orderNumber}`,
    },
  });

  // ------------------------------------------------- Saxlanmış konfiqurasiya
  await db.configuration.create({
    data: {
      code: await nextCounter("CFG"),
      productId: products[1].id,
      userId: customer.id,
      width: products[1].defaultWidth,
      height: products[1].defaultHeight,
      choices: JSON.stringify(
        pruneIncompatible(
          {
            width: products[1].defaultWidth,
            height: products[1].defaultHeight,
            choices: defaultChoices(products[1]),
          },
          findOptionValue,
        ).choices,
      ),
      total: products[1].basePrice,
    },
  });

  // ------------------------------------------------------------ Müraciətlər
  const repairNumber = await nextCounter("REP");
  await db.repairRequest.create({
    data: {
      number: repairNumber,
      userId: customer.id,
      technicianId: technician.id,
      category: "LOCK",
      doorType: "ENTRANCE",
      description: "Kilid çətin çevrilir, açar yarıda ilişir.",
      city: "Bakı",
      address: "Yasamal",
      name: "Test User",
      phone: "",
      status: "TECHNICIAN_ASSIGNED",
    },
  });

  const measurementNumber = await nextCounter("MSR");
  await db.measurementRequest.create({
    data: {
      number: measurementNumber,
      userId: customer.id,
      technicianId: technician.id,
      propertyType: "APARTMENT",
      doorCount: 2,
      city: "Bakı",
      address: "Yasamal",
      name: "Test User",
      phone: "",
      status: "SCHEDULED",
    },
  });

  await db.quoteRequest.create({
    data: {
      number: await nextCounter("QTE"),
      userId: customer.id,
      name: "Test User",
      phone: "",
      email: customer.email,
      productId: products[1].id,
      width: 1450,
      height: 2350,
      message: "Standartdan böyük ölçü üçün qiymət təklifi istəyirəm.",
      status: "SENT",
    },
  });

  // --------------------------------------------------------------- Görüş
  await db.appointment.create({
    data: {
      reference: measurementNumber,
      type: "MEASUREMENT",
      date: "2026-09-10",
      startTime: "14:00",
      endTime: "15:00",
      address: "Bakı, Yasamal",
      status: "SCHEDULED",
      userId: customer.id,
      technicianId: technician.id,
    },
  });

  // -------------------------------------------------------------- Zəmanət
  await db.warranty.create({
    data: {
      number: `WAR-${orderNumber.slice(4)}`,
      serialNumber: `DR-${orderNumber.slice(4)}`,
      productName: product.name,
      orderId: order.id,
      userId: customer.id,
      installationDate: "2026-06-04",
      startDate: "2026-06-04",
      endDate: `${2026 + product.warrantyYears}-06-04`,
      status: "ACTIVE",
    },
  });

  console.log(`Hesablar: ${admin.email}, ${technicianUser.email}, ${customer.email}`);
}

/** Seed sayğacı — API-dəki `nextNumber` ilə eyni format (PRD §62). */
async function nextCounter(prefix: string, year = 2026): Promise<string> {
  const key = `${prefix}-${year}`;
  const counter = await db.counter.upsert({
    where: { key },
    create: { key, value: 1 },
    update: { value: { increment: 1 } },
  });
  return `${prefix}-${year}-${String(counter.value).padStart(6, "0")}`;
}


/**
 * Redaksiya qatı: rəylər, məzmun səhifələri, SEO yazıları və
 * tənzimləmələr.
 *
 * Endirim və audit log qəsdən boş qalır — onlar əməliyyat datasıdır və
 * uydurma qeyd yaradılmır. Audit sətirləri admin əməliyyat etdikcə özü
 * yaranır.
 */
async function seedEditorial() {
  const product = await db.product.findFirst({ orderBy: { name: "asc" } });

  for (const review of reviews) {
    const target =
      (await db.product.findFirst({ where: { name: review.productName } })) ?? product;
    if (!target) break;

    await db.review.create({
      data: {
        // id mock-dakı ilə eynidir: `content.i18n.ts` tərcümələri
        // məhz bu açarla tapır.
        id: review.id,
        productId: target.id,
        author: review.author,
        city: review.city,
        rating: review.rating,
        text: review.text,
        status: "APPROVED",
        verified: review.verified,
        createdAt: new Date(review.date),
      },
    });
  }

  // Mövcud səhifələr — yol və başlıq saytdakı ilə eynidir.
  const pages: { path: string; title: string; published: boolean }[] = [
    { path: "/", title: az.nav.home, published: true },
    { path: "/haqqimizda", title: az.nav.about, published: true },
    { path: "/xidmetler", title: az.nav.services, published: true },
    { path: "/layiheler", title: az.nav.projects, published: true },
    { path: "/blog", title: az.nav.blog, published: true },
    { path: "/faq", title: az.nav.faq, published: true },
    { path: "/elaqe", title: az.nav.contact, published: true },
    { path: "/legal/privacy", title: az.footer.privacy, published: true },
    { path: "/legal/terms", title: az.footer.terms, published: true },
  ];

  for (const page of pages) {
    await db.contentPage.create({ data: page });
  }

  // SEO yazıları saytın həqiqətən göndərdiyi meta mətnlərdən doldurulur.
  const seo: { path: string; title: string; description: string }[] = [
    { path: "/", title: az.meta.slogan, description: az.meta.description },
    {
      path: "/qapilar",
      title: az.pageMeta.catalog.title,
      description: az.pageMeta.catalog.description,
    },
    {
      path: "/konfiqurator",
      title: az.pageMeta.configurator.title,
      description: az.pageMeta.configurator.description,
    },
    {
      path: "/xidmetler",
      title: az.pageMeta.services.title,
      description: az.pageMeta.services.description,
    },
  ];

  for (const entry of seo) {
    await db.seoEntry.create({ data: entry });
  }

  const settings: Record<string, string> = {
    siteName: brand.name,
    currency: "AZN",
    defaultLocale: "az",
    locales: "az,en,ru",
    timeZone: "Asia/Baku",
    orderPrefix: "ORD",
    // Boş qalanlar brend konfiqurasiyasından gəlir və uydurulmur.
    supportPhone: brand.contact.phone,
    supportEmail: brand.contact.email,
  };

  for (const [key, value] of Object.entries(settings)) {
    await db.setting.create({ data: { key, value } });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
