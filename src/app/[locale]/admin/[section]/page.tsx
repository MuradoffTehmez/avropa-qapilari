import { AdminSection } from "@/components/admin/AdminSection";
import { isLocale } from "@/i18n";
import { currentUser } from "@/server/auth";
import {
  adminAppointments,
  adminBrands,
  adminCategories,
  adminCustomers,
  adminMeasurements,
  adminOptionGroups,
  adminOrders,
  adminProducts,
  adminQuotes,
  adminRepairs,
  adminTechnicians,
  adminWarranties,
  type AdminData,
} from "@/server/admin";

/**
 * Bölmənin ehtiyacı olan sətirləri yükləyir.
 *
 * Yalnız ADMIN üçün oxunur; səlahiyyət yoxdursa boş `data` gedir və
 * `AdminBoundary` kilid ekranını göstərir (PRD §93).
 */
async function loadSection(section: string): Promise<AdminData> {
  switch (section) {
    case "products":
    case "inventory":
      return { products: await adminProducts() };
    case "categories":
      return { categories: await adminCategories() };
    case "brands":
      return { brands: await adminBrands() };
    case "configurator":
      return { optionGroups: await adminOptionGroups() };
    case "orders":
      return { orders: await adminOrders() };
    case "quotes":
      return { quotes: await adminQuotes() };
    case "repairs":
      return { repairs: await adminRepairs(), technicians: await adminTechnicians() };
    case "measurements":
      return { measurements: await adminMeasurements(), technicians: await adminTechnicians() };
    case "appointments":
      return { appointments: await adminAppointments() };
    case "technicians":
      return { technicians: await adminTechnicians() };
    case "customers":
    case "roles":
      return { customers: await adminCustomers() };
    case "warranty":
      return { warranties: await adminWarranties() };
    default:
      return {};
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; section: string }>;
}) {
  const { locale, section } = await params;
  const user = await currentUser();
  const data = user?.role === "ADMIN" ? await loadSection(section) : {};

  return (
    <AdminSection
      key={`${locale}/${section}`}
      locale={isLocale(locale) ? locale : "az"}
      section={section}
      data={data}
    />
  );
}
