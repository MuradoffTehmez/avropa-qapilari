"use client";

import { useState } from "react";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";
import { ProductMedia, mediaCount } from "@/components/product/ProductMedia";

/** Məhsul qalereyası — rəng variantları. */
export function ProductGallery({ product }: { product: Product }) {
  const count = mediaCount(product);
  const [active, setActive] = useState(0);
  const index = Math.min(active, count - 1);

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:gap-4">
      <div className="flex gap-2 sm:flex-col">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`${product.name} — ${i + 1}`}
            aria-pressed={i === index}
            className={cn(
              "relative aspect-3/4 w-16 shrink-0 overflow-hidden border bg-bone transition-colors sm:w-20",
              i === index ? "border-ink" : "border-line hover:border-mist",
            )}
          >
            <ProductMedia product={product} index={i} sizes="80px" ambient={false} />
          </button>
        ))}
      </div>

      <div className="relative flex-1 border border-line bg-bone">
        <div className="aspect-3/4 sm:aspect-4/5">
          <ProductMedia
            product={product}
            index={index}
            priority
            sizes="(max-width: 1024px) 100vw, 45vw"
          />
        </div>
        <p className="absolute bottom-3 left-3 rounded-[2px] bg-paper/85 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.1em] text-graphite backdrop-blur">
          {product.defaultWidth} × {product.defaultHeight} mm
        </p>
      </div>
    </div>
  );
}
