"use client";

import { useEffect, useState } from "react";

import { ApiRequestError, apiFetch } from "@/lib/api";
import type { ConfigurationSelection } from "@/types";
import type { ServerPrice } from "@/features/pricing/labels";

interface State {
  /** Cari seçim üçün server cavabı; sorğu gedirsə `null`. */
  price: ServerPrice | null;
  pending: boolean;
  /** Server seçimi rədd edibsə (uyğunsuz kombinasiya, naməlum id). */
  error: string | null;
}

interface Answer {
  /** Cavabın aid olduğu sorğu gövdəsi. */
  payload: string;
  price: ServerPrice | null;
  error: string | null;
}

/**
 * Konfiquratorun yekun qiymətini SERVER-dən alır (PRD §130).
 *
 * Client-dəki `features/pricing/engine.ts` yalnız cavab gələnə qədər
 * optimistik göstərici kimi qalır — səbətə və sifarişə düşən məbləği
 * hər halda server yenidən hesablayır.
 */
export function useServerPrice(
  productSlug: string,
  selection: ConfigurationSelection,
): State {
  const [answer, setAnswer] = useState<Answer | null>(null);

  // Seçim obyekti hər render-də yenidən yaranır; sorğunu dəyərə görə
  // açar edirik ki, eyni seçim təkrar göndərilməsin.
  const payload = JSON.stringify({
    productSlug,
    width: selection.width,
    height: selection.height,
    choices: selection.choices,
  });

  useEffect(() => {
    const controller = new AbortController();

    // Sürüşdürücü ilə ölçü dəyişəndə hər addımda sorğu getməsin.
    const timer = window.setTimeout(() => {
      apiFetch<ServerPrice>("/api/configurator/price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        signal: controller.signal,
      })
        .then((price) => setAnswer({ payload, price, error: null }))
        .catch((error: unknown) => {
          if (controller.signal.aborted) return;
          setAnswer({
            payload,
            price: null,
            error: error instanceof ApiRequestError ? error.error.code : "NETWORK_ERROR",
          });
        });
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [payload]);

  // Cavab köhnə seçimə aiddirsə hələ gözləyirik — bu müddətdə UI
  // client hesablamasını göstərir.
  const fresh = answer?.payload === payload ? answer : null;

  return {
    price: fresh?.price ?? null,
    pending: fresh === null,
    error: fresh?.error ?? null,
  };
}
