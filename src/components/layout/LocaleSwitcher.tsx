"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import type { Locale } from "@/types";
import { localeNames, locales, localeShort } from "@/i18n/config";
import { swapLocaleInPath } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { useEscapeKey } from "@/lib/hooks";
import { FlagIcon } from "@/components/ui/FlagIcons";
import { useDict } from "@/i18n/provider";

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
  const dict = useDict();

  useEscapeKey(() => setOpen(false), open);

  function choose(next: Locale) {
    rememberLocale(next);
    setOpen(false);
    router.push(swapLocaleInPath(pathname, next));
  }

  if (variant === "inline") {
    return (
      <div className={cn("flex items-center gap-1.5", className)} role="group" aria-label={dict.actions.language}>
        {locales.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => choose(l)}
            aria-current={l === locale ? "true" : undefined}
            className={cn(
              "flex items-center gap-2 border px-3 py-2 text-[13px] transition-colors",
              l === locale
                ? "border-ink bg-bone font-semibold text-ink"
                : "border-line text-graphite hover:border-mist",
            )}
          >
            <FlagIcon locale={l} />
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
        aria-label={`${dict.actions.language}: ${localeNames[locale]}`}
        className="flex h-11 items-center gap-1.5 px-1.5 text-[13px] font-medium text-graphite transition-colors hover:text-ink sm:px-2"
      >
        <FlagIcon locale={locale} />
        <span className="hidden sm:inline">{localeShort[locale]}</span>
        <ChevronDown
          size={13}
          className={cn("shrink-0 text-stone transition-transform", open && "rotate-180")}
        />
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
            className="absolute right-0 top-full z-50 mt-1 min-w-44 border border-line bg-paper py-1 shadow-lg"
          >
            {locales.map((l) => (
              <li key={l}>
                <button
                  role="menuitemradio"
                  aria-checked={l === locale}
                  type="button"
                  onClick={() => choose(l)}
                  className={cn(
                    "flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-[13.5px] transition-colors hover:bg-bone",
                    l === locale ? "font-medium text-ink" : "text-graphite",
                  )}
                >
                  <FlagIcon locale={l} />
                  <span className="flex-1">{localeNames[l]}</span>
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
