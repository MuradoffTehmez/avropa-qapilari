"use client";

import { useWorkflow } from "@/store/workflow";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Layers, Link2, RotateCcw, Save, X } from "lucide-react";

import type { Dictionary } from "@/i18n";
import type {
  ConfigurationSelection,
  Locale,
  OptionGroupKey,
  OptionGroupMeta,
  OptionValue,
  Product,
  SizePreset,
} from "@/types";
import { routes } from "@/lib/routes";
import { clamp, cn, formatPrice, uid } from "@/lib/utils";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Field, Input, RadioCard } from "@/components/ui/form";
import { Badge, Notice } from "@/components/ui/primitives";
import { Stepper } from "@/components/ui/disclosure";
import { toast } from "@/components/ui/overlays";
import {
  DoorVisual,
  type CylinderKind,
  type DoorFace,
  type FrameKind,
  type GlassKind,
  type GlassPattern,
  type HandleKind,
  type HingeKind,
  type LockKind,
  type OpeningKind,
  type SidelightKind,
  type SurfaceTexture,
  type ThresholdKind,
} from "@/components/product/DoorVisual";
import { DoorLayers, type VisualLayer } from "@/components/configurator/DoorLayers";
import { optionLabel, optionText } from "@/mock/options.i18n";
import { calculatePrice, sizeRangeLabel } from "@/features/pricing/engine";
import { toBreakdown } from "@/features/pricing/labels";
import { useServerPrice } from "@/components/configurator/useServerPrice";
import { checkCompatibility, pruneIncompatible } from "@/features/configurator/compatibility";
import { defaultChoices } from "@/features/configurator/defaults";
import { productOptionsForGroup, resolveProductOption } from "@/features/configurator/product-options";
import { useCart } from "@/store/cart";
import { useSession } from "@/store/session";
import { ApiRequestError, apiFetch } from "@/lib/api";

