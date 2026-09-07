"use client";

import { useCallback, useRef, useState } from "react";

import type { ConstructionLayer } from "@/types";
import { cn } from "@/lib/utils";
import { DoorVisual, type DoorFace, type DoorVisualProps } from "@/components/product/DoorVisual";

/**
 * 360° QAPI BAXIŞI.
 *
 * Qapı şaquli ox ətrafında döndərilir. Ortoqrafik proyeksiya işlənir:
 * panelin görünən eni `|cos θ|`, kəsiyin eni isə `|sin θ|` ilə dəyişir,
 * 90° və 270°-də qapı yalnız kəsiyi ilə görünür. Kəsiyin zolaqları
 * `configuredConstruction` yığınından gəlir — beləliklə yan görünüş
 * seçilmiş rəng və izolyasiya paketini əks etdirir.
 */

/** SVG-də çərçivənin yarım eni (viewBox 300 vahidin 107-si). */
const FRAME_HALF = 107 / 300;
/** Çərçivənin tam eni — qalınlığı eyni miqyasa gətirmək üçün. */
const FRAME_SPAN = 214 / 300;
/** Sürüşdürmə həssaslığı: piksel → dərəcə. */
const DRAG_DEGREES_PER_PX = 0.55;

export function normalizeAngle(angle: number): number {
  return ((angle % 360) + 360) % 360;
}

/** Bucaqdan görünən üzü hesablayır — 90°–270° aralığında iç tərəf görünür. */
export function faceForAngle(angle: number): DoorFace {
  return Math.cos((normalizeAngle(angle) * Math.PI) / 180) >= 0 ? "OUTSIDE" : "INSIDE";
}

export function DoorTurntable({
  visual,
  stack,
  angle,
  onAngleChange,
  label,
  hint,
  className,
}: {
  /** `buildPreview` nəticəsi — `face` bucaqdan hesablanır, ötürülmür. */
  visual: Omit<DoorVisualProps, "face">;
  /** Qapının kəsik qatları — yan görünüşün zolaqları. */
  stack: ConstructionLayer[];
  angle: number;
  onAngleChange: (angle: number) => void;
  /** Ekran oxuyucusu üçün ad. */
  label: string;
  /** Necə döndərmək barədə qısa izah — `title` kimi göstərilir. */
  hint?: string;
  className?: string;
}) {
  const [dragging, setDragging] = useState(false);
  const lastX = useRef(0);

  const normalized = normalizeAngle(angle);
  const rad = (normalized * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const face = cos >= 0 ? "OUTSIDE" : "INSIDE";

  // Qalınlıq qapının eninə nisbətdə — kəsik real ölçüdə görünsün.
  const thickness = stack.reduce((sum, layer) => sum + layer.thicknessMm, 0);
  const widthMm = visual.widthMm ?? 960;
  const panelHalfPct = FRAME_HALF * Math.abs(cos) * 100;
  const edgePct = FRAME_SPAN * (thickness / Math.max(widthMm, 1)) * Math.abs(sin) * 100;
  const edgeOnRight = sin >= 0;

  // Kəsik zolaqları həmişə çöldən içə doğru düzülür; iç tərəfdən baxanda
  // sıra tərsinə çevrilir.
  const edgeLayers = face === "INSIDE" ? [...stack].reverse() : stack;

  const nudge = useCallback(
    (delta: number) => onAngleChange(normalizeAngle(normalized + delta)),
    [normalized, onAngleChange],
  );

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    lastX.current = event.clientX;
    setDragging(true);
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    const delta = event.clientX - lastX.current;
    if (delta === 0) return;
    lastX.current = event.clientX;
    onAngleChange(normalizeAngle(normalized + delta * DRAG_DEGREES_PER_PX));
  }

  function endDrag(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setDragging(false);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const step = event.shiftKey ? 15 : 5;
    const actions: Record<string, () => void> = {
      ArrowRight: () => nudge(step),
      ArrowUp: () => nudge(step),
      ArrowLeft: () => nudge(-step),
      ArrowDown: () => nudge(-step),
      PageUp: () => nudge(45),
      PageDown: () => nudge(-45),
      Home: () => onAngleChange(0),
      End: () => onAngleChange(180),
    };
    const action = actions[event.key];
    if (!action) return;
    event.preventDefault();
    action();
  }

  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={360}
      aria-valuenow={Math.round(normalized)}
      aria-valuetext={`${Math.round(normalized)}°`}
      aria-orientation="horizontal"
      title={hint}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={onKeyDown}
      className={cn(
        "relative h-full w-full touch-pan-y select-none outline-none",
        "focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2",
        dragging ? "cursor-grabbing" : "cursor-grab",
        className,
      )}
    >
      {/* Qapı kəsiyi — panelin yanında, qalınlığa uyğun enlə */}
      {edgePct > 0.15 && (
        <div
          aria-hidden
          className={cn(
            "absolute top-[3.5%] flex h-[90%] overflow-hidden",
            !dragging && "motion-safe:transition-all motion-safe:duration-200",
          )}
          style={{
            width: `${edgePct}%`,
            [edgeOnRight ? "left" : "right"]: `calc(50% + ${panelHalfPct}%)`,
          }}
        >
          {edgeLayers.map((layer) => (
            <span
              key={layer.id}
              className="h-full"
              style={{
                flex: `${Math.max(layer.thicknessMm, thickness * 0.02)} 0 0`,
                background: layer.color,
              }}
            />
          ))}
        </div>
      )}

      {/* Panelin özü — dönmə eni sıxır, üz bucaqdan seçilir */}
      <div
        className={cn(
          "h-full w-full origin-center",
          !dragging && "motion-safe:transition-transform motion-safe:duration-200",
        )}
        style={{ transform: `scaleX(${Math.max(Math.abs(cos), 0.001)})` }}
      >
        <DoorVisual {...visual} face={face} label={label} />
      </div>
    </div>
  );
}
