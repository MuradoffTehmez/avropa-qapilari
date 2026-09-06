"use client";

import { useId, useState, type KeyboardEvent, type ReactNode } from "react";
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
  const accordionId = useId();

  return (
    <div className={cn("divide-y divide-line border-y border-line", className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.id}>
            <h3>
              <button
                id={`${accordionId}-trigger-${i}`}
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                aria-controls={`${accordionId}-panel-${i}`}
                className="flex w-full items-center justify-between gap-4 py-4 text-left sm:py-5"
              >
                <span className="text-[15px] font-medium text-ink">{item.title}</span>
                <span className="shrink-0 text-stone">
                  {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                </span>
              </button>
            </h3>
            <div
              id={`${accordionId}-panel-${i}`}
              role="region"
              aria-labelledby={`${accordionId}-trigger-${i}`}
              aria-hidden={!isOpen}
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-300",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <div className="pb-5 pr-8 text-sm leading-relaxed text-graphite">{item.content}</div>
              </div>
            </div>
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
  const tabsId = useId();
  const current = tabs.find((t) => t.id === active) ?? tabs[0];

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const nextIndex =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? tabs.length - 1
          : (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    const next = tabs[nextIndex];
    if (!next) return;
    setActive(next.id);
    document.getElementById(`${tabsId}-tab-${next.id}`)?.focus();
  }

  return (
    <div className={className}>
      <div
        role="tablist"
        className="hide-scrollbar -mx-4 flex gap-1 overflow-x-auto border-b border-line px-4 sm:mx-0 sm:px-0"
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            id={`${tabsId}-tab-${tab.id}`}
            role="tab"
            aria-selected={tab.id === active}
            aria-controls={`${tabsId}-panel-${tab.id}`}
            tabIndex={tab.id === active ? 0 : -1}
            onClick={() => setActive(tab.id)}
            onKeyDown={(event) => onTabKeyDown(event, index)}
            className={cn(
              "relative inline-flex min-h-11 items-center whitespace-nowrap px-3.5 py-3 text-[13px] font-medium transition-colors sm:min-h-0 sm:text-sm",
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
      <div
        id={`${tabsId}-panel-${current?.id}`}
        role="tabpanel"
        aria-labelledby={`${tabsId}-tab-${current?.id}`}
        tabIndex={0}
        className="pt-6 outline-none sm:pt-8"
      >
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
                state === "done" && "border-gold-400 text-graphite hover:text-ink",
                state === "pending" && "border-line text-mist",
                !clickable && "cursor-default",
              )}
            >
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold",
                  state === "current" && "bg-ink text-paper",
                  state === "done" && "bg-gold-400 text-paper",
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
                item.state === "done" ? "bg-gold-400" : "bg-line",
              )}
            />
          )}
          <span
            className={cn(
              "relative z-10 mt-0.5 flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-full border-2 bg-paper",
              item.state === "done" && "border-gold-400 bg-gold-400",
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
