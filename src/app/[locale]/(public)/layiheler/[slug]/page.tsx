import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, locales } from "@/i18n";
import type { Locale } from "@/types";
import { localeAlternates, routes } from "@/lib/routes";
import { Breadcrumbs, DataRow, Section } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/Button";
import { ProjectDetail } from "@/components/product/ProjectDetail";
import { localizedProjects } from "@/mock/content.i18n";

export function generateStaticParams() {
  return locales.flatMap((locale) => localizedProjects(locale).map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = (isLocale(raw) ? raw : "az") as Locale;
  const project = localizedProjects(locale).find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: `${project.location} · ${project.doorModel} · ${project.color}`,
    alternates: localeAlternates(`/layiheler/${slug}`, locale),
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale = (isLocale(raw) ? raw : "az") as Locale;
  const dict = getDictionary(locale);
  const r = routes(locale);

  const project = localizedProjects(locale).find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <>
      <div className="border-b border-line bg-bone">
        <div className="container-page py-8 sm:py-10">
          <Breadcrumbs
            items={[
              { label: dict.nav.home, href: r.home },
              { label: dict.nav.projects, href: r.projects },
              { label: project.title },
            ]}
          />
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-600">
            {project.location}
          </p>
          <h1 className="font-display mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl lg:text-[2.35rem]">
            {project.title}
          </h1>
        </div>
      </div>

      <Section>
        <div className="container-page grid gap-8 lg:grid-cols-2 lg:gap-12">
          <ProjectDetail accent={project.accent} title={project.title} />

          <div>
            <h2 className="text-xl font-semibold tracking-tight text-ink">
              Girişin yenilənməsi
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-graphite">
              Mövcud giriş ölçülür, açılma istiqaməti seçilir və interyerə uyğun qapı
              quraşdırılır. Son mərhələdə kilid, menteşə və izolyasiya yoxlanılır.
            </p>

            <dl className="mt-6 border-t border-line">
              <DataRow label="Model" value={project.doorModel} />
              <DataRow label={dict.common.color} value={project.color} />
              <DataRow label="Layihə növü" value={project.category} />
              <DataRow label="İl" value={project.year} />
            </dl>

            <h2 className="mt-8 text-lg font-semibold tracking-tight text-ink">İş mərhələləri</h2>
            <ol className="mt-4 border-t border-line">
              {[
                "Ölçü və məsləhət",
                "Konfiqurasiya və qiymətin təsdiqi",
                "Çatdırılma və quraşdırma",
                "Keyfiyyət yoxlaması və zəmanət",
              ].map((step, i) => (
                <li key={step} className="flex items-start gap-4 border-b border-line py-3.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-line text-xs font-semibold tabular-nums text-graphite">
                    {i + 1}
                  </span>
                  <span className="pt-0.5 text-[15px] text-ink">{step}</span>
                </li>
              ))}
            </ol>

            <ButtonLink href={r.measurement} size="lg" className="mt-7">
              Oxşar layihə üçün ölçü sifariş et
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
