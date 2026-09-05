import { cn } from "@/lib/utils";
import { brand } from "@/config/brand";

/**
 * DEMO LOGO — rəsmi loqo hazır olmadığı üçün müvəqqəti işarə.
 * Konsept: qapı açırımı + astana xətti (arxitektura motivi).
 * Real loqo gələndə yalnız bu komponent əvəzlənəcək.
 */
export function LogoMark({
  size = 28,
  className,
  tone = "ink",
}: {
  size?: number;
  className?: string;
  tone?: "ink" | "paper";
}) {
  const stroke = tone === "paper" ? "#ffffff" : "#1a1917";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      className={cn("shrink-0", className)}
    >
      <rect x="4.5" y="2.5" width="23" height="27" stroke={stroke} strokeWidth="1.6" />
      <rect x="9" y="7" width="14" height="18" fill="#a9844a" opacity="0.14" />
      <path d="M9 7h14v18H9z" stroke={stroke} strokeWidth="1.2" />
      <path d="M9 13.5h14M9 18.5h14" stroke={stroke} strokeWidth="0.9" opacity="0.5" />
      <circle cx="20.4" cy="16" r="1.35" fill="#a9844a" />
      <path d="M2 29.5h28" stroke={stroke} strokeWidth="1.6" strokeLinecap="square" />
    </svg>
  );
}

export function Logo({
  className,
  tone = "ink",
  compact = false,
}: {
  className?: string;
  tone?: "ink" | "paper";
  compact?: boolean;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark tone={tone} size={compact ? 24 : 28} />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-semibold tracking-[0.02em]",
            compact ? "text-[15px]" : "text-[17px]",
            tone === "paper" ? "text-paper" : "text-ink",
          )}
        >
          {brand.name}
        </span>
        {!compact && (
          <span
            className={cn(
              "mt-[3px] text-[9px] font-medium uppercase tracking-[0.24em]",
              tone === "paper" ? "text-paper/50" : "text-stone",
            )}
          >
            {brand.tagline}
          </span>
        )}
      </span>
    </span>
  );
}
