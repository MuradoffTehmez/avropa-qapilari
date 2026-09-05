import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary, isLocale } from "@/i18n";
import type { Locale } from "@/types";
import { routes } from "@/lib/routes";
import { formatDate } from "@/lib/utils";
import { Badge, Breadcrumbs, Section } from "@/components/ui/primitives";
import { blogPosts } from "@/mock/content";

export const metadata: Metadata = {
  title: "Bloq",
  description: "Qapı seçimi, təhlükəsizlik sinifləri, smart lock və baxım üzrə bələdçilər.",
};

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
          <Breadcrumbs items={[{ label: "Ana səhifə", href: r.home }, { label: dict.nav.blog }]} />
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-ink sm:text-3xl lg:text-[2.35rem]">
            {dict.nav.blog}
          </h1>
        </div>
      </div>

      <Section>
        <div className="container-page grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Link
              key={post.id}
              href={r.blogPost(post.slug)}
              className="group flex flex-col border border-line bg-paper transition-colors hover:border-mist"
            >
              <div
                className="relative aspect-16/10 border-b border-line"
                style={{ background: `linear-gradient(135deg, ${post.accent}, ${post.accent}cc)` }}
              >
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
                  {formatDate(post.date)} · {post.readMinutes} dəq oxu
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
