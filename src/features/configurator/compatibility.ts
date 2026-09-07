import type { ConfigurationSelection, OptionValue } from "@/types";
import type { Dictionary } from "@/i18n";

/**
 * COMPATIBILITY ENGINE.
 * `requires`: dəyər yalnız sadalanan option-lardan biri seçilibsə mümkündür.
 * `excludes`: dəyər seçilibsə, sadalanan option-lar bloklanır.
 */

export interface CompatibilityResult {
  allowed: boolean;
  reason?: string;
}

function selectedIds(selection: ConfigurationSelection): string[] {
  return Object.values(selection.choices).flatMap((raw) =>
    !raw ? [] : Array.isArray(raw) ? raw : [raw],
  );
}

export function checkCompatibility(
  value: OptionValue,
  selection: ConfigurationSelection,
  resolve: (id: string) => OptionValue | undefined,
  labelOf: (id: string) => string,
  dict: Dictionary,
): CompatibilityResult {
  const chosen = selectedIds(selection);

  if (value.requires?.length) {
    const ok = value.requires.some((id) => chosen.includes(id));
    if (!ok) {
      const names = value.requires.map(labelOf).join(dict.configurator.orSeparator);
      return { allowed: false, reason: `${dict.configurator.selectFirst}: ${names}` };
    }
  }

  if (value.excludes?.length) {
    const clash = value.excludes.find((id) => chosen.includes(id));
    if (clash) {
      return { allowed: false, reason: dict.configurator.notCompatibleWith.replace("{option}", labelOf(clash)) };
    }
  }

  for (const id of chosen) {
    // Əks istiqamət: artıq seçilmiş dəyər bunu excludes edirmi?
    if (id === value.id) continue;
    const selected = resolve(id);
    if (selected?.excludes?.includes(value.id)) {
      return {
        allowed: false,
        reason: dict.configurator.notCompatibleWith.replace("{option}", labelOf(id)),
      };
    }
  }

  return { allowed: true };
}

/**
 * Seçim dəyişdikdən sonra artıq uyğun olmayan seçimləri təmizləyir.
 * Məsələn: kilid "3 nöqtəli"yə dəyişilsə, Smart Lock X2 avtomatik düşür.
 */
export function pruneIncompatible(
  selection: ConfigurationSelection,
  resolve: (id: string) => OptionValue | undefined,
): ConfigurationSelection {
  const next: ConfigurationSelection = {
    ...selection,
    choices: { ...selection.choices },
  };

  let changed = true;
  let guard = 0;

  while (changed && guard < 10) {
    changed = false;
    guard += 1;

    const chosen = selectedIds(next);

    for (const [group, raw] of Object.entries(next.choices)) {
      if (!raw) continue;
      const ids = Array.isArray(raw) ? raw : [raw];

      const kept = ids.filter((id) => {
        const value = resolve(id);
        if (!value) return false;
        if (value.requires?.length && !value.requires.some((req) => chosen.includes(req))) return false;
        if (value.excludes?.some((excluded) => chosen.includes(excluded))) return false;
        return true;
      });

      if (kept.length !== ids.length) {
        changed = true;
        const key = group as keyof ConfigurationSelection["choices"];
        if (Array.isArray(raw)) {
          next.choices[key] = kept;
        } else {
          delete next.choices[key];
        }
      }
    }
  }

  return next;
}
