"use client";

import { useState } from "react";
import { Eye, EyeOff, Layers, Ruler, Scissors } from "lucide-react";

import type { Dictionary } from "@/i18n";
import type { ConfigurationSelection, ConstructionLayer, OptionGroupKey, Product } from "@/types";
import { cn, formatPrice } from "@/lib/utils";
import { constructionLayers } from "@/mock/construction";
import { resolveProductOption } from "@/features/configurator/product-options";
import { materialName } from "@/lib/i18n-format";

type LayerTextKey = keyof Dictionary["configurator"]["constructionLayers"];

/**
 * Qat adı və rolu sözlükdən gəlir; `construction.ts`-dəki mətn yalnız
 * sözlükdə açarı olmayan yeni qat üçün ehtiyatdır.
 */
function layerText(layer: ConstructionLayer, dict: Dictionary): { name: string; role: string } {
  const table = dict.configurator.constructionLayers;
  return layer.id in table ? table[layer.id as LayerTextKey] : { name: layer.name, role: layer.role };
}

/** Preview-də görünən vizual qatlar (PRD §50). */
export interface VisualLayer {
  key: OptionGroupKey | "BASE";
  label: string;
  value: string;
  priceDelta: number;
  swatch?: string;
  /** Bu qat söndürülə bilərmi (baza qatı söndürülmür) */
  toggleable: boolean;
}

export function DoorLayers({
  product,
  dict,
  layers,
  hidden,
  onToggle,
  selection,
  className,
}: {
  product: Product;
  dict: Dictionary;
  layers: VisualLayer[];
  hidden: Set<string>;
  onToggle: (key: string) => void;
  selection: ConfigurationSelection;
  className?: string;
}) {
  const [tab, setTab] = useState<"visual" | "section">("visual");
  const stack = configuredConstruction(product, selection, hidden);

  return (
    <div className={cn("flex min-h-0 flex-col border-t border-line bg-paper", className)}>
      <div role="tablist" aria-label={dict.configurator.layers} className="flex border-b border-line">
        <TabButton
          active={tab === "visual"}
          onClick={() => setTab("visual")}
          icon={<Layers size={14} />}
          label={dict.configurator.visualLayers}
        />
        <TabButton
          active={tab === "section"}
          onClick={() => setTab("section")}
          icon={<Scissors size={14} />}
          label={dict.configurator.crossSection}
        />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {tab === "visual" ? (
          <VisualLayerList layers={layers} hidden={hidden} onToggle={onToggle} dict={dict} />
        ) : (
          <CrossSection stack={stack} product={product} dict={dict} />
        )}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "relative flex flex-1 items-center justify-center gap-1.5 px-3 py-2.5 text-[12.5px] font-medium transition-colors",
        active ? "text-ink" : "text-stone hover:text-graphite",
      )}
    >
      {icon}
      {label}
      {active && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gold-500" />}
    </button>
  );
}

/* ---------------------------- vizual qatlar ---------------------------- */

function VisualLayerList({
  layers,
  hidden,
  onToggle,
  dict,
}: {
  layers: VisualLayer[];
  hidden: Set<string>;
  onToggle: (key: string) => void;
  dict: Dictionary;
}) {
  return (
    <ul className="divide-y divide-line">
      {layers.map((layer, i) => {
        const isHidden = hidden.has(layer.key);
        return (
          <li
            key={layer.key}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 transition-opacity sm:px-4",
              isHidden && "opacity-45",
            )}
          >
            <span className="w-4 shrink-0 text-[11px] tabular-nums text-mist">
              {String(layers.length - i).padStart(2, "0")}
            </span>

            <span
              aria-hidden
              className="h-7 w-7 shrink-0 rounded-[2px] border border-line"
              style={{ background: layer.swatch ?? "var(--color-sand)" }}
            />

            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-medium text-ink">
                {layer.label}
              </span>
              <span className="block truncate text-[12px] text-stone">{layer.value}</span>
            </span>

            {layer.priceDelta > 0 && (
              <span className="shrink-0 text-[12px] tabular-nums text-graphite">
                +{formatPrice(layer.priceDelta)}
              </span>
            )}

            {layer.toggleable ? (
              <button
                type="button"
                onClick={() => onToggle(layer.key)}
                aria-pressed={!isHidden}
                aria-label={`${layer.label} — ${isHidden ? dict.configurator.showLayer : dict.configurator.hideLayer}`}
                className="flex h-8 w-8 shrink-0 items-center justify-center text-stone transition-colors hover:text-ink"
              >
                {isHidden ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            ) : (
              <span className="w-8 shrink-0" />
            )}
          </li>
        );
      })}
    </ul>
  );
}

/* --------------------------- konstruksiya kəsiyi ----------------------- */

