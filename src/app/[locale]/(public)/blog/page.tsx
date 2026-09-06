import { DoorScene } from "@/components/product/DoorScene";
import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary, isLocale } from "@/i18n";
import type { Locale } from "@/types";
import { localeAlternates, routes } from "@/lib/routes";
import { formatDate } from "@/lib/utils";
import { Badge, Breadcrumbs, Section } from "@/components/ui/primitives";
import { localizedPosts } from "@/mock/content.i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "az");

  return {
    alternates: localeAlternates("/blog", isLocale(locale) ? locale : "az"),
    title: dict.pageMeta.blog.title,
    description: dict.pageMeta.blog.description,
  };
}


export default async function BlogPage({
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
          <Breadcrumbs items={[{ label: dict.nav.home, href: r.home }, { label: dict.nav.blog }]} />
          <h1 className="font-display mt-4 text-2xl font-semibold tracking-tight text-ink sm:text-3xl lg:text-[2.35rem]">
            {dict.nav.blog}
          </h1>
        </div>
      </div>

      <Section>
        <div className="container-page grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
          {localizedPosts(locale).map((post) => (
            <Link
              key={post.id}
              href={r.blogPost(post.slug)}
              className="group flex flex-col border border-line bg-paper transition-colors hover:border-mist"
            >
              <div
                className="relative aspect-16/10 border-b border-line"
                style={{ background: `linear-gradient(135deg, ${post.accent}, ${post.accent}cc)` }}
              >
                <DoorScene color={post.accent} variant={localizedPosts(locale).indexOf(post)} title={post.title} />
                <Badge tone="dark" className="absolute left-3 top-3">
                  {post.category}
                </Badge>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h2 className="text-[16px] font-medium leading-snug text-ink group-hover:underline">
                  {post.title}
                </h2>
                <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-stone">
                  {post.excerpt}
                </p>
                <p className="mt-4 text-xs text-mist">
                  {formatDate(post.date)} · {post.readMinutes} {dict.blog.readMinutes}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
