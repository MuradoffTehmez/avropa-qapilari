"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/** favorilər: anonim local, login sonrası server ilə merge. */
interface FavoritesState {
  ids: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
  /** Serverdən gələn siyahını qəbul edir (giriş sonrası sinxronizasiya). */
  replace: (ids: string[]) => void;
  clear: () => void;
}

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) =>
        set((s) => ({
          ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [...s.ids, id],
        })),
      has: (id) => get().ids.includes(id),
      replace: (ids) => set({ ids: [...new Set(ids)] }),
      clear: () => set({ ids: [] }),
    }),
    { name: "ep-favorites-v1" },
  ),
);

/** müqayisə, maksimum 4 məhsul. */
export const COMPARE_LIMIT = 4;

interface CompareState {
  ids: string[];
  toggle: (id: string) => "added" | "removed" | "full";
  remove: (id: string) => void;
  clear: () => void;
}

export const useCompare = create<CompareState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => {
        const { ids } = get();
        if (ids.includes(id)) {
          set({ ids: ids.filter((x) => x !== id) });
          return "removed";
        }
        if (ids.length >= COMPARE_LIMIT) return "full";
        set({ ids: [...ids, id] });
        return "added";
      },
      remove: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
      clear: () => set({ ids: [] }),
    }),
    { name: "ep-compare-v1" },
  ),
);
