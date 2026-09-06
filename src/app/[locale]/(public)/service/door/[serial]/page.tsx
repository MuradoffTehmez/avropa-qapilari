import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Lock, Phone, QrCode as QrIcon, ShieldCheck } from "lucide-react";

import { getDictionary, isLocale, locales } from "@/i18n";
import type { Dictionary } from "@/i18n";
import type { DoorAssetEventType, Locale } from "@/types";
import { routes } from "@/lib/routes";
import { formatDate } from "@/lib/utils";
import { brand } from "@/config/brand";
import { Badge, Breadcrumbs, Card, DataRow, Notice, Section } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/Button";
import { QrCode } from "@/components/ui/QrCode";
import { doorAssets, getDoorAsset } from "@/mock/account";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    doorAssets.map((d) => ({ locale, serial: d.serialNumber })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "az");

  return {
    title: dict.pageMeta.doorPassport.title,
    robots: { index: false, follow: false },
  };
}


/**
 * QR ilə açılan public qapı səhifəsi.
 * Public görünüşdə şəxsi məlumat GÖSTƏRİLMİR; tam tarixçə yalnız
 * authenticated usta/admin üçün açılır.
 */
export default async function DoorPassportPage({
  params,
}: {
  params: Promise<{ locale: string; serial: string }>;
}) {
  const { locale: raw, serial } = await params;
  const locale = (isLocale(raw) ? raw : "az") as Locale;
  const dict = getDictionary(locale);
  const r = routes(locale);

  const asset = getDoorAsset(serial);
  if (!asset) notFound();

  return (
    <>
      <div className="border-b border-line bg-bone">
        <div className="container-page py-8">
          <Breadcrumbs
            items={[{ label: dict.nav.home, href: r.home }, { label: dict.service.doorPassport }]}
          />
          <div className="mt-4 flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-line bg-paper">
              <QrIcon size={26} className="text-gold-500" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                {dict.service.doorPassport}
              </h1>
              <p className="mt-1 font-mono text-[15px] text-graphite">{asset.serialNumber}</p>
            </div>
          </div>
        </div>
      </div>

      <Section className="!py-10">
        <div className="container-page grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="space-y-4">
            <Card className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-stone">
                    {dict.service.model}
                  </p>
                  <p className="mt-1.5 text-xl font-semibold tracking-tight text-ink">
                    {asset.productName}
                  </p>
                  <p className="mt-1 text-[13px] text-stone">{asset.model}</p>
                </div>
                <Badge tone={asset.warrantyStatus === "ACTIVE" ? "success" : "neutral"}>
                  {asset.warrantyStatus === "ACTIVE" ? dict.warranty.active : dict.warranty.expired}
                </Badge>
              </div>

              <dl className="mt-5 border-t border-line pt-3">
                <DataRow label={dict.service.installationDate} value={formatDate(asset.installedAt)} />
                <DataRow
                  label={dict.service.warrantyStatus}
                  value={
                    asset.warrantyStatus === "ACTIVE"
                      ? dict.service.activeUntil.replace("{date}", formatDate(asset.warrantyEnd))
                      : dict.service.warrantyExpired
                  }
                />
                {brand.contact.phone && (
                  <DataRow
                    label={dict.service.servicePhone}
                    value={
                      <a href={`tel:${brand.contact.phoneHref}`} className="hover:underline">
                        {brand.contact.phone}
                      </a>
                    }
                  />
                )}
              </dl>
            </Card>

            {/* Private history — locked */}
            <Card className="relative overflow-hidden">
              <div className="border-b border-line px-5 py-3.5">
                <h2 className="flex items-center gap-2 text-[13px] font-semibold text-ink">
                  <Lock size={14} className="text-stone" />
                  {dict.service.history}
                </h2>
              </div>

              <div aria-hidden className="select-none px-5 py-4 blur-[4px]">
                <ul className="space-y-3">
                  {asset.privateHistory.map((e) => (
                    <li key={`${e.type}-${e.date}`} className="flex gap-3 text-[13px]">
                      <span className="w-20 shrink-0 text-stone">{formatDate(e.date)}</span>
                      <span>
                        <span className="block font-medium text-ink">{historyTitle(e.type, dict)}</span>
                        <span className="block text-stone">{e.detail}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="absolute inset-x-0 bottom-0 top-[52px] flex flex-col items-center justify-center bg-paper/70 px-6 text-center backdrop-blur-[2px]">
                <Lock size={20} className="text-stone" />
                <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-graphite">
                  {dict.service.fullHistoryLocked}
                </p>
                <ButtonLink href={r.account} size="sm" variant="secondary" className="mt-4">
                  {dict.service.signIn}
                </ButtonLink>
              </div>
            </Card>
          </div>

          <aside className="space-y-4">
            <Card className="flex flex-col items-center p-5 text-center">
              <QrCode
                value={`${brand.siteUrl}${r.doorPassport(asset.serialNumber)}`}
                size={148}
                label={`${dict.service.doorPassport} — ${asset.serialNumber}`}
                className="border border-line"
              />
              <p className="mt-3 text-[12px] leading-relaxed text-stone">
                {dict.service.qrHint}
              </p>
              <p className="mt-1 font-mono text-[12px] text-graphite">{asset.serialNumber}</p>
            </Card>

            <Notice tone="info" title={dict.service.privacy}>
              {dict.service.publicNotice}
            </Notice>

            <Card className="p-5">
              <h2 className="mb-4 flex items-center gap-2 text-[13px] font-semibold text-ink">
                <ShieldCheck size={15} className="text-gold-500" />
                {dict.service.availableActions}
              </h2>
              <div className="space-y-2">
                <ButtonLink href={r.repair} full>
                  {dict.actions.callTechnician}
                </ButtonLink>
                <ButtonLink href={r.serviceMaintenance} variant="secondary" full>
                  {dict.services.maintenance}
                </ButtonLink>
                {brand.contact.phone && (
                  <a
                    href={`tel:${brand.contact.phoneHref}`}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-[3px] border border-line text-sm font-medium text-ink transition-colors hover:border-mist"
                  >
                    <Phone size={15} /> {brand.contact.phone}
                  </a>
                )}
              </div>
            </Card>
          </aside>
        </div>
      </Section>
    </>
  );
}

/** Servis hadisəsinin adı — dilə uyğun. */
function historyTitle(type: DoorAssetEventType, dict: Dictionary): string {
  switch (type) {
    case "SALE":
      return dict.warranty.historySale;
    case "INSTALLATION":
      return dict.warranty.historyInstallation;
    case "WARRANTY":
      return dict.warranty.historyWarranty;
    case "MAINTENANCE":
      return dict.warranty.historyMaintenance;
    default:
      return dict.warranty.historyRepair;
  }
}
