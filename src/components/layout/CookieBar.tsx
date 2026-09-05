"use client";

import type { Dictionary } from "@/i18n";
import { Button } from "@/components/ui/Button";
import { useHydrated, useStoredValue, writeStoredValue } from "@/lib/hooks";

const KEY = "ep-cookie-consent-v1";

/** PRD §173 — kuki razılığı. Analitik/marketinq yalnız razılıqdan sonra. */
export function CookieBar({ dict }: { dict: Dictionary }) {
  const hydrated = useHydrated();
  const consent = useStoredValue(KEY);

  if (!hydrated || consent) return null;

  return (
    <div
      role="region"
      aria-label={dict.cookie.title}
      className="fixed inset-x-0 bottom-16 lg:bottom-0 z-90 border-t border-line bg-paper/97 backdrop-blur-md"
    >
      <div className="container-page flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-[13px] leading-relaxed text-graphite">
          <span className="font-semibold text-ink">{dict.cookie.title}. </span>
          {dict.cookie.text}
        </p>
        <div className="flex shrink-0 gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => writeStoredValue(KEY, "necessary")}
          >
            {dict.cookie.necessaryOnly}
          </Button>
          <Button size="sm" onClick={() => writeStoredValue(KEY, "all")}>
            {dict.cookie.acceptAll}
          </Button>
        </div>
      </div>
    </div>
  );
}
