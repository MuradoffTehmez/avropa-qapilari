"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { FileQuestion, Link2, ShieldCheck } from "lucide-react";

import type { Dictionary } from "@/i18n";
import type { ConfigurationSelection, Locale, OptionGroupKey } from "@/types";
import { routes } from "@/lib/routes";
import { formatPrice, uid } from "@/lib/utils";
import { Badge, Card, DataRow, EmptyState, Section } from "@/components/ui/primitives";
import { Button, ButtonLink } from "@/components/ui/Button";
import { toast } from "@/components/ui/overlays";
import { DoorVisual, type GlassKind, type HandleKind } from "@/components/product/DoorVisual";
import { getProduct } from "@/mock/products";
import { findOptionValue, optionGroups } from "@/mock/options";
import { parseSharedDesign } from "@/features/configurator/shared";
import { calculatePrice } from "@/features/pricing/engine";
import { materialName, styleName } from "@/lib/i18n-format";
import { useCart } from "@/store/cart";

/**
 * Paylaşılan konfiqurasiya səhifəsi (PRD §57).
 * Link yalnız qapı seçimlərini daşıyır — şəxsi məlumat ötürülmür.
 */
export function SharedConfiguration({
  code,
  locale,
  dict,
}: {
  code: string;
  locale: Locale;
  dict: Dictionary;
}) {
  const params = useSearchParams();
  const r = routes(locale);
  const add = useCart((s) => s.add);

  const slug = params.get("p") ?? "";
  const raw = params.get("d") ?? undefined;

  const product = slug ? getProduct(slug) : undefined;
  const selection = useMemo(
    () => (product ? parseSharedDesign(raw, product) : undefined),
    [product, raw],
  );

  if (!product || !selection) {
    return (
      <Section>
        <div className="container-page">
          <EmptyState
            icon={<FileQuestion size={34} />}
            title={dict.configurator.sharedInvalid}
            text={dict.configurator.sharedInvalidHint}
            action={<ButtonLink href={r.configurator}>{dict.actions.startConfigurator}</ButtonLink>}
          />
        </div>
      </Section>
    );
  }

  const price = calculatePrice(product, selection);
  const preview = buildPreview(selection, product);
  const lines = summaryLines(selection, dict);

  function copyLink() {
    navigator.clipboard?.writeText(window.location.href).then(
      () => toast(dict.configurator.linkCopied),
      () => toast(window.location.href),
    );
  }

  function addToCart() {
    add({
      id: uid(),
      productId: product!.id,
      productSlug: product!.slug,
      productName: product!.name,
      sku: product!.sku,
      panelHex: preview.panelHex,
      quantity: 1,
      unitPrice: price.total,
      snapshot: {
        width: selection!.width,
        height: selection!.height,
        lines: lines.map((l) => ({ group: l.group, value: l.value })),
      },
    });
    toast(dict.actions.addToCart);
  }

  const designHref = `${r.configuratorFor(product.slug)}?design=${encodeURIComponent(JSON.stringify(selection))}`;

  return (
    <Section className="!pt-8">
      <div className="container-page grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
        {/* Önizləmə */}
        <div>
          <div className="relative border border-line bg-bone">
            <div className="mx-auto aspect-3/4 max-w-sm">
              <DoorVisual {...preview} />
            </div>
            <p className="absolute bottom-3 left-3 rounded-[2px] bg-paper/85 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.1em] text-graphite backdrop-blur">
              {selection.width} × {selection.height} mm
            </p>
          </div>

          <p className="mt-3 flex items-center gap-1.5 text-[12px] text-stone">
            <ShieldCheck size={13} className="shrink-0 text-gold-500" />
            {dict.configurator.sharedPrivacy}
          </p>
        </div>

        {/* Detallar */}
        <div>
          <Badge tone="gold">{dict.configurator.sharedBadge}</Badge>

          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            {product.name}
          </h1>
          <p className="mt-1.5 font-mono text-[13px] text-stone">{code}</p>

          <p className="mt-4 text-[15px] leading-relaxed text-graphite">
            {product.shortDescription}
          </p>

          <dl className="mt-6 border-t border-line">
            <DataRow label={dict.product.sku} value={product.sku} />
            <DataRow label={dict.catalog.material} value={materialName(product.material, dict)} />
            <DataRow label={dict.catalog.style} value={styleName(product.style, dict)} />
            {product.securityClass !== "—" && (
              <DataRow label={dict.catalog.securityClass} value={product.securityClass} />
            )}
            {lines.map((l) => (
              <DataRow key={l.group} label={l.group} value={l.value} />
            ))}
          </dl>

          <Card className="mt-6 p-5">
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone">
                {dict.configurator.finalPrice}
              </span>
              <span className="text-2xl font-semibold tracking-tight tabular-nums text-ink">
                {formatPrice(price.total)}
              </span>
            </div>

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <ButtonLink href={designHref} size="lg" className="justify-center">
                {dict.configurator.sharedOpen}
              </ButtonLink>
              <Button variant="secondary" size="lg" onClick={addToCart} className="justify-center">
                {dict.actions.addToCart}
              </Button>
            </div>

            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <Button variant="ghost" onClick={copyLink} className="border border-line">
                <Link2 size={15} /> {dict.actions.copy}
              </Button>
              <Link
                href={r.quote}
                className="flex h-11 items-center justify-center border border-line text-sm font-medium text-ink transition-colors hover:border-mist"
              >
                {dict.actions.requestQuote}
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */

function buildPreview(selection: ConfigurationSelection, product: NonNullable<ReturnType<typeof getProduct>>) {
  const outside = findOptionValue(selection.choices.OUTSIDE_COLOR as string);
  const glassValue = findOptionValue(selection.choices.GLASS as string);
  const handleValue = findOptionValue(selection.choices.HANDLE as string);
  const smartLock = findOptionValue(selection.choices.SMART_LOCK as string);
  const opening = findOptionValue(selection.choices.OPENING_DIRECTION as string);
  const accessories = Array.isArray(selection.choices.ACCESSORY)
    ? (selection.choices.ACCESSORY as string[])
    : [];

  return {
    panelHex: outside?.hex ?? product.panelHexes[0],
    style: product.style,
    glass: (glassValue?.code ?? "NONE") as GlassKind,
    handle: (handleValue?.code ?? "INOX") as HandleKind,
    side: (opening?.code?.startsWith("LEFT") ? "LEFT" : "RIGHT") as "LEFT" | "RIGHT",
    smartLock: Boolean(smartLock && smartLock.code !== "NONE"),
    viewer: accessories.includes("ac-viewer"),
    houseNumber: accessories.includes("ac-number"),
    widthMm: selection.width,
    heightMm: selection.height,
  };
}

function summaryLines(selection: ConfigurationSelection, dict: Dictionary) {
  const out: { group: string; value: string }[] = [];

  for (const [key, raw] of Object.entries(selection.choices)) {
    if (!raw) continue;
    const ids = Array.isArray(raw) ? raw : [raw];
    const labels = ids.map((id) => findOptionValue(id)?.label).filter(Boolean) as string[];
    if (labels.length === 0) continue;
    out.push({
      group: dict.configurator.steps[key as OptionGroupKey] ?? optionGroups[key as OptionGroupKey].title,
      value: labels.join(", "),
    });
  }

  return out;
}
