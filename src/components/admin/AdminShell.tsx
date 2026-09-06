"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import {
  BarChart3,
  Bell,
  Box,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  Package,
  ScrollText,
  Search,
  Settings,
  ShieldCheck,
  Users,
  Wrench,
  X,
} from "lucide-react";

import type { Dictionary } from "@/i18n";
import type { Locale } from "@/types";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { brand } from "@/config/brand";
import { LogoMark } from "@/components/layout/Logo";
import { useDialogFocus, useLockBodyScroll } from "@/lib/hooks";
import { useSession } from "@/store/session";

/** admin sidebar strukturu. */
export function AdminShell({
  locale,
  dict,
  children,
}: {
  locale: Locale;
  dict: Dictionary;
  children: React.ReactNode;
}) {
  const r = routes(locale);
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const user = useSession((s) => s.user);
  const signOut = useSession((s) => s.signOut);
  useLockBodyScroll(open);
  useDialogFocus(mobilePanelRef, open);

  const groups: {
    title?: string;
    items: { label: string; href: string; icon?: React.ComponentType<{ size?: number; className?: string }> }[];
  }[] = [
    { items: [{ label: dict.admin.dashboard, href: `/${locale}/admin`, icon: LayoutDashboard }] },
    {
      title: dict.admin.catalog,
      items: [
        { label: dict.admin.products, href: `/${locale}/admin/products`, icon: Package },
        { label: dict.admin.categories, href: `/${locale}/admin/categories` },
        { label: dict.admin.brands, href: `/${locale}/admin/brands` },
        { label: dict.admin.configurator, href: `/${locale}/admin/configurator` },
      ],
    },
    {
      title: dict.admin.sales,
      items: [
        { label: dict.admin.orders, href: `/${locale}/admin/orders`, icon: ClipboardList },
        { label: dict.admin.quotes, href: `/${locale}/admin/quotes` },
        { label: dict.admin.discounts, href: `/${locale}/admin/discounts` },
      ],
    },
    {
      title: dict.admin.services,
      items: [
        { label: dict.admin.repairs, href: `/${locale}/admin/repairs`, icon: Wrench },
        { label: dict.admin.measurements, href: `/${locale}/admin/measurements` },
        { label: dict.admin.appointments, href: `/${locale}/admin/appointments` },
      ],
    },
    {
      title: dict.admin.team,
      items: [
        { label: dict.admin.technicians, href: `/${locale}/admin/technicians`, icon: Users },
        { label: dict.admin.roles, href: `/${locale}/admin/roles`, icon: ShieldCheck },
      ],
    },
    {
      items: [
        { label: dict.admin.customers, href: `/${locale}/admin/customers`, icon: Users },
        { label: dict.admin.inventory, href: `/${locale}/admin/inventory`, icon: Box },
        { label: dict.admin.warranty, href: `/${locale}/admin/warranty`, icon: ShieldCheck },
        { label: dict.admin.reviews, href: `/${locale}/admin/reviews` },
      ],
    },
    {
      title: dict.admin.content,
      items: [
        { label: dict.admin.pages, href: `/${locale}/admin/content`, icon: FileText },
        { label: dict.admin.seo, href: `/${locale}/admin/seo`, icon: Megaphone },
      ],
    },
    {
      items: [
        { label: dict.admin.analytics, href: `/${locale}/admin/analytics`, icon: BarChart3 },
        { label: dict.admin.auditLogs, href: `/${locale}/admin/audit`, icon: ScrollText },
        { label: dict.admin.settings, href: `/${locale}/admin/settings`, icon: Settings },
      ],
    },
  ];

  const sidebar = (
    <nav aria-label={dict.admin.title} className="flex h-full flex-col">
      <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-paper/10 px-5">
        <LogoMark tone="paper" size={22} />
        <span className="text-[13px] font-semibold tracking-tight text-paper">{brand.name}</span>
        <span className="ml-auto text-[10px] font-medium uppercase tracking-[0.14em] text-gold-300">
          {dict.auth.roleAdmin}
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2.5 py-4">
        {groups.map((group, gi) => (
          <div key={gi} className="mb-4 last:mb-0">
            {group.title && (
              <p className="mb-1.5 px-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-paper/70">
                {group.title}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map(({ label, href, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-2.5 rounded-[3px] px-2.5 py-2 text-[13px] transition-colors",
                        active
                          ? "bg-paper/12 font-medium text-paper"
                          : "text-paper/60 hover:bg-paper/6 hover:text-paper",
                      )}
                    >
                      {Icon ? <Icon size={15} className="shrink-0" /> : <span className="w-[15px]" />}
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="shrink-0 border-t border-paper/10 p-3">
        <Link
          href={r.home}
          className="flex min-h-11 items-center gap-2 px-2.5 py-2 text-xs text-paper/70 transition-colors hover:text-paper"
        >
          {dict.admin.backToSite}
        </Link>
      </div>
    </nav>
  );

  return (
    <div className="flex min-h-dvh bg-bone">
      <aside className="hidden w-60 shrink-0 bg-ink lg:block">
        <div className="sticky top-0 h-dvh">{sidebar}</div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-100 lg:hidden">
          <button
            type="button"
            aria-label={dict.actions.close}
            onClick={() => setOpen(false)}
            className="motion-overlay absolute inset-0 bg-obsidian/50"
          />
          <div ref={mobilePanelRef} role="dialog" aria-modal="true" aria-label={dict.admin.title} tabIndex={-1} className="motion-drawer-left absolute inset-y-0 left-0 w-64 bg-ink outline-none">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={dict.actions.close}
              className="absolute right-2 top-1.5 z-10 flex h-11 w-11 items-center justify-center text-paper/70"
            >
              <X size={18} />
            </button>
            {sidebar}
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-3 border-b border-line bg-paper px-4 lg:px-6">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={dict.actions.menu}
            className="-ml-2 flex h-11 w-11 items-center justify-center text-graphite lg:hidden"
          >
            <Menu size={19} />
          </button>

          <div className="relative hidden max-w-xs flex-1 sm:block">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mist"
            />
            <input
              value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder={dict.admin.searchSections}
              aria-label={dict.actions.search}
              className="h-9 w-full rounded-[3px] border border-line bg-bone pl-9 pr-3 text-[13px] text-ink outline-none placeholder:text-mist focus:border-ink"
            />
          </div>

          {query && <div className="absolute left-4 top-14 z-50 max-h-80 w-72 overflow-auto border bg-paper p-3 shadow-xl">{groups.flatMap(g=>g.items).filter(i=>i.label.toLowerCase().includes(query.toLowerCase())).map(i=><Link className="block min-h-11 border-b p-3 text-sm" key={i.href} href={i.href} onClick={()=>setQuery("")}>{i.label}</Link>)}</div>}
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setQuery(dict.admin.repairs)}
              aria-label={dict.account.notifications}
              className="relative flex h-11 w-11 items-center justify-center text-graphite hover:text-ink"
            >
              <Bell size={17} />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-gold-500" />
            </button>
            <div className="flex items-center gap-2.5 border-l border-line pl-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sand text-[11px] font-semibold text-graphite">
                {initials(user?.name)}
              </span>
              <div className="hidden sm:block">
                <p className="text-[13px] font-medium leading-tight text-ink">
                  {user?.name ?? dict.auth.roleAdmin}
                </p>
                {user?.email && <p className="max-w-40 truncate text-xs leading-tight text-stone">{user.email}</p>}
              </div>
              <button
                type="button"
                onClick={() => {
                  void signOut().then(() => router.push(r.adminLogin));
                }}
                aria-label={dict.account.logout}
                title={dict.account.logout}
                className="flex h-11 w-11 items-center justify-center text-graphite transition-colors hover:text-danger"
              >
                <LogOut size={17} />
              </button>
            </div>
          </div>
        </header>

        <main id="main" className="min-w-0 flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

/** Adın baş hərfləri — avatar üçün. */
function initials(name?: string): string {
  if (!name) return "EP";
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
}
