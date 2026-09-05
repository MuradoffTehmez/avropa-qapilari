import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, locales } from "@/i18n";
import type { Locale } from "@/types";
import { routes } from "@/lib/routes";
import { formatDate } from "@/lib/utils";
import { Badge, Breadcrumbs, Section } from "@/components/ui/primitives";
import { blogPosts } from "@/mock/content";

export function generateStaticParams() {
  return locales.flatMap((locale) => blogPosts.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
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

  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const others = blogPosts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <>
      <div className="border-b border-line bg-bone">
        <div className="container-page py-8 sm:py-10">
          <Breadcrumbs
            items={[
              { label: "Ana səhifə", href: r.home },
              { label: dict.nav.blog, href: r.blog },
              { label: post.title },
            ]}
          />
          <Badge tone="gold" className="mt-4">
            {post.category}
          </Badge>
          <h1 className="mt-3 max-w-3xl text-balance-heading text-2xl font-semibold leading-tight tracking-tight text-ink sm:text-3xl lg:text-[2.4rem]">
            {post.title}
          </h1>
          <p className="mt-3 text-[13px] text-stone">
            {formatDate(post.date)} · {post.readMinutes} dəq oxu
          </p>
        </div>
      </div>

      <Section>
        <div className="container-page">
          <article className="max-w-2xl space-y-5 text-[16px] leading-[1.75] text-graphite">
            <p className="text-[18px] leading-relaxed text-ink">{post.excerpt}</p>
            <h2 className="pt-4 text-xl font-semibold tracking-tight text-ink">Nə üçün vacibdir</h2>
            <p>
              Qapı seçimində qərar adətən üç parametr ətrafında formalaşır: təhlükəsizlik, izolyasiya
              və dizayn. Bu üçlüyün balansı obyektin tipindən asılı olaraq dəyişir — mənzil girişi
              üçün səs izolyasiyası, villa üçün isə termo göstərici prioritet olur.
            </p>

            <h2 className="pt-4 text-xl font-semibold tracking-tight text-ink">Praktik tövsiyə</h2>
            <p>
              Ölçünü mütləq usta götürsün. Açırımın diaqonal fərqi, divar qalınlığı və çərçivə
              dərinliyi qapının düzgün oturmasını müəyyən edir; bu parametrlərdəki səhv sonradan
              cırıltı, keçmə və kilid problemləri yaradır.
            </p>
          </article>

          <div className="mt-14 border-t border-line pt-10">
            <h2 className="mb-6 text-lg font-semibold tracking-tight text-ink">Digər yazılar</h2>
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
