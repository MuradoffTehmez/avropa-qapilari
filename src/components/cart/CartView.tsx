"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/types";
import { routes } from "@/lib/routes";
import { formatPrice } from "@/lib/utils";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card, EmptyState, Notice, Skeleton } from "@/components/ui/primitives";
import { DoorVisual } from "@/components/product/DoorVisual";
import { cartSubtotal, useCart } from "@/store/cart";
import { useHydrated } from "@/lib/hooks";

export function CartView({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const r = routes(locale);
  const hydrated = useHydrated();

  const items = useCart((s) => s.items);
  const remove = useCart((s) => s.remove);
  const setQuantity = useCart((s) => s.setQuantity);

  if (!hydrated) {
    return (
      <div className="container-page grid gap-6 py-10 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-3">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-page py-12">
        <EmptyState
          icon={<ShoppingBag size={34} />}
          title={dict.cart.empty}
          text={dict.cart.emptyHint}
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <ButtonLink href={r.doors}>{dict.actions.selectDoor}</ButtonLink>
              <ButtonLink href={r.configurator} variant="secondary">
                {dict.actions.configure}
              </ButtonLink>
            </div>
          }
        />
      </div>
    );
  }

  const subtotal = cartSubtotal(items);

  return (
    <div className="container-page grid gap-6 py-8 lg:grid-cols-[1.6fr_1fr] lg:gap-10 lg:py-10">
      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.id} className="flex gap-4 p-3 sm:gap-5 sm:p-4">
            <Link
              href={r.product(item.productSlug)}
              className="relative aspect-3/4 w-20 shrink-0 overflow-hidden border border-line bg-bone sm:w-28"
            >
              <DoorVisual panelHex={item.panelHex} ambient={false} />
            </Link>

            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    href={r.product(item.productSlug)}
                    className="text-[15px] font-medium text-ink hover:underline"
                  >
                    {item.productName}
                  </Link>
                  <p className="mt-0.5 text-xs text-stone">
                    {item.sku} · {item.snapshot.width} × {item.snapshot.height} mm
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  aria-label={dict.cart.removeItem}
                  className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center text-stone transition-colors hover:text-danger"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              {/* PRD §65 — konfiqurasiya snapshot-u */}
              <ul className="mt-2.5 flex flex-wrap gap-x-4 gap-y-0.5 text-[12px] text-graphite">
                {item.snapshot.lines.map((line) => (
                  <li key={line.group}>
                    <span className="text-stone">{line.group}:</span> {line.value}
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-4">
                <div className="flex items-center border border-line">
                  <button
                    type="button"
                    onClick={() => setQuantity(item.id, item.quantity - 1)}
                    aria-label="Azalt"
                    className="flex h-9 w-9 items-center justify-center text-graphite transition-colors hover:bg-bone"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-10 text-center text-sm font-medium tabular-nums text-ink">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(item.id, item.quantity + 1)}
                    aria-label="Artır"
                    className="flex h-9 w-9 items-center justify-center text-graphite transition-colors hover:bg-bone"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <div className="text-right">
                  {item.quantity > 1 && (
                    <p className="text-xs text-stone">{formatPrice(item.unitPrice)} × {item.quantity}</p>
                  )}
                  <p className="text-lg font-semibold tracking-tight tabular-nums text-ink">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <aside className="lg:sticky lg:top-24 lg:h-fit">
        <Card className="p-5">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone">
            {dict.checkout.orderSummary}
          </h2>

          <dl className="mt-4 space-y-2.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-stone">{dict.common.subtotal}</dt>
              <dd className="font-medium tabular-nums text-ink">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-stone">{dict.services.delivery}</dt>
              <dd className="text-graphite">Növbəti addımda</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-stone">{dict.services.installation}</dt>
              <dd className="text-graphite">Növbəti addımda</dd>
            </div>
          </dl>

          <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
            <span className="text-sm font-medium text-ink">{dict.common.total}</span>
            <span className="text-2xl font-semibold tracking-tight tabular-nums text-ink">
              {formatPrice(subtotal)}
            </span>
          </div>

          <ButtonLink href={r.checkout} size="lg" full className="mt-5">
            {dict.cart.goToCheckout}
          </ButtonLink>
          <Button
            variant="ghost"
            full
            className="mt-2"
            onClick={() => (window.location.href = r.doors)}
          >
            {dict.cart.continueShopping}
          </Button>

          <Notice className="mt-5">{dict.cart.deliveryNote}</Notice>
        </Card>
      </aside>
    </div>
  );
}
