"use client";

import { useEffect, useRef } from "react";

import type { CartItem } from "@/types";
import { apiFetch } from "@/lib/api";
import { useCart } from "@/store/cart";
import { useFavorites } from "@/store/lists";
import { useSession } from "@/store/session";

/**
 * FAVORİT VƏ SƏBƏTİN SERVERLƏ SİNXRONİZASİYASI.
 *
 * Anonim istifadəçidə hər iki siyahı brauzerdə qalır. Giriş edildikdə
 * brauzerdəki siyahı serverdəki ilə birləşdirilir, sonra hər dəyişiklik
 * serverə yazılır — beləliklə siyahılar cihazlar arasında eyni qalır.
 *
 * Səbətin qiyməti serverdən gəlir: cavabdakı sətirlər olduğu kimi
 * store-a yazılır (PRD §130).
 */

/** Snapshot sətirlərini qiymətləndirmə üçün seçim obyektinə çevirir. */
function toChoices(item: CartItem): Record<string, string | string[]> {
  const choices: Record<string, string | string[]> = {};
  for (const line of item.snapshot.lines) {
    const current = choices[line.group];
    if (current === undefined) choices[line.group] = line.value;
    else if (Array.isArray(current)) current.push(line.value);
    else choices[line.group] = [current, line.value];
  }
  return choices;
}

function toInput(item: CartItem) {
  return {
    productSlug: item.productSlug,
    quantity: item.quantity,
    width: item.snapshot.width,
    height: item.snapshot.height,
    choices: toChoices(item),
  };
}

/** Eyni məhsul + eyni ölçü + eyni seçim bir sətirdir. */
function cartKey(item: CartItem): string {
  return JSON.stringify([
    item.productSlug,
    item.snapshot.width,
    item.snapshot.height,
    [...item.snapshot.lines].sort((a, b) => `${a.group}${a.value}`.localeCompare(`${b.group}${b.value}`)),
  ]);
}

export function ListSync() {
  const userId = useSession((s) => s.user?.id ?? null);
  // Sinxronizasiya bitənə qədər gələn dəyişiklikləri serverə göndərmirik.
  const ready = useRef(false);

  useEffect(() => {
    ready.current = false;
    if (!userId) return;

    let cancelled = false;

    async function merge() {
      const favorites = useFavorites.getState();
      const cart = useCart.getState();

      const [favoriteResult, serverCart] = await Promise.allSettled([
        apiFetch<{ productIds: string[] }>("/api/account/favorites", {
          method: "PUT",
          json: { productIds: favorites.ids, merge: true },
        }),
        apiFetch<CartItem[]>("/api/account/cart"),
      ]);

      if (cancelled) return;

      if (favoriteResult.status === "fulfilled") {
        favorites.replace(favoriteResult.value.productIds);
      }

      // Səbət: serverdəki sətirlər saxlanılır, brauzerdə olan yeni
      // sətirlər üzərinə əlavə olunur.
      const remote = serverCart.status === "fulfilled" ? serverCart.value : [];
      const seen = new Set(remote.map(cartKey));
      const merged = [...remote, ...cart.items.filter((item) => !seen.has(cartKey(item)))];

      if (merged.length > 0) {
        const saved = await apiFetch<CartItem[]>("/api/account/cart", {
          method: "PUT",
          json: { items: merged.map(toInput) },
        }).catch(() => null);
        if (!cancelled && saved) cart.replace(saved);
      } else if (!cancelled) {
        cart.replace(remote);
      }
    }

    merge()
      .catch(() => {})
      .finally(() => {
        if (!cancelled) ready.current = true;
      });

    return () => {
      cancelled = true;
      ready.current = false;
    };
  }, [userId]);

  // Sinxronizasiyadan sonra hər local dəyişiklik serverə yazılır.
  useEffect(() => {
    if (!userId) return;

    let favoriteTimer = 0;
    let cartTimer = 0;

    const unsubscribeFavorites = useFavorites.subscribe((state, previous) => {
      if (!ready.current || state.ids === previous.ids) return;
      window.clearTimeout(favoriteTimer);
      const ids = state.ids;
      favoriteTimer = window.setTimeout(() => {
        void apiFetch("/api/account/favorites", {
          method: "PUT",
          json: { productIds: ids, merge: false },
        }).catch(() => {});
      }, 400);
    });

    const unsubscribeCart = useCart.subscribe((state, previous) => {
      if (!ready.current || state.items === previous.items) return;
      window.clearTimeout(cartTimer);
      const items = state.items;
      cartTimer = window.setTimeout(() => {
        void apiFetch("/api/account/cart", {
          method: "PUT",
          json: { items: items.map(toInput) },
        }).catch(() => {});
      }, 600);
    });

    return () => {
      window.clearTimeout(favoriteTimer);
      window.clearTimeout(cartTimer);
      unsubscribeFavorites();
      unsubscribeCart();
    };
  }, [userId]);

  return null;
}
