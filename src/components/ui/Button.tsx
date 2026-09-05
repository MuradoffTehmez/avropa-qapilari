import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger" | "gold";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium tracking-tight transition-[background,color,border-color,transform] duration-200 disabled:pointer-events-none disabled:opacity-45 select-none rounded-[3px] whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-paper hover:bg-obsidian active:translate-y-px border border-ink",
  secondary:
    "bg-bone text-ink border border-line hover:bg-sand hover:border-mist active:translate-y-px",
  outline:
    "bg-transparent text-ink border border-ink/25 hover:border-ink hover:bg-ink/[0.03] active:translate-y-px",
  ghost: "bg-transparent text-graphite hover:text-ink hover:bg-bone",
  danger: "bg-danger text-paper border border-danger hover:brightness-110",
  gold:
    "bg-gold-500 text-paper border border-gold-500 hover:bg-gold-600 hover:border-gold-600 active:translate-y-px",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[13px]",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-[15px]",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  full?: boolean;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  full,
  className,
  children,
  ...props
}: CommonProps & ComponentProps<"button">) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], full && "w-full", className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  full,
  className,
  children,
  href,
  ...props
}: CommonProps & ComponentProps<typeof Link>) {
  return (
    <Link
      href={href}
      className={cn(base, variants[variant], sizes[size], full && "w-full", className)}
      {...props}
    >
      {children}
    </Link>
  );
}

export function IconButton({
  className,
  children,
  label,
  ...props
}: { label: string } & ComponentProps<"button">) {
  return (
    <button
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-[3px] text-graphite transition-colors hover:bg-bone hover:text-ink",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
