"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/**
 * Persist edilmiş store-lar üçün hydration mismatch-ın qarşısını alır.
 * Server-də `false`, client hydration-dan sonra `true` qaytarır.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** Səhifə müəyyən qədər sürüşdürülübmü (sticky header kölgəsi üçün). */
export function useScrolledPast(offset = 8): boolean {
  const subscribe = useCallback((onChange: () => void) => {
    window.addEventListener("scroll", onChange, { passive: true });
    return () => window.removeEventListener("scroll", onChange);
  }, []);

  return useSyncExternalStore(
    subscribe,
    () => window.scrollY > offset,
    () => false,
  );
}

/**
 * localStorage-dakı açarı xarici store kimi oxuyur.
 * Private rejimdə və ya bloklanmış saytda `null` qaytarır.
 */
export function useStoredValue(key: string): string | null {
  const subscribe = useCallback((onChange: () => void) => {
    const handler = (e: StorageEvent) => {
      if (e.key === key || e.key === null) onChange();
    };
    window.addEventListener("storage", handler);
    window.addEventListener("ep:storage", onChange);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("ep:storage", onChange);
    };
  }, [key]);

  return useSyncExternalStore(
    subscribe,
    () => {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    () => null,
  );
}

/** useStoredValue abunəçilərini xəbərdar edərək dəyəri yazır. */
export function writeStoredValue(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* private rejim — yaddaşa yazmaq mümkün deyil */
  }
  window.dispatchEvent(new Event("ep:storage"));
}

/** Body scroll-u bloklamaq (drawer, modal). */
export function useLockBodyScroll(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [locked]);
}

export function useEscapeKey(handler: () => void, active = true): void {
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handler();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handler, active]);
}
