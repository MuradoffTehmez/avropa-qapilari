"use client";

import { useState } from "react";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";
import { DoorVisual } from "@/components/product/DoorVisual";

/** Məhsul qalereyası — rəng variantları. */
export function ProductGallery({ product }: { product: Product }) {
  const views: { hex: string; label: string; glass: "NONE" | "SATIN" }[] = product.panelHexes.map(
    (hex, i) => ({
      hex,
      label: `Variant ${i + 1}`,
      glass: product.hasGlass ? "SATIN" : "NONE",
    }),
  );

  const [active, setActive] = useState(0);
  const current = views[active] ?? views[0];

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:gap-4">
      <div className="flex gap-2 sm:flex-col">
        {views.map((v, i) => (
          <button
            key={v.hex}
            type="button"
            onClick={() => setActive(i)}
            aria-label={v.label}
            aria-pressed={i === active}
            className={cn(
              "relative aspect-3/4 w-16 shrink-0 overflow-hidden border bg-bone transition-colors sm:w-20",
              i === active ? "border-ink" : "border-line hover:border-mist",
            )}
          >
            <DoorVisual panelHex={v.hex} style={product.style} glass={v.glass} ambient={false} />
          </button>
        ))}
      </div>

      <div className="relative flex-1 border border-line bg-bone">
        <div className="aspect-3/4 sm:aspect-4/5">
          <DoorVisual
            panelHex={current.hex}
            style={product.style}
            glass={current.glass}
            handle={product.style === "LOFT" ? "BAR" : "INOX"}
            smartLock={product.categorySlug === "smart-qapilar"}
            widthMm={product.defaultWidth}
            heightMm={product.defaultHeight}
          />
        </div>
        <p className="absolute bottom-3 left-3 rounded-[2px] bg-paper/85 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.1em] text-graphite backdrop-blur">
          {product.defaultWidth} × {product.defaultHeight} mm
        </p>
      </div>
    </div>
  );
}
