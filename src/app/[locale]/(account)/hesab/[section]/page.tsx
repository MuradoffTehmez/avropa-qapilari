import { NotificationSettings } from "@/components/account/NotificationSettings";
import { ActivityFeed } from "@/components/account/ActivityFeed";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CalendarClock,
  Package,
  Ruler,
  ShieldCheck,
  Sliders,
  Wrench,
} from "lucide-react";

import { getDictionary, isLocale } from "@/i18n";
import type { Locale } from "@/types";
import { routes } from "@/lib/routes";
import { formatDate, formatDateTime, formatPrice, monthShort } from "@/lib/utils";
import { Badge, Card, DataRow, EmptyState } from "@/components/ui/primitives";
import { Timeline } from "@/components/ui/disclosure";
import { ButtonLink } from "@/components/ui/Button";
import { OrderStatusPill, RepairStatusPill } from "@/components/account/StatusPill";
import { DoorVisual } from "@/components/product/DoorVisual";
import { ProductMedia } from "@/components/product/ProductMedia";
import { ProfileForm } from "@/components/account/ProfileForm";
import { AddressManager } from "@/components/account/AddressManager";
import { currentUser } from "@/server/auth";
import { db } from "@/server/db";
import {
  userAddresses,
  userAppointments,
  userConfigurations,
  userMeasurements,
  userOrders,
  userQuotes,
  userRepairs,
  userWarranties,
} from "@/server/account";
import { snapshotLine } from "@/mock/options.i18n";
import { getProduct } from "@/mock/products";

const sections = [
  "orders",
  "configurations",
  "repairs",
  "appointments",
  "warranties",
  "addresses",
  "notifications",
  "profile",
] as const;

