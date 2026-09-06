import { NotificationSettings } from "@/components/account/NotificationSettings";
import { LocalManager } from "@/components/admin/LocalManager";
import { ActivityFeed } from "@/components/account/ActivityFeed";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Sliders } from "lucide-react";

import { getDictionary, isLocale, locales } from "@/i18n";
import type { Locale } from "@/types";
import { routes } from "@/lib/routes";
import { formatDate, formatDateTime, formatPrice, monthShort } from "@/lib/utils";
import { Badge, Card, DataRow, EmptyState } from "@/components/ui/primitives";
import { Timeline } from "@/components/ui/disclosure";
import { ButtonLink } from "@/components/ui/Button";
import { OrderStatusPill, RepairStatusPill } from "@/components/account/StatusPill";
import { DoorVisual } from "@/components/product/DoorVisual";
import { ProfileForm } from "@/components/account/ProfileForm";
import {
  addresses,
  appointments,
  measurements,
  orders,
  quotes,
  repairRequests,
  savedConfigurations,
  warranties,
} from "@/mock/account";
import { technicians } from "@/mock/content";

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

export function generateStaticParams() {
  return locales.flatMap((locale) => sections.map((section) => ({ locale, section })));
}

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

  /* ------------------------------------------------------------ ORDERS */
  if (section === "orders") {
    return (
      <div className="space-y-4"><ActivityFeed section={section} locale={locale} />
        <h2 className="text-xl font-semibold tracking-tight text-ink">{dict.account.orders}</h2>

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
                {o.items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <Link
                      href={r.product(item.productSlug)}
                      className="aspect-3/4 w-16 shrink-0 overflow-hidden border border-line bg-bone"
                    >
                      <DoorVisual panelHex={item.panelHex} ambient={false} />
                    </Link>
                    <div className="min-w-0">
                      <p className="text-[14px] font-medium text-ink">{item.productName}</p>
                      <p className="text-[12px] text-stone">
                        {item.sku} · {item.snapshot.width}×{item.snapshot.height} mm · {item.quantity} əd.
                      </p>
                      <ul className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[12px] text-graphite">
                        {item.snapshot.lines.map((l) => (
                          <li key={l.group}>
                            <span className="text-stone">{l.group}:</span> {l.value}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
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
                  <Badge tone={q.status === "SENT" ? "gold" : "info"}>{q.status}</Badge>
                  {q.amount && (
                    <span className="text-[15px] font-semibold tabular-nums text-ink">
                      {formatPrice(q.amount)}
                    </span>
                  )}
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
    return (
      <div className="space-y-4"><ActivityFeed section={section} locale={locale} />
        <h2 className="text-xl font-semibold tracking-tight text-ink">
          {dict.account.configurations}
        </h2>

        {savedConfigurations.length === 0 ? (
          <EmptyState icon={<Sliders size={30} />} title="Saxlanmış konfiqurasiya yoxdur" />
        ) : (
          savedConfigurations.map((c) => (
            <Card key={c.id} className="flex flex-wrap items-center justify-between gap-4 p-4">
              <div>
                <p className="font-mono text-[12px] text-stone">{c.id}</p>
                <p className="mt-1 text-[15px] font-medium text-ink">{c.productName}</p>
                <p className="mt-0.5 text-[13px] text-stone">{c.summary}</p>
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
    return (
      <div className="space-y-4"><ActivityFeed section={section} locale={locale} />
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-ink">{dict.account.repairs}</h2>
          <ButtonLink href={r.repair} size="sm">
            {dict.actions.callTechnician}
          </ButtonLink>
        </div>

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
              {rp.technician && <DataRow label="Usta" value={rp.technician} />}
              {rp.scheduledAt && (
                <DataRow label="Görüş" value={formatDateTime(rp.scheduledAt)} />
              )}
              {rp.estimatedCost !== undefined && (
                <DataRow label="Təxmini dəyər" value={formatPrice(rp.estimatedCost)} />
              )}
            </dl>
          </Card>
        ))}

        <h2 className="pt-4 text-xl font-semibold tracking-tight text-ink">
          {dict.admin.measurements}
        </h2>
        {measurements.map((m) => (
          <Card key={m.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="font-mono text-[13px] text-graphite">{m.number}</p>
              <p className="mt-0.5 text-[13.5px] text-ink">
                {dict.measurement.property[m.propertyType]} · {m.doorCount} qapı
              </p>
              <p className="text-[12px] text-stone">{m.address}</p>
            </div>
            <div className="text-right">
              <Badge tone={m.status === "COMPLETED" ? "success" : "gold"}>{m.status}</Badge>
              <p className="mt-1 text-[12px] text-stone">{formatDate(m.preferredDate)}</p>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  /* ------------------------------------------------------ APPOINTMENTS */
  if (section === "appointments") {
    return (
      <div className="space-y-4"><ActivityFeed section={section} locale={locale} />
        <h2 className="text-xl font-semibold tracking-tight text-ink">
          {dict.account.appointments}
        </h2>

        {appointments.map((a) => {
          const tech = technicians.find((t) => t.id === a.technicianId);
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
                  {tech && <p className="mt-0.5 text-[13px] text-graphite">Usta: {tech.name}</p>}
                </div>
              </div>
              <div className="text-right">
                <Badge tone={a.status === "CONFIRMED" ? "success" : "gold"}>{a.status}</Badge>
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
    return (
      <div className="space-y-4"><ActivityFeed section={section} locale={locale} />
        <h2 className="text-xl font-semibold tracking-tight text-ink">
          {dict.account.warranties}
        </h2>

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
              <DataRow label="Sifariş" value={w.orderNumber} />
              <DataRow label="Quraşdırma" value={formatDate(w.installationDate)} />
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
    return (
      <div className="space-y-4"><ActivityFeed section={section} locale={locale} />
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-ink">
            {dict.account.addresses}
          </h2>
          <LocalManager section="addresses" label="Yeni ünvan" />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {addresses.map((a) => (
            <Card key={a.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-gold-500" />
                  <div>
                    <p className="text-[15px] font-medium text-ink">{a.label}</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-stone">
                      {[a.city, a.district, a.street, a.building, a.apartment && `mənzil ${a.apartment}`]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                </div>
                {a.isDefault && <Badge tone="outline">Əsas</Badge>}
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  /* ----------------------------------------------------- NOTIFICATIONS */
  if (section === "notifications") return <NotificationSettings />;

  /* ----------------------------------------------------------- PROFILE */
  return <ProfileForm dict={dict} />;
}
