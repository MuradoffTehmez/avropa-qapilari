"use client";

import Link from "next/link";
import { Heart, Scale, ShieldCheck, Volume2 } from "lucide-react";
import type { Locale, Product } from "@/types";
import { routes } from "@/lib/routes";
import { cn, formatPrice, formatPriceFrom } from "@/lib/utils";
import { Badge } from "@/components/ui/primitives";
import { DoorVisual } from "@/components/product/DoorVisual";
import { useCompare, useFavorites, COMPARE_LIMIT } from "@/store/lists";
import { useHydrated } from "@/lib/hooks";
import { toast } from "@/components/ui/overlays";
import { materialLabels } from "@/mock/products";

export function ProductCard({
  product,
  locale,
  view = "grid",
  className,
}: {
  product: Product;
  locale: Locale;
  view?: "grid" | "list";
  className?: string;
}) {
  const r = routes(locale);
  const hydrated = useHydrated();

  const favIds = useFavorites((s) => s.ids);
  const toggleFav = useFavorites((s) => s.toggle);
  const cmpIds = useCompare((s) => s.ids);
  const toggleCmp = useCompare((s) => s.toggle);

  const isFav = hydrated && favIds.includes(product.id);
  const isCmp = hydrated && cmpIds.includes(product.id);

  function onFav(e: React.MouseEvent) {
    e.preventDefault();
    toggleFav(product.id);
    toast(isFav ? "Favorilərdən çıxarıldı" : "Favorilərə əlavə edildi");
  }

  function onCmp(e: React.MouseEvent) {
    e.preventDefault();
    const result = toggleCmp(product.id);
    if (result === "full") toast(`Müqayisədə maksimum ${COMPARE_LIMIT} məhsul ola bilər`);
    else toast(result === "added" ? "Müqayisəyə əlavə edildi" : "Müqayisədən çıxarıldı");
  }

  const badges = (
    <div className="pointer-events-none absolute left-3 top-3 z-10 flex flex-col items-start gap-1.5">
      {product.isNew && <Badge tone="dark">Yeni</Badge>}
      {product.onSale && <Badge tone="gold">Endirim</Badge>}
      {product.isBestseller && !product.isNew && <Badge tone="neutral">Bestseller</Badge>}
    </div>
  );

  const actions = (
    <div className="absolute right-2.5 top-2.5 z-10 flex flex-col gap-1.5">
      <button
        type="button"
        onClick={onFav}
        aria-label="Favorilərə əlavə et"
        aria-pressed={isFav}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full border bg-paper/90 backdrop-blur transition-colors",
          isFav ? "border-gold-400 text-gold-500" : "border-line text-stone hover:text-ink",
        )}
      >
        <Heart size={15} className={cn(isFav && "fill-gold-500")} />
      </button>
      <button
        type="button"
        onClick={onCmp}
        aria-label="Müqayisəyə əlavə et"
        aria-pressed={isCmp}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full border bg-paper/90 backdrop-blur transition-colors",
          isCmp ? "border-ink text-ink" : "border-line text-stone hover:text-ink",
        )}
      >
        <Scale size={15} />
      </button>
    </div>
  );

  if (view === "list") {
    return (
      <Link
        href={r.product(product.slug)}
        className={cn(
          "group relative flex gap-4 border border-line bg-paper p-3 transition-colors hover:border-mist sm:gap-6 sm:p-4",
          className,
        )}
      >
        {badges}
        {actions}
        <div className="relative aspect-3/4 w-24 shrink-0 overflow-hidden bg-bone sm:w-36">
          <DoorVisual panelHex={product.panelHexes[0]} style={product.style} glass={product.hasGlass ? "SATIN" : "NONE"} />
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-stone">{product.sku}</p>
            <h3 className="mt-1 text-[15px] font-medium text-ink sm:text-base">{product.name}</h3>
            <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-stone">
              {product.shortDescription}
            </p>
            <div className="mt-3 hidden flex-wrap gap-x-4 gap-y-1 text-xs text-graphite sm:flex">
              <span>{materialLabels[product.material]}</span>
              {product.securityClass !== "—" && <span>{product.securityClass}</span>}
              <span>{product.soundInsulationDb} dB</span>
              <span>{product.warrantyYears} il zəmanət</span>
            </div>
          </div>

          <div className="mt-3 flex items-end justify-between gap-3">
            <div>
              {product.oldPrice && (
                <p className="text-xs text-mist line-through">{formatPrice(product.oldPrice)}</p>
              )}
              <p className="text-[17px] font-semibold tracking-tight text-ink">
                {formatPriceFrom(product.basePrice)}
              </p>
            </div>
            <span className="hidden text-[13px] font-medium text-gold-600 underline-offset-4 group-hover:underline sm:inline">
              Ətraflı
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={r.product(product.slug)}
      className={cn("group relative flex flex-col border border-line bg-paper transition-colors hover:border-mist", className)}
    >
      {badges}
      {actions}

      <div className="door-frame border-b border-line">
        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.03]">
          <DoorVisual
            panelHex={product.panelHexes[0]}
            style={product.style}
            glass={product.hasGlass ? "SATIN" : "NONE"}
            smartLock={product.smartLockReady && product.categorySlug === "smart-qapilar"}
            widthMm={product.defaultWidth}
            heightMm={product.defaultHeight}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] uppercase tracking-[0.14em] text-stone">{product.collection}</p>
        <h3 className="mt-1 text-[15px] font-medium leading-snug text-ink">{product.name}</h3>

        <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-graphite">
          {product.securityClass !== "—" && (
            <span className="inline-flex items-center gap-1">
              <ShieldCheck size={12} className="text-stone" /> {product.securityClass}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Volume2 size={12} className="text-stone" /> {product.soundInsulationDb} dB
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <div>
            {product.oldPrice && (
              <p className="text-[11px] text-mist line-through">{formatPrice(product.oldPrice)}</p>
            )}
            <p className="text-base font-semibold tracking-tight text-ink">
              {formatPriceFrom(product.basePrice)}
            </p>
          </div>
          <span
            className={cn(
              "text-[11px] font-medium",
              product.inStock ? "text-success" : "text-stone",
            )}
          >
            {product.inStock ? "Anbarda" : "Sifarişlə"}
          </span>
        </div>
      </div>
    </Link>
  );
}
