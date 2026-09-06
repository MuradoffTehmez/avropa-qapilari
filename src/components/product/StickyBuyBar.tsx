"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { Dictionary } from "@/i18n";
import type { Locale, Product } from "@/types";
import { routes } from "@/lib/routes";
import { cn, uid } from "@/lib/utils";
import { priceFrom } from "@/lib/i18n-format";
import { Button, ButtonLink } from "@/components/ui/Button";
import { toast } from "@/components/ui/overlays";
import { DoorVisual } from "@/components/product/DoorVisual";
import { useCart } from "@/store/cart";

/**
 * Səhifə aşağı sürüşdürüləndə görünən alış paneli.
 * Uzun məhsul səhifəsində CTA-nın itməsinin qarşısını alır.
 */
export function StickyBuyBar({
  product,
  locale,
  dict,
}: {
  product: Product;
  locale: Locale;
  dict: Dictionary;
}) {
  const r = routes(locale);
  const add = useCart((s) => s.add);

  const subscribe = useCallback((onChange: () => void) => {
    window.addEventListener("scroll", onChange, { passive: true });
    window.addEventListener("resize", onChange);
    return () => {
      window.removeEventListener("scroll", onChange);
      window.removeEventListener("resize", onChange);
    };
  }, []);

  /** Əsas CTA blokunun altına keçəndə panel görünür. */
  const visible = useSyncExternalStore(
    subscribe,
    () => {
      const anchor = document.getElementById("product-actions");
      if (!anchor) return false;
      return anchor.getBoundingClientRect().bottom < 0;
    },
    () => false,
  );

  function addBasic() {
    add({
      id: uid(),
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      sku: product.sku,
      panelHex: product.panelHexes[0],
      quantity: 1,
      unitPrice: product.basePrice,
      snapshot: {
        width: product.defaultWidth,
        height: product.defaultHeight,
        lines: [{ group: dict.configurator.baseLayer, value: dict.configurator.standardSizes }],
      },
    });
    toast(dict.actions.addToCart);
  }

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-45 border-t border-line bg-paper/97 backdrop-blur-md",
        "transition-[transform,opacity] duration-300 ease-out",
      )}
      style={{
        transform: visible ? "translateY(0)" : "translateY(110%)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
      }}
      aria-hidden={!visible}
    >
      <div className="container-page safe-bottom flex items-center gap-3 py-2.5 sm:gap-4 sm:py-3">
        <span className="hidden h-12 w-9 shrink-0 overflow-hidden border border-line bg-bone sm:block">
          <DoorVisual panelHex={product.panelHexes[0]} style={product.style} ambient={false} />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13.5px] font-medium text-ink sm:text-[15px]">
            {product.name}
          </span>
          <span className="block text-[13px] font-semibold tabular-nums text-gold-600 sm:text-[14px]">
            {priceFrom(product.basePrice, locale, dict)}
          </span>
        </span>

        <Button
          variant="secondary"
          onClick={addBasic}
          className="hidden shrink-0 md:inline-flex"
          tabIndex={visible ? 0 : -1}
        >
          {dict.actions.addToCart}
        </Button>

        <ButtonLink
          href={r.configuratorFor(product.slug)}
          className="shrink-0"
          tabIndex={visible ? 0 : -1}
        >
          {dict.actions.configure}
        </ButtonLink>
      </div>
    </div>
  );
}
