/** Bazanın cari vəziyyətini göstərir — inkişaf zamanı yoxlama üçün. */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const [users, orders, repairs, measurements, quotes, sessions, products] = await Promise.all([
    db.user.count(),
    db.order.count(),
    db.repairRequest.count(),
    db.measurementRequest.count(),
    db.quoteRequest.count(),
    db.session.count(),
    db.product.count(),
  ]);

  console.log(
    `products=${products} users=${users} orders=${orders} repairs=${repairs} ` +
      `measurements=${measurements} quotes=${quotes} sessions=${sessions}`,
  );

  const order = await db.order.findFirst({
    include: { items: true, history: true },
    orderBy: { createdAt: "asc" },
  });
  if (order) {
    console.log(
      `sifariş ${order.number} · ${order.total} AZN · ${order.items.length} sətir · ` +
        order.history.map((h) => h.status).join("→"),
    );
  }

  const user = await db.user.findFirst({ orderBy: { createdAt: "desc" } });
  if (user) console.log(`son istifadəçi ${user.email} · parol ${user.password.slice(0, 24)}… (salt:hash)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
