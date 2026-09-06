"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import {
  ChevronRight,
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
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { brand, hasContact } from "@/config/brand";
import { Logo } from "@/components/layout/Logo";
import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { useCart, cartCount } from "@/store/cart";
import { useCompare, useFavorites } from "@/store/lists";
import { useDialogFocus, useHydrated, useLockBodyScroll, useScrolledPast } from "@/lib/hooks";
import { useSession } from "@/store/session";
import { categories } from "@/mock/taxonomy";
import { categoryName } from "@/lib/i18n-format";

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const r = routes(locale);
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const scrolled = useScrolledPast(8);
  const hydrated = useHydrated();

  const items = useCart((s) => s.items);
  const favorites = useFavorites((s) => s.ids);
  const compare = useCompare((s) => s.ids);
  const user = useSession((s) => s.user);

  useLockBodyScroll(mobileOpen);
  useDialogFocus(mobilePanelRef, mobileOpen);

  /** `wide: true` — yalnız geniş ekranda görünür; mobil menyuda hamısı var. */
  const nav = [
    { label: dict.nav.doors, href: r.doors },
    { label: dict.nav.configurator, href: r.configurator },
    { label: dict.nav.services, href: r.services },
    { label: dict.nav.repair, href: r.repair },
    { label: dict.nav.showroom, href: r.showroom },
    { label: dict.nav.projects, href: r.projects, wide: true },
    { label: dict.nav.about, href: r.about, wide: true },
    { label: dict.nav.contact, href: r.contact },
  ];

  const count = hydrated ? cartCount(items) : 0;
  const favCount = hydrated ? favorites.length : 0;
  const cmpCount = hydrated ? compare.length : 0;

  const accountHref = hydrated && user ? r.account : r.login;

  const close = () => setMobileOpen(false);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b bg-paper/95 backdrop-blur-md transition-shadow",
          scrolled ? "border-line shadow-[0_1px_12px_rgba(11,29,52,0.07)]" : "border-line/60",
        )}
      >
        <div className="container-page flex h-16 items-center gap-2 sm:gap-4 lg:h-18">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label={dict.actions.menu}
            aria-expanded={mobileOpen}
            className="-ml-2 flex h-11 w-11 shrink-0 items-center justify-center text-ink lg:hidden"
          >
            <Menu size={22} />
          </button>

          <Link href={r.home} aria-label={brand.name} className="shrink-0">
            <span className="sm:hidden">
              <Logo compact showTagline={false} />
            </span>
            <span className="hidden sm:block xl:hidden">
              <Logo compact />
            </span>
            <span className="hidden xl:block">
              <Logo tagline={dict.meta.slogan} />
            </span>
          </Link>

          <nav className="mx-auto hidden items-center lg:flex" aria-label={dict.actions.menu}>
            {nav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative whitespace-nowrap px-2 py-2 text-[13px] font-medium transition-colors xl:px-3 xl:text-[13.5px]",
                    active ? "text-ink" : "text-graphite hover:text-ink",
                    item.wide && "hidden xl:block",
                  )}
                >
                  {item.label}
                  {active && (
                    <span className="absolute inset-x-2 bottom-0 h-0.5 bg-gold-500 xl:inset-x-3" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-0.5 lg:ml-0">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label={dict.actions.search}
              className="flex h-11 w-11 items-center justify-center text-graphite transition-colors hover:text-ink"
            >
              <Search size={19} />
            </button>

            <HeaderIcon
              href={r.compare}
              label={dict.actions.compare}
              count={cmpCount}
              className="hidden md:flex"
            >
              <SlidersHorizontal size={19} />
            </HeaderIcon>

            <HeaderIcon
              href={r.favorites}
              label={dict.actions.favorites}
              count={favCount}
              className="hidden sm:flex"
            >
              <Heart size={19} />
            </HeaderIcon>

            <HeaderIcon
              href={accountHref}
              label={user ? dict.actions.account : dict.auth.signIn}
              className="hidden sm:flex"
            >
              <User size={19} />
            </HeaderIcon>

            <HeaderIcon href={r.cart} label={dict.actions.cart} count={count}>
              <ShoppingBag size={19} />
            </HeaderIcon>

            <span aria-hidden className="mx-1 hidden h-5 w-px bg-line sm:block" />
            <LocaleSwitcher locale={locale} />
          </div>
        </div>
      </header>

      {/* Mobil çekmecə */}
      {mobileOpen && (
        <div className="fixed inset-0 z-100 lg:hidden">
          <button
            type="button"
            aria-label={dict.actions.close}
            onClick={close}
            className="motion-overlay absolute inset-0 bg-obsidian/50"
          />
          <div
            ref={mobilePanelRef}
            role="dialog"
            aria-modal="true"
            aria-label={dict.actions.menu}
            tabIndex={-1}
            className="motion-drawer-left absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col bg-paper outline-none"
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-4">
              <Logo compact tagline={dict.meta.slogan} />
              <button
                type="button"
                onClick={close}
                aria-label={dict.actions.close}
                className="-mr-2 flex h-11 w-11 items-center justify-center text-stone"
              >
                <X size={20} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <nav className="flex flex-col px-2 py-2" aria-label={dict.actions.menu}>
                {nav.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={close}
                    aria-current={active ? "page" : undefined}
                    className="flex items-center justify-between border-b border-line px-3 py-3.5 text-[15px] font-medium text-ink last:border-b-0"
                  >
                    {item.label}
                    <ChevronRight size={15} className="text-mist" />
                  </Link>
                  );
                })}
              </nav>

              <div className="border-t border-line px-5 py-4">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone">
                  {dict.home.categoriesTitle}
                </p>
                <div className="flex flex-col gap-2.5">
                  {categories
                    .filter((c) => c.featured)
                    .map((c) => (
                      <Link
                        key={c.slug}
                        href={r.category(c.slug)}
                        onClick={close}
                        className="text-[14px] text-graphite"
                      >
                        {categoryName(c, dict)}
                      </Link>
                    ))}
                </div>
              </div>

              <div className="border-t border-line px-5 py-4">
                <div className="flex flex-col gap-3.5 text-[14px]">
                  <Link
                    href={r.favorites}
                    onClick={close}
                    className="flex items-center gap-2.5 text-graphite"
                  >
                    <Heart size={17} /> {dict.actions.favorites}
                    {favCount > 0 && <span className="text-stone">({favCount})</span>}
                  </Link>
                  <Link
                    href={r.compare}
                    onClick={close}
                    className="flex items-center gap-2.5 text-graphite"
                  >
                    <SlidersHorizontal size={17} /> {dict.actions.compare}
                    {cmpCount > 0 && <span className="text-stone">({cmpCount})</span>}
                  </Link>
                  <Link
                    href={accountHref}
                    onClick={close}
                    className="flex items-center gap-2.5 text-graphite"
                  >
                    <User size={17} /> {user ? dict.actions.account : dict.auth.signIn}
                  </Link>
                </div>
              </div>
            </div>

            <div className="safe-bottom shrink-0 border-t border-line p-4">
              {hasContact && brand.contact.phone && (
                <a
                  href={`tel:${brand.contact.phoneHref}`}
                  className="mb-3 flex items-center justify-center gap-2 border border-line py-2.5 text-sm font-medium text-ink"
                >
                  <Phone size={15} /> {brand.contact.phone}
                </a>
              )}
              <LocaleSwitcher locale={locale} variant="inline" className="justify-center" />
            </div>
          </div>
        </div>
      )}

      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        locale={locale}
        dict={dict}
      />
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
        "relative flex h-11 w-11 items-center justify-center text-graphite transition-colors hover:text-ink",
        className,
      )}
    >
      {children}
      {count !== undefined && count > 0 && (
        <span className="absolute right-1 top-1.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-gold-500 px-1 text-[10px] font-semibold tabular-nums text-paper">
          {count}
        </span>
      )}
    </Link>
  );
}
