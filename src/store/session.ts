"use client";

import { create } from "zustand";

/**
 * SESSİYA — server tərəfindən idarə olunur.
 *
 * Token HttpOnly kukidədir və JavaScript-dən oxunmur; bu store yalnız
 * `/api/auth/me` cavabının UI üçün keşidir. Rol yoxlaması burada
 * interfeysin hansı ekranı göstərəcəyini müəyyən edir — əsl icazə
 * yoxlaması hər API route-unda serverdə aparılır (PRD §93).
 */
export type Role = "CUSTOMER" | "TECHNICIAN" | "ADMIN";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

type Status = "loading" | "authenticated" | "anonymous";

interface SessionState {
  user: SessionUser | null;
  status: Status;
  /** `/api/auth/me` cavabını yazır. */
  setUser: (user: SessionUser | null) => void;
  /** Serverdəki sessiyanı bağlayır. */
  signOut: () => Promise<void>;
}

export const useSession = create<SessionState>()((set) => ({
  user: null,
  status: "loading",
  setUser: (user) => set({ user, status: user ? "authenticated" : "anonymous" }),
  signOut: async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      set({ user: null, status: "anonymous" });
    }
  },
}));

/** Rolun tələb olunan səviyyəyə çatıb-çatmadığı. */
export function hasRole(user: SessionUser | null, required: Role): boolean {
  if (!user) return false;
  if (user.role === "ADMIN") return true;
  return user.role === required;
}
