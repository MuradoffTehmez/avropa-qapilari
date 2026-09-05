import { cn } from "@/lib/utils";
import { brand } from "@/config/brand";

/**
 * EuroPorta işarəsi — loqonun vektor variantı.
 * Portal çərçivəsi, açıq qapı və pilləli baza; qızıl detallar, navy panel.
 * Raster loqo `public/brand/` qovluğundadır (og-image və çap üçün).
 */
export function LogoMark({
  size = 32,
  className,
  tone = "ink",
}: {
  size?: number;
  className?: string;
  /** `paper` — tünd fonlar üçün açıq variant */
  tone?: "ink" | "paper";
}) {
  const panel = tone === "paper" ? "#0b1d34" : "#0b1d34";
  const panelDeep = tone === "paper" ? "#071322" : "#071322";
  const void_ = tone === "paper" ? "#0b1d34" : "#ffffff";
  const uid = `ep-${tone}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 56 56"
      fill="none"
      aria-hidden
      className={cn("shrink-0", className)}
    >
      <defs>
        <linearGradient id={`${uid}-gold`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e8c17a" />
          <stop offset="42%" stopColor="#d3a54f" />
          <stop offset="100%" stopColor="#8f6529" />
        </linearGradient>
        <linearGradient id={`${uid}-goldFlat`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#d3a54f" />
          <stop offset="50%" stopColor="#e8c17a" />
          <stop offset="100%" stopColor="#a87c33" />
        </linearGradient>
      </defs>

      {/* Xarici portal — qızıl kontur, navy dolğu */}
      <path
        d="M28 2.5 46.5 13v33.5h-37V13z"
        fill={panel}
        stroke={`url(#${uid}-gold)`}
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Daxili portal çərçivəsi */}
      <path
        d="M28 12.5 39 18.7v27.8H17V18.7z"
        fill={void_}
        stroke={`url(#${uid}-goldFlat)`}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />

      {/* Açıq qapı qanadı */}
      <path d="M27.4 19.6 36.6 22v24.5h-9.2z" fill={panel} />
      <path d="M27.4 19.6 36.6 22" stroke={panelDeep} strokeWidth="0.8" />

      {/* Qızıl bar dəstək */}
      <rect x="29.1" y="28" width="1.7" height="11" rx="0.85" fill={`url(#${uid}-goldFlat)`} />

      {/* Pilləli baza */}
      <rect x="15" y="46.5" width="26" height="2.6" fill={`url(#${uid}-goldFlat)`} />
      <rect x="11" y="49.1" width="34" height="2.6" fill={`url(#${uid}-gold)`} />
      <rect x="6.5" y="51.7" width="43" height="2.8" rx="0.6" fill={`url(#${uid}-goldFlat)`} />
    </svg>
  );
}

/** Söz nişanı — "Euro" navy, "Porta" qızıl. */
export function LogoWordmark({
  className,
  tone = "ink",
}: {
  className?: string;
  tone?: "ink" | "paper";
}) {
  return (
    <span className={cn("font-semibold tracking-[-0.01em]", className)}>
      <span className={tone === "paper" ? "text-paper" : "text-ink"}>Euro</span>
      <span className="text-gold-500">Porta</span>
    </span>
  );
}

export function Logo({
  className,
  tone = "ink",
  compact = false,
  showTagline = true,
  tagline,
}: {
  className?: string;
  tone?: "ink" | "paper";
  compact?: boolean;
  showTagline?: boolean;
  /** Dilə uyğun slogan; verilməzsə brend sloganı istifadə olunur. */
  tagline?: string;
}) {
  return (
    <span className={cn("flex items-center gap-2 sm:gap-2.5", className)}>
      <LogoMark tone={tone} size={compact ? 26 : 32} />
      <span className="flex min-w-0 flex-col leading-none">
        <LogoWordmark tone={tone} className={compact ? "text-[15px]" : "text-[17px] sm:text-[19px]"} />
        {showTagline && !compact && (
          <span
            className={cn(
              "mt-[3px] truncate text-[8.5px] font-medium uppercase tracking-[0.2em]",
              tone === "paper" ? "text-paper/45" : "text-stone",
            )}
          >
            {tagline ?? brand.slogan}
          </span>
        )}
      </span>
    </span>
  );
}
