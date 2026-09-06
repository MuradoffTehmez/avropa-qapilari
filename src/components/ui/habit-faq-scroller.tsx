import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Tiplər                                                                     */
/* -------------------------------------------------------------------------- */

export interface ScrollerFaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqRow {
  id: string;
  /** CSS müddəti, məs. "60s" */
  speed?: string;
  direction?: "left" | "right";
  faqItems: ScrollerFaqItem[];
}

export interface FaqSectionData {
  /** Başlığın üstündəki kiçik etiket. */
  eyebrow?: string;
  mainTitle: string;
  mainSubtitle: string;
  rows: FaqRow[];
}

/* -------------------------------------------------------------------------- */

/**
 * FaqCard
 * Bir FAQ elementi üçün kart.
 *
 * Dizayn sistemi: kölgə yox, ayırma `border-line` ilə; radius minimal;
 * rənglər tokenlərdən (CLAUDE.md → Dizayn sistemi).
 */
export const FaqCard = ({ question, answer }: { question: string; answer: string }) => {
  return (
    <div className="faq-card flex w-[17.5rem] flex-shrink-0 flex-col items-start gap-2.5 border border-line bg-paper p-5 transition-colors hover:border-mist sm:w-80">
      <span aria-hidden className="h-px w-8 shrink-0 bg-gold-400" />
      <h3 className="faq-title text-[15px] font-medium leading-snug text-ink">{question}</h3>
      <p className="faq-answer text-[13.5px] leading-relaxed text-stone">{answer}</p>
    </div>
  );
};

/**
 * HorizontalScroller
 * Uşaq elementləri bükür və kəsintisiz üfüqi dövr animasiyası yaradır.
 *
 * Məzmun iki dəfə render olunur; trek `-50%` sürüşdükdə ikinci nüsxə
 * birincinin yerinə düşür və keçid görünmür.
 */
export const HorizontalScroller = ({
  children,
  speed = "40s",
  direction = "left",
}: {
  children: ReactNode;
  speed?: string;
  direction?: "left" | "right";
}) => {
  const animationClass =
    direction === "right" ? "animate-scroll-horizontal-reverse" : "animate-scroll-horizontal";

  // Sürüşmə müddətini CSS dəyişəni kimi ötürürük.
  const style = { "--scroll-duration": speed } as CSSProperties;

  return (
    <div className="scroller-mask group relative w-full overflow-hidden">
      {/*
        `w-max` vacibdir: trek eni məzmunun cəmi olmalıdır ki, `-50%`
        tam bir nüsxəyə bərabər olsun. Əks halda trek valideynin eni
        qədər olur və dövr yerində sıçrayır.
      */}
      <div className={cn("flex w-max", animationClass)} style={style}>
        <div className="flex flex-shrink-0 items-stretch gap-4 px-2">{children}</div>
        {/* kəsintisiz dövr üçün nüsxə */}
        <div className="flex flex-shrink-0 items-stretch gap-4 px-2" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * FaqSection
 * Başlıq, alt başlıq və bir neçə üfüqi sətri birləşdirir.
 *
 * Məzmundan asılı deyil — mətn `data` ilə ötürülür. Layihə lüğəti ilə
 * bağlanmış variant: `src/components/home/FaqScroller.tsx`.
 */
const FaqSection = ({
  data,
  className,
  action,
}: {
  data: FaqSectionData;
  className?: string;
  /** Sətirlərin altında göstərilən düymə və ya link. */
  action?: ReactNode;
}) => {
  return (
    <div className={cn("flex w-full flex-col items-center gap-10", className)}>
      <div className="flex max-w-2xl flex-col items-center gap-3 px-4 text-center">
        {data.eyebrow && (
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-600"
            style={{ opacity: 0, animation: "fadeInUp 0.7s ease-out 0.1s forwards" }}
          >
            {data.eyebrow}
          </p>
        )}
        <h2
          className="font-display text-balance-heading text-[1.7rem] font-semibold leading-tight text-ink sm:text-[2.1rem]"
          style={{ opacity: 0, animation: "fadeInUp 0.7s ease-out 0.2s forwards" }}
        >
          {data.mainTitle}
        </h2>
        <p
          className="text-[15px] leading-relaxed text-stone"
          style={{ opacity: 0, animation: "fadeInUp 0.7s ease-out 0.4s forwards" }}
        >
          {data.mainSubtitle}
        </p>
      </div>

      <div className="flex w-full flex-col gap-4">
        {data.rows.map((row) => (
          <HorizontalScroller key={row.id} speed={row.speed} direction={row.direction}>
            {row.faqItems.map((item) => (
              <FaqCard key={item.id} question={item.question} answer={item.answer} />
            ))}
          </HorizontalScroller>
        ))}
      </div>

      {action && <div className="px-4">{action}</div>}
    </div>
  );
};

export default FaqSection;
