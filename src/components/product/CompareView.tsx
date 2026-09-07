"use client";

import Link from "next/link";
import { Check, Minus, Scale, X } from "lucide-react";
import type { Dictionary } from "@/i18n";
import type { Brand, Locale, Product } from "@/types";
import { routes } from "@/lib/routes";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EmptyState, Skeleton } from "@/components/ui/primitives";
import { ProductMedia } from "@/components/product/ProductMedia";
import { useCompare } from "@/store/lists";
import { useHydrated } from "@/lib/hooks";
import { materialName, priceFrom, styleName } from "@/lib/i18n-format";

/** maksimum 4 məhsul müqayisəsi. */
export function CompareView({
  locale,
  dict,
  products,
  brands,
}: {
  locale: Locale;
  dict: Dictionary;
  products: Product[];
  brands: Brand[];
}) {
  const r = routes(locale);
  const hydrated = useHydrated();
  const ids = useCompare((s) => s.ids);
  const remove = useCompare((s) => s.remove);
  const clear = useCompare((s) => s.clear);

  if (!hydrated) {
    return (
      <div className="container-page py-10">
        <Skeleton className="h-96" />
      </div>
    );
  }

  const list = products.filter((p) => ids.includes(p.id));

  if (list.length === 0) {
    return (
      <div className="container-page py-12">
        <EmptyState
          icon={<Scale size={34} />}
          title={dict.compare.empty}
          text={dict.compare.emptyHint}
          action={<ButtonLink href={r.doors}>{dict.actions.selectDoor}</ButtonLink>}
        />
      </div>
    );
  }

  const rows: { label: string; render: (p: Product) => React.ReactNode }[] = [
    { label: dict.common.price, render: (p) => priceFrom(p.basePrice, locale, dict) },
    {
      label: dict.catalog.brand,
      render: (p) => brands.find((b) => b.slug === p.brandSlug)?.name ?? "—",
    },
    { label: dict.catalog.material, render: (p) => materialName(p.material, dict) },
    { label: dict.catalog.securityClass, render: (p) => p.securityClass },
    { label: dict.catalog.soundInsulation, render: (p) => `${p.soundInsulationDb} dB` },
    { label: dict.catalog.thermal, render: (p) => `${p.thermalW} W/m²K` },
    { label: dict.catalog.fireRating, render: (p) => p.fireRating ?? <Minus size={14} className="mx-auto text-mist" /> },
    { label: dict.common.warranty, render: (p) => `${p.warrantyYears} ${dict.common.years}` },
    { label: dict.catalog.style, render: (p) => styleName(p.style, dict) },
    { label: dict.catalog.smartLock, render: (p) => <Bool value={p.smartLockReady} yes={dict.common.yes} no={dict.common.no} /> },
    { label: dict.catalog.glass, render: (p) => <Bool value={p.hasGlass} yes={dict.common.yes} no={dict.common.no} /> },
    { label: dict.catalog.customSize, render: (p) => <Bool value={p.customSizeAvailable} yes={dict.common.yes} no={dict.common.no} /> },
    { label: dict.catalog.installationAvailable, render: (p) => <Bool value={p.installationAvailable} yes={dict.common.yes} no={dict.common.no} /> },
    {
      label: dict.product.availability,
      render: (p) => (p.inStock ? dict.common.inStock : dict.common.madeToOrder),
    },
    {
      label: dict.product.deliveryEstimate,
      render: (p) => `${p.deliveryDays[0]}–${p.deliveryDays[1]} ${dict.common.days}`,
    },
  ];

  return (
    <div className="container-page py-8 lg:py-10">
      <div className="mb-5 flex items-center justify-between border-b border-line pb-4">
        <p className="text-[13px] text-stone">
          <span className="font-semibold tabular-nums text-ink">{list.length}</span> / 4
        </p>
        <Button variant="ghost" size="sm" onClick={clear}>
          {dict.actions.clear}
        </Button>
      </div>

      <div
        className="-mx-4 overflow-x-auto px-4 focus-visible:outline-offset-[-2px] sm:mx-0 sm:px-0"
        tabIndex={0}
        role="region"
        aria-label={`${dict.pageMeta.compare.title}: ${dict.compare.feature}`}
      >
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr>
              <th className="w-36 border-b border-line p-2 text-left align-bottom sm:w-44">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone">
                  {dict.compare.feature}
                </span>
              </th>
              {list.map((p) => (
                <th key={p.id} className="border-b border-line p-2 align-bottom">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => remove(p.id)}
                      aria-label={`${p.name} — ${dict.actions.remove}`}
                      className="absolute right-0 top-0 z-20 flex h-11 w-11 items-center justify-center border border-line bg-paper text-stone transition-colors hover:text-danger"
                    >
                      <X size={13} />
                    </button>
                    <Link href={r.product(p.slug)} className="block">
                      <span className="door-frame block border border-line">
                        <ProductMedia product={p} sizes="160px" />
                      </span>
                      <span className="mt-2 block text-left text-[13.5px] font-medium leading-snug text-ink">
                        {p.name}
                      </span>
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="even:bg-bone/60">
                <th scope="row" className="border-b border-line p-3 text-left text-[13px] font-normal text-stone">
                  {row.label}
                </th>
                {list.map((p) => (
                  <td
                    key={p.id}
                    className="border-b border-line p-3 text-center text-[13.5px] font-medium text-ink"
                  >
                    {row.render(p)}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="p-3" />
              {list.map((p) => (
                <td key={p.id} className="p-3 text-center">
                  <ButtonLink href={r.configuratorFor(p.slug)} size="sm" full>
                    {dict.actions.configure}
                  </ButtonLink>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Bool({ value, yes, no }: { value: boolean; yes: string; no: string }) {
  return value ? (
    <span><Check size={15} className="mx-auto text-success" aria-hidden /><span className="sr-only">{yes}</span></span>
  ) : (
    <span><Minus size={14} className="mx-auto text-mist" aria-hidden /><span className="sr-only">{no}</span></span>
  );
}
