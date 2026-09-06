import { useId } from "react";
import { cn } from "@/lib/utils";
import type { SurfaceStyle } from "@/types";

/**
 * DOOR VISUAL "layer-based rendering".
 *
 * Real məhsul fotoları hazır olmadığı üçün qapı proqram şəkildə SVG
 * qatlarından qurulur: base → panel → şüşə → dəstək → kilid → aksesuar.
 * Fotolar R2/Cloudflare Images-ə yüklənəndə bu komponentin daxili
 * <image> qatlarına keçid edəcək — xarici API dəyişməyəcək.
 */

export type GlassKind = "NONE" | "SATIN" | "CLEAR" | "BRONZE" | "TRIPLEX";
export type HandleKind = "INOX" | "BLACK" | "BRASS" | "BAR";
export type SideKind = "LEFT" | "RIGHT";

export interface DoorVisualProps {
  panelHex: string;
  insideHex?: string;
  style?: SurfaceStyle;
  glass?: GlassKind;
  handle?: HandleKind;
  handleHex?: string;
  /** Qat görünüşündə dəstəyi gizlətmək üçün */
  hideHandle?: boolean;
  side?: SideKind;
  smartLock?: boolean;
  viewer?: boolean;
  houseNumber?: boolean;
  /** Panel eni/hündürlüyü nisbətini vizual olaraq əks etdirir */
  widthMm?: number;
  heightMm?: number;
  className?: string;
  /** Ətraf mühit (döşəmə + kölgə) göstərilsin */
  ambient?: boolean;
  priority?: boolean;
}

const glassFill: Record<GlassKind, string> = {
  NONE: "none",
  SATIN: "rgba(226,232,232,0.72)",
  CLEAR: "rgba(186,206,212,0.55)",
  BRONZE: "rgba(168,134,90,0.5)",
  TRIPLEX: "rgba(150,176,183,0.62)",
};

const handleFill: Record<HandleKind, string> = {
  INOX: "#b9bcc0",
  BLACK: "#1b1b1d",
  BRASS: "#a9844a",
  BAR: "#8d9094",
};

function shade(hex: string, amount: number): string {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const num = parseInt(full, 16);
  const r = Math.max(0, Math.min(255, ((num >> 16) & 255) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 255) + amount));
  const b = Math.max(0, Math.min(255, (num & 255) + amount));
  return `rgb(${r},${g},${b})`;
}

