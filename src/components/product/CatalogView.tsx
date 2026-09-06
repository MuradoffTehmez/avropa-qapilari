"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { LayoutGrid, List, SlidersHorizontal, X } from "lucide-react";
import type { Dictionary } from "@/i18n";
import type { DoorMaterial, Locale, Product, SecurityClass, SurfaceStyle } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Checkbox, Input, Select, Swatch } from "@/components/ui/form";
import { Drawer } from "@/components/ui/overlays";
import { EmptyState } from "@/components/ui/primitives";
import { ProductCard } from "@/components/product/ProductCard";
import { brands, categories, collections } from "@/mock/taxonomy";
import { materialLabels, styleLabels } from "@/mock/products";
import { categoryName, countryName, materialName, styleName } from "@/lib/i18n-format";
import {
  applyFilters,
  countActive,
  emptyFilters,
  colorName,
  filterColors,
  sortProducts,
  type CatalogFilters,
  type SortKey,
} from "@/features/catalog/filter";

const PAGE_SIZE = 12;

export function CatalogView({
  products,
  locale,
  dict,
  lockedCategory,
}: {
  products: Product[];
  locale: Locale;
  dict: Dictionary;
  lockedCategory?: string;
}) {
  const query = useSyncExternalStore(subscribeQuery, () => window.location.search, () => "");
  const filters = useMemo(() => readFilters(query), [query]);
  const sort = (new URLSearchParams(query).get("sort") ?? "popular") as SortKey;
  function setFilters(next: CatalogFilters) { updateQuery("filters", JSON.stringify(next)); }
  function setSort(next: SortKey) { updateQuery("sort", next); }
  const [view, setView] = useState<"grid" | "list">("grid");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const result = useMemo(
    () => sortProducts(applyFilters(products, filters), sort),
    [products, filters, sort],
  );

  const activeCount = countActive(filters);

  function patch(next: Partial<CatalogFilters>) {
    setFilters({ ...filters, ...next });
    setVisible(PAGE_SIZE);
  }

  function toggleIn<T>(list: T[], value: T): T[] {
    return list.includes(value) ? list.filter((x) => x !== value) : [...list, value];
  }

  const panel = (
    <FilterPanel
      filters={filters}
      patch={patch}
      toggleIn={toggleIn}
      dict={dict}
      lockedCategory={lockedCategory}
    />
  );

  return (
    <div className="container-page grid gap-8 pb-16 lg:grid-cols-[248px_1fr] lg:gap-10">
      {/* Desktop filter rail */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100dvh-8rem)] overflow-y-auto pr-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink">
              {dict.catalog.filters}
            </h2>
            {activeCount > 0 && (
              <button
                type="button"
                onClick={() => setFilters(emptyFilters)}
                className="text-xs text-gold-600 underline-offset-2 hover:underline"
              >
                {dict.catalog.clearAll}
              </button>
            )}
          </div>
          {panel}
        </div>
      </aside>

      <div className="min-w-0">
        {/* Toolbar */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-x-3 gap-y-2.5 border-b border-line pb-4">
          <p className="text-[13px] text-stone">
            <span className="font-semibold tabular-nums text-ink">{result.length}</span>{" "}
            {dict.common.results}
          </p>

          <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden"
            >
              <SlidersHorizontal size={15} />
              {dict.catalog.filters}
              {activeCount > 0 && (
                <span className="ml-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-ink px-1 text-[10px] font-semibold text-paper">
                  {activeCount}
                </span>
              )}
            </Button>

            <Select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              aria-label={dict.actions.sort}
              className="h-9 min-w-0 flex-1 text-[13px] sm:w-auto sm:max-w-52 sm:flex-none"
            >
              <option value="popular">{dict.sort.popular}</option>
              <option value="newest">{dict.sort.newest}</option>
              <option value="priceAsc">{dict.sort.priceAsc}</option>
              <option value="priceDesc">{dict.sort.priceDesc}</option>
              <option value="rating">{dict.sort.rating}</option>
              <option value="discount">{dict.sort.discount}</option>
            </Select>

            <div className="hidden items-center border border-line sm:flex">
              <button
                type="button"
                onClick={() => setView("grid")}
                aria-label={dict.catalog.grid}
                aria-pressed={view === "grid"}
                className={cn(
                  "flex h-9 w-9 items-center justify-center transition-colors",
                  view === "grid" ? "bg-ink text-paper" : "text-stone hover:text-ink",
                )}
              >
                <LayoutGrid size={15} />
              </button>
              <button
                type="button"
                onClick={() => setView("list")}
                aria-label={dict.catalog.list}
                aria-pressed={view === "list"}
                className={cn(
                  "flex h-9 w-9 items-center justify-center border-l border-line transition-colors",
                  view === "list" ? "bg-ink text-paper" : "text-stone hover:text-ink",
                )}
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Active chips */}
        {activeCount > 0 && (
          <div className="mb-5 flex flex-wrap gap-2">
            <ActiveChips filters={filters} patch={patch} dict={dict} />
            <button
              type="button"
              onClick={() => setFilters(emptyFilters)}
              className="text-[12px] text-gold-600 underline underline-offset-2"
            >
              {dict.catalog.clearAll}
            </button>
          </div>
        )}

        {result.length === 0 ? (
          <EmptyState
            title={dict.catalog.noResults}
            text={dict.catalog.noResultsHint}
            action={
              <Button variant="secondary" onClick={() => setFilters(emptyFilters)}>
                {dict.catalog.clearAll}
              </Button>
            }
          />
        ) : (
          <>
            <div
              className={cn(
                view === "grid"
                  ? "grid grid-cols-1 gap-3 xs:grid-cols-2 sm:gap-4 md:grid-cols-3 xl:grid-cols-4"
                  : "flex flex-col gap-3",
              )}
            >
              {result.slice(0, visible).map((p) => (
                <ProductCard key={p.id} product={p} locale={locale} dict={dict} view={view} />
              ))}
            </div>

            {visible < result.length && (
              <div className="mt-8 flex justify-center">
                <Button variant="secondary" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                  {dict.actions.loadMore} ({result.length - visible})
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Mobile drawer ayrıca mobil pattern */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        side="bottom"
        title={dict.catalog.filters}
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" full onClick={() => setFilters(emptyFilters)}>
              {dict.catalog.clearAll}
            </Button>
            <Button full onClick={() => setDrawerOpen(false)}>
              {dict.catalog.showResults} ({result.length})
            </Button>
          </div>
        }
      >
        <div className="p-4">{panel}</div>
      </Drawer>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function FilterGroup({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-line py-4 first:pt-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="mb-3 flex w-full items-center justify-between text-left"
      >
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-graphite">
          {title}
        </span>
        <span className="text-stone">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="flex flex-col gap-2.5">{children}</div>}
    </div>
  );
}

function FilterPanel({
  filters,
  patch,
  toggleIn,
  dict,
  lockedCategory,
}: {
  filters: CatalogFilters;
  patch: (next: Partial<CatalogFilters>) => void;
  toggleIn: <T>(list: T[], value: T) => T[];
  dict: Dictionary;
  lockedCategory?: string;
}) {
  return (
    <div>
      {!lockedCategory && (
        <FilterGroup title={dict.catalog.category}>
          {categories.map((c) => (
            <Checkbox
              key={c.id}
              label={`${categoryName(c, dict)} (${c.productCount})`}
              checked={filters.categories.includes(c.slug)}
              onChange={() => patch({ categories: toggleIn(filters.categories, c.slug) })}
            />
          ))}
        </FilterGroup>
      )}

      <FilterGroup title={dict.catalog.brand}>
        {brands.map((b) => (
          <Checkbox
            key={b.id}
            label={b.name}
            description={countryName(b, dict)}
            checked={filters.brands.includes(b.slug)}
            onChange={() => patch({ brands: toggleIn(filters.brands, b.slug) })}
          />
        ))}
      </FilterGroup>

      <FilterGroup title={dict.catalog.groupPrice}>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            inputMode="numeric"
            placeholder={dict.catalog.priceMin}
            aria-label={dict.catalog.priceMin}
            value={filters.priceMin ?? ""}
            onChange={(e) => patch({ priceMin: e.target.value ? Number(e.target.value) : null })}
            className="h-9 text-[13px]"
          />
          <span className="text-mist">—</span>
          <Input
            type="number"
            inputMode="numeric"
            placeholder={dict.catalog.priceMax}
            aria-label={dict.catalog.priceMax}
            value={filters.priceMax ?? ""}
            onChange={(e) => patch({ priceMax: e.target.value ? Number(e.target.value) : null })}
            className="h-9 text-[13px]"
          />
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {[
            [0, 1000],
            [1000, 2000],
            [2000, 3000],
            [3000, null],
          ].map(([min, max]) => (
            <button
              key={`${min}-${max}`}
              type="button"
              onClick={() => patch({ priceMin: min as number, priceMax: max as number | null })}
              className="border border-line px-2 py-1 text-[11px] text-graphite transition-colors hover:border-ink hover:text-ink"
            >
              {max ? `${min}–${max}` : `${min}+`}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title={dict.catalog.groupTechnical}>
        <p className="text-[11px] uppercase tracking-wide text-stone">{dict.catalog.material}</p>
        {(Object.keys(materialLabels) as DoorMaterial[]).map((m) => (
          <Checkbox
            key={m}
            label={materialName(m, dict)}
            checked={filters.materials.includes(m)}
            onChange={() => patch({ materials: toggleIn(filters.materials, m) })}
          />
        ))}

        <p className="mt-3 text-[11px] uppercase tracking-wide text-stone">
          {dict.catalog.securityClass}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {(["RC2", "RC3", "RC4", "RC5"] as SecurityClass[]).map((sc) => (
            <button
              key={sc}
              type="button"
              onClick={() => patch({ securityClasses: toggleIn(filters.securityClasses, sc) })}
              aria-pressed={filters.securityClasses.includes(sc)}
              className={cn(
                "border px-2.5 py-1 text-[12px] transition-colors",
                filters.securityClasses.includes(sc)
                  ? "border-ink bg-ink text-paper"
                  : "border-line text-graphite hover:border-ink",
              )}
            >
              {sc}
            </button>
          ))}
        </div>

        <p className="mt-3 text-[11px] uppercase tracking-wide text-stone">
          {dict.catalog.soundInsulation}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {[30, 35, 40, 45].map((db) => (
            <button
              key={db}
              type="button"
              onClick={() => patch({ minSound: filters.minSound === db ? null : db })}
              aria-pressed={filters.minSound === db}
              className={cn(
                "border px-2.5 py-1 text-[12px] transition-colors",
                filters.minSound === db
                  ? "border-ink bg-ink text-paper"
                  : "border-line text-graphite hover:border-ink",
              )}
            >
              {db}+ dB
            </button>
          ))}
        </div>

        <Checkbox
          className="mt-3"
          label={dict.catalog.fireRating}
          checked={filters.fireRated}
          onChange={(e) => patch({ fireRated: e.target.checked })}
        />
      </FilterGroup>

      <FilterGroup title={dict.catalog.groupDesign} defaultOpen={false}>
        <p className="text-[11px] uppercase tracking-wide text-stone">{dict.catalog.color}</p>
        <div className="flex flex-wrap gap-1.5">
          {filterColors.map((c) => (
            <Swatch
              key={c.hex}
              hex={c.hex}
              label={colorName(c.key, dict)}
              selected={filters.colors.includes(c.hex)}
              onClick={() => patch({ colors: toggleIn(filters.colors, c.hex) })}
              className="h-8 w-8"
            />
          ))}
        </div>

        <p className="mt-3 text-[11px] uppercase tracking-wide text-stone">{dict.catalog.style}</p>
        {(Object.keys(styleLabels) as SurfaceStyle[]).map((s) => (
          <Checkbox
            key={s}
            label={styleName(s, dict)}
            checked={filters.styles.includes(s)}
            onChange={() => patch({ styles: toggleIn(filters.styles, s) })}
          />
        ))}

        <Checkbox
          className="mt-2"
          label={dict.catalog.glass}
          checked={filters.hasGlass}
          onChange={(e) => patch({ hasGlass: e.target.checked })}
        />
      </FilterGroup>

      <FilterGroup title={dict.catalog.groupSize} defaultOpen={false}>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder={`${dict.catalog.width} min`}
            aria-label={`${dict.catalog.width} min`}
            value={filters.widthMin ?? ""}
            onChange={(e) => patch({ widthMin: e.target.value ? Number(e.target.value) : null })}
            className="h-9 text-[13px]"
          />
          <span className="text-mist">—</span>
          <Input
            type="number"
            placeholder={`${dict.catalog.width} maks`}
            aria-label={`${dict.catalog.width} maks`}
            value={filters.widthMax ?? ""}
            onChange={(e) => patch({ widthMax: e.target.value ? Number(e.target.value) : null })}
            className="h-9 text-[13px]"
          />
        </div>
        <Checkbox
          label={dict.catalog.customSize}
          checked={filters.customSize}
          onChange={(e) => patch({ customSize: e.target.checked })}
        />
      </FilterGroup>

      <FilterGroup title={dict.catalog.groupOther} defaultOpen={false}>
        <Checkbox
          label={dict.catalog.onlyInStock}
          checked={filters.inStock}
          onChange={(e) => patch({ inStock: e.target.checked })}
        />
        <Checkbox
          label={dict.common.madeToOrder}
          checked={filters.madeToOrder}
          onChange={(e) => patch({ madeToOrder: e.target.checked })}
        />
        <Checkbox
          label={dict.catalog.onlySale}
          checked={filters.onSale}
          onChange={(e) => patch({ onSale: e.target.checked })}
        />
        <Checkbox
          label={dict.catalog.smartLock}
          checked={filters.smartLock}
          onChange={(e) => patch({ smartLock: e.target.checked })}
        />
        <Checkbox
          label={dict.catalog.installationAvailable}
          checked={filters.installation}
          onChange={(e) => patch({ installation: e.target.checked })}
        />
      </FilterGroup>

      <FilterGroup title={dict.catalog.collection} defaultOpen={false}>
        {collections.map((c) => (
          <Checkbox
            key={c}
            label={c}
            checked={filters.collections.includes(c)}
            onChange={() => patch({ collections: toggleIn(filters.collections, c) })}
          />
        ))}
      </FilterGroup>
    </div>
  );
}

function ActiveChips({
  filters,
  patch,
  dict,
}: {
  filters: CatalogFilters;
  patch: (next: Partial<CatalogFilters>) => void;
  dict: Dictionary;
}) {
  const chips: { label: string; clear: () => void }[] = [];

  for (const slug of filters.categories) {
    const c = categories.find((x) => x.slug === slug);
    if (c) chips.push({ label: categoryName(c, dict), clear: () => patch({ categories: filters.categories.filter((x) => x !== slug) }) });
  }
  for (const slug of filters.brands) {
    const b = brands.find((x) => x.slug === slug);
    if (b) chips.push({ label: b.name, clear: () => patch({ brands: filters.brands.filter((x) => x !== slug) }) });
  }
  for (const m of filters.materials) {
    chips.push({ label: materialName(m, dict), clear: () => patch({ materials: filters.materials.filter((x) => x !== m) }) });
  }
  for (const sc of filters.securityClasses) {
    chips.push({ label: sc, clear: () => patch({ securityClasses: filters.securityClasses.filter((x) => x !== sc) }) });
  }
  for (const s of filters.styles) {
    chips.push({ label: styleName(s, dict), clear: () => patch({ styles: filters.styles.filter((x) => x !== s) }) });
  }
  if (filters.priceMin !== null || filters.priceMax !== null) {
    chips.push({
      label: `${filters.priceMin ?? 0}–${filters.priceMax ?? "∞"} AZN`,
      clear: () => patch({ priceMin: null, priceMax: null }),
    });
  }
  if (filters.minSound !== null) {
    chips.push({ label: `${filters.minSound}+ dB`, clear: () => patch({ minSound: null }) });
  }
  if (filters.inStock) chips.push({ label: dict.catalog.inStockChip, clear: () => patch({ inStock: false }) });
  if (filters.onSale) chips.push({ label: dict.catalog.saleChip, clear: () => patch({ onSale: false }) });
  if (filters.smartLock) chips.push({ label: dict.catalog.smartLock, clear: () => patch({ smartLock: false }) });
  if (filters.hasGlass) chips.push({ label: dict.catalog.glassChip, clear: () => patch({ hasGlass: false }) });
  if (filters.fireRated) chips.push({ label: dict.catalog.fireRatedChip, clear: () => patch({ fireRated: false }) });

  return (
    <>
      {chips.map((chip, i) => (
        <button
          key={`${chip.label}-${i}`}
          type="button"
          onClick={chip.clear}
          className="inline-flex items-center gap-1.5 border border-line bg-bone px-2.5 py-1 text-[12px] text-graphite transition-colors hover:border-ink hover:text-ink"
        >
          {chip.label}
          <X size={12} />
        </button>
      ))}
    </>
  );
}

function subscribeQuery(callback: () => void) { window.addEventListener("popstate",callback);return () => window.removeEventListener("popstate",callback); }
function updateQuery(key: string, value: string) { const url=new URL(window.location.href);url.searchParams.set(key,value);window.history.replaceState(null,"",url);window.dispatchEvent(new PopStateEvent("popstate")); }
function readFilters(query: string): CatalogFilters {
 const result={...emptyFilters};try {const raw=JSON.parse(new URLSearchParams(query).get("filters")??"{}");for(const key of Object.keys(emptyFilters) as (keyof CatalogFilters)[]){const value=raw[key]; const base=emptyFilters[key];if((Array.isArray(base)&&Array.isArray(value)&&value.every(v=>typeof v==="string"))||(typeof base==="boolean"&&typeof value==="boolean")||(base===null&&(value===null||typeof value==="number"&&Number.isFinite(value)))) Object.assign(result,{[key]:value});}}catch{}return result;
}
