"use client";

import type { ComponentProps, ReactElement, ReactNode } from "react";
import { cloneElement, isValidElement, useId } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const control =
  "w-full rounded-[3px] border border-line bg-paper px-3.5 text-sm text-ink transition-colors placeholder:text-mist hover:border-mist focus:border-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-gold-500 focus-visible:outline-offset-1";

export function Field({
  label,
  hint,
  error,
  required,
  children,
  className,
}: {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  const fieldId = useId();
  const messageId = `${fieldId}-message`;
  const child = isValidElement<Record<string, unknown>>(children) ? children : null;
  const controlChild = child
    ? cloneElement(child as ReactElement<Record<string, unknown>>, {
        id: child.props.id ?? fieldId,
        "aria-invalid": error ? true : child.props["aria-invalid"],
        "aria-describedby": error || hint ? messageId : child.props["aria-describedby"],
      })
    : children;
  return (
    <label htmlFor={fieldId} className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <span className="text-[13px] font-medium text-graphite">
          {label}
          {required && <span className="ml-0.5 text-danger">*</span>}
        </span>
      )}
      {controlChild}
      {error ? (
        <span id={messageId} role="alert" className="text-xs text-danger">{error}</span>
      ) : hint ? (
        <span id={messageId} className="text-xs text-stone">{hint}</span>
      ) : null}
    </label>
  );
}

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(control, "h-11", className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(control, "min-h-28 resize-y py-3", className)} {...props} />;
}

export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <div className="relative">
      <select className={cn(control, "h-11 appearance-none pr-9", className)} {...props}>
        {children}
      </select>
      <ChevronDown
        size={15}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone"
        aria-hidden
      />
    </div>
  );
}

export function Checkbox({
  label,
  description,
  className,
  ...props
}: { label: ReactNode; description?: string } & ComponentProps<"input">) {
  const id = useId();
  return (
    <label
      htmlFor={id}
      className={cn(
        "group flex min-h-11 cursor-pointer items-center gap-2.5 text-sm text-graphite",
        className,
      )}
    >
      <span className="relative mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center">
        <input
          id={id}
          type="checkbox"
          className="peer h-[18px] w-[18px] appearance-none rounded-[2px] border border-mist bg-paper transition-colors checked:border-ink checked:bg-ink focus-visible:outline-2 focus-visible:outline-gold-500 focus-visible:outline-offset-1"
          {...props}
        />
        <Check
          size={12}
          strokeWidth={3}
          className="pointer-events-none absolute text-paper opacity-0 peer-checked:opacity-100"
          aria-hidden
        />
      </span>
      <span className="leading-snug">
        <span className="group-hover:text-ink">{label}</span>
        {description && <span className="block text-xs text-stone">{description}</span>}
      </span>
    </label>
  );
}

export function RadioCard({
  label,
  description,
  price,
  badge,
  disabled,
  reason,
  checked,
  className,
  ...props
}: {
  label: ReactNode;
  description?: string;
  price?: ReactNode;
  badge?: string;
  disabled?: boolean;
  reason?: string;
  checked?: boolean;
} & ComponentProps<"input">) {
  const id = useId();
  return (
    <label
      htmlFor={id}
      aria-disabled={disabled}
      className={cn(
        "relative flex cursor-pointer items-start gap-3 border p-3.5 transition-colors",
        checked ? "border-ink bg-bone" : "border-line bg-paper hover:border-mist",
        disabled && "cursor-not-allowed opacity-45 hover:border-line",
        className,
      )}
    >
      <input
        id={id}
        type="radio"
        checked={checked}
        disabled={disabled}
        className="sr-only"
        {...props}
      />
      <span
        className={cn(
          "mt-0.5 flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-full border transition-colors",
          checked ? "border-ink" : "border-mist",
        )}
      >
        {checked && <span className="h-[9px] w-[9px] rounded-full bg-ink" />}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-ink">{label}</span>
          {badge && (
            <span className="rounded-[2px] bg-gold-100 px-1.5 py-px text-[10px] font-semibold uppercase tracking-wider text-gold-700">
              {badge}
            </span>
          )}
        </span>
        {description && <span className="mt-0.5 block text-xs leading-relaxed text-stone">{description}</span>}
        {disabled && reason && (
          <span className="mt-1 block text-xs text-danger">{reason}</span>
        )}
      </span>

      {price !== undefined && (
        <span className="shrink-0 text-sm font-medium tabular-nums text-graphite">{price}</span>
      )}
    </label>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  className,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn("group flex min-h-11 items-center gap-2.5 text-sm text-graphite", className)}
    >
      <span
        className={cn(
          "relative h-[20px] w-[34px] rounded-full border transition-colors",
          checked ? "border-ink bg-ink" : "border-mist bg-sand",
        )}
      >
        <span
          className={cn(
            "absolute top-[2px] h-[14px] w-[14px] rounded-full bg-paper transition-[left]",
            checked ? "left-[17px]" : "left-[2px]",
          )}
        />
      </span>
      <span className="group-hover:text-ink">{label}</span>
    </button>
  );
}

export function Swatch({
  hex,
  swatch,
  label,
  selected,
  disabled,
  onClick,
  className,
}: {
  hex?: string;
  swatch?: string;
  label: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      aria-pressed={selected}
      className={cn(
        "relative h-11 w-11 shrink-0 rounded-[3px] border transition-transform",
        selected ? "border-ink ring-1 ring-ink ring-offset-2 ring-offset-paper" : "border-line hover:scale-105",
        disabled && "cursor-not-allowed opacity-35",
        className,
      )}
      style={{ background: swatch ?? hex }}
    >
      {selected && (
        <Check
          size={15}
          strokeWidth={3}
          className="absolute inset-0 m-auto text-paper mix-blend-difference"
          aria-hidden
        />
      )}
    </button>
  );
}
