"use client";

import { useEffect, useState } from "react";
import type { Dictionary } from "@/i18n";
import { Button } from "@/components/ui/Button";

const KEY = "ep-cookie-consent-v1";

/** PRD §173 — kuki razılığı. Analitik/marketinq yalnız razılıqdan sonra. */
export function CookieBar({ dict }: { dict: Dictionary }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setVisible(true);
    } catch {
      /* private mode — banner göstərmirik */
    }
  }, []);

  function decide(value: "all" | "necessary") {
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label={dict.cookie.title}
      className="fixed inset-x-0 bottom-0 z-90 border-t border-line bg-paper/97 backdrop-blur-md"
    >
      <div className="container-page flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-[13px] leading-relaxed text-graphite">
          <span className="font-semibold text-ink">{dict.cookie.title}. </span>
          {dict.cookie.text}
        </p>
        <div className="flex shrink-0 gap-2">
          <Button variant="secondary" size="sm" onClick={() => decide("necessary")}>
            {dict.cookie.necessaryOnly}
          </Button>
          <Button size="sm" onClick={() => decide("all")}>
            {dict.cookie.acceptAll}
          </Button>
        </div>
      </div>
    </div>
  );
}
