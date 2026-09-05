"use client";

import { useRouter } from "next/navigation";
import { Heart, Scale } from "lucide-react";
import type { Dictionary } from "@/i18n";
import type { Locale, Product } from "@/types";
import { routes } from "@/lib/routes";
import { cn, uid } from "@/lib/utils";
import { Button, ButtonLink } from "@/components/ui/Button";
import { toast } from "@/components/ui/overlays";
import { useCart } from "@/store/cart";
import { useCompare, useFavorites, COMPARE_LIMIT } from "@/store/lists";
import { useHydrated } from "@/lib/hooks";

export function ProductActions({
  product,
  locale,
  dict,
}: {
  product: Product;
  locale: Locale;
  dict: Dictionary;
}) {
  const r = routes(locale);
  const router = useRouter();
  const hydrated = useHydrated();

  const add = useCart((s) => s.add);
  const favIds = useFavorites((s) => s.ids);
  const toggleFav = useFavorites((s) => s.toggle);
  const cmpIds = useCompare((s) => s.ids);
  const toggleCmp = useCompare((s) => s.toggle);

  const isFav = hydrated && favIds.includes(product.id);
  const isCmp = hydrated && cmpIds.includes(product.id);

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
        lines: [{ group: "Konfiqurasiya", value: "Standart (bazis)" }],
      },
    });
    toast("Səbətə əlavə edildi");
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <ButtonLink href={r.configuratorFor(product.slug)} size="lg" full className="sm:flex-1">
          {dict.actions.configure}
        </ButtonLink>
        <Button variant="secondary" size="lg" full onClick={addBasic} className="sm:flex-1">
          {dict.actions.addToCart}
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            toggleFav(product.id);
            toast(isFav ? "Favorilərdən çıxarıldı" : "Favorilərə əlavə edildi");
          }}
          className={cn("flex-1 border border-line", isFav && "text-brass-600")}
        >
          <Heart size={15} className={cn(isFav && "fill-brass-500 text-brass-500")} />
          {dict.actions.favorites}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const res = toggleCmp(product.id);
            if (res === "full") toast(`Müqayisədə maksimum ${COMPARE_LIMIT} məhsul ola bilər`);
            else toast(res === "added" ? "Müqayisəyə əlavə edildi" : "Müqayisədən çıxarıldı");
          }}
          className={cn("flex-1 border border-line", isCmp && "text-ink")}
        >
          <Scale size={15} />
          {dict.actions.compare}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(r.quote)}
          className="flex-1 border border-line"
        >
          {dict.actions.requestQuote}
        </Button>
      </div>
    </div>
  );
}
