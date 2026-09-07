"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import type { Dictionary } from "@/i18n";
import type { Brand, Category, Locale, Product } from "@/types";
import { routes } from "@/lib/routes";
import { useDialogFocus, useEscapeKey, useLockBodyScroll } from "@/lib/hooks";
import { ProductMedia } from "@/components/product/ProductMedia";
import { categoryName, priceFrom } from "@/lib/i18n-format";

/** Axtarış və avtotamamlama. */
export function SearchOverlay({
  open,
  onClose,
  locale,
  dict,
  products,
  categories,
  brands,
}: {
  open: boolean;
  onClose: () => void;
  locale: Locale;
  dict: Dictionary;
  products: Product[];
  categories: Category[];
  brands: Brand[];
}) {
  const [query, setQuery] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const r = routes(locale);

  useEscapeKey(onClose, open);
  useLockBodyScroll(open);
  useDialogFocus(panelRef, open);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return null;

    return {
      products: products
        .filter((p) =>
          [p.name, p.sku, p.collection, p.shortDescription, p.material].some((f) =>
            f.toLowerCase().includes(q),
          ),
        )
        .slice(0, 6),
      categories: categories.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 4),
      brands: brands.filter((b) => b.name.toLowerCase().includes(q)).slice(0, 4),
    };
  }, [query]);

  if (!open) return null;

  const empty =
    results !== null &&
    results.products.length === 0 &&
    results.categories.length === 0 &&
    results.brands.length === 0;

  return (
    <div className="fixed inset-0 z-100">
      <button type="button" aria-label={dict.actions.close} onClick={onClose} className="motion-overlay absolute inset-0 bg-obsidian/50 backdrop-blur-[3px]" />

      <div ref={panelRef} role="dialog" aria-modal="true" aria-label={dict.actions.search} tabIndex={-1} className="motion-modal relative mx-auto flex max-h-dvh w-full max-w-2xl flex-col bg-paper pb-[env(safe-area-inset-bottom,0px)] shadow-2xl outline-none sm:mt-24 sm:max-h-[85dvh]">
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-line px-4 sm:px-5">
          <Search size={19} className="shrink-0 text-stone" aria-hidden />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={dict.common.searchPlaceholder}
            aria-label={dict.actions.search}
            className="h-full flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-mist"
          />
          <button type="button" onClick={onClose} aria-label={dict.actions.close} className="-mr-1 flex h-11 w-11 items-center justify-center text-stone hover:text-ink">
            <X size={18} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {results === null && (
            <div className="p-5">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone">
                {dict.common.popularSearches}
              </p>
              <div className="flex flex-wrap gap-2">
                {dict.common.searchSuggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setQuery(s)}
                    className="border border-line px-3 py-1.5 text-[13px] text-graphite transition-colors hover:border-ink hover:text-ink"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {empty && (
            <p className="p-8 text-center text-sm text-stone">
              &laquo;{query}&raquo; {dict.common.noSearchResults}
            </p>
          )}

          {results && results.products.length > 0 && (
            <div className="border-b border-line p-3">
              <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone">
                {dict.common.productsLabel}
              </p>
              {results.products.map((p) => (
                <Link
                  key={p.id}
                  href={r.product(p.slug)}
                  onClick={onClose}
                  className="flex min-h-11 items-center gap-3 rounded-[3px] p-2 transition-colors hover:bg-bone"
                >
                  <span className="h-14 w-11 shrink-0 overflow-hidden bg-bone">
                    <ProductMedia product={p} sizes="44px" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-ink">{p.name}</span>
                    <span className="block text-xs text-stone">
                      {p.sku} · {priceFrom(p.basePrice, locale, dict)}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          )}

          {results && (results.categories.length > 0 || results.brands.length > 0) && (
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              {results.categories.length > 0 && (
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone">
                    {dict.common.categoriesLabel}
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {results.categories.map((c) => (
                      <Link key={c.id} href={r.category(c.slug)} onClick={onClose} className="flex min-h-11 items-center text-sm text-graphite hover:text-ink">
                        {categoryName(c, dict)}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {results.brands.length > 0 && (
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone">
                    {dict.common.brandsLabel}
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {results.brands.map((b) => (
                      <Link key={b.id} href={r.brand(b.slug)} onClick={onClose} className="flex min-h-11 items-center text-sm text-graphite hover:text-ink">
                        {b.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
