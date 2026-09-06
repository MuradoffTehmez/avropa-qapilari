"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DoorOpen, Home, SlidersHorizontal, User, Wrench } from "lucide-react";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/types";
import { routes } from "@/lib/routes";
import { useSession } from "@/store/session";
import { cn } from "@/lib/utils";

/** Telefon və planşetdə alt naviqasiya paneli. */
export function MobileNav({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const path = usePathname();
  const r = routes(locale);
  const user = useSession((s) => s.user);

  // Konfiqurator, checkout və admin öz alt panellərinə malikdir
  const hidden =
    /\/admin|\/(konfiqurator|configurator|konfigurator)\/|\/(sifaris|checkout|oformlenie)/.test(path);
  if (hidden) return null;

  const items = [
    { href: r.home, label: dict.nav.home, icon: Home },
    { href: r.doors, label: dict.nav.doors, icon: DoorOpen },
    { href: r.configurator, label: dict.nav.configurator, icon: SlidersHorizontal },
    { href: r.repair, label: dict.nav.services, icon: Wrench },
    { href: user ? r.account : r.login, label: user ? dict.actions.account : dict.auth.signIn, icon: User },
  ];

  return (
    <nav
      aria-label="Mobil naviqasiya"
      className="mobile-bottom-nav safe-bottom fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-line bg-paper/95 backdrop-blur-md lg:hidden"
    >
      {items.map(({ href, label, icon: Icon }) => {
        const active = path === href || (href !== r.home && path.startsWith(`${href}/`));
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-15 flex-col items-center justify-center gap-1 px-1 py-2 text-center text-[10px] leading-tight transition-colors",
              active ? "font-semibold text-gold-600" : "text-graphite",
            )}
          >
            <Icon size={19} strokeWidth={active ? 2.2 : 1.8} />
            <span className="truncate">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
