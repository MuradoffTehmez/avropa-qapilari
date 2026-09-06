"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * SESSİYA — MƏRHƏLƏ 1 (yalnız frontend).
 *
 * Backend qoşulanda bu store silinir: sessiya HttpOnly kuki ilə serverdə
 * saxlanılacaq, rol yoxlaması isə middleware və API səviyyəsində aparılacaq
 * (PRD §88, §93). Buradakı rol yalnız interfeysin hansı ekranı göstərəcəyini
 * müəyyən edir — təhlükəsizlik zəmanəti deyil.
 */
export type Role = "CUSTOMER" | "TECHNICIAN" | "ADMIN";

export interface SessionUser {
  name: string;
  email: string;
  role: Role;
}

interface SessionState {
  user: SessionUser | null;
  signIn: (user: SessionUser) => void;
  signOut: () => void;
}

export const useSession = create<SessionState>()(
  persist(
    (set) => ({
      user: null,
      signIn: (user) => set({ user }),
      signOut: () => set({ user: null }),
    }),
    { name: "ep-session-v1" },
  ),
);

/** Rolun tələb olunan səviyyəyə çatıb-çatmadığı. */
export function hasRole(user: SessionUser | null, required: Role): boolean {
  if (!user) return false;
  if (user.role === "ADMIN") return true;
  return user.role === required;
}

/** E-poçtdan görünən ad çıxarır (backend gələnə qədər). */
export function nameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "";
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
