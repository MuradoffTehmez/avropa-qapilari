"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { FileQuestion, Link2, ShieldCheck } from "lucide-react";

import type { Dictionary } from "@/i18n";
import type { ConfigurationSelection, Locale, OptionGroupKey, Product } from "@/types";
import { routes } from "@/lib/routes";
import { cn, formatPrice, uid } from "@/lib/utils";
import { Badge, Card, DataRow, EmptyState, Section } from "@/components/ui/primitives";
import { Button, ButtonLink } from "@/components/ui/Button";
import { toast } from "@/components/ui/overlays";
import type { DoorFace } from "@/components/product/DoorVisual";
import { DoorTurntable, faceForAngle } from "@/components/product/DoorTurntable";
import { configuredConstruction } from "@/features/configurator/construction";
import { optionLabel } from "@/mock/options.i18n";
import { parseSharedDesign } from "@/features/configurator/shared";
import { calculatePrice } from "@/features/pricing/engine";
import { buildPreview, snapshotKeys } from "@/components/configurator/Configurator";
import { materialName, productShort, styleName } from "@/lib/i18n-format";
import { useCart } from "@/store/cart";
import { resolveProductOption } from "@/features/configurator/product-options";

/**
 * Paylaşılan konfiqurasiya səhifəsi (PRD §57).
 * Link yalnız qapı seçimlərini daşıyır — şəxsi məlumat ötürülmür.
 */
/** Serverdə saxlanmış konfiqurasiya — `/api/configurations/:code`-un nəticəsi. */
export interface SavedConfiguration {
  productSlug: string;
  width: number;
  height: number;
  choices: Record<string, string | string[]>;
  total: number;
}

export function SharedConfiguration({
  code,
  locale,
  dict,
  saved,
  product: serverProduct,
}: {
  code: string;
  locale: Locale;
  dict: Dictionary;
  /** Kod bazada tapılıbsa seçimlər və məbləğ serverdən gəlir. */
  saved?: SavedConfiguration | null;
  product?: Product | null;
}) {
  const params = useSearchParams();
  const r = routes(locale);
  const add = useCart((s) => s.add);
  // Konfiquratorla eyni 360° baxış — paylaşılan link fərqli görünməsin.
  const [previewAngle, setPreviewAngle] = useState(0);
  const previewFace = faceForAngle(previewAngle);
  const showFace = (face: DoorFace) => setPreviewAngle(face === "INSIDE" ? 180 : 0);

  // Köhnə paylaşma linkləri seçimləri sorğu parametrində daşıyırdı;
  // yeni linklər yalnız kod daşıyır. Hər iki halda məhsulu server verir.
  const raw = params.get("d") ?? undefined;

  const product = serverProduct ?? undefined;
  const selection = useMemo(
    () =>
      product
        ? saved
          ? { width: saved.width, height: saved.height, choices: saved.choices }
          : parseSharedDesign(raw, product)
        : undefined,
    [product, raw, saved],
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

  // Saxlanmış konfiqurasiyada məbləği server hesablayıb (PRD §130);
  // yalnız köhnə linklərdə client hesablamasına düşürük.
  const price = saved
    ? { ...calculatePrice(product, selection, { locale, dict }), total: saved.total }
    : calculatePrice(product, selection, { locale, dict });
  const preview = buildPreview(selection, product, new Set(), previewFace);
  const lines = summaryLines(selection, product, locale, dict);

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
        lines: snapshotKeys(selection!, product!),
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
              <DoorTurntable
                visual={preview}
                stack={configuredConstruction(product, selection)}
                angle={previewAngle}
                onAngleChange={setPreviewAngle}
                label={dict.actions.doorPreview}
                hint={dict.configurator.rotateHint}
              />
            </div>
            <p className="absolute bottom-3 left-3 rounded-[2px] bg-paper/85 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.1em] text-graphite backdrop-blur">
              {selection.width} × {selection.height} mm
            </p>
            <div className="absolute right-3 top-3 flex border border-line bg-paper/90 p-0.5 backdrop-blur">
              {(["OUTSIDE", "INSIDE"] as const).map((face) => (
                <button
                  key={face}
                  type="button"
                  onClick={() => showFace(face)}
                  aria-pressed={previewFace === face && (previewAngle === 0 || previewAngle === 180)}
                  className={cn(
                    "min-h-9 px-3 text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors",
                    previewFace === face && (previewAngle === 0 || previewAngle === 180)
                      ? "bg-ink text-paper"
                      : "text-stone hover:text-ink",
                  )}
                >
                  {face === "OUTSIDE" ? dict.configurator.outside : dict.configurator.inside}
                </button>
              ))}
            </div>
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
            {productShort(product, dict)}
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

function summaryLines(
  selection: ConfigurationSelection,
  product: Product,
  locale: Locale,
  dict: Dictionary,
) {
  const out: { group: string; value: string }[] = [];

  for (const [key, raw] of Object.entries(selection.choices)) {
    if (!raw) continue;
    const ids = Array.isArray(raw) ? raw : [raw];
    const labels = ids
      .map((id) => {
        const v = resolveProductOption(product, id);
        return v ? optionLabel(v, locale) : null;
      })
      .filter(Boolean) as string[];
    if (labels.length === 0) continue;
    out.push({
      group: dict.configurator.steps[key as OptionGroupKey],
      value: labels.join(", "),
    });
  }

  return out;
}
