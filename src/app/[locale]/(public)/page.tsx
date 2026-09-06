import Image from "next/image";
import { DoorScene } from "@/components/product/DoorScene";
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
import { TrustStrip } from "@/components/home/TrustStrip";
import { ProcessSection } from "@/components/home/ProcessSection";
import { categories, brands } from "@/mock/taxonomy";
import { getFeaturedProducts } from "@/mock/products";
import { faq, projects, reviews } from "@/mock/content";
import { categoryName, countryName } from "@/lib/i18n-format";

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
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg,#fff 0 1px,transparent 1px 96px)",
          }}
        />

        <div className="container-page relative grid items-center gap-8 py-10 sm:py-14 lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:py-20 xl:py-24">
          {/* Mobil: şəkil əvvəl, desktop: sağda */}
          <div className="relative order-1 w-full lg:order-2">
            <div className="relative aspect-16/10 overflow-hidden sm:aspect-3/2 lg:aspect-4/5">
              <Image
                src="/images/entrance-hero.webp"
                alt="Mat qara giriş qapısı, qızıl bar dəstək"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-3 left-3 border border-paper/15 bg-obsidian/85 px-3 py-2 backdrop-blur sm:bottom-4 sm:left-4 sm:px-4 sm:py-3">
              <p className="text-[10px] uppercase tracking-[0.16em] text-paper/45">
                {dict.configurator.title}
              </p>
              <p className="mt-1 text-[13px] font-medium text-paper sm:text-sm">
                1000 × 2100 · Antrasit
              </p>
              <p className="text-[13px] font-semibold text-gold-300 sm:text-sm">2 890 AZN</p>
            </div>
          </div>

          <div className="order-2 animate-fade-up lg:order-1">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-300 sm:mb-5 sm:text-[11px] sm:tracking-[0.28em]">
              {dict.home.heroEyebrow}
            </p>
            <h1 className="font-display text-balance-heading text-[1.9rem] font-semibold leading-[1.1] tracking-tight sm:text-[2.75rem] lg:text-[3.25rem] xl:text-[3.75rem]">
              {dict.home.heroTitleTop}
              <br />
              <span className="text-gold-300">{dict.home.heroTitleBottom}</span>
            </h1>
            <p className="mt-4 max-w-lg text-[14.5px] leading-relaxed text-paper/65 sm:mt-6 sm:text-base">
              {dict.home.heroText}
            </p>

            <div className="mt-6 grid gap-2.5 sm:mt-8 sm:flex sm:flex-wrap sm:gap-3">
              <ButtonLink href={r.doors} variant="gold" size="lg" className="justify-center">
                {dict.actions.selectDoor}
                <ArrowRight size={17} />
              </ButtonLink>
              <ButtonLink
                href={r.configurator}
                size="lg"
                className="justify-center border-paper/25 bg-transparent text-paper hover:border-paper hover:bg-paper/5"
              >
                {dict.actions.configure}
              </ButtonLink>
              <ButtonLink
                href={r.measurement}
                variant="ghost"
                size="lg"
                className="justify-center text-paper/70 hover:bg-paper/5 hover:text-paper"
              >
                {dict.actions.bookMeasurement}
              </ButtonLink>
            </div>

            <div className="mt-8 grid grid-cols-3 items-stretch gap-3 border-t border-paper/12 pt-6 sm:mt-10 sm:gap-6 sm:pt-8">
              <Stat invert compact label={dict.home.heroStatDoors} value="4 200+" />
              <Stat invert compact label={dict.home.heroStatYears} value="18" />
              <Stat invert compact label={dict.home.heroStatBrands} value="12" />
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
                className="group overflow-hidden border border-line bg-paper transition-shadow hover:shadow-lg"
              >
                <div className="aspect-[4/3] overflow-hidden"><DoorScene color={c.accent} variant={i} title={categoryName(c, dict)} /></div>
                <div className="p-4 sm:p-5">
                  <h3 className="text-[15px] font-medium text-ink sm:text-lg">{categoryName(c, dict)}</h3>
                  <p className="mt-1 text-xs text-stone">{c.productCount} model</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      <TrustStrip locale={locale} dict={dict} />

      {/* ------------------------------------------------ CONFIGURATOR */}
      <Section tone="bone" className="border-y border-line">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="order-2 lg:order-1">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-600">
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
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} dict={dict} />
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
                <Icon size={22} className="text-gold-500" />
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

      <ProcessSection locale={locale} dict={dict} />

      {/* ------------------------------------------------------ REPAIR */}
      <section className="bg-ink text-paper">
        <div className="container-page grid gap-8 py-14 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:py-20">
          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-300">
              24 saat içində usta
            </p>
            <h2 className="text-balance-heading text-2xl font-semibold leading-tight tracking-tight sm:text-3xl lg:text-[2.35rem]">
              {dict.home.repairTitle}
            </h2>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-paper/60">
              {dict.home.repairText}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={r.repair} variant="gold" size="lg">
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
                href={`${r.projects}/${p.slug}`}
                className="group border border-line bg-paper transition-colors hover:border-mist"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-bone">
                  <DoorScene color={p.accent} variant={projects.indexOf(p)} title={p.title} />
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
                  {countryName(b, dict)}
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
