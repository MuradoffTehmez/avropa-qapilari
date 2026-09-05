"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Heart,
  Menu,
  Phone,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  User,
  X,
} from "lucide-react";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/types";
import { routes, swapLocaleInPath } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { brand } from "@/config/brand";
import { locales, localeShort } from "@/i18n/config";
import { Logo } from "@/components/layout/Logo";
import { useCart, cartCount } from "@/store/cart";
import { useCompare, useFavorites } from "@/store/lists";
import { useHydrated, useLockBodyScroll, useScrolledPast } from "@/lib/hooks";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { categories } from "@/mock/taxonomy";

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const r = routes(locale);
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const scrolled = useScrolledPast(8);
  const hydrated = useHydrated();

  const items = useCart((s) => s.items);
  const favorites = useFavorites((s) => s.ids);
  const compare = useCompare((s) => s.ids);

  useLockBodyScroll(mobileOpen);

  const nav = [
    { label: dict.nav.doors, href: r.doors },
    { label: dict.nav.configurator, href: r.configurator },
    { label: dict.nav.services, href: r.services },
    { label: dict.nav.repair, href: r.repair },
    { label: dict.nav.projects, href: r.projects },
    { label: dict.nav.about, href: r.about },
    { label: dict.nav.contact, href: r.contact },
  ];

  const count = hydrated ? cartCount(items) : 0;
  const favCount = hydrated ? favorites.length : 0;
  const cmpCount = hydrated ? compare.length : 0;

  return (
    <>
      {/* Utility bar */}
      <div className="hidden border-b border-line bg-bone lg:block">
        <div className="container-page flex h-9 items-center justify-between text-[12px] text-stone">
          <p>{brand.contact.workingHours}</p>
          <div className="flex items-center gap-5">
            <a href={`tel:${brand.contact.phoneHref}`} className="flex items-center gap-1.5 transition-colors hover:text-ink">
              <Phone size={12} />
              {brand.contact.phone}
            </a>
            <div className="flex items-center gap-1">
              {locales.map((l) => (
                <Link
                  key={l}
                  href={swapLocaleInPath(pathname, l)}
                  className={cn(
                    "px-1.5 py-0.5 transition-colors",
                    l === locale ? "font-semibold text-ink" : "hover:text-ink",
                  )}
                >
                  {localeShort[l]}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 border-b bg-paper/95 backdrop-blur-md transition-shadow",
          scrolled ? "border-line shadow-[0_1px_12px_rgba(14,14,13,0.06)]" : "border-transparent",
        )}
      >
        <div className="container-page flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
          {/* Mobile: menu */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label={dict.actions.menu}
            className="-ml-2 flex h-10 w-10 items-center justify-center text-ink lg:hidden"
          >
            <Menu size={21} />
          </button>

          <Link href={r.home} aria-label={brand.name} className="shrink-0">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Əsas menyu">
            {nav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-3 py-2 text-[13.5px] font-medium transition-colors xl:px-3.5",
                    active ? "text-ink" : "text-graphite hover:text-ink",
                  )}
                >
                  {item.label}
                  {active && <span className="absolute inset-x-3 bottom-0 h-px bg-ink" />}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label={dict.actions.search}
              className="flex h-10 w-10 items-center justify-center text-graphite transition-colors hover:text-ink"
            >
              <Search size={19} />
            </button>

            <HeaderIcon href={r.compare} label={dict.actions.compare} count={cmpCount} className="hidden sm:flex">
              <SlidersHorizontal size={19} />
            </HeaderIcon>

            <HeaderIcon href={r.favorites} label={dict.actions.favorites} count={favCount} className="hidden sm:flex">
              <Heart size={19} />
            </HeaderIcon>

            <HeaderIcon href={r.account} label={dict.actions.account} className="hidden sm:flex">
              <User size={19} />
            </HeaderIcon>

            <HeaderIcon href={r.cart} label={dict.actions.cart} count={count}>
              <ShoppingBag size={19} />
            </HeaderIcon>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-100 lg:hidden">
          <button
            type="button"
            aria-label={dict.actions.close}
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-obsidian/45"
          />
          <div className="absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col bg-paper">
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-4">
              <Logo compact />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label={dict.actions.close}
                className="-mr-2 flex h-10 w-10 items-center justify-center text-stone"
              >
                <X size={20} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              <nav className="flex flex-col p-2" aria-label="Mobil menyu">
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="border-b border-line px-3 py-3.5 text-[15px] font-medium text-ink last:border-b-0"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="px-5 pb-4 pt-2">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone">
                  {dict.home.categoriesTitle}
                </p>
                <div className="flex flex-col gap-2">
                  {categories.filter((c) => c.featured).map((c) => (
                    <Link key={c.slug} href={r.category(c.slug)} onClick={() => setMobileOpen(false)} className="text-sm text-graphite">
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="border-t border-line px-5 py-4">
                <div className="flex flex-col gap-3 text-sm">
                  <Link href={r.favorites} className="flex items-center gap-2.5 text-graphite">
                    <Heart size={17} /> {dict.actions.favorites} {favCount > 0 && `(${favCount})`}
                  </Link>
                  <Link href={r.compare} className="flex items-center gap-2.5 text-graphite">
                    <SlidersHorizontal size={17} /> {dict.actions.compare} {cmpCount > 0 && `(${cmpCount})`}
                  </Link>
                  <Link href={r.account} className="flex items-center gap-2.5 text-graphite">
                    <User size={17} /> {dict.actions.account}
                  </Link>
                </div>
              </div>
            </div>

            <div className="shrink-0 border-t border-line p-4">
              <a
                href={`tel:${brand.contact.phoneHref}`}
                className="mb-3 flex items-center justify-center gap-2 border border-line py-2.5 text-sm font-medium text-ink"
              >
                <Phone size={15} /> {brand.contact.phone}
              </a>
              <div className="flex items-center justify-center gap-1">
                {locales.map((l) => (
                  <Link
                    key={l}
                    href={swapLocaleInPath(pathname, l)}
                    className={cn(
                      "px-2.5 py-1 text-[13px]",
                      l === locale ? "font-semibold text-ink underline underline-offset-4" : "text-stone",
                    )}
                  >
                    {localeShort[l]}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} locale={locale} dict={dict} />
    </>
  );
}

function HeaderIcon({
  href,
  label,
  count,
  children,
  className,
}: {
  href: string;
  label: string;
  count?: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={count ? `${label} (${count})` : label}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center text-graphite transition-colors hover:text-ink",
        className,
      )}
    >
      {children}
      {count !== undefined && count > 0 && (
        <span className="absolute right-1 top-1 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-brass-500 px-1 text-[10px] font-semibold tabular-nums text-paper">
          {count}
        </span>
      )}
    </Link>
  );
}
