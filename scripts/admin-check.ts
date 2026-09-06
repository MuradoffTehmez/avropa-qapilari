/** Admin oxu qatının nəticələrini konsola yazır — bazadan gələnləri yoxlamaq üçün. */
import {
  adminAppointments, adminBrands, adminCategories, adminCustomers, adminDashboard,
  adminMeasurements, adminOptionGroups, adminOrders, adminProducts, adminQuotes,
  adminRepairs, adminTechnicians, adminTopOptions, adminTopProducts, adminWarranties,
} from "../src/server/admin";
import { db } from "../src/server/db";

async function main() {
  console.log("KPI      ", await adminDashboard());
  console.log("top qapı ", await adminTopProducts());
  console.log("top rəng ", await adminTopOptions("OUTSIDE_COLOR"));
  console.log("sifariş  ", (await adminOrders()).map((o) => `${o.number} ${o.status} ${o.total}`));
  console.log("müştəri  ", (await adminCustomers()).map((c) => `${c.email} rol=${c.role} sifariş=${c.orders}`));
  console.log("təmir    ", (await adminRepairs()).map((r) => `${r.number} ${r.status} usta=${r.technician}`));
  console.log("ölçü     ", (await adminMeasurements()).map((m) => `${m.number} ${m.status} usta=${m.technician}`));
  console.log("zəmanət  ", (await adminWarranties()).map((w) => `${w.number} ${w.status}`));
  console.log("usta     ", (await adminTechnicians()).map((t) => `${t.name} açıq=${t.openJobs}`));
  console.log("görüş    ", (await adminAppointments()).map((a) => `${a.reference} ${a.date}`));
  console.log("təklif   ", (await adminQuotes()).map((q) => `${q.number} ${q.status}`));
  console.log("sayğac   ", {
    məhsul: (await adminProducts()).length,
    kateqoriya: (await adminCategories()).length,
    brend: (await adminBrands()).length,
    optionQrupu: (await adminOptionGroups()).length,
  });
}

main().finally(() => db.$disconnect());
