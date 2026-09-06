"use client";

import type { ReactNode } from "react";

import type { Dictionary } from "@/i18n";
import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/layout/Logo";
import { DoorKeyAnimation, type DoorState } from "@/components/account/DoorKeyAnimation";

/**
 * Giriş ekranlarının ortaq qabığı.
 * Sol tərəfdə qapı–açar vizualı, sağda forma.
 * `tone="ink"` idarəetmə paneli girişi üçündür.
 */
export function AuthShell({
  title,
  text,
  eyebrow,
  doorState,
  tone = "paper",
  aside,
  children,
}: {
  title: string;
  text: string;
  eyebrow?: string;
  doorState: DoorState;
  tone?: "paper" | "ink";
  aside?: ReactNode;
  children: ReactNode;
}) {
  const dark = tone === "ink";

  return (
    <div className={cn("relative isolate", dark ? "bg-obsidian text-paper" : "bg-bone")}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: "repeating-linear-gradient(90deg,currentColor 0 1px,transparent 1px 88px)",
        }}
      />

      <div className="container-page relative grid min-h-[calc(100dvh-4rem)] items-center gap-8 py-10 lg:grid-cols-[1fr_minmax(0,26rem)] lg:gap-16 lg:py-14">
        {/* Vizual + dəyər təklifi */}
        <div className="order-2 lg:order-1">
          <div className="grid items-center gap-6 sm:grid-cols-[minmax(0,15rem)_1fr] sm:gap-8">
            <DoorKeyAnimation state={doorState} className="mx-auto w-40 sm:mx-0 sm:w-full" />

            <div>
              {eyebrow && (
                <p
                  className={cn(
                    "text-[11px] font-semibold uppercase tracking-[0.22em]",
                    dark ? "text-gold-300" : "text-gold-600",
                  )}
                >
                  {eyebrow}
                </p>
              )}
              <h1
                className={cn(
                  "font-display mt-3 text-balance-heading text-[1.7rem] font-semibold leading-tight sm:text-[2.1rem]",
                  dark ? "text-paper" : "text-ink",
                )}
              >
                {title}
              </h1>
              <p
                className={cn(
                  "mt-3 max-w-md text-[14.5px] leading-relaxed",
                  dark ? "text-paper/60" : "text-stone",
                )}
              >
                {text}
              </p>
              {aside}
            </div>
          </div>
        </div>

        {/* Forma */}
        <div
          className={cn(
            "order-1 border p-5 sm:p-7 lg:order-2",
            dark ? "border-paper/12 bg-paper/[0.03]" : "border-line bg-paper",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/** Forma başlığı — loqo işarəsi ilə. */
export function AuthHeading({
  label,
  dict,
  tone = "paper",
}: {
  label: string;
  dict: Dictionary;
  tone?: "paper" | "ink";
}) {
  const dark = tone === "ink";
  return (
    <div className="mb-6 flex items-center gap-3">
      <LogoMark size={30} tone={dark ? "paper" : "ink"} />
      <div>
        <p className={cn("text-[15px] font-semibold", dark ? "text-paper" : "text-ink")}>{label}</p>
        <p className={cn("text-xs", dark ? "text-paper/50" : "text-stone")}>
          {dict.meta.titleSuffix}
        </p>
      </div>
    </div>
  );
}
