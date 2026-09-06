"use client";

import { Heart } from "lucide-react";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/types";
import { routes } from "@/lib/routes";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EmptyState, Skeleton } from "@/components/ui/primitives";
import { ProductCard } from "@/components/product/ProductCard";
import { useFavorites } from "@/store/lists";
import { useHydrated } from "@/lib/hooks";
import { products } from "@/mock/products";

export function FavoritesView({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const r = routes(locale);
  const hydrated = useHydrated();
  const ids = useFavorites((s) => s.ids);
  const clear = useFavorites((s) => s.clear);

  if (!hydrated) {
    return (
      <div className="container-page grid grid-cols-1 gap-3 py-10 xs:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="aspect-3/4" />
        ))}
      </div>
    );
  }

  const list = products.filter((p) => ids.includes(p.id));

  if (list.length === 0) {
    return (
      <div className="container-page py-12">
        <EmptyState
          icon={<Heart size={34} />}
          title={dict.favorites.empty}
          text={dict.favorites.emptyHint}
          action={<ButtonLink href={r.doors}>{dict.actions.selectDoor}</ButtonLink>}
        />
      </div>
    );
  }

  return (
    <div className="container-page py-8 lg:py-10">
      <div className="mb-5 flex items-center justify-between border-b border-line pb-4">
        <p className="text-[13px] text-stone">
          <span className="font-semibold tabular-nums text-ink">{list.length}</span>{" "}
          {dict.common.results}
        </p>
        <Button variant="ghost" size="sm" onClick={clear}>
          {dict.actions.clear}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
        {list.map((p) => (
          <ProductCard key={p.id} product={p} locale={locale} dict={dict} />
        ))}
      </div>
    </div>
  );
}