function CrossSection({
  stack,
  product,
  dict,
}: {
  stack: ConstructionLayer[];
  product: Product;
  dict: Dictionary;
}) {
  const [active, setActive] = useState<string | null>(null);
  const total = stack.reduce((s, l) => s + l.thicknessMm, 0);

  // Nazik qatlar da görünsün deyə minimum pay veririk
  const weights = stack.map((l) => Math.max(l.thicknessMm, total * 0.028));
  const weightSum = weights.reduce((a, b) => a + b, 0);

  return (
    <div className="p-3 sm:p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="flex items-center gap-1.5 text-[12px] text-stone">
          <Ruler size={13} className="text-gold-500" />
          {dict.configurator.totalThickness}:{" "}
          <span className="font-semibold text-ink">{Math.round(total)} mm</span>
        </p>
        <p className="text-[12px] text-stone">{materialName(product.material, dict)}</p>
      </div>

      {/* Kəsik zolağı */}
      <div className="mb-1 flex justify-between text-[10px] uppercase tracking-[0.14em] text-stone">
        <span>{dict.configurator.outside}</span>
        <span>{dict.configurator.inside}</span>
      </div>

      <div
        role="img"
        aria-label={dict.configurator.crossSection}
        className="flex h-24 w-full overflow-hidden rounded-[2px] border border-line sm:h-28"
      >
        {stack.map((layer, i) => (
          <button
            key={layer.id}
            type="button"
            onClick={() => setActive(active === layer.id ? null : layer.id)}
            aria-label={`${layerText(layer, dict).name} — ${layer.thicknessMm} mm`}
            title={`${layerText(layer, dict).name} · ${layer.thicknessMm} mm`}
            className={cn(
              "relative h-full border-r border-black/10 transition-[filter] last:border-r-0",
              active && active !== layer.id && "brightness-[0.82] saturate-50",
            )}
            style={{
              width: `${(weights[i] / weightSum) * 100}%`,
              background: layer.color,
            }}
          >
            {layer.pattern === "fiber" && (
              <span
                aria-hidden
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(115deg,rgba(255,255,255,.6) 0 1px,transparent 1px 4px)",
                }}
              />
            )}
            {layer.pattern === "honeycomb" && (
              <span
                aria-hidden
                className="absolute inset-0 opacity-35"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg,rgba(0,0,0,.35) 0 1px,transparent 1px 9px)",
                }}
              />
            )}
            {layer.pattern === "metal" && (
              <span
                aria-hidden
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg,rgba(255,255,255,.55),rgba(255,255,255,0) 45%,rgba(0,0,0,.18))",
                }}
              />
            )}
            {active === layer.id && (
              <span aria-hidden className="absolute inset-0 ring-2 ring-inset ring-ink" />
            )}
          </button>
        ))}
      </div>

      {/* Qat siyahısı */}
      <ul className="mt-3 divide-y divide-line border-t border-line">
        {stack.map((layer) => (
          <li key={layer.id}>
            <button
              type="button"
              onClick={() => setActive(active === layer.id ? null : layer.id)}
              className={cn(
                "flex w-full items-center gap-3 py-2 text-left transition-colors",
                active === layer.id && "bg-bone",
              )}
            >
              <span
                aria-hidden
                className="h-4 w-4 shrink-0 rounded-[2px] border border-line"
                style={{ background: layer.color }}
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12.5px] font-medium text-ink">
                  {layerText(layer, dict).name}
                </span>
                <span className="block truncate text-[11.5px] text-stone">
                  {layerText(layer, dict).role}
                </span>
              </span>
              <span className="shrink-0 text-[12px] tabular-nums text-graphite">
                {layer.thicknessMm} mm
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function configuredConstruction(
  product: Product,
  selection: ConfigurationSelection,
  hidden: Set<string>,
): ConstructionLayer[] {
  const stack = constructionLayers(product.material).map((layer) => ({ ...layer }));
  const outside = resolveProductOption(product, selection.choices.OUTSIDE_COLOR as string);
  const inside = resolveProductOption(product, selection.choices.INSIDE_COLOR as string);

  if (!hidden.has("OUTSIDE_COLOR") && outside?.hex && stack[0]) {
    stack[0].color = outside.hex;
  }
  if (!hidden.has("INSIDE_COLOR") && inside?.hex && stack.at(-1)) {
    stack[stack.length - 1].color = inside.hex;
  }

  if (!hidden.has("INSULATION")) {
    const insulation = resolveProductOption(product, selection.choices.INSULATION as string);
    const extra = insulation?.code === "MAX" ? 10 : insulation?.code === "THERMAL" ? 7 : insulation?.code === "ACOUSTIC" ? 4 : 0;
    if (extra > 0 && stack.length > 2) {
      const coreIndex = stack.reduce(
        (best, layer, index) => (layer.thicknessMm > stack[best].thicknessMm ? index : best),
        0,
      );
      stack[coreIndex].thicknessMm += extra;
    }
  }

  return stack;
}
