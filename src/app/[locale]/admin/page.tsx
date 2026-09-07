import Link from "next/link";
import { ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react";

import { getDictionary, isLocale } from "@/i18n";
import type { Locale } from "@/types";
import { formatDate, formatDateLong, formatPrice } from "@/lib/utils";
import { Card } from "@/components/ui/primitives";
import { OrderStatusPill, RepairStatusPill } from "@/components/account/StatusPill";
import { currentStaffUser } from "@/server/auth";
import {
  adminDashboard,
  adminMeasurements,
  adminOrders,
  adminRepairs,
  adminTopOptions,
  adminTopProducts,
} from "@/server/admin";

/** admin dashboard KPI. */
export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "az") as Locale;
  const dict = getDictionary(locale);

  // Səlahiyyət yoxdursa `AdminBoundary` kilid ekranını göstərir.
  const user = await currentStaffUser();
  if (user?.role !== "ADMIN") return null;

  const [stats, orders, repairRequests, measurements, topDoors, topColors, topLocks] =
    await Promise.all([
      adminDashboard(),
      adminOrders(),
      adminRepairs(),
      adminMeasurements(),
      adminTopProducts(),
      adminTopOptions("OUTSIDE_COLOR"),
      adminTopOptions("LOCK"),
    ]);

  // Bütün göstəricilər bazadan gəlir; müqayisə üçün əvvəlki ay
  // yoxdursa faiz göstərilmir.
  const kpis = [
    { label: dict.admin.kpi.todayRevenue, value: formatPrice(stats.dayRevenue), delta: null },
    {
      label: dict.admin.kpi.monthRevenue,
      value: formatPrice(stats.monthRevenue),
      delta: stats.monthDelta,
    },
    { label: dict.admin.kpi.orders, value: String(stats.orders), delta: null },
    { label: dict.admin.kpi.aov, value: formatPrice(stats.averageOrder), delta: null },
  ];

  const operational = [
    { label: dict.admin.kpi.pendingOrders, value: stats.pendingOrders },
    { label: dict.admin.kpi.newRepairs, value: stats.newRepairs },
    { label: dict.admin.kpi.activeRepairs, value: stats.activeRepairs },
    { label: dict.admin.kpi.appointmentsToday, value: stats.todayAppointments },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">{dict.admin.dashboard}</h1>
        <p className="mt-1 text-[13px] text-stone">
          {formatDateLong(new Date().toISOString())}
        </p>
      </div>


      {/* KPI */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label} className="p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone">
              {k.label}
            </p>
            <p className="mt-2 text-[1.75rem] font-semibold tracking-tight tabular-nums text-ink">
              {k.value}
            </p>
            {k.delta !== null && (
              <p
                className={
                  k.delta >= 0
                    ? "mt-1.5 flex items-center gap-1 text-[12px] font-medium text-success"
                    : "mt-1.5 flex items-center gap-1 text-[12px] font-medium text-danger"
                }
              >
                {k.delta >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                {Math.abs(Math.round(k.delta))}% {dict.adminUi.comparedToLastMonth}
              </p>
            )}
          </Card>
        ))}
      </div>

      {/* Operational */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {operational.map((o) => (
          <Card key={o.label} className="p-4">
            <p className="text-[2rem] font-semibold leading-none tabular-nums text-ink">{o.value}</p>
            <p className="mt-2 text-[12px] leading-snug text-stone">{o.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        {/* Son sifarişlər */}
        <Card>
          <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
            <h2 className="text-[13px] font-semibold text-ink">{dict.admin.recentOrders}</h2>
            <Link
              href={`/${locale}/admin/orders`}
              className="flex items-center gap-1 text-[12px] font-medium text-gold-600 hover:underline"
            >
              {dict.actions.viewAll} <ArrowUpRight size={13} />
            </Link>
          </div>
          {/* Mobil: kart görünüşü */}
          <ul className="divide-y divide-line md:hidden">
            {orders.map((o) => (
              <li key={o.id} className="flex flex-wrap items-start justify-between gap-2 px-4 py-3">
                <div className="min-w-0">
                  <p className="font-mono text-[12px] text-graphite">{o.number}</p>
                  <p className="mt-0.5 text-[13.5px] text-ink">{o.customerName}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <OrderStatusPill status={o.status} label={dict.orderStatus[o.status]} />
                  <span className="text-[13px] font-medium tabular-nums text-ink">
                    {formatPrice(o.total)}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <div className="hidden overflow-x-auto md:block" role="region" tabIndex={0} aria-label={dict.admin.recentOrders}>
            <table className="w-full min-w-[520px] text-[13px]">
              <thead>
                <tr className="border-b border-line bg-bone/60 text-left text-[11px] uppercase tracking-[0.1em] text-stone">
                  <th className="px-5 py-2.5 font-medium">{dict.adminUi.labels.number}</th>
                  <th className="px-5 py-2.5 font-medium">{dict.adminUi.labels.customer}</th>
                  <th className="px-5 py-2.5 font-medium">{dict.adminUi.labels.status}</th>
                  <th className="px-5 py-2.5 text-right font-medium">{dict.adminUi.labels.amount}</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-line last:border-b-0">
                    <td className="px-5 py-3 font-mono text-[12px] text-graphite">{o.number}</td>
                    <td className="px-5 py-3 text-ink">{o.customerName}</td>
                    <td className="px-5 py-3">
                      <OrderStatusPill status={o.status} label={dict.orderStatus[o.status]} />
                    </td>
                    <td className="px-5 py-3 text-right font-medium tabular-nums text-ink">
                      {formatPrice(o.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Son təmirlər */}
        <Card>
          <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
            <h2 className="text-[13px] font-semibold text-ink">{dict.admin.recentRepairs}</h2>
            <Link
              href={`/${locale}/admin/repairs`}
              className="flex items-center gap-1 text-[12px] font-medium text-gold-600 hover:underline"
            >
              {dict.actions.viewAll} <ArrowUpRight size={13} />
            </Link>
          </div>
          <ul className="divide-y divide-line">
            {repairRequests.map((rp) => (
              <li key={rp.id} className="px-5 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-[12px] text-graphite">{rp.number}</p>
                    <p className="mt-0.5 text-[13.5px] text-ink">
                      {dict.repair.categories[rp.category]}
                    </p>
                    <p className="text-[12px] text-stone">{formatDate(rp.createdAt)}</p>
                  </div>
                  <RepairStatusPill status={rp.status} label={dict.repairStatus[rp.status]} />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Top listlər */}
      <div className="grid gap-4 lg:grid-cols-3">
        <TopList
          title={dict.admin.topDoors}
          empty={dict.adminUi.empty}
          items={topDoors.map((p) => ({
            label: p.name,
            value: `${p.quantity} ${dict.adminUi.saleUnit}`,
          }))}
        />
        <TopList
          title={dict.admin.topColors}
          empty={dict.adminUi.empty}
          items={topColors.map((c) => ({ label: c.label, value: `${c.share}%`, hex: c.hex ?? undefined }))}
        />
        <TopList
          title={dict.admin.topLocks}
          empty={dict.adminUi.empty}
          items={topLocks.map((l) => ({ label: l.label, value: `${l.share}%` }))}
        />
      </div>

      {/* Ölçü sifarişləri */}
      <Card>
        <div className="border-b border-line px-5 py-3.5">
          <h2 className="text-[13px] font-semibold text-ink">{dict.admin.measurements}</h2>
        </div>
        <ul className="divide-y divide-line md:hidden">
          {measurements.map((m) => (
            <li key={m.id} className="px-4 py-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="font-mono text-[12px] text-graphite">{m.number}</p>
                <p className="text-[12px] text-stone">{formatDate(m.preferredDate)}</p>
              </div>
              <p className="mt-1 text-[13.5px] text-ink">
                {dict.measurement.property[m.propertyType]} · {m.doorCount} {dict.common.doorUnit}
              </p>
              <p className="mt-0.5 text-[12px] text-stone">{m.technician ?? "—"}</p>
            </li>
          ))}
        </ul>

        <div className="hidden overflow-x-auto md:block" role="region" tabIndex={0} aria-label={dict.admin.measurements}>
          <table className="w-full min-w-[560px] text-[13px]">
            <thead>
              <tr className="border-b border-line bg-bone/60 text-left text-[11px] uppercase tracking-[0.1em] text-stone">
                <th className="px-5 py-2.5 font-medium">{dict.adminUi.labels.number}</th>
                <th className="px-5 py-2.5 font-medium">{dict.adminUi.labels.object}</th>
                <th className="px-5 py-2.5 font-medium">{dict.adminUi.labels.door}</th>
                <th className="px-5 py-2.5 font-medium">{dict.adminUi.labels.technician}</th>
                <th className="px-5 py-2.5 font-medium">{dict.adminUi.labels.date}</th>
              </tr>
            </thead>
            <tbody>
              {measurements.map((m) => (
                <tr key={m.id} className="border-b border-line last:border-b-0">
                  <td className="px-5 py-3 font-mono text-[12px] text-graphite">{m.number}</td>
                  <td className="px-5 py-3 text-ink">{dict.measurement.property[m.propertyType]}</td>
                  <td className="px-5 py-3 tabular-nums text-graphite">{m.doorCount}</td>
                  <td className="px-5 py-3 text-graphite">{m.technician ?? "—"}</td>
                  <td className="px-5 py-3 text-graphite">{formatDate(m.preferredDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function TopList({
  title,
  items,
  empty,
}: {
  title: string;
  items: { label: string; value: string; hex?: string }[];
  empty: string;
}) {
  return (
    <Card>
      <div className="border-b border-line px-5 py-3.5">
        <h2 className="text-[13px] font-semibold text-ink">{title}</h2>
      </div>
      {items.length === 0 && <p className="px-5 py-8 text-center text-[13px] text-stone">{empty}</p>}
      <ul className="divide-y divide-line">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center justify-between gap-3 px-5 py-2.5">
            <span className="flex min-w-0 items-center gap-2.5">
              <span className="w-4 shrink-0 text-[12px] tabular-nums text-mist">{i + 1}</span>
              {item.hex && (
                <span
                  className="h-4 w-4 shrink-0 rounded-[2px] border border-line"
                  style={{ background: item.hex }}
                />
              )}
              <span className="truncate text-[13px] text-ink">{item.label}</span>
            </span>
            <span className="shrink-0 text-[12px] tabular-nums text-stone">{item.value}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
