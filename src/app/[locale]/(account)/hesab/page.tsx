import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarClock, Package, ShieldCheck, Wrench } from "lucide-react";

import { getDictionary, isLocale } from "@/i18n";
import type { Locale } from "@/types";
import { routes } from "@/lib/routes";
import { formatDate, formatPrice } from "@/lib/utils";
import { Card, Stat } from "@/components/ui/primitives";
import { OrderStatusPill, RepairStatusPill } from "@/components/account/StatusPill";
import { currentUser } from "@/server/auth";
import {
  accountSummary,
  userAppointments,
  userOrders,
  userRepairs,
  userWarranties,
} from "@/server/account";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "az");

  return {
    title: dict.pageMeta.account.title,
    robots: { index: false, follow: false },
  };
}


export default async function AccountDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "az") as Locale;
  const dict = getDictionary(locale);
  const r = routes(locale);

  // Sessiya yoxdursa layout-dakı `AuthGuard` giriş ekranını göstərir.
  const user = await currentUser();
  if (!user) return null;

  const [summary, orders, repairRequests, warranties, appointments] = await Promise.all([
    accountSummary(user.id),
    userOrders(user.id),
    userRepairs(user.id),
    userWarranties(user.id),
    userAppointments(user.id),
  ]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Card className="p-5">
          <Stat label={dict.account.orders} value={summary.orders} hint={`${summary.activeOrders} ${dict.accountUi.active}`} />
        </Card>
        <Card className="p-5">
          <Stat label={dict.account.repairs} value={summary.repairs} hint={`${summary.activeRepairs} ${dict.accountUi.active}`} />
        </Card>
        <Card className="p-5">
          <Stat label={dict.account.warranties} value={summary.warranties} hint={dict.account.activeWarranties} />
        </Card>
        <Card className="p-5">
          <Stat label={dict.account.appointments} value={summary.appointments} hint={dict.account.plannedAppointments} />
        </Card>
      </div>

      {/* Yaxın görüşlər */}
      <section>
        <SectionHead
          icon={CalendarClock}
          title={dict.account.appointments}
          href={r.accountSection("appointments")}
          label={dict.actions.viewAll}
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {appointments.map((a) => {
            return (
              <Card key={a.id} className="p-4">
                <p className="text-[11px] uppercase tracking-[0.14em] text-gold-600">
                  {a.type === "REPAIR"
                    ? dict.services.repair
                    : a.type === "MEASUREMENT"
                      ? dict.services.measurement
                      : dict.services.installation}
                </p>
                <p className="mt-1.5 text-[15px] font-medium text-ink">
                  {formatDate(a.date)} · {a.startTime}
                </p>
                <p className="mt-1 text-[13px] text-stone">{a.address}</p>
                {a.technicianName && (
                  <p className="mt-2 text-[13px] text-graphite">
                    {dict.accountUi.technician}: {a.technicianName}
                  </p>
                )}
                <p className="mt-2 font-mono text-[11px] text-mist">{a.reference}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Sifarişlər */}
      <section>
        <SectionHead
          icon={Package}
          title={dict.account.orders}
          href={r.accountSection("orders")}
          label={dict.actions.viewAll}
        />
        <div className="space-y-2">
          {orders.slice(0, 3).map((o) => (
            <Link
              key={o.id}
              href={r.accountSection("orders")}
              className="flex flex-wrap items-center justify-between gap-3 border border-line bg-paper p-4 transition-colors hover:border-mist"
            >
              <div>
                <p className="font-mono text-[13px] text-graphite">{o.number}</p>
                <p className="mt-0.5 text-[13px] text-stone">
                  {formatDate(o.createdAt)} · {o.itemCount} {dict.cart.itemCount}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <OrderStatusPill status={o.status} label={dict.orderStatus[o.status]} />
                <span className="text-[15px] font-semibold tabular-nums text-ink">
                  {formatPrice(o.total)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Təmir */}
      <section>
        <SectionHead
          icon={Wrench}
          title={dict.account.repairs}
          href={r.accountSection("repairs")}
          label={dict.actions.viewAll}
        />
        <div className="space-y-2">
          {repairRequests.slice(0, 3).map((rp) => (
            <div
              key={rp.id}
              className="flex flex-wrap items-center justify-between gap-3 border border-line bg-paper p-4"
            >
              <div>
                <p className="font-mono text-[13px] text-graphite">{rp.number}</p>
                <p className="mt-0.5 text-[13px] text-stone">
                  {dict.repair.categories[rp.category]} · {formatDate(rp.createdAt)}
                </p>
              </div>
              <RepairStatusPill status={rp.status} label={dict.repairStatus[rp.status]} />
            </div>
          ))}
        </div>
      </section>

      {/* Zəmanətlər */}
      <section>
        <SectionHead
          icon={ShieldCheck}
          title={dict.account.warranties}
          href={r.accountSection("warranties")}
          label={dict.actions.viewAll}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          {warranties.slice(0, 4).map((w) => (
            <Card key={w.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[15px] font-medium text-ink">{w.productName}</p>
                  <p className="mt-0.5 font-mono text-[12px] text-stone">{w.serialNumber}</p>
                </div>
                <span className="shrink-0 rounded-[2px] bg-success-soft px-2 py-0.5 text-xs font-medium uppercase tracking-wider text-success">
                  {dict.warranty.active}
                </span>
              </div>
              <p className="mt-3 text-[13px] text-stone">
                {dict.warranty.validUntil}: {formatDate(w.endDate)}
              </p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

function SectionHead({
  icon: Icon,
  title,
  href,
  label,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  href: string;
  label: string;
}) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight text-ink">
        <Icon size={17} className="text-gold-500" />
        {title}
      </h2>
      <Link
        href={href}
        className="flex items-center gap-1 text-[13px] font-medium text-gold-600 underline-offset-4 hover:underline"
      >
        {label} <ArrowRight size={13} />
      </Link>
    </div>
  );
}
