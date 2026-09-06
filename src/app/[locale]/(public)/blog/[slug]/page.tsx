import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, locales } from "@/i18n";
import type { Locale } from "@/types";
import { localeAlternates, routes } from "@/lib/routes";
import { formatDate } from "@/lib/utils";
import { Badge, Breadcrumbs, Section } from "@/components/ui/primitives";
import { localizedPosts } from "@/mock/content.i18n";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleSchema, breadcrumbSchema } from "@/lib/structured-data";

export function generateStaticParams() {
  return locales.flatMap((locale) => localizedPosts(locale).map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = (isLocale(raw) ? raw : "az") as Locale;
  const post = localizedPosts(locale).find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: localeAlternates(`/blog/${slug}`, locale),
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale = (isLocale(raw) ? raw : "az") as Locale;
  const dict = getDictionary(locale);
  const r = routes(locale);

  const post = localizedPosts(locale).find((p) => p.slug === slug);
  if (!post) notFound();

  const others = localizedPosts(locale).filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <>
      <JsonLd
        data={[
          articleSchema(post, locale),
          breadcrumbSchema([
            { label: dict.nav.home, href: r.home },
            { label: dict.nav.blog, href: r.blog },
            { label: post.title, href: r.blogPost(post.slug) },
          ]),
        ]}
      />

      <div className="border-b border-line bg-bone">
        <div className="container-page py-8 sm:py-10">
          <Breadcrumbs
            items={[
              { label: dict.nav.home, href: r.home },
              { label: dict.nav.blog, href: r.blog },
              { label: post.title },
            ]}
          />
          <Badge tone="gold" className="mt-4">
            {post.category}
          </Badge>
          <h1 className="font-display mt-3 max-w-3xl text-balance-heading text-2xl font-semibold leading-tight tracking-tight text-ink sm:text-3xl lg:text-[2.4rem]">
            {post.title}
          </h1>
          <p className="mt-3 text-[13px] text-stone">
            {formatDate(post.date)} · {post.readMinutes} {dict.blog.readMinutes}
          </p>
        </div>
      </div>

      <Section>
        <div className="container-page">
          <article className="max-w-2xl space-y-5 text-[16px] leading-[1.75] text-graphite">
            <p className="text-[18px] leading-relaxed text-ink">{post.excerpt}</p>
            <h2 className="pt-4 text-xl font-semibold tracking-tight text-ink">{dict.blog.whyItMatters}</h2>
            <p>{dict.blog.whyItMattersText}</p>

            <h2 className="pt-4 text-xl font-semibold tracking-tight text-ink">{dict.blog.practicalTip}</h2>
            <p>{dict.blog.practicalTipText}</p>
          </article>

          <div className="mt-14 border-t border-line pt-10">
            <h2 className="mb-6 text-lg font-semibold tracking-tight text-ink">{dict.blog.otherPosts}</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {others.map((p) => (
                <Link
                  key={p.id}
                  href={r.blogPost(p.slug)}
                  className="border border-line bg-paper p-4 transition-colors hover:border-mist"
                >
                  <p className="text-[11px] uppercase tracking-[0.14em] text-stone">{p.category}</p>
                  <h3 className="mt-1.5 text-[14.5px] font-medium leading-snug text-ink">
                    {p.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
