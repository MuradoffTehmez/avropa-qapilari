"use client";

import { useState, type ReactNode } from "react";
import { Check, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/* ----------------------------- Accordion ------------------------------- */

export function Accordion({
  items,
  defaultOpen = -1,
  className,
}: {
  items: { id: string; title: string; content: ReactNode }[];
  defaultOpen?: number;
  className?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={cn("divide-y divide-line border-y border-line", className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.id}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 py-4 text-left sm:py-5"
              >
                <span className="text-[15px] font-medium text-ink">{item.title}</span>
                <span className="shrink-0 text-stone">
                  {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                </span>
              </button>
            </h3>
            {isOpen && (
              <div className="pb-5 pr-8 text-sm leading-relaxed text-graphite">{item.content}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* -------------------------------- Tabs --------------------------------- */

export function Tabs({
  tabs,
  className,
}: {
  tabs: { id: string; label: string; content: ReactNode }[];
  className?: string;
}) {
  const [active, setActive] = useState(tabs[0]?.id);
  const current = tabs.find((t) => t.id === active) ?? tabs[0];

  return (
    <div className={className}>
      <div
        role="tablist"
        className="hide-scrollbar -mx-4 flex gap-1 overflow-x-auto border-b border-line px-4 sm:mx-0 sm:px-0"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={tab.id === active}
            onClick={() => setActive(tab.id)}
            className={cn(
              "relative whitespace-nowrap px-3.5 py-3 text-[13px] font-medium transition-colors sm:text-sm",
              tab.id === active ? "text-ink" : "text-stone hover:text-graphite",
            )}
          >
            {tab.label}
            {tab.id === active && (
              <span className="absolute inset-x-3 -bottom-px h-[2px] bg-ink" />
            )}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="pt-6 sm:pt-8">
        {current?.content}
      </div>
    </div>
  );
}

/* ------------------------------ Stepper -------------------------------- */

export function Stepper({
  steps,
  current,
  onSelect,
  className,
}: {
  steps: string[];
  current: number;
  onSelect?: (index: number) => void;
  className?: string;
}) {
  return (
    <ol className={cn("hide-scrollbar flex gap-1 overflow-x-auto", className)}>
      {steps.map((label, i) => {
        const state = i < current ? "done" : i === current ? "current" : "pending";
        const clickable = onSelect && i <= current;

        return (
          <li key={label} className="shrink-0">
            <button
              type="button"
              disabled={!clickable}
              onClick={() => clickable && onSelect?.(i)}
              aria-current={state === "current" ? "step" : undefined}
              className={cn(
                "flex items-center gap-2 border-b-2 px-3 py-2.5 text-[13px] transition-colors",
                state === "current" && "border-ink text-ink",
                state === "done" && "border-brass-400 text-graphite hover:text-ink",
                state === "pending" && "border-line text-mist",
                !clickable && "cursor-default",
              )}
            >
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold",
                  state === "current" && "bg-ink text-paper",
                  state === "done" && "bg-brass-400 text-paper",
                  state === "pending" && "border border-line text-mist",
                )}
              >
                {state === "done" ? <Check size={11} strokeWidth={3} /> : i + 1}
              </span>
              <span className="whitespace-nowrap font-medium">{label}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

/* ---------------------------- Vertical steps --------------------------- */

export function Timeline({
  items,
  className,
}: {
  items: { label: string; date?: string | null; state: "done" | "current" | "pending" }[];
  className?: string;
}) {
  return (
    <ol className={cn("relative", className)}>
      {items.map((item, i) => (
        <li key={item.label} className="relative flex gap-4 pb-6 last:pb-0">
          {i < items.length - 1 && (
            <span
              aria-hidden
              className={cn(
                "absolute left-[9px] top-5 h-full w-px",
                item.state === "done" ? "bg-brass-400" : "bg-line",
              )}
            />
          )}
          <span
            className={cn(
              "relative z-10 mt-0.5 flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-full border-2 bg-paper",
              item.state === "done" && "border-brass-400 bg-brass-400",
              item.state === "current" && "border-ink",
              item.state === "pending" && "border-line",
            )}
          >
            {item.state === "done" && <Check size={11} strokeWidth={3} className="text-paper" />}
            {item.state === "current" && <span className="h-[7px] w-[7px] rounded-full bg-ink" />}
          </span>
          <span className="min-w-0 flex-1 pt-px">
            <span
              className={cn(
                "block text-sm font-medium",
                item.state === "pending" ? "text-mist" : "text-ink",
              )}
            >
              {item.label}
            </span>
            {item.date && <span className="mt-0.5 block text-xs text-stone">{item.date}</span>}
          </span>
        </li>
      ))}
    </ol>
  );
}
