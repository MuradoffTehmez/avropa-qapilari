import Link from "next/link";
import { Award, ShieldCheck, Star, Wrench } from "lucide-react";

import type { Dictionary } from "@/i18n";
import type { Locale, Review } from "@/types";
import { routes } from "@/lib/routes";

/**
 * Sosial sübut zolağı — kateqoriyalardan dərhal sonra.
 * Rəy və rəqəmlər səhifənin altında qalmasın deyə yuxarı çəkilib.
 */
export function TrustStrip({
  locale,
  dict,
  review,
}: {
  locale: Locale;
  dict: Dictionary;
  /** Moderasiyadan keçmiş ən son rəy; yoxdursa blok göstərilmir. */
  review?: Review;
}) {
  const r = routes(locale);

  const stats = [
    { icon: ShieldCheck, value: "RC2–RC5", label: dict.trust.securityCertified },
    { icon: Wrench, value: dict.trust.responseTime, label: dict.trust.technicianResponse },
    { icon: Award, value: dict.trust.warrantyYears, label: dict.trust.warrantyRange },
  ];

  return (
    <section className="border-y border-line bg-bone">
      <div className="container-page grid gap-6 py-8 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-12 lg:py-10">
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-start gap-3">
              <Icon size={20} className="mt-0.5 shrink-0 text-gold-500" />
              <div className="min-w-0">
                <dt className="text-[17px] font-semibold tracking-tight text-ink">{value}</dt>
                <dd className="mt-0.5 text-[13px] leading-snug text-stone">{label}</dd>
              </div>
            </div>
          ))}
        </dl>

        {review && (
          <figure className="border-l-2 border-gold-400 pl-4 lg:pl-5">
            <div className="flex items-center gap-1" aria-label={`${review.rating} / 5`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={13}
                  className={i < review.rating ? "fill-gold-400 text-gold-400" : "text-mist"}
                  aria-hidden
                />
              ))}
            </div>
            <blockquote className="mt-2 line-clamp-3 text-[14px] leading-relaxed text-graphite">
              “{review.text}”
            </blockquote>
            <figcaption className="mt-2 text-[12px] text-stone">
              {review.author} · {review.city} ·{" "}
              <Link href={r.faq} className="text-gold-600 underline-offset-2 hover:underline">
                {dict.home.reviewsTitle}
              </Link>
            </figcaption>
          </figure>
        )}
      </div>
    </section>
  );
}
