import type { Metadata } from "next";
import { getDictionary, isLocale } from "@/i18n";
import type { Locale } from "@/types";
import { localeAlternates, routes } from "@/lib/routes";
import { Badge, Breadcrumbs, Section } from "@/components/ui/primitives";
import { DoorScene } from "@/components/product/DoorScene";
import Link from "next/link";
import { localizedProjects } from "@/mock/content.i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "az");

  return {
    alternates: localeAlternates("/layiheler", isLocale(locale) ? locale : "az"),
    title: dict.pageMeta.projects.title,
    description: dict.pageMeta.projects.description,
  };
}


export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "az") as Locale;
  const dict = getDictionary(locale);
  const r = routes(locale);

  return (
    <>
      <div className="border-b border-line bg-bone">
        <div className="container-page py-8 sm:py-10">
          <Breadcrumbs items={[{ label: dict.nav.home, href: r.home }, { label: dict.nav.projects }]} />
          <h1 className="font-display mt-4 text-2xl font-semibold tracking-tight text-ink sm:text-3xl lg:text-[2.35rem]">
            {dict.nav.projects}
          </h1>
          <p className="mt-2 max-w-xl text-[15px] text-stone">{dict.home.projectsText}</p>
        </div>
      </div>

      <Section>
        <div className="container-page grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
          {localizedProjects(locale).map((p) => (
            <article key={p.id} className="border border-line bg-paper">
              <div className="relative aspect-4/3 overflow-hidden bg-bone">
                <DoorScene color={p.accent} variant={localizedProjects(locale).indexOf(p)} title={p.title} />
                <Badge tone="dark" className="absolute left-3 top-3">
                  {p.category}
                </Badge>
                <span className="absolute bottom-3 right-3 rounded-[2px] bg-paper/85 px-2 py-1 text-[11px] font-medium text-graphite backdrop-blur">
                  {p.year}
                </span>
              </div>
              <div className="p-5">
                <h2 className="text-[16px] font-medium text-ink"><Link className="underline-offset-4 hover:underline" href={`${r.projects}/${p.slug}`}>{p.title} →</Link></h2>
                <p className="mt-1 text-[13px] text-stone">{p.location}</p>
                <dl className="mt-4 border-t border-line pt-3 text-[13px]">
                  <div className="flex justify-between py-1">
                    <dt className="text-stone">Model</dt>
                    <dd className="font-medium text-ink">{p.doorModel}</dd>
                  </div>
                  <div className="flex justify-between py-1">
                    <dt className="text-stone">{dict.common.color}</dt>
                    <dd className="font-medium text-ink">{p.color}</dd>
                  </div>
                </dl>
              </div>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
