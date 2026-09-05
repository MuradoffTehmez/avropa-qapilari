"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";

/**
 * anonim istifadəçi üçün local persistence.
 * Backend qoşulanda login zamanı server cart ilə merge ediləcək.
 */
interface CartState {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (item) =>
        set((s) => {
          const existing = s.items.find(
            (i) =>
              i.productId === item.productId &&
              JSON.stringify(i.snapshot) === JSON.stringify(item.snapshot),
          );
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.id === existing.id ? { ...i, quantity: i.quantity + item.quantity } : i,
              ),
            };
          }
          return { items: [...s.items, item] };
        }),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      setQuantity: (id, quantity) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.id === id ? { ...i, quantity: Math.max(1, Math.min(99, quantity)) } : i,
          ),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: "ep-cart-v1" },
  ),
);

export function cartCount(items: CartItem[]): number {
  return items.reduce((n, i) => n + i.quantity, 0);
}

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((n, i) => n + i.quantity * i.unitPrice, 0);
}
