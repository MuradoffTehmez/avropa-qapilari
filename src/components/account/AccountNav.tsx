"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  CalendarClock,
  Heart,
  LayoutDashboard,
  LogOut,
  MapPin,
  Package,
  ShieldCheck,
  Sliders,
  User,
  Wrench,
} from "lucide-react";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/types";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

export function AccountNav({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const router = useRouter();
  const r = routes(locale);
  const pathname = usePathname();

  const items = [
    { icon: LayoutDashboard, label: dict.account.dashboard, href: r.account },
    { icon: Package, label: dict.account.orders, href: r.accountSection("orders") },
    { icon: Sliders, label: dict.account.configurations, href: r.accountSection("configurations") },
    { icon: Wrench, label: dict.account.repairs, href: r.accountSection("repairs") },
    { icon: CalendarClock, label: dict.account.appointments, href: r.accountSection("appointments") },
    { icon: ShieldCheck, label: dict.account.warranties, href: r.accountSection("warranties") },
    { icon: Heart, label: dict.account.favorites, href: r.favorites },
    { icon: MapPin, label: dict.account.addresses, href: r.accountSection("addresses") },
    { icon: Bell, label: dict.account.notifications, href: r.accountSection("notifications") },
    { icon: User, label: dict.account.profile, href: r.accountSection("profile") },
  ];

  return (
    <nav aria-label={dict.account.title} className="lg:sticky lg:top-24 lg:h-fit">
      <ul className="hide-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:px-0">
        {items.map(({ icon: Icon, label, href }) => {
          const active = pathname === href;
          return (
            <li key={href} className="shrink-0">
              <Link
                href={href}
                className={cn(
                  "flex items-center gap-2.5 whitespace-nowrap border px-3 py-2.5 text-[13.5px] transition-colors lg:border-0 lg:border-l-2 lg:px-3",
                  active
                    ? "border-ink bg-ink text-paper lg:border-l-ink lg:bg-bone lg:font-medium lg:text-ink"
                    : "border-line text-graphite hover:border-mist lg:border-l-transparent lg:hover:bg-bone lg:hover:text-ink",
                )}
              >
                <Icon size={16} className="shrink-0" />
                {label}
              </Link>
            </li>
          );
        })}
        <li className="shrink-0 lg:mt-4 lg:border-t lg:border-line lg:pt-4">
          <button
            onClick={() => { router.push(r.login); }}
            type="button"
            className="flex w-full items-center gap-2.5 whitespace-nowrap border border-line px-3 py-2.5 text-[13.5px] text-stone transition-colors hover:text-danger lg:border-0 lg:px-3"
          >
            <LogOut size={16} className="shrink-0" />
            {dict.account.logout}
          </button>
        </li>
      </ul>
    </nav>
  );
}
