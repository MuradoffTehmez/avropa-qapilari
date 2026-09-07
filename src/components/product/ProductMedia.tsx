import Image from "next/image";
import type { MediaProduct } from "@/types";
import { cn } from "@/lib/utils";
import { DoorVisual, type GlassKind } from "@/components/product/DoorVisual";

/**
 * Məhsul vizualı — foto varsa foto, yoxdursa SVG qapı.
 * İstehsalçı kataloqundan şəkillər gələndə yalnız `product.images`
 * doldurulur, komponentləri dəyişmək lazım gəlmir.
 */
export function ProductMedia({
  product,
  index = 0,
  sizes,
  priority,
  className,
  ambient = true,
}: {
  product: MediaProduct;
  /** Hansı şəkil / rəng variantı */
  index?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
  ambient?: boolean;
}) {
  const photo = product.images[index] ?? product.images.find((i) => i.primary);

  if (photo) {
    return (
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes ?? "(max-width: 768px) 50vw, 25vw"}
        priority={priority}
        className={cn("object-cover", className)}
      />
    );
  }

  return (
    <DoorVisual
      label={product.name}
      panelHex={product.panelHexes[index] ?? product.panelHexes[0]}
      style={product.style}
      glass={(product.hasGlass ? "SATIN" : "NONE") as GlassKind}
      smartLock={product.smartLockReady && product.categorySlug === "smart-qapilar"}
      widthMm={product.defaultWidth}
      heightMm={product.defaultHeight}
      ambient={ambient}
      className={className}
    />
  );
}

/** Məhsulun neçə vizual variantı var — foto və ya rəng sayı. */
export function mediaCount(product: MediaProduct): number {
  return product.images.length > 0 ? product.images.length : product.panelHexes.length;
}
