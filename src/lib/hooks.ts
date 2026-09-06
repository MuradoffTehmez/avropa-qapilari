"use client";

import { useCallback, useEffect, useSyncExternalStore, type RefObject } from "react";

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
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        onChange();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return useSyncExternalStore(
    subscribe,
    () => window.scrollY > offset,
    () => false,
  );
}

/** Dialog/drawer daxilində fokusu saxlayır və bağlananda əvvəlki elementə qaytarır. */
export function useDialogFocus(
  containerRef: RefObject<HTMLElement | null>,
  active: boolean,
): void {
  useEffect(() => {
    if (!active) return;

    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const frame = window.requestAnimationFrame(() => {
      const container = containerRef.current;
      if (!container) return;
      const first = container.querySelector<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      (first ?? container).focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const container = containerRef.current;
      if (!container) return;
      const focusable = Array.from(
        container.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => !element.hidden && element.getAttribute("aria-hidden") !== "true");
      if (focusable.length === 0) {
        event.preventDefault();
        container.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown);
      previous?.focus();
    };
  }, [active, containerRef]);
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
