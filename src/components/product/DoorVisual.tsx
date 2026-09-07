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
export type GlassPattern = "PLAIN" | "LINES" | "VERTICAL" | "GRID" | "EDGE";
export type HingeKind = "STD" | "HEAVY" | "HIDDEN";
export type SidelightKind = "NONE" | "LEFT" | "RIGHT" | "BOTH" | "TRANSOM";
export type DoorFace = "OUTSIDE" | "INSIDE";
export type OpeningKind = "INWARD" | "OUTWARD";
export type FrameKind = "STD" | "TELE" | "WIDE" | "HIDDEN";
export type LockKind = "3P" | "5P" | "MP" | "MOTOR";
export type CylinderKind = "STD" | "KNOB" | "ANTI_DRILL" | "CARD";
export type ThresholdKind = "STD" | "THERMAL" | "LOW" | "DROP";
export type SurfaceTexture = "SOLID" | "WOOD" | "CONCRETE";

export interface DoorVisualProps {
  panelHex: string;
  insideHex?: string;
  texture?: SurfaceTexture;
  insideTexture?: SurfaceTexture;
  face?: DoorFace;
  style?: SurfaceStyle;
  glass?: GlassKind;
  handle?: HandleKind;
  handleHex?: string;
  /** Qat görünüşündə dəstəyi gizlətmək üçün */
  hideHandle?: boolean;
  side?: SideKind;
  glassPattern?: GlassPattern;
  hinge?: HingeKind;
  sidelight?: SidelightKind;
  opening?: OpeningKind;
  frame?: FrameKind;
  lock?: LockKind;
  cylinder?: CylinderKind;
  threshold?: ThresholdKind;
  hidePattern?: boolean;
  hideLock?: boolean;
  hideCylinder?: boolean;
  showThreshold?: boolean;
  showOpeningGuide?: boolean;
  smartLock?: boolean;
  viewer?: boolean;
  houseNumber?: boolean;
  closer?: boolean;
  chain?: boolean;
  letterbox?: boolean;
  kickplate?: boolean;
  bell?: boolean;
  camera?: boolean;
  /** Panel eni/hündürlüyü nisbətini vizual olaraq əks etdirir */
  widthMm?: number;
  heightMm?: number;
  className?: string;
  /** Ekran oxuyucusu üçün ad — dilə uyğun ötürülməlidir. */
  label?: string;
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
  insideHex,
  texture = "SOLID",
  insideTexture,
  face = "OUTSIDE",
  style = "MODERN",
  glass = "NONE",
  handle = "INOX",
  handleHex,
  hideHandle = false,
  side = "RIGHT",
  glassPattern = "PLAIN",
  hinge = "STD",
  sidelight = "NONE",
  opening = "INWARD",
  frame = "STD",
  lock = "3P",
  cylinder = "STD",
  threshold = "STD",
  hidePattern = false,
  hideLock = false,
  hideCylinder = false,
  showThreshold = false,
  showOpeningGuide = false,
  smartLock = false,
  viewer = false,
  houseNumber = false,
  closer = false,
  chain = false,
  letterbox = false,
  kickplate = false,
  bell = false,
  camera = false,
  widthMm = 960,
  heightMm = 2050,
  className,
  label,
  ambient = true,
}: DoorVisualProps) {
  const uid = useId().replace(/[^a-z0-9]/gi, "");

  // Vizual proporsiya: geniş qapılar daha enli görünür
  const ratio = widthMm / heightMm;
  const panelW = Math.round(190 * (ratio / (960 / 2050)));
  const baseW = Math.max(150, Math.min(250, panelW));

  // Yan panel varsa əsas qanad daralır ki, ümumi en dəyişməsin
  const sideCount = sidelight === "BOTH" ? 2 : sidelight === "LEFT" || sidelight === "RIGHT" ? 1 : 0;
  const sideW = sideCount > 0 ? 34 : 0;
  const clampedW = Math.max(110, baseW - sideW * sideCount * 0.75);

  const hasTransom = sidelight === "TRANSOM";
  const transomH = hasTransom ? 44 : 0;

  const totalW = clampedW + sideW * sideCount;
  const groupX = (300 - totalW) / 2;
  const panelX = groupX + (sidelight === "LEFT" || sidelight === "BOTH" ? sideW : 0);
  const panelY = 26 + transomH;
  const panelH = 348 - transomH;

  const handleColor = handleHex ?? handleFill[handle];
  const isRight = face === "INSIDE" ? side !== "RIGHT" : side === "RIGHT";
  // Menteşə açılma tərəfində, dəstək əks tərəfdə
  const handleX = isRight ? panelX + clampedW - 16 : panelX + 16;
  const hingeX = isRight ? panelX + 5 : panelX + clampedW - 5;

  const surfaceHex = face === "INSIDE" ? (insideHex ?? panelHex) : panelHex;
  const surfaceTexture = face === "INSIDE" ? (insideTexture ?? texture) : texture;
  const light = shade(surfaceHex, 22);
  const dark = shade(surfaceHex, -26);
  const deeper = shade(surfaceHex, -46);
  const frameOutset = frame === "HIDDEN" ? 3 : frame === "WIDE" ? 17 : frame === "TELE" ? 14 : 12;

  return (
    <svg
      viewBox="0 0 300 400"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("h-full w-full", className)}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id={`panel-${uid}`} x1="0" y1="0" x2="1" y2="0.35">
          <stop offset="0%" stopColor={light} />
          <stop offset="45%" stopColor={surfaceHex} />
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
        <filter id={`concrete-${uid}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" seed="8" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>

      {/* Ambient: divar + döşəmə kölgəsi */}
      {ambient && (
        <>
          <rect x="0" y="0" width="300" height="400" fill="transparent" />
          <ellipse
            cx="150"
            cy="382"
            rx={(clampedW + sideW * sideCount) * 0.78}
            ry="12"
            fill={`url(#floor-${uid})`}
          />
        </>
      )}

      {/* Yan və üst panellər */}
      {(sideCount > 0 || hasTransom) && (
        <g filter={`url(#soft-${uid})`}>
          {hasTransom && (
            <g>
              <rect
                x={groupX - 12}
                y={14}
                width={totalW + 24}
                height={transomH}
                rx="1"
                fill={`url(#frame-${uid})`}
              />
              <rect
                x={groupX - 4}
                y={20}
                width={totalW + 8}
                height={transomH - 12}
                fill="rgba(226,232,232,0.68)"
                stroke={deeper}
                strokeWidth="1"
              />
            </g>
          )}

          {(sidelight === "LEFT" || sidelight === "BOTH") && (
            <SidePanel
              x={groupX}
              y={panelY}
              w={sideW}
              h={panelH}
              frame={`url(#frame-${uid})`}
              stroke={deeper}
            />
          )}
          {(sidelight === "RIGHT" || sidelight === "BOTH") && (
            <SidePanel
              x={groupX + totalW - sideW}
              y={panelY}
              w={sideW}
              h={panelH}
              frame={`url(#frame-${uid})`}
              stroke={deeper}
            />
          )}
        </g>
      )}

      {/* Çərçivə */}
      <g filter={`url(#soft-${uid})`}>
        <rect
          x={panelX - frameOutset}
          y={panelY - frameOutset}
          width={clampedW + frameOutset * 2}
          height={panelH + frameOutset}
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

      {/* Rəng seçimində göstərilən səth materialı */}
      {surfaceTexture === "WOOD" && (
        <g fill="none" stroke={deeper} strokeWidth="0.8" opacity="0.2">
          {Array.from({ length: 8 }).map((_, index) => {
            const x = panelX + ((index + 1) * clampedW) / 9;
            return (
              <path
                key={index}
                d={`M ${x} ${panelY + 4} C ${x - 4} ${panelY + panelH * 0.28}, ${x + 5} ${panelY + panelH * 0.62}, ${x} ${panelY + panelH - 4}`}
              />
            );
          })}
        </g>
      )}
      {surfaceTexture === "CONCRETE" && (
        <rect
          x={panelX}
          y={panelY}
          width={clampedW}
          height={panelH}
          filter={`url(#concrete-${uid})`}
          opacity="0.09"
        />
      )}

      {/* Stil naxışı */}
      {!hidePattern && (
        <StylePattern
          style={style}
          x={panelX}
          y={panelY}
          w={clampedW}
          h={panelH}
          light={light}
          dark={deeper}
        />
      )}

      {/* Şüşə */}
      {glass !== "NONE" && (
        <GlassInsert
          style={style}
          pattern={glassPattern}
          x={panelX}
          y={panelY}
          w={clampedW}
          h={panelH}
          fill={`url(#glass-${uid})`}
          stroke={deeper}
        />
      )}

      {/* Menteşələr — gizli variantda çəkilmir */}
      {hinge !== "HIDDEN" &&
        (hinge === "HEAVY"
          ? [panelY + 34, panelY + panelH * 0.38, panelY + panelH * 0.62, panelY + panelH - 34]
          : [panelY + 40, panelY + panelH / 2, panelY + panelH - 40]
        ).map((cy) => (
          <rect
            key={cy}
            x={hingeX - (hinge === "HEAVY" ? 2.6 : 2)}
            y={cy - (hinge === "HEAVY" ? 11 : 9)}
            width={hinge === "HEAVY" ? 5.2 : 4}
            height={hinge === "HEAVY" ? 22 : 18}
            rx="2"
            fill={shade(surfaceHex, -60)}
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

      {/* Kilid nöqtələri və silindr tipi */}
      {!hideLock && lock !== "3P" &&
        (lock === "5P" ? [0.22, 0.5, 0.78] : [0.14, 0.32, 0.5, 0.68, 0.86]).map((position) => (
          <rect
            key={position}
            x={isRight ? panelX + clampedW - 3 : panelX}
            y={panelY + panelH * position - 2}
            width="3"
            height="4"
            rx="1"
            fill={lock === "MOTOR" ? "#ad7d38" : shade(surfaceHex, -68)}
          />
        ))}
      {!hideCylinder && <g>
        <circle
          cx={isRight ? handleX - 4 : handleX + 4}
          cy={panelY + panelH / 2 + 24}
          r={cylinder === "ANTI_DRILL" ? 5.2 : 3.8}
          fill={cylinder === "CARD" ? "#ad7d38" : shade(surfaceHex, -70)}
          stroke={cylinder === "ANTI_DRILL" ? "#b9bcc0" : "none"}
          strokeWidth="1.8"
        />
        {cylinder === "KNOB" && (
          <rect
            x={(isRight ? handleX - 4 : handleX + 4) - 1.4}
            y={panelY + panelH / 2 + 16}
            width="2.8"
            height="16"
            rx="1.4"
            fill={handleColor}
          />
        )}
      </g>}

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
            stroke={shade(surfaceHex, -70)}
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
            stroke={shade(surfaceHex, -60)}
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
          fill={shade(surfaceHex, 70)}
          opacity="0.85"
        >
          48
        </text>
      )}

      {/* Astana */}
      {showThreshold && threshold !== "DROP" && (
        <rect
          x={panelX - 3}
          y={panelY + panelH - (threshold === "LOW" ? 3 : 6)}
          width={clampedW + 6}
          height={threshold === "LOW" ? 3 : 6}
          fill={threshold === "THERMAL" ? "#ad7d38" : "#8d9094"}
          opacity="0.92"
        />
      )}

      {/* Aksesuarlar */}
      {closer && (
        <g fill={handleColor}>
          <rect x={panelX + clampedW * 0.34} y={panelY + 14} width={clampedW * 0.32} height="8" rx="2" />
          <path d={`M ${panelX + clampedW * 0.5} ${panelY + 22} L ${panelX + clampedW * 0.72} ${panelY + 34}`} stroke={handleColor} strokeWidth="2" />
        </g>
      )}
      {chain && (
        <path
          d={`M ${isRight ? panelX + 22 : panelX + clampedW - 22} ${panelY + 150} q ${isRight ? 22 : -22} 14 0 30`}
          fill="none"
          stroke="#b9bcc0"
          strokeWidth="2"
          strokeDasharray="2 2"
        />
      )}
      {letterbox && (
        <rect x={panelX + clampedW * 0.28} y={panelY + panelH * 0.66} width={clampedW * 0.44} height="13" rx="2" fill={handleColor} />
      )}
      {kickplate && (
        <rect x={panelX + 8} y={panelY + panelH - 52} width={clampedW - 16} height="38" rx="1" fill={handleColor} opacity="0.72" />
      )}
      {bell && (
        <g>
          <circle cx={isRight ? panelX + clampedW - 18 : panelX + 18} cy={panelY + 92} r="6" fill="#ad7d38" />
          <circle cx={isRight ? panelX + clampedW - 18 : panelX + 18} cy={panelY + 92} r="2" fill="#f4e4bf" />
        </g>
      )}
      {camera && (
        <g>
          <rect x={panelX + clampedW / 2 - 10} y={panelY + 90} width="20" height="13" rx="3" fill="#17171a" />
          <circle cx={panelX + clampedW / 2} cy={panelY + 96.5} r="3" fill="#48616b" />
        </g>
      )}

      {/* İçəri/çölə açılmanı göstərən üst görünüş işarəsi */}
      {showOpeningGuide && <g transform="translate(18 16)" opacity="0.78">
        <path d="M0 18 H24" stroke="#8d9094" strokeWidth="1.5" />
        <path
          d={opening === "INWARD" ? "M2 18 A20 20 0 0 1 22 0" : "M2 18 A20 20 0 0 0 22 36"}
          fill="none"
          stroke="#ad7d38"
          strokeWidth="1.5"
          strokeDasharray="3 2"
        />
        <path d={isRight ? "M23 18 V1" : "M1 18 V1"} stroke="#101f33" strokeWidth="2" />
      </g>}
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

/** Yan sabit panel — şüşəli. */
function SidePanel({
  x,
  y,
  w,
  h,
  frame,
  stroke,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  frame: string;
  stroke: string;
}) {
  return (
    <g>
      <rect x={x - 6} y={y - 12} width={w + 12} height={h + 12} rx="1" fill={frame} />
      <rect
        x={x + 2}
        y={y + 6}
        width={w - 4}
        height={h - 18}
        fill="rgba(226,232,232,0.62)"
        stroke={stroke}
        strokeWidth="1"
      />
      <line
        x1={x + 2}
        y1={y + 6 + (h - 18) / 2}
        x2={x + w - 2}
        y2={y + 6 + (h - 18) / 2}
        stroke={stroke}
        strokeWidth="0.8"
        opacity="0.5"
      />
    </g>
  );
}

function GlassInsert({
  style,
  pattern = "PLAIN",
  x,
  y,
  w,
  h,
  fill,
  stroke,
}: {
  style: SurfaceStyle;
  pattern?: GlassPattern;
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
  stroke: string;
}) {
  /** Şüşə sahəsi — stilə görə mövqe və ölçü. */
  const area =
    style === "LOFT"
      ? { gx: x + 20, gy: y + 20, gw: w - 40, gh: h - 40 }
      : style === "MINIMAL" || style === "MODERN"
        ? { gx: x + w * 0.62, gy: y + 34, gw: w * 0.2, gh: h - 68 }
        : { gx: x + 26, gy: y + 26, gw: w - 52, gh: h * 0.3 };

  const { gx, gy, gw, gh } = area;

  return (
    <g>
      <rect x={gx} y={gy} width={gw} height={gh} fill={fill} stroke={stroke} strokeWidth="1.3" />
      <GlassPatternMarks pattern={pattern} gx={gx} gy={gy} gw={gw} gh={gh} stroke={stroke} />
    </g>
  );
}

/** Qumlama naxışı — şüşə sahəsinin içində. */
function GlassPatternMarks({
  pattern,
  gx,
  gy,
  gw,
  gh,
  stroke,
}: {
  pattern: GlassPattern;
  gx: number;
  gy: number;
  gw: number;
  gh: number;
  stroke: string;
}) {
  if (pattern === "PLAIN") {
    return (
      <line
        x1={gx}
        y1={gy + gh / 2}
        x2={gx + gw}
        y2={gy + gh / 2}
        stroke={stroke}
        strokeWidth="1"
        opacity="0.45"
      />
    );
  }

  if (pattern === "LINES") {
    const count = Math.max(3, Math.round(gh / 26));
    return (
      <g opacity="0.7">
        {Array.from({ length: count }).map((_, i) => (
          <rect
            key={i}
            x={gx + 3}
            y={gy + (gh / (count + 1)) * (i + 1) - 2}
            width={gw - 6}
            height="4"
            fill="rgba(255,255,255,0.85)"
          />
        ))}
      </g>
    );
  }

  if (pattern === "VERTICAL") {
    const count = Math.max(2, Math.round(gw / 16));
    return (
      <g opacity="0.7">
        {Array.from({ length: count }).map((_, i) => (
          <rect
            key={i}
            x={gx + (gw / (count + 1)) * (i + 1) - 1.6}
            y={gy + 3}
            width="3.2"
            height={gh - 6}
            fill="rgba(255,255,255,0.85)"
          />
        ))}
      </g>
    );
  }

  if (pattern === "GRID") {
    const cols = Math.max(2, Math.round(gw / 26));
    const rows = Math.max(2, Math.round(gh / 30));
    return (
      <g stroke="rgba(255,255,255,0.9)" strokeWidth="2" opacity="0.75">
        {Array.from({ length: cols - 1 }).map((_, i) => (
          <line
            key={`c${i}`}
            x1={gx + (gw / cols) * (i + 1)}
            y1={gy}
            x2={gx + (gw / cols) * (i + 1)}
            y2={gy + gh}
          />
        ))}
        {Array.from({ length: rows - 1 }).map((_, i) => (
          <line
            key={`r${i}`}
            x1={gx}
            y1={gy + (gh / rows) * (i + 1)}
            x2={gx + gw}
            y2={gy + (gh / rows) * (i + 1)}
          />
        ))}
      </g>
    );
  }

  // EDGE — kənarlar mat, mərkəz şəffaf
  const inset = Math.min(gw, gh) * 0.18;
  return (
    <g>
      <rect
        x={gx}
        y={gy}
        width={gw}
        height={gh}
        fill="rgba(255,255,255,0.7)"
      />
      <rect
        x={gx + inset}
        y={gy + inset}
        width={Math.max(0, gw - inset * 2)}
        height={Math.max(0, gh - inset * 2)}
        fill="rgba(255,255,255,0.05)"
        stroke={stroke}
        strokeWidth="0.8"
        opacity="0.6"
      />
    </g>
  );
}
