"use client";

import { useWorkflow } from "@/store/workflow";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Layers, Link2, RotateCcw, Save, X } from "lucide-react";

import type { Dictionary } from "@/i18n";
import type {
  ConfigurationSelection,
  Locale,
  OptionGroupKey,
  OptionValue,
  Product,
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
  type GlassKind,
  type GlassPattern,
  type HandleKind,
  type HingeKind,
  type SidelightKind,
} from "@/components/product/DoorVisual";
import { DoorLayers, type VisualLayer } from "@/components/configurator/DoorLayers";
import { findOptionValue, optionGroups, standardSizes } from "@/mock/options";
import { calculatePrice, sizeRangeLabel } from "@/features/pricing/engine";
import { checkCompatibility, pruneIncompatible } from "@/features/configurator/compatibility";
import { useCart } from "@/store/cart";

export function Configurator({
  product,
  locale,
  dict,
  initialSelection,
}: {
  initialSelection?: ConfigurationSelection;
  product: Product;
  locale: Locale;
  dict: Dictionary;
}) {
  const r = routes(locale);
  const addToCart = useCart((s) => s.add);

  const steps = useMemo(
    () => product.optionGroups,
    [product.optionGroups],
  );

  const [stepIndex, setStepIndex] = useState(0);
  const [hiddenLayers, setHiddenLayers] = useState<Set<string>>(new Set());
  const [layersOpen, setLayersOpen] = useState(false);
  const [customSize, setCustomSize] = useState(false);

  const [selection, setSelection] = useState<ConfigurationSelection>(() => initialSelection ?? ({
    width: product.defaultWidth,
    height: product.defaultHeight,
    choices: defaultChoices(product),
  }));

  const price = useMemo(() => calculatePrice(product, selection), [product, selection]);
  const currentGroup = steps[stepIndex];
  const isSummary = stepIndex >= steps.length;

  function setChoice(group: OptionGroupKey, valueId: string, multi: boolean) {
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

      return pruneIncompatible(next, findOptionValue);
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
    setSelection({
      width: product.defaultWidth,
      height: product.defaultHeight,
      choices: defaultChoices(product),
    });
    setCustomSize(false);
    setStepIndex(0);
    setHiddenLayers(new Set());
    toast("Konfiqurasiya sıfırlandı");
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
      includedServices: [selection.choices.INSTALLATION, selection.choices.DELIVERY].reduce<number>((sum, id) => sum + (typeof id === "string" ? findOptionValue(id)?.priceDelta ?? 0 : 0), 0),
      snapshot: {
        width: selection.width,
        height: selection.height,
        lines: summaryLines(selection),
      },
    });
    toast("Konfiqurasiya səbətə əlavə edildi");
  }

  const previewProps = buildPreview(selection, product, hiddenLayers);
  const visualLayers = buildVisualLayers(selection, product, dict);
  if (currentGroup === "INSIDE_COLOR") previewProps.panelHex = findOptionValue(selection.choices.INSIDE_COLOR as string)?.hex ?? previewProps.panelHex;
  const selectedLines = summaryLines(selection);

  return (
    <div className="configurator-shell lg:grid lg:min-h-[calc(100dvh-4.5rem)] lg:grid-cols-[1.15fr_1fr]">
      {/* ------------------------------------------------- PREVIEW */}
      <div className="configurator-preview sticky top-16 z-20 flex flex-col border-b border-line bg-bone lg:top-[4.5rem] lg:h-[calc(100dvh-4.5rem)] lg:border-b-0 lg:border-r">
        <div className="relative flex h-52 shrink-0 items-center justify-center px-4 py-4 sm:h-72 lg:h-auto lg:flex-1 lg:px-10">
          <div className="h-full max-h-[70vh] w-auto">
            <div className="h-full" style={{ aspectRatio: "3 / 4" }}>
              <DoorVisual {...previewProps} />
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
            className="max-h-[45dvh] shrink-0 lg:max-h-[52%]"
          />
        )}
      </div>

      {/* ------------------------------------------------- OPTIONS */}
      <div className="flex flex-col">
        <div className="border-b border-line bg-paper px-4 py-3 sm:px-6 lg:px-8">
          <Stepper
            steps={[...steps.map((s) => dict.configurator.steps[s]), "Xülasə"]}
            current={stepIndex}
            onSelect={setStepIndex}
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
              selection={selection}
              onSelect={setChoice}
              dict={dict}
            />
          )}
        </div>

        {/* --------------------------------------------- PRICE BAR */}
        <div className="configurator-price sticky bottom-0 z-30 border-t border-line bg-paper/97 backdrop-blur">
          <div className="px-4 py-3 sm:px-6 lg:px-8">
            <details className="group mb-3 hidden lg:block">
              <summary className="cursor-pointer list-none text-[12px] font-medium text-gold-600 underline-offset-2 hover:underline">
                Qiymət hesablaması ({price.lines.length} sətir)
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

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-stone">
                  {dict.configurator.finalPrice}
                </p>
                <p className="text-2xl font-semibold tracking-tight tabular-nums text-ink">
                  {formatPrice(price.total)}
                </p>
              </div>

              <div className="flex gap-2">
                {stepIndex > 0 && (
                  <Button variant="secondary" onClick={() => setStepIndex((i) => i - 1)}>
                    <ArrowLeft size={16} />
                    <span className="hidden sm:inline">{dict.actions.back}</span>
                  </Button>
                )}
                {isSummary ? (
                  <Button onClick={addConfiguredToCart} disabled={price.requiresQuote}>
                    {dict.actions.addToCart}
                  </Button>
                ) : (
                  <Button onClick={() => setStepIndex((i) => i + 1)}>
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

function defaultChoices(product: Product): ConfigurationSelection["choices"] {
  const choices: ConfigurationSelection["choices"] = {};

  for (const key of product.optionGroups) {
    if (key === "SIZE") continue;
    const group = optionGroups[key];

    if (group.multi) {
      choices[key] = [];
      continue;
    }

    // Xarici rəng üçün məhsulun öz palitrasına uyğun dəyəri seçirik
    // Panel naxışı məhsulun öz stilindən başlayır
    if (key === "PANEL_STYLE") {
      const match = group.values.find((v) => v.code === product.style);
      if (match) {
        choices[key] = match.id;
        continue;
      }
    }

    if (key === "OUTSIDE_COLOR") {
      const match = group.values.find((v) => v.hex === product.panelHexes[0]);
      if (match) {
        choices[key] = match.id;
        continue;
      }
    }

    const first = group.values.find((v) => v.priceDelta === 0 && !v.requires) ?? group.values[0];
    if (first) choices[key] = first.id;
  }

  return choices;
}

function summaryLines(selection: ConfigurationSelection) {
  const lines: { group: string; value: string }[] = [];

  for (const [key, raw] of Object.entries(selection.choices)) {
    if (!raw) continue;
    const group = optionGroups[key as OptionGroupKey];
    const ids = Array.isArray(raw) ? raw : [raw];
    const labels = ids.map((id) => findOptionValue(id)?.label).filter(Boolean) as string[];
    if (labels.length === 0) continue;
    lines.push({ group: group.title, value: labels.join(", ") });
  }

  return lines;
}

function buildPreview(
  selection: ConfigurationSelection,
  product: Product,
  hidden: Set<string> = new Set(),
) {
  const value = (key: OptionGroupKey) => findOptionValue(selection.choices[key] as string);

  const outside = value("OUTSIDE_COLOR");
  const panelStyle = value("PANEL_STYLE");
  const glassValue = value("GLASS");
  const glassPattern = value("GLASS_PATTERN");
  const handleValue = value("HANDLE");
  const hingeValue = value("HINGE");
  const sidelightValue = value("SIDELIGHT");
  const smartLock = value("SMART_LOCK");
  const opening = value("OPENING_DIRECTION");
  const accessories = Array.isArray(selection.choices.ACCESSORY)
    ? (selection.choices.ACCESSORY as string[])
    : [];

  const off = (key: string) => hidden.has(key);

  return {
    panelHex: off("OUTSIDE_COLOR") ? "#c7ccd3" : (outside?.hex ?? product.panelHexes[0]),
    style: (off("PANEL_STYLE") ? product.style : ((panelStyle?.code as Product["style"]) ?? product.style)),
    glass: (off("GLASS") ? "NONE" : (glassValue?.code ?? "NONE")) as GlassKind,
    glassPattern: (off("GLASS_PATTERN") ? "PLAIN" : (glassPattern?.code ?? "PLAIN")) as GlassPattern,
    handle: (handleValue?.code ?? "INOX") as HandleKind,
    handleHex: handleValue?.hex,
    hideHandle: off("HANDLE"),
    hinge: (off("HINGE") ? "STD" : (hingeValue?.code ?? "STD")) as HingeKind,
    sidelight: (off("SIDELIGHT") ? "NONE" : (sidelightValue?.code ?? "NONE")) as SidelightKind,
    side: (opening?.code?.startsWith("LEFT") ? "LEFT" : "RIGHT") as "LEFT" | "RIGHT",
    smartLock: !off("SMART_LOCK") && Boolean(smartLock && smartLock.code !== "NONE"),
    viewer: !off("ACCESSORY") && accessories.some((a) => a.startsWith("ac-viewer")),
    houseNumber: !off("ACCESSORY") && accessories.includes("ac-number"),
    widthMm: selection.width,
    heightMm: selection.height,
  };
}

/** Preview-i təşkil edən qatlar — çöl tərəfdən başlayaraq (PRD §50). */
function buildVisualLayers(
  selection: ConfigurationSelection,
  product: Product,
  dict: Dictionary,
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
    const values = ids.map(findOptionValue).filter(Boolean) as NonNullable<
      ReturnType<typeof findOptionValue>
    >[];
    if (values.length === 0) continue;
    if (values.length === 1 && values[0].code === "NONE") continue;

    layers.push({
      key,
      label: dict.configurator.steps[key],
      value: values.map((v) => v.label).join(", "),
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
  selection,
  setSize,
  customSize,
  setCustomSize,
  dict,
  requiresQuote,
}: {
  product: Product;
  selection: ConfigurationSelection;
  setSize: (w: number, h: number) => void;
  customSize: boolean;
  setCustomSize: (v: boolean) => void;
  dict: Dictionary;
  requiresQuote: boolean;
}) {
  return (
    <div>
      <StepHeading title={dict.configurator.steps.SIZE} hint={optionGroups.SIZE.hint} />

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
          {standardSizes
            .filter((s) => s.width >= product.minWidth && s.width <= product.maxWidth)
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
                        ? "Standart"
                        : "Alternativ"}
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
  selection,
  onSelect,
  dict,
}: {
  group: OptionGroupKey;
  selection: ConfigurationSelection;
  onSelect: (group: OptionGroupKey, valueId: string, multi: boolean) => void;
  dict: Dictionary;
}) {
  const def = optionGroups[group];
  const isColor = group === "OUTSIDE_COLOR" || group === "INSIDE_COLOR";
  const current = selection.choices[group];

  const labelOf = (id: string) => findOptionValue(id)?.label ?? id;

  const withCompat = def.values.map((v) => ({
    value: v,
    compat: checkCompatibility(v, selection, labelOf),
  }));

  return (
    <div>
      <StepHeading title={dict.configurator.steps[group]} hint={def.hint} multi={def.multi} />

      {isColor ? (
        <ColorGrid
          items={withCompat}
          selectedId={current as string}
          onSelect={(id) => onSelect(group, id, false)}
        />
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {withCompat.map(({ value, compat }) => {
            const selected = def.multi
              ? Array.isArray(current) && current.includes(value.id)
              : current === value.id;

            return def.multi ? (
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
                  <span className="block text-sm font-medium text-ink">{value.label}</span>
                  {value.description && (
                    <span className="mt-0.5 block text-xs text-stone">{value.description}</span>
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
                label={value.label}
                description={value.description}
                badge={value.badge}
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
  onSelect,
}: {
  items: { value: OptionValue; compat: { allowed: boolean; reason?: string } }[];
  selectedId?: string;
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
                <span className="block truncate text-[13px] font-medium text-ink">{value.label}</span>
                <span className="text-[11px] text-stone">{value.code}</span>
              </span>
              <span className="shrink-0 text-[12px] tabular-nums text-graphite">
                {value.priceDelta === 0 ? "—" : `+${value.priceDelta}`}
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
  const [configId] = useState(() => `CFG-26-${uid().toUpperCase()}`);

  function save() {
    useWorkflow.getState().save({ id: configId, productSlug: product.slug, productName: product.name, selection, total: calculatePrice(product, selection).total, date: new Date().toISOString() });
    toast(dict.configurator.configurationSaved);
  }

  function share() {
    const query = new URLSearchParams({
      p: product.slug,
      d: JSON.stringify(selection),
    });
    const url = `${window.location.origin}${r.configuration(configId)}?${query}`;

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
      <StepHeading title={dict.configurator.summary} hint="Seçimlərinizi yoxlayın." />

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
        <Button variant="secondary" size="sm" onClick={save}>
          <Save size={15} /> {dict.configurator.saveConfiguration}
        </Button>
        <Button variant="secondary" size="sm" onClick={share}>
          <Link2 size={15} /> {dict.configurator.shareConfiguration}
        </Button>
        <ButtonLink href={r.cart} variant="ghost" size="sm" className="border border-line">
          {dict.cart.title}
        </ButtonLink>
      </div>

      <p className="mt-4 text-xs text-stone">
        {dict.configurator.configurationId}:{" "}
        <span className="font-mono text-graphite">{configId}</span> —{" "}
        {dict.configurator.sharedPrivacy}
      </p>
    </div>
  );
}

function StepHeading({
  title,
  hint,
  multi,
}: {
  title: string;
  hint: string;
  multi?: boolean;
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">{title}</h2>
        {multi && <Badge tone="outline">Çoxlu seçim</Badge>}
      </div>
      <p className="mt-1.5 text-[14px] text-stone">{hint}</p>
    </div>
  );
}
