import Link from "next/link";
import {
  ArrowRight,
  Hammer,
  Ruler,
  ShieldCheck,
  Truck,
  Wrench,
} from "lucide-react";

import { getDictionary, isLocale } from "@/i18n";
import type { Locale } from "@/types";
import { routes } from "@/lib/routes";
import { formatDate } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/Button";
import { Badge, Section, SectionHeading, Stat, Rating } from "@/components/ui/primitives";
import { Accordion } from "@/components/ui/disclosure";
import { DoorVisual } from "@/components/product/DoorVisual";
import { ProductCard } from "@/components/product/ProductCard";
import { categories, brands } from "@/mock/taxonomy";
import { getFeaturedProducts } from "@/mock/products";
import { faq, projects, reviews } from "@/mock/content";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "az") as Locale;
  const dict = getDictionary(locale);
  const r = routes(locale);

  const featured = getFeaturedProducts(8);
  const featuredCategories = categories.filter((c) => c.featured);

  return (
    <>
      {/* ---------------------------------------------------------- HERO */}
      <section className="relative overflow-hidden bg-ink text-paper">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg,#fff 0 1px,transparent 1px 96px)",
          }}
        />
        <div className="container-page relative grid gap-12 py-16 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-8 lg:py-24">
          <div className="animate-fade-up">
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.28em] text-brass-300">
              {dict.home.heroEyebrow}
            </p>
            <h1 className="text-balance-heading text-[2.15rem] font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.9rem]">
              {dict.home.heroTitleTop}
              <br />
              <span className="text-brass-300">{dict.home.heroTitleBottom}</span>
            </h1>
            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-paper/65 sm:text-base">
              {dict.home.heroText}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href={r.doors} variant="brass" size="lg">
                {dict.actions.selectDoor}
                <ArrowRight size={17} />
              </ButtonLink>
              <ButtonLink
                href={r.configurator}
                size="lg"
                className="border-paper/25 bg-transparent text-paper hover:border-paper hover:bg-paper/5"
              >
                {dict.actions.configure}
              </ButtonLink>
              <ButtonLink
                href={r.measurement}
                variant="ghost"
                size="lg"
                className="text-paper/70 hover:bg-paper/5 hover:text-paper"
              >
                {dict.actions.bookMeasurement}
              </ButtonLink>
            </div>

            <div className="mt-12 grid grid-cols-3 items-stretch gap-6 border-t border-paper/12 pt-8">
              <Stat invert label={dict.home.heroStatDoors} value="4 200+" />
              <Stat invert label={dict.home.heroStatYears} value="18" />
              <Stat invert label={dict.home.heroStatBrands} value="12" />
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative aspect-4/5">
              <div
                aria-hidden
                className="absolute inset-x-8 bottom-0 top-12 bg-gradient-to-b from-paper/[0.06] to-transparent"
              />
              <DoorVisual
                panelHex="#33312e"
                style="MODERN"
                glass="SATIN"
                handle="BRASS"
                smartLock
                widthMm={1000}
                heightMm={2100}
                className="relative"
              />
            </div>
            <div className="absolute -left-2 bottom-6 border border-paper/15 bg-obsidian/80 px-4 py-3 backdrop-blur sm:left-0">
              <p className="text-[10px] uppercase tracking-[0.16em] text-paper/45">Konfiqurasiya</p>
              <p className="mt-1 text-sm font-medium text-paper">
                1000 × 2100 · Antrasit ağac
              </p>
              <p className="text-sm font-semibold text-brass-300">2 890 AZN</p>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- CATEGORIES */}
      <Section>
        <div className="container-page">
          <SectionHeading
            eyebrow="Kataloq"
            title={dict.home.categoriesTitle}
            text={dict.home.categoriesText}
            action={
              <ButtonLink href={r.doors} variant="outline" size="sm">
                {dict.actions.viewAll} <ArrowRight size={15} />
              </ButtonLink>
            }
          />

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {featuredCategories.map((c, i) => (
              <Link
                key={c.id}
                href={r.category(c.slug)}
                className="group relative flex min-h-44 flex-col justify-end overflow-hidden border border-line bg-bone p-5 transition-colors hover:border-mist sm:min-h-56 sm:p-6"
              >
                <div
                  aria-hidden
                  className="absolute -right-6 -top-4 h-40 w-28 opacity-25 transition-transform duration-500 group-hover:scale-105 sm:h-52 sm:w-36"
                >
                  <DoorVisual panelHex={c.accent} style={i % 2 === 0 ? "MODERN" : "CLASSIC"} ambient={false} />
                </div>
                <div className="relative">
                  <h3 className="text-[15px] font-medium text-ink sm:text-lg">{c.name}</h3>
                  <p className="mt-1 text-xs text-stone">{c.productCount} model</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------ CONFIGURATOR */}
      <Section tone="bone" className="border-y border-line">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="order-2 lg:order-1">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-brass-600">
              Konfiqurator
            </p>
            <h2 className="text-balance-heading text-2xl font-semibold leading-tight tracking-tight text-ink sm:text-3xl lg:text-[2.5rem]">
              {dict.home.configuratorTitle}
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-stone">
              {dict.home.configuratorText}
            </p>

            <ol className="mt-8 space-y-0 border-t border-line">
              {dict.home.configuratorSteps.map((step, i) => (
                <li key={step} className="flex items-center gap-4 border-b border-line py-3.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-line text-xs font-semibold tabular-nums text-graphite">
                    {i + 1}
                  </span>
                  <span className="text-[15px] text-ink">{step}</span>
                </li>
              ))}
            </ol>

            <ButtonLink href={r.configurator} size="lg" className="mt-8">
              {dict.actions.startConfigurator} <ArrowRight size={17} />
            </ButtonLink>
          </div>

          <div className="order-1 grid grid-cols-3 gap-3 lg:order-2">
            {[
              { hex: "#383e42", style: "MODERN" as const, handle: "BLACK" as const },
              { hex: "#a9743c", style: "CLASSIC" as const, handle: "BRASS" as const },
              { hex: "#f1f0ea", style: "MINIMAL" as const, handle: "INOX" as const },
            ].map((v, i) => (
              <div key={v.hex} className="door-frame border border-line bg-paper">
                <DoorVisual
                  panelHex={v.hex}
                  style={v.style}
                  handle={v.handle}
                  glass={i === 2 ? "SATIN" : "NONE"}
                  side={i === 1 ? "LEFT" : "RIGHT"}
                />
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------- FEATURED */}
      <Section>
        <div className="container-page">
          <SectionHeading
            eyebrow="Seçilmişlər"
            title={dict.home.featuredTitle}
            text={dict.home.featuredText}
            action={
              <ButtonLink href={r.doors} variant="outline" size="sm">
                {dict.actions.viewAll} <ArrowRight size={15} />
              </ButtonLink>
            }
          />
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} />
            ))}
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------- SERVICES */}
      <Section tone="bone" className="border-y border-line">
        <div className="container-page">
          <SectionHeading eyebrow="Xidmətlər" title={dict.home.servicesTitle} text={dict.home.servicesText} />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { icon: Ruler, title: dict.services.measurement, text: dict.services.measurementText, href: r.serviceMeasurement },
              { icon: Truck, title: dict.services.delivery, text: dict.services.deliveryText, href: r.services },
              { icon: Hammer, title: dict.services.installation, text: dict.services.installationText, href: r.serviceInstallation },
              { icon: Wrench, title: dict.services.repair, text: dict.services.repairText, href: r.serviceRepair },
              { icon: ShieldCheck, title: dict.services.warranty, text: dict.services.warrantyText, href: r.services },
            ].map(({ icon: Icon, title, text, href }) => (
              <Link
                key={title}
                href={href}
                className="group flex flex-col border border-line bg-paper p-5 transition-colors hover:border-mist"
              >
                <Icon size={22} className="text-brass-500" />
                <h3 className="mt-4 text-[15px] font-medium text-ink">{title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-stone">{text}</p>
                <span className="mt-4 text-[13px] font-medium text-graphite underline-offset-4 group-hover:underline">
                  {dict.actions.details}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------------ REPAIR */}
      <section className="bg-ink text-paper">
        <div className="container-page grid gap-8 py-14 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:py-20">
          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-brass-300">
              24 saat içində usta
            </p>
            <h2 className="text-balance-heading text-2xl font-semibold leading-tight tracking-tight sm:text-3xl lg:text-[2.35rem]">
              {dict.home.repairTitle}
            </h2>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-paper/60">
              {dict.home.repairText}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={r.repair} variant="brass" size="lg">
                {dict.actions.callTechnician} <ArrowRight size={17} />
              </ButtonLink>
              <ButtonLink
                href={r.serviceRepair}
                size="lg"
                className="border-paper/25 bg-transparent text-paper hover:border-paper hover:bg-paper/5"
              >
                {dict.actions.details}
              </ButtonLink>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2">
            {["Kilid", "Menteşə", "Çərçivə", "Şüşə", "Smart lock", "Tənzimləmə"].map((s) => (
              <div key={s} className="border border-paper/12 px-4 py-3 text-[13px] text-paper/70">
                {s}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- PROJECTS */}
      <Section>
        <div className="container-page">
          <SectionHeading
            eyebrow="Portfolio"
            title={dict.home.projectsTitle}
            text={dict.home.projectsText}
            action={
              <ButtonLink href={r.projects} variant="outline" size="sm">
                {dict.actions.viewAll} <ArrowRight size={15} />
              </ButtonLink>
            }
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 3).map((p) => (
              <Link
                key={p.id}
                href={r.projects}
                className="group border border-line bg-paper transition-colors hover:border-mist"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-bone">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-[85%] w-[45%] transition-transform duration-500 group-hover:scale-105">
                      <DoorVisual panelHex={p.accent} style="CLASSIC" handle="BRASS" ambient={false} />
                    </div>
                  </div>
                  <Badge tone="dark" className="absolute left-3 top-3">
                    {p.category}
                  </Badge>
                </div>
                <div className="p-4">
                  <h3 className="text-[15px] font-medium text-ink">{p.title}</h3>
                  <p className="mt-1 text-[13px] text-stone">
                    {p.location} · {p.doorModel}
                  </p>
                  <p className="mt-0.5 text-xs text-mist">
                    {p.color} · {p.year}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------------ BRANDS */}
      <Section tone="bone" className="border-y border-line !py-12">
        <div className="container-page">
          <SectionHeading title={dict.home.brandsTitle} text={dict.home.brandsText} className="!mb-8" />
          <div className="grid grid-cols-2 gap-px overflow-hidden border border-line bg-line sm:grid-cols-3 lg:grid-cols-6">
            {brands.map((b) => (
              <Link
                key={b.id}
                href={r.brand(b.slug)}
                className="flex flex-col items-center justify-center bg-paper px-4 py-7 text-center transition-colors hover:bg-bone"
              >
                <span className="text-[15px] font-semibold tracking-tight text-ink">{b.name}</span>
                <span className="mt-1 text-[11px] uppercase tracking-[0.14em] text-stone">
                  {b.country}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      {/* ----------------------------------------------------- REVIEWS */}
      <Section>
        <div className="container-page">
          <SectionHeading eyebrow="Rəylər" title={dict.home.reviewsTitle} text={dict.home.reviewsText} />
          <div className="grid gap-3 sm:gap-4 lg:grid-cols-3">
            {reviews.slice(0, 3).map((rv) => (
              <figure key={rv.id} className="flex flex-col border border-line bg-paper p-5">
                <Rating value={rv.rating} />
                <blockquote className="mt-4 flex-1 text-[14px] leading-relaxed text-graphite">
                  “{rv.text}”
                </blockquote>
                <figcaption className="mt-5 border-t border-line pt-4">
                  <p className="text-sm font-medium text-ink">{rv.author}</p>
                  <p className="mt-0.5 text-xs text-stone">
                    {rv.city} · {rv.productName} · {formatDate(rv.date)}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </Section>

      {/* --------------------------------------------------------- FAQ */}
      <Section tone="bone" className="border-t border-line">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow="FAQ" title={dict.home.faqTitle} text={dict.home.faqText} className="!mb-6" />
            <ButtonLink href={r.faq} variant="outline" size="sm">
              {dict.actions.viewAll} <ArrowRight size={15} />
            </ButtonLink>
          </div>
          <Accordion
            defaultOpen={0}
            items={faq.slice(0, 6).map((f) => ({ id: f.id, title: f.question, content: f.answer }))}
          />
        </div>
      </Section>
    </>
  );
}
