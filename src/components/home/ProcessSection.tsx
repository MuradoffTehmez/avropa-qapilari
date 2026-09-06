import { ArrowRight, ClipboardCheck, Factory, Hammer, Ruler, ShieldCheck } from "lucide-react";

import type { Dictionary } from "@/i18n";
import type { Locale } from "@/types";
import { routes } from "@/lib/routes";
import { ButtonLink } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/ui/primitives";

/** "Necə işləyir" — ölçüdən zəmanətə 5 addım. */
export function ProcessSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const r = routes(locale);

  const steps = [
    { icon: Ruler, title: dict.process.step1, text: dict.process.step1Text, meta: dict.process.step1Meta },
    { icon: ClipboardCheck, title: dict.process.step2, text: dict.process.step2Text, meta: dict.process.step2Meta },
    { icon: Factory, title: dict.process.step3, text: dict.process.step3Text, meta: dict.process.step3Meta },
    { icon: Hammer, title: dict.process.step4, text: dict.process.step4Text, meta: dict.process.step4Meta },
    { icon: ShieldCheck, title: dict.process.step5, text: dict.process.step5Text, meta: dict.process.step5Meta },
  ];

  return (
    <Section tone="bone" className="border-y border-line">
      <div className="container-page">
        <SectionHeading
          eyebrow={dict.process.eyebrow}
          title={dict.process.title}
          text={dict.process.text}
          action={
            <ButtonLink href={r.measurement} variant="outline" size="sm">
              {dict.actions.bookMeasurement} <ArrowRight size={15} />
            </ButtonLink>
          }
        />

        <ol className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
          {steps.map(({ icon: Icon, title, text, meta }, i) => (
            <li key={title} className="flex flex-col bg-paper p-5">
              <div className="flex items-center justify-between">
                <Icon size={20} className="text-gold-500" />
                <span className="text-[11px] font-semibold tabular-nums text-mist">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-4 text-[15px] font-medium text-ink">{title}</h3>
              <p className="mt-2 flex-1 text-[13px] leading-relaxed text-stone">{text}</p>
              <p className="mt-4 border-t border-line pt-3 text-[12px] font-medium text-graphite">
                {meta}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
