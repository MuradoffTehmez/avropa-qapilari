"use client";

import { useEffect } from "react";

import { useSession, useStaffSession, type SessionUser } from "@/store/session";

/**
 * Səhifə yüklənəndə serverdəki sessiyanı bir dəfə oxuyur.
 *
 * Token HttpOnly kukidədir, ona görə client onu birbaşa oxuya bilmir —
 * `/api/auth/me` yeganə mənbədir.
 */
export function SessionBootstrap() {
  const setUser = useSession((s) => s.setUser);
  const setStaffUser = useStaffSession((s) => s.setUser);

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

    fetch("/api/auth/staff/me")
      .then((r) => (r.ok ? r.json() : { data: null }))
      .then((body: { data: SessionUser | null }) => {
        if (!cancelled) setStaffUser(body.data ?? null);
      })
      .catch(() => {
        if (!cancelled) setStaffUser(null);
      });

    return () => {
      cancelled = true;
    };
  }, [setStaffUser, setUser]);

  return null;
}
