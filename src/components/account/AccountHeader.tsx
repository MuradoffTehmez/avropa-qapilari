"use client";

import type { Dictionary } from "@/i18n";
import { useSession } from "@/store/session";

/** Kabinetin başlığı — adı sessiyadan götürür. */
export function AccountHeader({ dict }: { dict: Dictionary }) {
  const user = useSession((s) => s.user);
  if (!user) return null;

  return (
    <div className="border-b border-line bg-bone">
      <div className="container-page py-8">
        <p className="text-[11px] uppercase tracking-[0.16em] text-stone">{dict.account.title}</p>
        <h1 className="font-display mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          {user.name}
        </h1>
        <p className="mt-1 text-[13px] text-stone">{user.email}</p>
      </div>
    </div>
  );
}
