import QR from "qrcode";
import { cn } from "@/lib/utils";

/**
 * Serial nömrə linki üçün QR kod (PRD §83).
 * Server komponentidir — SVG build zamanı yaradılır, client-ə JS düşmür.
 */
export function QrCode({
  value,
  size = 132,
  className,
  label,
}: {
  value: string;
  size?: number;
  className?: string;
  label?: string;
}) {
  let modules: { size: number; get: (r: number, c: number) => number };
  try {
    modules = QR.create(value, { errorCorrectionLevel: "M" }).modules as typeof modules;
  } catch {
    return null;
  }

  const count = modules.size;
  const quiet = 2;
  const span = count + quiet * 2;

  let path = "";
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (modules.get(r, c)) path += `M${c} ${r}h1v1h-1z`;
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${span} ${span}`}
      role="img"
      aria-label={label ?? value}
      shapeRendering="crispEdges"
      className={cn("shrink-0", className)}
    >
      <rect width={span} height={span} fill="#ffffff" />
      <g transform={`translate(${quiet} ${quiet})`}>
        <path d={path} fill="#0b1d34" />
      </g>
    </svg>
  );
}
