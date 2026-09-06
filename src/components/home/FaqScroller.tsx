import type { ReactNode } from "react";

import type { Dictionary } from "@/i18n";
import type { Locale } from "@/types";
import { localizedFaq } from "@/mock/content.i18n";
import FaqSection, { type FaqRow } from "@/components/ui/habit-faq-scroller";

/** Sətir başına sürət və istiqamət — növbələşərək daha canlı görünür. */
const ROW_STYLE: { speed: string; direction: "left" | "right" }[] = [
  { speed: "70s", direction: "left" },
  { speed: "55s", direction: "right" },
  { speed: "80s", direction: "left" },
];

const ROW_COUNT = ROW_STYLE.length;

/**
 * FAQ üfüqi sürüşdürücüsü — mətn lüğətdən və `localizedFaq()`-dan gəlir.
 *
 * `/faq` səhifəsindəki akkordeonu əvəz etmir: bu, marketinq bölmələri
 * üçün qısa baxışdır. Hər iki yer eyni mənbədən oxuyur, ona görə
 * tərcümə bir yerdə saxlanılır.
 */
export function FaqScroller({
  locale,
  dict,
  className,
  eyebrow,
  action,
}: {
  locale: Locale;
  dict: Dictionary;
  className?: string;
  eyebrow?: string;
  /** Sətirlərin altındakı düymə — məs. "Hamısına bax". */
  action?: ReactNode;
}) {
  const items = localizedFaq(locale);

  // Sualları sətirlərə növbə ilə paylayırıq ki, hər sətir təqribən
  // eyni sayda kart alsın və heç biri boş qalmasın.
  const rows: FaqRow[] = ROW_STYLE.map((style, index) => ({
    id: `faq-row-${index}`,
    ...style,
    faqItems: items.filter((_, i) => i % ROW_COUNT === index),
  })).filter((row) => row.faqItems.length > 0);

  if (rows.length === 0) return null;

  return (
    <FaqSection
      className={className}
      action={action}
      data={{
        eyebrow,
        mainTitle: dict.home.faqTitle,
        mainSubtitle: dict.home.faqText,
        rows,
      }}
    />
  );
}
