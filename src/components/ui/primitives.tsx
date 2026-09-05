import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ChevronRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------- Badge --------------------------------- */

type BadgeTone = "neutral" | "dark" | "brass" | "success" | "warning" | "danger" | "info" | "outline";

const badgeTones: Record<BadgeTone, string> = {
  neutral: "bg-sand text-graphite",
  dark: "bg-ink text-paper",
  brass: "bg-brass-100 text-brass-700",
  success: "bg-[#e8f2ec] text-success",
  warning: "bg-[#faf1de] text-warning",
  danger: "bg-[#f7e9e8] text-danger",
  info: "bg-[#e7eef3] text-info",
  outline: "border border-line text-graphite",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-[2px] px-2 py-[3px] text-[11px] font-medium uppercase tracking-[0.08em]",
        badgeTones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------- Layout -------------------------------- */

export function Section({
  className,
  children,
  tone = "paper",
  ...props
}: { tone?: "paper" | "bone" | "ink" } & ComponentProps<"section">) {
  return (
    <section
      className={cn(
        "py-14 sm:py-20 lg:py-24",
        tone === "bone" && "bg-bone",
        tone === "ink" && "bg-ink text-paper",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  text,
  align = "left",
  action,
  invert,
  className,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  align?: "left" | "center";
  action?: ReactNode;
  invert?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "sm:flex-col sm:items-center sm:text-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
        {eyebrow && (
          <p
            className={cn(
              "mb-3 text-[11px] font-semibold uppercase tracking-[0.22em]",
              invert ? "text-brass-300" : "text-brass-600",
            )}
          >
            {eyebrow}
          </p>
        )}
        <h2
          className={cn(
            "text-balance-heading text-2xl font-semibold leading-[1.15] tracking-tight sm:text-3xl lg:text-[2.5rem]",
            invert ? "text-paper" : "text-ink",
          )}
        >
          {title}
        </h2>
        {text && (
          <p
            className={cn(
              "mt-3 text-[15px] leading-relaxed",
              invert ? "text-paper/65" : "text-stone",
            )}
          >
            {text}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* -------------------------------- Card --------------------------------- */

export function Card({ className, children, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("border border-line bg-paper", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function Divider({ className }: { className?: string }) {
  return <hr className={cn("border-0 border-t border-line", className)} />;
}

/* ------------------------------- Rating -------------------------------- */

export function Rating({
  value,
  count,
  size = 14,
  className,
}: {
  value: number;
  count?: number;
  size?: number;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[13px]", className)}>
      <Star size={size} className="fill-brass-400 text-brass-400" aria-hidden />
      <span className="font-medium text-ink">{value.toFixed(1)}</span>
      {count !== undefined && <span className="text-stone">({count})</span>}
    </span>
  );
}

/* ----------------------------- Breadcrumbs ----------------------------- */

export function Breadcrumbs({
  items,
  className,
}: {
  items: { label: string; href?: string }[];
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex flex-wrap items-center gap-1 text-[13px]", className)}>
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`} className="flex items-center gap-1">
          {i > 0 && <ChevronRight size={13} className="text-mist" aria-hidden />}
          {item.href ? (
            <Link href={item.href} className="text-stone transition-colors hover:text-ink">
              {item.label}
            </Link>
          ) : (
            <span className="text-ink">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

/* ----------------------------- Empty state ----------------------------- */

export function EmptyState({
  icon,
  title,
  text,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  text?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center border border-dashed border-line bg-bone/50 px-6 py-16 text-center",
        className,
      )}
    >
      {icon && <div className="mb-4 text-mist">{icon}</div>}
      <h3 className="text-lg font-medium text-ink">{title}</h3>
      {text && <p className="mt-2 max-w-sm text-sm leading-relaxed text-stone">{text}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

/* ------------------------------ Data list ------------------------------ */

export function DataRow({
  label,
  value,
  className,
}: {
  label: string;
  value: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-6 border-b border-line py-2.5 text-sm last:border-b-0",
        className,
      )}
    >
      <dt className="text-stone">{label}</dt>
      <dd className="text-right font-medium text-ink">{value}</dd>
    </div>
  );
}

/* ------------------------------ Skeleton ------------------------------- */

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-[2px] bg-sand", className)} />;
}

/* ------------------------------- Notice -------------------------------- */

export function Notice({
  tone = "info",
  title,
  children,
  className,
}: {
  tone?: "info" | "warning" | "success" | "danger";
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  const tones = {
    info: "border-l-info bg-[#f2f6f9]",
    warning: "border-l-warning bg-[#fbf6ea]",
    success: "border-l-success bg-[#eff5f2]",
    danger: "border-l-danger bg-[#faf0ef]",
  } as const;

  return (
    <div className={cn("border border-line border-l-2 px-4 py-3 text-[13px] leading-relaxed", tones[tone], className)}>
      {title && <p className="mb-1 font-semibold text-ink">{title}</p>}
      <div className="text-graphite">{children}</div>
    </div>
  );
}

/* ------------------------------ Stat tile ------------------------------ */

export function Stat({
  label,
  value,
  hint,
  invert,
  className,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  invert?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex h-full flex-col justify-end", className)}>
      <p
        className={cn(
          "text-[11px] font-semibold uppercase leading-tight tracking-[0.16em]",
          invert ? "text-paper/45" : "text-stone",
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "mt-1.5 text-2xl font-semibold tracking-tight tabular-nums sm:text-[1.75rem]",
          invert ? "text-paper" : "text-ink",
        )}
      >
        {value}
      </p>
      {hint && (
        <p className={cn("mt-1 text-xs", invert ? "text-paper/45" : "text-stone")}>{hint}</p>
      )}
    </div>
  );
}