export function DoorVisual({
  panelHex,
  style = "MODERN",
  glass = "NONE",
  handle = "INOX",
  handleHex,
  hideHandle = false,
  side = "RIGHT",
  smartLock = false,
  viewer = false,
  houseNumber = false,
  widthMm = 960,
  heightMm = 2050,
  className,
  ambient = true,
}: DoorVisualProps) {
  const uid = useId().replace(/[^a-z0-9]/gi, "");

  // Vizual proporsiya: geniş qapılar daha enli görünür
  const ratio = widthMm / heightMm;
  const panelW = Math.round(190 * (ratio / (960 / 2050)));
  const clampedW = Math.max(150, Math.min(250, panelW));
  const panelX = (300 - clampedW) / 2;
  const panelY = 26;
  const panelH = 348;

  const handleColor = handleHex ?? handleFill[handle];
  const isRight = side === "RIGHT";
  // Menteşə açılma tərəfində, dəstək əks tərəfdə
  const handleX = isRight ? panelX + clampedW - 16 : panelX + 16;
  const hingeX = isRight ? panelX + 5 : panelX + clampedW - 5;

  const light = shade(panelHex, 22);
  const dark = shade(panelHex, -26);
  const deeper = shade(panelHex, -46);

  return (
    <svg
      viewBox="0 0 300 400"
      role="img"
      aria-label="Qapı önizləməsi"
      className={cn("h-full w-full", className)}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id={`panel-${uid}`} x1="0" y1="0" x2="1" y2="0.35">
          <stop offset="0%" stopColor={light} />
          <stop offset="45%" stopColor={panelHex} />
          <stop offset="100%" stopColor={dark} />
        </linearGradient>
        <linearGradient id={`frame-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={deeper} />
          <stop offset="50%" stopColor={dark} />
          <stop offset="100%" stopColor={deeper} />
        </linearGradient>
        <linearGradient id={`glass-${uid}`} x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
          <stop offset="55%" stopColor={glassFill[glass]} />
          <stop offset="100%" stopColor="rgba(255,255,255,0.18)" />
        </linearGradient>
        <linearGradient id={`floor-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(0,0,0,0.10)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </linearGradient>
        <filter id={`soft-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="7" floodColor="#0e0e0d" floodOpacity="0.16" />
        </filter>
      </defs>

      {/* Ambient: divar + döşəmə kölgəsi */}
      {ambient && (
        <>
          <rect x="0" y="0" width="300" height="400" fill="transparent" />
          <ellipse
            cx="150"
            cy="382"
            rx={clampedW * 0.78}
            ry="12"
            fill={`url(#floor-${uid})`}
          />
        </>
      )}

      {/* Çərçivə */}
      <g filter={`url(#soft-${uid})`}>
        <rect
          x={panelX - 12}
          y={panelY - 12}
          width={clampedW + 24}
          height={panelH + 12}
          rx="2"
          fill={`url(#frame-${uid})`}
        />
        {/* Panel */}
        <rect
          x={panelX}
          y={panelY}
          width={clampedW}
          height={panelH}
          rx="1"
          fill={`url(#panel-${uid})`}
        />
      </g>

      {/* Stil naxışı */}
      <StylePattern
        style={style}
        x={panelX}
        y={panelY}
        w={clampedW}
        h={panelH}
        light={light}
        dark={deeper}
      />

      {/* Şüşə */}
      {glass !== "NONE" && (
        <GlassInsert
          style={style}
          x={panelX}
          y={panelY}
          w={clampedW}
          h={panelH}
          fill={`url(#glass-${uid})`}
          stroke={deeper}
        />
      )}

      {/* Menteşələr */}
      {[panelY + 40, panelY + panelH / 2, panelY + panelH - 40].map((cy) => (
        <rect
          key={cy}
          x={hingeX - 2}
          y={cy - 9}
          width="4"
          height="18"
          rx="2"
          fill={shade(panelHex, -60)}
          opacity="0.85"
        />
      ))}

      {/* Dəstək */}
      {hideHandle ? null : handle === "BAR" ? (
        <g>
          <rect
            x={handleX - 3}
            y={panelY + 70}
            width="6"
            height={panelH - 140}
            rx="3"
            fill={handleColor}
          />
          <rect x={handleX - 5} y={panelY + 74} width="10" height="4" rx="2" fill={shade(handleColor === "#1b1b1d" ? "#1b1b1d" : handleColor, -30)} />
        </g>
      ) : (
        <g>
          <rect
            x={isRight ? handleX - 22 : handleX - 2}
            y={panelY + panelH / 2 - 3}
            width="24"
            height="6"
            rx="3"
            fill={handleColor}
          />
          <circle cx={handleX} cy={panelY + panelH / 2} r="5.5" fill={shade(handleColor, -18)} />
        </g>
      )}

      {/* Kilid silindri */}
      <circle
        cx={isRight ? handleX - 4 : handleX + 4}
        cy={panelY + panelH / 2 + 24}
        r="3.4"
        fill={shade(panelHex, -70)}
      />

      {/* Smart lock klaviaturası */}
      {smartLock && (
        <g>
          <rect
            x={isRight ? handleX - 32 : handleX + 8}
            y={panelY + panelH / 2 - 52}
            width="24"
            height="36"
            rx="4"
            fill="#131315"
            stroke={shade(panelHex, -70)}
            strokeWidth="0.6"
          />
          <rect
            x={isRight ? handleX - 28 : handleX + 12}
            y={panelY + panelH / 2 - 47}
            width="16"
            height="11"
            rx="2"
            fill="#2f6f5e"
            opacity="0.9"
          />
          {[0, 1, 2].map((r) =>
            [0, 1, 2].map((c) => (
              <circle
                key={`${r}-${c}`}
                cx={(isRight ? handleX - 26 : handleX + 14) + c * 5.5}
                cy={panelY + panelH / 2 - 31 + r * 5.5}
                r="1.5"
                fill="#5c5c60"
              />
            )),
          )}
        </g>
      )}

      {/* Rəqəmsal göz */}
      {viewer && (
        <g>
          <circle
            cx={panelX + clampedW / 2}
            cy={panelY + 118}
            r="7"
            fill="#17171a"
            stroke={shade(panelHex, -60)}
            strokeWidth="0.8"
          />
          <circle cx={panelX + clampedW / 2} cy={panelY + 118} r="3" fill="#3a4c52" />
        </g>
      )}

      {/* Mənzil nömrəsi */}
      {houseNumber && (
        <text
          x={panelX + clampedW / 2}
          y={panelY + 58}
          textAnchor="middle"
          fontSize="15"
          fontWeight="500"
          letterSpacing="2"
          fill={shade(panelHex, 70)}
          opacity="0.85"
        >
          48
        </text>
      )}
    </svg>
  );
}

function StylePattern({
  style,
  x,
  y,
  w,
  h,
  light,
  dark,
}: {
  style: SurfaceStyle;
  x: number;
  y: number;
  w: number;
  h: number;
  light: string;
  dark: string;
}) {
  const inset = 18;

  if (style === "MINIMAL") {
    return (
      <line
        x1={x + w * 0.28}
        y1={y + inset}
        x2={x + w * 0.28}
        y2={y + h - inset}
        stroke={dark}
        strokeWidth="1.2"
        opacity="0.5"
      />
    );
  }

  if (style === "MODERN") {
    return (
      <g opacity="0.55">
        {Array.from({ length: 7 }).map((_, i) => {
          const ly = y + inset + 14 + i * ((h - inset * 2 - 14) / 7);
          return (
            <g key={i}>
              <line x1={x + inset} y1={ly} x2={x + w - inset} y2={ly} stroke={dark} strokeWidth="1.4" />
              <line x1={x + inset} y1={ly + 1.6} x2={x + w - inset} y2={ly + 1.6} stroke={light} strokeWidth="0.7" opacity="0.5" />
            </g>
          );
        })}
      </g>
    );
  }

  if (style === "LOFT") {
    const cols = 2;
    const rows = 4;
    const gx = (w - inset * 2) / cols;
    const gy = (h - inset * 2) / rows;
    return (
      <g opacity="0.7">
        <rect x={x + inset} y={y + inset} width={w - inset * 2} height={h - inset * 2} fill="none" stroke={dark} strokeWidth="2" />
        {Array.from({ length: cols - 1 }).map((_, i) => (
          <line key={`c${i}`} x1={x + inset + gx * (i + 1)} y1={y + inset} x2={x + inset + gx * (i + 1)} y2={y + h - inset} stroke={dark} strokeWidth="2" />
        ))}
        {Array.from({ length: rows - 1 }).map((_, i) => (
          <line key={`r${i}`} x1={x + inset} y1={y + inset + gy * (i + 1)} x2={x + w - inset} y2={y + inset + gy * (i + 1)} stroke={dark} strokeWidth="2" />
        ))}
      </g>
    );
  }

  // CLASSIC / NEOCLASSIC — qabarıq panellər
  const panels = style === "NEOCLASSIC" ? 3 : 2;
  const gap = 14;
  const ph = (h - inset * 2 - gap * (panels - 1)) / panels;

  return (
    <g>
      {Array.from({ length: panels }).map((_, i) => {
        const py = y + inset + i * (ph + gap);
        return (
          <g key={i}>
            <rect x={x + inset} y={py} width={w - inset * 2} height={ph} fill="none" stroke={dark} strokeWidth="1.6" opacity="0.6" />
            <rect x={x + inset + 6} y={py + 6} width={w - inset * 2 - 12} height={ph - 12} fill="none" stroke={light} strokeWidth="1" opacity="0.45" />
            {style === "NEOCLASSIC" && (
              <circle cx={x + w / 2} cy={py + ph / 2} r="6" fill="none" stroke={dark} strokeWidth="1" opacity="0.45" />
            )}
          </g>
        );
      })}
    </g>
  );
}

function GlassInsert({
  style,
  x,
  y,
  w,
  h,
  fill,
  stroke,
}: {
  style: SurfaceStyle;
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
  stroke: string;
}) {
  if (style === "LOFT") {
    return <rect x={x + 20} y={y + 20} width={w - 40} height={h - 40} fill={fill} opacity="0.9" />;
  }

  if (style === "MINIMAL" || style === "MODERN") {
    return (
      <g>
        <rect x={x + w * 0.62} y={y + 34} width={w * 0.2} height={h - 68} fill={fill} stroke={stroke} strokeWidth="1.2" />
        <line x1={x + w * 0.62} y1={y + 34 + (h - 68) / 2} x2={x + w * 0.82} y2={y + 34 + (h - 68) / 2} stroke={stroke} strokeWidth="1" opacity="0.6" />
      </g>
    );
  }

  return (
    <g>
      <rect x={x + 26} y={y + 26} width={w - 52} height={h * 0.3} fill={fill} stroke={stroke} strokeWidth="1.4" />
      <line x1={x + w / 2} y1={y + 26} x2={x + w / 2} y2={y + 26 + h * 0.3} stroke={stroke} strokeWidth="1" opacity="0.7" />
    </g>
  );
}
