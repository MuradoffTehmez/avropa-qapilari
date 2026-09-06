import type { Metadata } from "next";
import {
  Backpack,
  Clock,
  DoorOpen,
  Layers,
  MapPin,
  Palette,
  ParkingCircle,
  ScanFace,
  UserRound,
} from "lucide-react";

import { getDictionary, isLocale } from "@/i18n";
import type { Locale } from "@/types";
import { routes } from "@/lib/routes";
import { brand, hasContact } from "@/config/brand";
import {
  Badge,
  Breadcrumbs,
  Card,
  DataRow,
  Notice,
  Section,
  SectionHeading,
} from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/Button";
import { Accordion } from "@/components/ui/disclosure";
import { DoorVisual } from "@/components/product/DoorVisual";
import { ShowroomBooking } from "@/components/showroom/ShowroomBooking";
import { faq } from "@/mock/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "az");

  return {
    title: dict.pageMeta.showroom.title,
    description: dict.pageMeta.showroom.description,
  };
}


export default async function ShowroomPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "az") as Locale;
  const dict = getDictionary(locale);
  const r = routes(locale);

  const zones = [
    {
      icon: DoorOpen,
      title: dict.showroom.zone1,
      text: dict.showroom.zone1Text,
      meta: dict.showroom.zone1Meta,
      panel: "#383e42",
      style: "MODERN" as const,
    },
    {
      icon: Palette,
      title: dict.showroom.zone2,
      text: dict.showroom.zone2Text,
      meta: dict.showroom.zone2Meta,
      panel: "#a9743c",
      style: "CLASSIC" as const,
    },
    {
      icon: ScanFace,
      title: dict.showroom.zone3,
      text: dict.showroom.zone3Text,
      meta: dict.showroom.zone3Meta,
      panel: "#33312e",
      style: "MINIMAL" as const,
    },
    {
      icon: Layers,
      title: dict.showroom.zone4,
      text: dict.showroom.zone4Text,
      meta: dict.showroom.zone4Meta,
      panel: "#6b665e",
      style: "LOFT" as const,
    },
  ];

  const visitFacts = [
    { icon: Clock, label: dict.showroom.duration, value: dict.showroom.durationValue },
    { icon: UserRound, label: dict.showroom.consultant, value: dict.showroom.consultantValue },
    { icon: ParkingCircle, label: dict.showroom.parking, value: dict.showroom.parkingValue },
    { icon: Backpack, label: dict.showroom.bring, value: dict.showroom.bringValue },
  ];

  /** Rəng kitabxanası nümunəsi */
  const palette = [
    "#f1f0ea", "#e6d2b5", "#c8a678", "#a9743c", "#5b3a26", "#3a2a22",
    "#8b8d8a", "#6b665e", "#474a51", "#383e42", "#1a2b3c", "#27352a",
    "#45322e", "#0e0e10", "#33312e", "#efeee4",
  ];

  return (
    <>
      {/* ---------------------------------------------------------- HERO */}
      <section className="relative overflow-hidden bg-ink text-paper">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg,#fff 0 1px,transparent 1px 90px)",
          }}
        />
        <div className="container-page relative py-10 sm:py-14 lg:py-20">
          <Breadcrumbs
            className="[&_a]:text-paper/50 [&_a:hover]:text-paper [&_span]:text-paper/80"
            items={[{ label: dict.nav.home, href: r.home }, { label: dict.showroom.title }]}
          />

          <div className="mt-6 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-center">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-300 sm:text-[11px]">
                {dict.showroom.eyebrow}
              </p>
              <h1 className="font-display mt-4 text-balance-heading text-[1.9rem] font-semibold leading-[1.1] sm:text-[2.6rem] lg:text-[3.1rem]">
                {dict.showroom.heroTitle}
              </h1>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-paper/65 sm:text-base">
                {dict.showroom.heroText}
              </p>

              <div className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:gap-3">
                <ButtonLink href="#qeydiyyat" variant="gold" size="lg" className="justify-center">
                  {dict.showroom.bookVisit}
                </ButtonLink>
                <ButtonLink
                  href={r.doors}
                  size="lg"
                  className="justify-center border-paper/25 bg-transparent text-paper hover:border-paper hover:bg-paper/5"
                >
                  {dict.catalog.title}
                </ButtonLink>
              </div>
            </div>

            {/* Showroom vitrini */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { hex: "#383e42", style: "MODERN" as const },
                { hex: "#a9743c", style: "CLASSIC" as const },
                { hex: "#f1f0ea", style: "MINIMAL" as const },
              ].map((d, i) => (
                <div
                  key={d.hex}
                  className="door-frame border border-paper/12 bg-paper/[0.04]"
                  style={{ marginTop: i === 1 ? "1.25rem" : undefined }}
                >
                  <DoorVisual
                    panelHex={d.hex}
                    style={d.style}
                    glass={i === 2 ? "SATIN" : "NONE"}
                    handle={i === 1 ? "BRASS" : "INOX"}
                    side={i === 1 ? "LEFT" : "RIGHT"}
                    ambient={false}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- ZONES */}
      <Section>
        <div className="container-page">
          <SectionHeading
            eyebrow={dict.showroom.title}
            title={dict.showroom.whatYouSee}
            text={dict.showroom.whatYouSeeText}
          />

          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            {zones.map(({ icon: Icon, title, text, meta, panel, style }, i) => (
              <article key={title} className="flex gap-4 border border-line bg-paper p-5 sm:gap-5 sm:p-6">
                <div className="hidden w-20 shrink-0 sm:block">
                  <div className="door-frame border border-line">
                    <DoorVisual panelHex={panel} style={style} ambient={false} />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <Icon size={20} className="shrink-0 text-gold-500" />
                    <span className="text-[11px] font-semibold tabular-nums text-mist">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-3 text-[16px] font-medium text-ink">{title}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-stone">{text}</p>
                  <Badge tone="gold" className="mt-4">
                    {meta}
                  </Badge>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------------- PALETTE */}
      <Section tone="bone" className="border-y border-line !py-12">
        <div className="container-page grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-center lg:gap-14">
          <div>
            <h2 className="font-display text-[1.5rem] font-semibold leading-tight text-ink sm:text-[1.9rem]">
              {dict.showroom.zone2}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-stone">
              {dict.showroom.zone2Text}
            </p>
            <ButtonLink href={r.configurator} variant="outline" size="sm" className="mt-5">
              {dict.actions.startConfigurator}
            </ButtonLink>
          </div>

          <div
            className="grid grid-cols-8 gap-px overflow-hidden border border-line bg-line"
            aria-label={dict.showroom.zone2}
          >
            {palette.map((hex) => (
              <div key={hex} className="aspect-square" style={{ background: hex }} />
            ))}
          </div>
        </div>
      </Section>

      {/* --------------------------------------------- VISIT + BOOKING */}
      <Section>
        <div className="container-page grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
          <div>
            <SectionHeading
              title={dict.showroom.visitTitle}
              text={dict.showroom.visitText}
              className="!mb-6"
            />

            <div className="space-y-4">
              {visitFacts.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <Icon size={18} className="mt-0.5 shrink-0 text-gold-500" />
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.14em] text-stone">{label}</p>
                    <p className="mt-0.5 text-[14.5px] text-ink">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {hasContact && brand.contact.address ? (
              <Card className="mt-6 p-5">
                <dl>
                  <DataRow
                    label={dict.common.address}
                    value={
                      <span className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-gold-500" />
                        {brand.contact.address}
                      </span>
                    }
                  />
                  {brand.contact.workingHours && (
                    <DataRow label={dict.showroom.duration} value={brand.contact.workingHours} />
                  )}
                  {brand.contact.phone && (
                    <DataRow
                      label={dict.common.phone}
                      value={
                        <a href={`tel:${brand.contact.phoneHref}`} className="hover:underline">
                          {brand.contact.phone}
                        </a>
                      }
                    />
                  )}
                </dl>
              </Card>
            ) : (
              <Notice className="mt-6">{dict.showroom.addressMissing}</Notice>
            )}
          </div>

          <div id="qeydiyyat" className="scroll-mt-24">
            <ShowroomBooking locale={locale} dict={dict} />
          </div>
        </div>
      </Section>

      {/* ----------------------------------------------------------- FAQ */}
      <Section tone="bone" className="border-t border-line">
        <div className="container-page grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <SectionHeading
            eyebrow={dict.nav.faq}
            title={dict.showroom.faqTitle}
            className="!mb-0"
          />
          <Accordion
            defaultOpen={0}
            items={faq.slice(0, 5).map((f) => ({ id: f.id, title: f.question, content: f.answer }))}
          />
        </div>
      </Section>
    </>
  );
}