export function Configurator({
  product,
  groups,
  sizePresets,
  locale,
  dict,
  initialSelection,
}: {
  initialSelection?: ConfigurationSelection;
  product: Product;
  /** Qrup qaydaları bazadan gəlir (`catalogOptionGroups`). */
  groups: Partial<Record<OptionGroupKey, OptionGroupMeta>>;
  /** Hazır ölçü presetləri bazadan gəlir (`catalogSizePresets`). */
  sizePresets: SizePreset[];
  locale: Locale;
  dict: Dictionary;
}) {
  const r = routes(locale);
  const addToCart = useCart((s) => s.add);
  const findValue = useCallback((id: string) => resolveProductOption(product, id), [product]);

  const steps = useMemo(
    () => product.optionGroups,
    [product.optionGroups],
  );

  const [stepIndex, setStepIndex] = useState(0);
  const [hiddenLayers, setHiddenLayers] = useState<Set<string>>(new Set());
  const [layersOpen, setLayersOpen] = useState(false);
  const [customSize, setCustomSize] = useState(false);
  const [previewFace, setPreviewFace] = useState<DoorFace>("OUTSIDE");

  // Başlanğıc seçim də uyğunluq qaydalarından keçirilir: bəzi qruplarda
  // (məsələn şüşə naxışı) bütün dəyərlər ilkin şərt tələb edir, ona görə
  // təmizlənməsə server sorğunu INCOMPATIBLE kimi rədd edir.
  const [selection, setSelection] = useState<ConfigurationSelection>(() =>
    pruneIncompatible(
      initialSelection ?? {
        width: product.defaultWidth,
        height: product.defaultHeight,
        choices: defaultChoices(product, groups),
      },
      findValue,
    ),
  );

  // Client hesablaması yalnız server cavabı gələnə qədər göstərilir.
  const estimate = useMemo(
    () => calculatePrice(product, selection, { locale, dict }),
    [product, selection, locale, dict],
  );
  const server = useServerPrice(product.slug, selection);
  const price = useMemo(
    () => (server.price ? toBreakdown(server.price, locale, dict, findValue) : estimate),
    [server.price, estimate, locale, dict, findValue],
  );
  const currentGroup = steps[stepIndex];
  const isSummary = stepIndex >= steps.length;

  function setChoice(group: OptionGroupKey, valueId: string, multi: boolean) {
    if (group === "INSIDE_COLOR") setPreviewFace("INSIDE");
    if (group === "OUTSIDE_COLOR") setPreviewFace("OUTSIDE");
    setSelection((prev) => {
      const next: ConfigurationSelection = { ...prev, choices: { ...prev.choices } };

      if (multi) {
        const list = Array.isArray(prev.choices[group]) ? ([...(prev.choices[group] as string[])]) : [];
        next.choices[group] = list.includes(valueId)
          ? list.filter((x) => x !== valueId)
          : [...list, valueId];
      } else {
        next.choices[group] = valueId;
      }

      return pruneIncompatible(next, findValue);
    });
  }

  function setSize(width: number, height: number) {
    setSelection((prev) => ({
      ...prev,
      width: clamp(width, 400, 3000),
      height: clamp(height, 1200, 3000),
    }));
  }

  function toggleLayer(key: string) {
    setHiddenLayers((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function reset() {
    setSelection(
      pruneIncompatible(
        {
          width: product.defaultWidth,
          height: product.defaultHeight,
          choices: defaultChoices(product, groups),
        },
        findValue,
      ),
    );
    setCustomSize(false);
    setStepIndex(0);
    setHiddenLayers(new Set());
    setPreviewFace("OUTSIDE");
    toast(dict.configurator.resetDone);
  }

  function goToStep(index: number) {
    const target = steps[index];
    if (target === "INSIDE_COLOR") setPreviewFace("INSIDE");
    if (target === "OUTSIDE_COLOR") setPreviewFace("OUTSIDE");
    setStepIndex(index);
  }

  function addConfiguredToCart() {
    addToCart({
      id: uid(),
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      sku: product.sku,
      panelHex: previewProps.panelHex,
      quantity: 1,
      unitPrice: price.total,
      includedServices: [selection.choices.INSTALLATION, selection.choices.DELIVERY].reduce<number>((sum, id) => sum + (typeof id === "string" ? findValue(id)?.priceDelta ?? 0 : 0), 0),
      snapshot: {
        width: selection.width,
        height: selection.height,
        lines: snapshotKeys(selection, product),
      },
    });
    toast(dict.configurator.addedToCart);
  }

  const previewProps = buildPreview(selection, product, hiddenLayers, previewFace);
  const visualLayers = buildVisualLayers(selection, product, dict, locale);
  const selectedLines = summaryLines(selection, product, locale, dict);
  const previewKey = JSON.stringify([
    selection.width,
    selection.height,
    selection.choices,
    [...hiddenLayers].sort(),
    previewFace,
  ]);

  return (
    <div className="configurator-shell lg:grid lg:min-h-[calc(100dvh-4.5rem)] lg:grid-cols-[1.15fr_1fr]">
      {/* ------------------------------------------------- PREVIEW */}
      <div className="configurator-preview sticky top-16 z-20 flex flex-col border-b border-line bg-bone lg:top-[4.5rem] lg:h-[calc(100dvh-4.5rem)] lg:border-b-0 lg:border-r">
        <div className="relative flex h-52 shrink-0 items-center justify-center px-4 py-4 sm:h-72 lg:h-auto lg:flex-1 lg:px-10">
          <div className="h-full max-h-[70vh] w-auto">
            <div key={previewKey} className="motion-preview h-full" style={{ aspectRatio: "3 / 4" }}>
              <DoorVisual {...previewProps} label={dict.actions.doorPreview} />
            </div>
          </div>

          <div className="absolute left-4 top-4 hidden lg:block">
            <p className="text-[11px] uppercase tracking-[0.18em] text-stone">
              {dict.configurator.preview}
            </p>
            <p className="mt-1 text-lg font-medium text-ink">{product.name}</p>
            <p className="text-[13px] text-stone">
              {selection.width} × {selection.height} mm
            </p>
          </div>

          <div className="absolute bottom-3 left-3 flex border border-line bg-paper p-0.5 sm:bottom-4 sm:left-4 lg:bottom-4 lg:left-1/2 lg:-translate-x-1/2">
            {(["OUTSIDE", "INSIDE"] as DoorFace[]).map((face) => (
              <button
                key={face}
                type="button"
                onClick={() => setPreviewFace(face)}
                aria-pressed={previewFace === face}
                className={cn(
                  "min-h-8 px-3 text-[11px] font-medium transition-colors",
                  previewFace === face ? "bg-ink text-paper" : "text-stone hover:text-ink",
                )}
              >
                {face === "OUTSIDE" ? dict.configurator.outside : dict.configurator.inside}
              </button>
            ))}
          </div>

          {/* Qat paneli açarı */}
          <button
            type="button"
            onClick={() => setLayersOpen((o) => !o)}
            aria-expanded={layersOpen}
            className={cn(
              "absolute right-3 top-3 flex items-center gap-1.5 border px-2.5 py-1.5 text-[12px] transition-colors sm:right-4 sm:top-4",
              layersOpen
                ? "border-ink bg-ink text-paper"
                : "border-line bg-paper text-graphite hover:border-ink hover:text-ink",
            )}
          >
            {layersOpen ? <X size={13} /> : <Layers size={13} />}
            {dict.configurator.layers}
            {hiddenLayers.size > 0 && (
              <span className="ml-0.5 rounded-full bg-gold-500 px-1.5 text-[10px] font-semibold text-paper">
                {hiddenLayers.size}
              </span>
            )}
          </button>

          <div className="absolute bottom-4 right-4 hidden gap-2 lg:flex">
            <button
              type="button"
              onClick={reset}
              className="flex items-center gap-1.5 border border-line bg-paper px-3 py-1.5 text-[12px] text-graphite transition-colors hover:border-ink hover:text-ink"
            >
              <RotateCcw size={13} /> {dict.configurator.resetConfig}
            </button>
          </div>
        </div>

        {layersOpen && (
          <DoorLayers
            product={product}
            dict={dict}
            layers={visualLayers}
            hidden={hiddenLayers}
            onToggle={toggleLayer}
            selection={selection}
            className="max-h-[45dvh] shrink-0 lg:max-h-[52%]"
          />
        )}
      </div>

      {/* ------------------------------------------------- OPTIONS */}
      <div className="flex flex-col">
        <div className="border-b border-line bg-paper px-4 py-3 sm:px-6 lg:px-8">
          <Stepper
            steps={[...steps.map((s) => dict.configurator.steps[s]), dict.configurator.summary]}
            current={stepIndex}
            onSelect={goToStep}
          />
        </div>

        <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {isSummary ? (
            <SummaryStep
              product={product}
              selection={selection}
              lines={selectedLines}
              dict={dict}
              locale={locale}
            />
          ) : currentGroup === "SIZE" ? (
            <SizeStep
              product={product}
              sizePresets={sizePresets}
              selection={selection}
              setSize={setSize}
              customSize={customSize}
              setCustomSize={setCustomSize}
              dict={dict}
              requiresQuote={price.requiresQuote}
            />
          ) : (
            <OptionStep
              group={currentGroup}
              multi={groups[currentGroup]?.multi ?? false}
              selection={selection}
              product={product}
              onSelect={setChoice}
              dict={dict}
              locale={locale}
            />
          )}
        </div>

        {/* --------------------------------------------- PRICE BAR */}
        <div className="configurator-price sticky bottom-0 z-30 border-t border-line bg-paper/97 backdrop-blur">
          <div className="px-4 py-3 sm:px-6 lg:px-8">
            <details className="group mb-3 hidden lg:block">
              <summary className="cursor-pointer list-none text-[12px] font-medium text-gold-600 underline-offset-2 hover:underline">
                {dict.configurator.priceBreakdown} ({price.lines.length})
              </summary>
              <dl className="mt-3 max-h-44 space-y-1 overflow-y-auto border-t border-line pt-3 text-[13px]">
                {price.lines.map((l) => (
                  <div key={l.key} className="flex justify-between gap-4">
                    <dt className="text-stone">{l.label}</dt>
                    <dd className="shrink-0 tabular-nums text-graphite">
                      {l.amount >= 0 ? "+" : ""}
                      {formatPrice(l.amount)}
                    </dd>
                  </div>
                ))}
                {price.discount > 0 && (
                  <div className="flex justify-between gap-4 text-success">
                    <dt>{dict.common.discount}</dt>
                    <dd className="tabular-nums">−{formatPrice(price.discount)}</dd>
                  </div>
                )}
              </dl>
            </details>

            {price.requiresQuote && (
              <Notice tone="warning" className="mb-3">
                {price.quoteReason}{" "}
                <Link href={r.quote} className="font-medium underline underline-offset-2">
                  {dict.actions.requestQuote}
                </Link>
              </Notice>
            )}

            {server.error && (
              <Notice tone="warning" className="mb-3">
                {dict.configurator.priceUnavailable}
              </Notice>
            )}

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-stone">
                  {dict.configurator.finalPrice}
                </p>
                <p
                  className={cn(
                    "text-2xl font-semibold tracking-tight tabular-nums text-ink transition-opacity",
                    server.pending && "opacity-55",
                  )}
                  aria-busy={server.pending}
                  aria-live="polite"
                >
                  {formatPrice(price.total)}
                </p>
                <span className="sr-only">
                  {server.pending ? dict.configurator.priceChecking : ""}
                </span>
              </div>

              <div className="flex gap-2">
                {stepIndex > 0 && (
                  <Button variant="secondary" onClick={() => goToStep(stepIndex - 1)}>
                    <ArrowLeft size={16} />
                    <span className="hidden sm:inline">{dict.actions.back}</span>
                  </Button>
                )}
                {isSummary ? (
                  <Button onClick={addConfiguredToCart} disabled={price.requiresQuote}>
                    {dict.actions.addToCart}
                  </Button>
                ) : (
                  <Button onClick={() => goToStep(stepIndex + 1)}>
                    <span className="inline">{dict.actions.continue}</span>
                    <ArrowRight size={16} />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

/** Səbətə yazılan snapshot: qrup açarı + option id (dil-müstəqil). */
export function snapshotKeys(selection: ConfigurationSelection, product: Product) {
  const lines: { group: string; value: string }[] = [];
  for (const [key, raw] of Object.entries(selection.choices)) {
    if (!raw) continue;
    const ids = (Array.isArray(raw) ? raw : [raw]).filter((id) =>
      resolveProductOption(product, id),
    );
    if (ids.length === 0) continue;
    for (const id of ids) lines.push({ group: key, value: id });
  }
  return lines;
}

function summaryLines(
  selection: ConfigurationSelection,
  product: Product,
  locale: Locale,
  dict: Dictionary,
) {
  const lines: { group: string; value: string }[] = [];

  for (const [key, raw] of Object.entries(selection.choices)) {
    if (!raw) continue;
    const groupKey = key as OptionGroupKey;
    const ids = Array.isArray(raw) ? raw : [raw];
    const labels = ids
      .map((id) => {
        const v = resolveProductOption(product, id);
        return v ? optionLabel(v, locale) : null;
      })
      .filter(Boolean) as string[];
    if (labels.length === 0) continue;
    lines.push({ group: dict.configurator.steps[groupKey], value: labels.join(", ") });
  }

  return lines;
}

export function buildPreview(
  selection: ConfigurationSelection,
  product: Product,
  hidden: Set<string> = new Set(),
  face: DoorFace = "OUTSIDE",
) {
  const value = (key: OptionGroupKey) => resolveProductOption(product, selection.choices[key] as string);

  const outside = value("OUTSIDE_COLOR");
  const inside = value("INSIDE_COLOR");
  const frame = value("FRAME");
  const panelStyle = value("PANEL_STYLE");
  const glassValue = value("GLASS");
  const glassPattern = value("GLASS_PATTERN");
  const handleValue = value("HANDLE");
  const hingeValue = value("HINGE");
  const sidelightValue = value("SIDELIGHT");
  const smartLock = value("SMART_LOCK");
  const lock = value("LOCK");
  const cylinder = value("CYLINDER");
  const threshold = value("THRESHOLD");
  const opening = value("OPENING_DIRECTION");
  const accessories = Array.isArray(selection.choices.ACCESSORY)
    ? (selection.choices.ACCESSORY as string[])
    : [];

  const off = (key: string) => hidden.has(key);
  const textureOf = (code?: string): SurfaceTexture => {
    if (!code) return "SOLID";
    if (/OAK|WALNUT|WENGE|WOOD/.test(code)) return "WOOD";
    if (code.includes("CONCRETE")) return "CONCRETE";
    return "SOLID";
  };

  return {
    panelHex: off("OUTSIDE_COLOR") ? "#c7ccd3" : (outside?.hex ?? product.panelHexes[0]),
    insideHex: off("INSIDE_COLOR") ? "#c7ccd3" : (inside?.hex ?? outside?.hex ?? product.panelHexes[0]),
    texture: off("OUTSIDE_COLOR") ? "SOLID" as const : textureOf(outside?.code),
    insideTexture: off("INSIDE_COLOR") ? "SOLID" as const : textureOf(inside?.code),
    face,
    style: (off("PANEL_STYLE") ? product.style : ((panelStyle?.code as Product["style"]) ?? product.style)),
    hidePattern: off("PANEL_STYLE"),
    glass: (off("GLASS") ? "NONE" : (glassValue?.code ?? "NONE")) as GlassKind,
    glassPattern: (off("GLASS_PATTERN") ? "PLAIN" : (glassPattern?.code ?? "PLAIN")) as GlassPattern,
    handle: (handleValue?.code ?? "INOX") as HandleKind,
    handleHex: handleValue?.hex,
    hideHandle: off("HANDLE"),
    hinge: (off("HINGE") ? "STD" : (hingeValue?.code ?? "STD")) as HingeKind,
    sidelight: (off("SIDELIGHT") ? "NONE" : (sidelightValue?.code ?? "NONE")) as SidelightKind,
    side: (opening?.code?.startsWith("LEFT") ? "LEFT" : "RIGHT") as "LEFT" | "RIGHT",
    opening: (opening?.code?.endsWith("OUTWARD") ? "OUTWARD" : "INWARD") as OpeningKind,
    frame: (off("FRAME") ? "HIDDEN" : (frame?.code ?? "STD")) as FrameKind,
    lock: (off("LOCK") ? "3P" : (lock?.code ?? "3P")) as LockKind,
    hideLock: off("LOCK"),
    cylinder: (off("CYLINDER") ? "STD" : (cylinder?.code ?? "STD")) as CylinderKind,
    hideCylinder: off("CYLINDER"),
    threshold: (off("THRESHOLD")
      ? "DROP"
      : threshold?.code === "AUTO"
        ? "DROP"
        : (threshold?.code ?? "STD")) as ThresholdKind,
    showThreshold: !off("THRESHOLD"),
    showOpeningGuide: !off("OPENING_DIRECTION"),
    smartLock: !off("SMART_LOCK") && Boolean(smartLock && smartLock.code !== "NONE"),
    viewer: !off("ACCESSORY") && accessories.some((a) => a.startsWith("ac-viewer")),
    houseNumber: !off("ACCESSORY") && accessories.includes("ac-number"),
    closer: !off("ACCESSORY") && accessories.includes("ac-closer"),
    chain: !off("ACCESSORY") && accessories.includes("ac-chain"),
    letterbox: !off("ACCESSORY") && accessories.includes("ac-letterbox"),
    kickplate: !off("ACCESSORY") && accessories.includes("ac-kickplate"),
    bell: !off("ACCESSORY") && accessories.includes("ac-bell"),
    camera: !off("ACCESSORY") && accessories.includes("ac-camera"),
    widthMm: selection.width,
    heightMm: selection.height,
  };
}

/** Preview-i təşkil edən qatlar — çöl tərəfdən başlayaraq (PRD §50). */
function buildVisualLayers(
  selection: ConfigurationSelection,
  product: Product,
  dict: Dictionary,
  locale: Locale,
): VisualLayer[] {
  const layers: VisualLayer[] = [
    {
      key: "BASE",
      label: dict.configurator.baseLayer,
      value: `${product.name} · ${selection.width} × ${selection.height} mm`,
      priceDelta: product.basePrice,
      swatch: "var(--color-sand)",
      toggleable: false,
    },
  ];

  const order: OptionGroupKey[] = [
    "OPENING_DIRECTION",
    "PANEL_STYLE",
    "OUTSIDE_COLOR",
    "INSIDE_COLOR",
    "FRAME",
    "SIDELIGHT",
    "GLASS",
    "GLASS_PATTERN",
    "HANDLE",
    "HINGE",
    "LOCK",
    "CYLINDER",
    "SMART_LOCK",
    "THRESHOLD",
    "INSULATION",
    "ACCESSORY",
  ];

  for (const key of order) {
    if (!product.optionGroups.includes(key)) continue;
    const raw = selection.choices[key];
    if (!raw) continue;

    const ids = Array.isArray(raw) ? raw : [raw];
    const values = ids
      .map((id) => resolveProductOption(product, id))
      .filter((value): value is OptionValue => value !== undefined);
    if (values.length === 0) continue;
    if (values.length === 1 && values[0].code === "NONE") continue;

    layers.push({
      key,
      label: dict.configurator.steps[key],
      value: values.map((v) => optionLabel(v, locale)).join(", "),
      priceDelta: values.reduce((sum, v) => sum + v.priceDelta, 0),
      swatch: values[0].swatch ?? values[0].hex,
      toggleable: true,
    });
  }

  return layers;
}

/* ------------------------------- steps ------------------------------ */

function SizeStep({
  product,
  sizePresets,
  selection,
  setSize,
  customSize,
  setCustomSize,
  dict,
  requiresQuote,
}: {
  product: Product;
  sizePresets: SizePreset[];
  selection: ConfigurationSelection;
  setSize: (w: number, h: number) => void;
  customSize: boolean;
  setCustomSize: (v: boolean) => void;
  dict: Dictionary;
  requiresQuote: boolean;
}) {
  return (
    <div>
      <StepHeading title={dict.configurator.steps.SIZE} hint={dict.configurator.hints.SIZE} />

      <div className="mb-6 flex gap-2">
        <button
          type="button"
          onClick={() => setCustomSize(false)}
          className={cn(
            "flex-1 border px-4 py-2.5 text-[13px] font-medium transition-colors",
            !customSize ? "border-ink bg-ink text-paper" : "border-line text-graphite hover:border-mist",
          )}
        >
          {dict.configurator.standardSizes}
        </button>
        <button
          type="button"
          onClick={() => setCustomSize(true)}
          className={cn(
            "flex-1 border px-4 py-2.5 text-[13px] font-medium transition-colors",
            customSize ? "border-ink bg-ink text-paper" : "border-line text-graphite hover:border-mist",
          )}
        >
          {dict.configurator.customSize}
        </button>
      </div>

      {customSize ? (
        <div className="max-w-md space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label={dict.configurator.widthMm}>
              <Input
                type="number"
                inputMode="numeric"
                value={selection.width}
                onChange={(e) => setSize(Number(e.target.value) || 0, selection.height)}
              />
            </Field>
            <Field label={dict.configurator.heightMm}>
              <Input
                type="number"
                inputMode="numeric"
                value={selection.height}
                onChange={(e) => setSize(selection.width, Number(e.target.value) || 0)}
              />
            </Field>
          </div>

          <p className="text-[13px] text-stone">
            {dict.configurator.sizeRange}: {sizeRangeLabel(product)}
          </p>

          {requiresQuote && <Notice tone="warning">{dict.configurator.quoteRequired}</Notice>}
        </div>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {sizePresets
            .filter(
              (s) =>
                s.width >= product.minWidth &&
                s.width <= product.maxWidth &&
                s.height >= product.minHeight &&
                s.height <= product.maxHeight,
            )
            .map((s) => {
              const active = selection.width === s.width && selection.height === s.height;
              return (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setSize(s.width, s.height)}
                  aria-pressed={active}
                  className={cn(
                    "flex items-center justify-between border p-3.5 text-left transition-colors",
                    active ? "border-ink bg-bone" : "border-line hover:border-mist",
                  )}
                >
                  <span>
                    <span className="block text-sm font-medium text-ink">{s.label} mm</span>
                    <span className="text-xs text-stone">
                      {s.width === product.defaultWidth && s.height === product.defaultHeight
                        ? dict.configurator.sizeStandard
                        : dict.configurator.sizeAlternative}
                    </span>
                  </span>
                  {active && <Check size={16} className="text-ink" />}
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
}

function OptionStep({
  group,
  multi,
  selection,
  product,
  onSelect,
  dict,
  locale,
}: {
  group: OptionGroupKey;
  multi: boolean;
  selection: ConfigurationSelection;
  product: Product;
  onSelect: (group: OptionGroupKey, valueId: string, multi: boolean) => void;
  dict: Dictionary;
  locale: Locale;
}) {
  const isColor = group === "OUTSIDE_COLOR" || group === "INSIDE_COLOR";
  const current = selection.choices[group];

  const labelOf = (id: string) => {
    const v = resolveProductOption(product, id);
    return v ? optionLabel(v, locale) : id;
  };

  const availableValues = productOptionsForGroup(product, group);
  const withCompat = availableValues.map((v) => ({
    value: v,
    compat: checkCompatibility(v, selection, (id) => resolveProductOption(product, id), labelOf, dict),
  }));

  return (
    <div>
      <StepHeading
        title={dict.configurator.steps[group]}
        hint={dict.configurator.hints[group]}
        multi={multi}
        multipleChoiceLabel={dict.configurator.multipleChoice}
      />

      {isColor ? (
        <ColorGrid
          items={withCompat}
          selectedId={current as string}
          locale={locale}
          onSelect={(id) => onSelect(group, id, false)}
        />
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {withCompat.map(({ value, compat }) => {
            const selected = multi
              ? Array.isArray(current) && current.includes(value.id)
              : current === value.id;

            const text = optionText(value, locale);

            return multi ? (
              <button
                key={value.id}
                type="button"
                disabled={!compat.allowed}
                onClick={() => onSelect(group, value.id, true)}
                className={cn(
                  "flex items-start gap-3 border p-3.5 text-left transition-colors",
                  selected ? "border-ink bg-bone" : "border-line hover:border-mist",
                  !compat.allowed && "cursor-not-allowed opacity-45",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-[2px] border",
                    selected ? "border-ink bg-ink" : "border-mist",
                  )}
                >
                  {selected && <Check size={11} strokeWidth={3} className="text-paper" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-ink">{text.label}</span>
                  {text.description && (
                    <span className="mt-0.5 block text-xs text-stone">{text.description}</span>
                  )}
                </span>
                <span className="shrink-0 text-sm tabular-nums text-graphite">
                  {value.priceDelta === 0 ? "—" : `+${formatPrice(value.priceDelta)}`}
                </span>
              </button>
            ) : (
              <RadioCard
                key={value.id}
                name={group}
                label={text.label}
                description={text.description}
                badge={text.badge}
                checked={selected}
                disabled={!compat.allowed}
                reason={compat.reason}
                price={value.priceDelta === 0 ? "—" : `+${formatPrice(value.priceDelta)}`}
                onChange={() => onSelect(group, value.id, false)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function ColorGrid({
  items,
  selectedId,
  locale,
  onSelect,
}: {
  items: { value: OptionValue; compat: { allowed: boolean; reason?: string } }[];
  selectedId?: string;
  locale: Locale;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {items.map(({ value, compat }) => {
        const selected = selectedId === value.id;
        return (
          <button
            key={value.id}
            type="button"
            disabled={!compat.allowed}
            onClick={() => onSelect(value.id)}
            aria-pressed={selected}
            className={cn(
              "group border text-left transition-colors",
              selected ? "border-ink" : "border-line hover:border-mist",
              !compat.allowed && "cursor-not-allowed opacity-45",
            )}
          >
            <span
              className="relative block h-20 w-full"
              style={{ background: value.swatch ?? value.hex }}
            >
              {selected && (
                <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-paper">
                  <Check size={12} strokeWidth={3} className="text-ink" />
                </span>
              )}
            </span>
            <span className="flex items-baseline justify-between gap-2 p-2.5">
              <span className="min-w-0">
                <span className="block truncate text-[13px] font-medium text-ink">
                  {optionLabel(value, locale)}
                </span>
                <span className="text-[11px] text-stone">{value.code}</span>
              </span>
              <span className="shrink-0 text-[12px] tabular-nums text-graphite">
                {value.priceDelta === 0 ? "—" : `+${formatPrice(value.priceDelta)}`}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function SummaryStep({
  product,
  selection,
  lines,
  dict,
  locale,
}: {
  product: Product;
  selection: ConfigurationSelection;
  lines: { group: string; value: string }[];
  dict: Dictionary;
  locale: Locale;
}) {
  const r = routes(locale);
  const router = useRouter();
  const user = useSession((s) => s.user);
  const [configId, setConfigId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const idempotencyKey = useRef(crypto.randomUUID());

  /**
   * Konfiqurasiyanı serverdə saxlayır. Nömrəni və yekun məbləği server
   * verir — client hesablaması burada da qəbul edilmir (PRD §130).
   */
  async function persist(): Promise<string | null> {
    if (configId) return configId;

    try {
      const saved = await apiFetch<{ code: string; total: number }>("/api/configurations", {
        method: "POST",
        headers: { "Idempotency-Key": idempotencyKey.current },
        json: {
          productSlug: product.slug,
          width: selection.width,
          height: selection.height,
          choices: selection.choices,
        },
      });

      setConfigId(saved.code);
      useWorkflow.getState().save({
        id: saved.code,
        productSlug: product.slug,
        productName: product.name,
        selection,
        total: saved.total,
        date: new Date().toISOString(),
      });
      return saved.code;
    } catch (error) {
      if (error instanceof ApiRequestError) toast(dict.configurator.saveFailed);
      return null;
    }
  }

  /** Saxlanmış konfiqurasiya kabinetdə görünür — giriş tələb olunur. */
  async function save() {
    if (!user) {
      toast(dict.configurator.saveNeedsAccount);
      router.push(`${r.login}?next=${encodeURIComponent(r.configuratorFor(product.slug))}`);
      return;
    }

    setBusy(true);
    const code = await persist();
    setBusy(false);
    if (code) toast(dict.configurator.configurationSaved);
  }

  /** Paylaşma linki koda bağlıdır — seçimlər URL-də daşınmır (PRD §57). */
  async function share() {
    setBusy(true);
    const code = await persist();
    setBusy(false);
    if (!code) return;

    const url = `${window.location.origin}${r.configuration(code)}`;

    if (navigator.share) {
      navigator
        .share({ title: product.name, text: dict.configurator.shareConfiguration, url })
        .catch(() => copyLink(url));
      return;
    }
    copyLink(url);
  }

  function copyLink(url: string) {
    navigator.clipboard?.writeText(url).then(
      () => toast(dict.configurator.linkCopied),
      () => toast(url),
    );
  }

  return (
    <div>
      <StepHeading title={dict.configurator.summary} hint={dict.configurator.reviewChoices} />

      <div className="mb-6 flex items-center gap-3 border border-line bg-bone p-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-stone">
            {dict.configurator.yourDoor}
          </p>
          <p className="mt-1 text-lg font-medium text-ink">{product.name}</p>
          <p className="text-[13px] text-stone">
            {selection.width} × {selection.height} mm · {product.sku}
          </p>
        </div>
      </div>

      <dl className="border-t border-line">
        {lines.map((l) => (
          <div key={l.group} className="flex items-baseline justify-between gap-6 border-b border-line py-2.5 text-sm">
            <dt className="text-stone">{l.group}</dt>
            <dd className="text-right font-medium text-ink">{l.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" onClick={() => void save()} disabled={busy}>
          <Save size={15} /> {dict.configurator.saveConfiguration}
        </Button>
        <Button variant="secondary" size="sm" onClick={() => void share()} disabled={busy}>
          <Link2 size={15} /> {dict.configurator.shareConfiguration}
        </Button>
        <ButtonLink href={r.cart} variant="ghost" size="sm" className="border border-line">
          {dict.cart.title}
        </ButtonLink>
      </div>

      <p className="mt-4 text-xs text-stone">
        {configId && (
          <>
            {dict.configurator.configurationId}:{" "}
            <span className="font-mono text-graphite">{configId}</span> —{" "}
          </>
        )}
        {dict.configurator.sharedPrivacy}
      </p>
    </div>
  );
}

function StepHeading({
  title,
  hint,
  multi,
  multipleChoiceLabel,
}: {
  title: string;
  hint: string;
  multi?: boolean;
  multipleChoiceLabel?: string;
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">{title}</h2>
        {multi && multipleChoiceLabel && <Badge tone="outline">{multipleChoiceLabel}</Badge>}
      </div>
      <p className="mt-1.5 text-[14px] text-stone">{hint}</p>
    </div>
  );
}
