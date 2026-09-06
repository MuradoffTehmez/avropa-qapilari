"use client";

import { useEffect } from "react";

import { useSession, type SessionUser } from "@/store/session";

/**
 * Səhifə yüklənəndə serverdəki sessiyanı bir dəfə oxuyur.
 *
 * Token HttpOnly kukidədir, ona görə client onu birbaşa oxuya bilmir —
 * `/api/auth/me` yeganə mənbədir.
 */
export function SessionBootstrap() {
  const setUser = useSession((s) => s.setUser);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : { data: null }))
      .then((body: { data: SessionUser | null }) => {
        if (!cancelled) setUser(body.data ?? null);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      });

    return () => {
      cancelled = true;
    };
  }, [setUser]);

  return null;
}