type Section = (typeof sections)[number];

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AccountSectionPage({
  params,
}: {
  params: Promise<{ locale: string; section: string }>;
}) {
  const { locale: raw, section } = await params;
  const locale = (isLocale(raw) ? raw : "az") as Locale;
  const dict = getDictionary(locale);
  const r = routes(locale);

  if (!sections.includes(section as Section)) notFound();

  // Sessiya yoxdursa layout-dakı `AuthGuard` giriş ekranını göstərir;
  // burada heç nə oxumuruq ki, başqasının datası sızmasın (PRD §93).
  const user = await currentUser();
  if (!user) return null;

  /* ------------------------------------------------------------ ORDERS */
  if (section === "orders") {
    const [orders, quotes] = await Promise.all([userOrders(user.id), userQuotes(user.id)]);

    return (
      <div className="space-y-4"><ActivityFeed section={section} locale={locale} />
        <h2 className="text-xl font-semibold tracking-tight text-ink">{dict.account.orders}</h2>

        {orders.length === 0 && (
          <EmptyState
            icon={<Package size={30} />}
            title={dict.account.noOrders}
            text={dict.accountUi.noOrdersHint}
            action={<ButtonLink href={r.doors}>{dict.nav.doors}</ButtonLink>}
          />
        )}

        {orders.map((o) => (
          <Card key={o.id} className="overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-bone px-4 py-3">
              <div>
                <p className="font-mono text-[13px] font-medium text-ink">{o.number}</p>
                <p className="text-[12px] text-stone">{formatDate(o.createdAt)}</p>
              </div>
              <div className="flex items-center gap-4">
                <OrderStatusPill status={o.status} label={dict.orderStatus[o.status]} />
                <span className="text-[15px] font-semibold tabular-nums text-ink">
                  {formatPrice(o.total)}
                </span>
              </div>
            </div>

            <div className="grid gap-6 p-4 lg:grid-cols-[1.4fr_1fr]">
              <div className="space-y-3">
                {o.items.map((item) => {
                  const product = getProduct(item.productSlug);
                  return <div key={item.id} className="flex gap-3">
                    <Link
                      href={r.product(item.productSlug)}
                      className="aspect-3/4 w-16 shrink-0 overflow-hidden border border-line bg-bone"
                    >
                      {product ? <ProductMedia product={product} sizes="64px" /> : <DoorVisual panelHex={item.panelHex} ambient={false} />}
                    </Link>
                    <div className="min-w-0">
                      <p className="text-[14px] font-medium text-ink">{item.productName}</p>
                      <p className="text-[12px] text-stone">
                        {item.sku} · {item.snapshot.width}×{item.snapshot.height} mm · {item.quantity} {dict.common.piece}
                      </p>
                      <ul className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[12px] text-graphite">
                        {item.snapshot.lines
                          .map((l) => snapshotLine(l, locale, dict))
                          .map((l) => (
                            <li key={l.group}>
                              <span className="text-stone">{l.group}:</span> {l.value}
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>;
                })}
              </div>

              {/* order timeline */}
              <div className="border-t border-line pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-stone">
                  {dict.account.orderProgress}
                </p>
                <Timeline
                  items={o.timeline.map((t) => ({
                    label: dict.orderStatus[t.status],
                    date: t.date ? formatDate(t.date) : null,
                    state: t.state,
                  }))}
                />
              </div>
            </div>
          </Card>
        ))}

        {quotes.length > 0 && (
          <>
            <h2 className="pt-4 text-xl font-semibold tracking-tight text-ink">
              {dict.admin.quotes}
            </h2>
            {quotes.map((q) => (
              <Card key={q.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-mono text-[13px] text-graphite">{q.number}</p>
                  <p className="mt-0.5 text-[13.5px] text-ink">{q.subject}</p>
                  <p className="text-[12px] text-stone">{formatDate(q.createdAt)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge tone={q.status === "SENT" ? "gold" : "info"}>
                    {q.status === "SENT" ? dict.accountUi.quoteSent : q.status}
                  </Badge>
                </div>
              </Card>
            ))}
          </>
        )}
      </div>
    );
  }

  /* ---------------------------------------------------- CONFIGURATIONS */
  if (section === "configurations") {
    const savedConfigurations = await userConfigurations(user.id);

    return (
      <div className="space-y-4"><ActivityFeed section={section} locale={locale} />
        <h2 className="text-xl font-semibold tracking-tight text-ink">
          {dict.account.configurations}
        </h2>

        {savedConfigurations.length === 0 ? (
          <EmptyState icon={<Sliders size={30} />} title={dict.accountUi.noSavedConfigurations} />
        ) : (
          savedConfigurations.map((c) => (
            <Card key={c.id} className="flex flex-wrap items-center justify-between gap-4 p-4">
              <div>
                <p className="font-mono text-[12px] text-stone">{c.id}</p>
                <p className="mt-1 text-[15px] font-medium text-ink">{c.productName}</p>
                <p className="mt-0.5 text-[13px] text-stone">
                  {c.width} × {c.height} mm
                </p>
                <p className="mt-1 text-[12px] text-mist">{formatDate(c.date)}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[15px] font-semibold tabular-nums text-ink">
                  {formatPrice(c.total)}
                </span>
                <ButtonLink href={r.configuratorFor(c.productSlug)} size="sm">
                  {dict.actions.configure}
                </ButtonLink>
              </div>
            </Card>
          ))
        )}
      </div>
    );
  }

  /* ----------------------------------------------------------- REPAIRS */
  if (section === "repairs") {
    const [repairRequests, measurements] = await Promise.all([
      userRepairs(user.id),
      userMeasurements(user.id),
    ]);

    return (
      <div className="space-y-4"><ActivityFeed section={section} locale={locale} />
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-ink">{dict.account.repairs}</h2>
          <ButtonLink href={r.repair} size="sm">
            {dict.actions.callTechnician}
          </ButtonLink>
        </div>

        {repairRequests.length === 0 && (
          <EmptyState icon={<Wrench size={30} />} title={dict.account.noRepairs} />
        )}

        {repairRequests.map((rp) => (
          <Card key={rp.id} className="p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[13px] text-graphite">{rp.number}</p>
                <p className="mt-1 text-[15px] font-medium text-ink">
                  {dict.repair.categories[rp.category]}
                </p>
                <p className="mt-0.5 text-[13px] text-stone">{rp.address}</p>
              </div>
              <RepairStatusPill status={rp.status} label={dict.repairStatus[rp.status]} />
            </div>

            <dl className="mt-4 border-t border-line pt-3">
              <DataRow label={dict.common.date} value={formatDate(rp.createdAt)} />
              {rp.technician && <DataRow label={dict.accountUi.technician} value={rp.technician} />}
              {rp.scheduledAt && (
                <DataRow label={dict.accountUi.appointment} value={formatDateTime(rp.scheduledAt)} />
              )}
              {rp.estimatedCost !== undefined && (
                <DataRow label={dict.accountUi.estimatedCost} value={formatPrice(rp.estimatedCost)} />
              )}
            </dl>
          </Card>
        ))}

        <h2 className="pt-4 text-xl font-semibold tracking-tight text-ink">
          {dict.admin.measurements}
        </h2>
        {measurements.length === 0 && (
          <EmptyState icon={<Ruler size={30} />} title={dict.accountUi.noMeasurements} />
        )}

        {measurements.map((m) => (
          <Card key={m.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="font-mono text-[13px] text-graphite">{m.number}</p>
              <p className="mt-0.5 text-[13.5px] text-ink">
                {dict.measurement.property[m.propertyType]} · {m.doorCount} {dict.common.doorUnit}
              </p>
              <p className="text-[12px] text-stone">{m.address}</p>
            </div>
            <div className="text-right">
              <Badge tone={m.status === "COMPLETED" ? "success" : "gold"}>{m.status === "COMPLETED" ? dict.accountUi.statuses.completed : dict.accountUi.statuses.scheduled}</Badge>
              <p className="mt-1 text-[12px] text-stone">{formatDate(m.preferredDate)}</p>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  /* ------------------------------------------------------ APPOINTMENTS */
  if (section === "appointments") {
    const appointments = await userAppointments(user.id);

    return (
      <div className="space-y-4"><ActivityFeed section={section} locale={locale} />
        <h2 className="text-xl font-semibold tracking-tight text-ink">
          {dict.account.appointments}
        </h2>

        {appointments.length === 0 && (
          <EmptyState icon={<CalendarClock size={30} />} title={dict.accountUi.noAppointments} />
        )}

        {appointments.map((a) => {
          return (
            <Card key={a.id} className="flex flex-wrap items-center justify-between gap-4 p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center border border-line bg-bone">
                  <span className="text-lg font-semibold leading-none text-ink">
                    {new Date(a.date).getDate()}
                  </span>
                  <span className="mt-0.5 text-[10px] uppercase tracking-wider text-stone">
                    {monthShort(a.date)}
                  </span>
                </div>
                <div>
                  <p className="text-[15px] font-medium text-ink">
                    {a.startTime} – {a.endTime}
                  </p>
                  <p className="text-[13px] text-stone">{a.address}</p>
                  {a.technicianName && (
                    <p className="mt-0.5 text-[13px] text-graphite">
                      {dict.accountUi.technician}: {a.technicianName}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <Badge tone={a.status === "CONFIRMED" ? "success" : "gold"}>{a.status === "CONFIRMED" ? dict.accountUi.statuses.confirmed : dict.accountUi.statuses.scheduled}</Badge>
                <p className="mt-1 font-mono text-[11px] text-mist">{a.reference}</p>
              </div>
            </Card>
          );
        })}
      </div>
    );
  }

  /* -------------------------------------------------------- WARRANTIES */
  if (section === "warranties") {
    const warranties = await userWarranties(user.id);

    return (
      <div className="space-y-4"><ActivityFeed section={section} locale={locale} />
        <h2 className="text-xl font-semibold tracking-tight text-ink">
          {dict.account.warranties}
        </h2>

        {warranties.length === 0 && (
          <EmptyState icon={<ShieldCheck size={30} />} title={dict.account.noWarranties} />
        )}

        {warranties.map((w) => (
          <Card key={w.id} className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[13px] text-graphite">{w.number}</p>
                <p className="mt-1 text-[16px] font-medium text-ink">{w.productName}</p>
              </div>
              <Badge tone={w.status === "ACTIVE" ? "success" : "neutral"}>
                {w.status === "ACTIVE" ? dict.warranty.active : dict.warranty.expired}
              </Badge>
            </div>

            <dl className="mt-4 border-t border-line pt-3">
              <DataRow label={dict.warranty.serialNumber} value={w.serialNumber} />
              <DataRow label={dict.warranty.historySale} value={w.orderNumber} />
              <DataRow label={dict.warranty.historyInstallation} value={formatDate(w.installationDate)} />
              <DataRow label={dict.warranty.validUntil} value={formatDate(w.endDate)} />
              <DataRow
                label={dict.warranty.coverage}
                value={w.coverage ?? dict.warranty.coverageDefault}
              />
            </dl>

            <ButtonLink
              href={r.doorPassport(w.serialNumber)}
              variant="secondary"
              size="sm"
              className="mt-4"
            >
              {dict.service.doorPassport}
            </ButtonLink>
          </Card>
        ))}
      </div>
    );
  }

  /* --------------------------------------------------------- ADDRESSES */
  if (section === "addresses") {
    const addresses = await userAddresses(user.id);

    return (
      <div className="space-y-4">
        <ActivityFeed section={section} locale={locale} />
        <AddressManager dict={dict} initial={addresses} />
      </div>
    );
  }

  /* ----------------------------------------------------- NOTIFICATIONS */
  if (section === "notifications") return <NotificationSettings />;

  /* ----------------------------------------------------------- PROFILE */
  const profile = await db.user.findUniqueOrThrow({ where: { id: user.id } });

  return (
    <ProfileForm
      dict={dict}
      profile={{
        name: profile.name,
        email: profile.email,
        phone: profile.phone ?? "",
        language: profile.language,
        marketingConsent: profile.marketingConsent,
      }}
    />
  );
}
