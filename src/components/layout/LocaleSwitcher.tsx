"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { Check, Globe } from "lucide-react";
import type { Locale } from "@/types";
import { localeNames, locales, localeShort } from "@/i18n/config";
import { swapLocaleInPath } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { useEscapeKey } from "@/lib/hooks";

const LOCALE_COOKIE = "ep-locale";

function rememberLocale(next: string) {
  try {
    document.cookie = LOCALE_COOKIE + "=" + next + "; path=/; max-age=31536000; samesite=lax";
  } catch {
    /* kuki bloklanıb */
  }
}

/** Dil seçici — seçim kuki ilə yadda saxlanılır və növbəti ziyarətdə tətbiq olunur. */
export function LocaleSwitcher({
  locale,
  variant = "menu",
  className,
}: {
  locale: Locale;
  /** `menu` — açılan siyahı, `inline` — yan-yana düymələr */
  variant?: "menu" | "inline";
  className?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEscapeKey(() => setOpen(false), open);

  function choose(next: Locale) {
    rememberLocale(next);
    setOpen(false);
    router.push(swapLocaleInPath(pathname, next));
  }

  if (variant === "inline") {
    return (
      <div className={cn("flex items-center gap-1", className)} role="group" aria-label="Dil">
        {locales.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => choose(l)}
            aria-current={l === locale ? "true" : undefined}
            className={cn(
              "px-2.5 py-1.5 text-[13px] transition-colors",
              l === locale
                ? "font-semibold text-ink underline underline-offset-4"
                : "text-stone hover:text-ink",
            )}
          >
            {localeShort[l]}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Dil: ${localeNames[locale]}`}
        className="flex items-center gap-1.5 px-2 py-1 text-[12px] font-medium text-stone transition-colors hover:text-ink"
      >
        <Globe size={13} />
        {localeShort[locale]}
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <ul
            role="menu"
            className="absolute right-0 top-full z-50 mt-1 min-w-40 border border-line bg-paper py-1 shadow-lg"
          >
            {locales.map((l) => (
              <li key={l}>
                <button
                  role="menuitemradio"
                  aria-checked={l === locale}
                  type="button"
                  onClick={() => choose(l)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-[13px] transition-colors hover:bg-bone",
                    l === locale ? "font-medium text-ink" : "text-graphite",
                  )}
                >
                  {localeNames[l]}
                  {l === locale && <Check size={14} className="text-gold-500" />}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
