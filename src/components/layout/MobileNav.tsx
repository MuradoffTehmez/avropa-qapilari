"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, DoorOpen, SlidersHorizontal, Wrench, User } from "lucide-react";
import type { Locale } from "@/types";
import { routes } from "@/lib/routes";
export function MobileNav({locale}:{locale:Locale}) {
 const path=usePathname();const r=routes(locale);
 if (/\/admin|\/konfiqurator\/|\/configurator\/|\/konfigurator\/|\/sifaris|\/checkout|\/oformlenie/.test(path)) return null;
 const items=[{href:r.home,label:"Ana səhifə",icon:Home},{href:r.doors,label:"Kataloq",icon:DoorOpen},{href:r.configurator,label:"Qapını yarat",icon:SlidersHorizontal},{href:r.repair,label:"Servis",icon:Wrench},{href:r.account,label:"Hesab",icon:User}];
 return <nav aria-label="Mobil naviqasiya" className="mobile-bottom-nav fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t bg-paper/95 backdrop-blur lg:hidden">{items.map(({href,label,icon:Icon})=><Link key={href} href={href} aria-current={path===href?"page":undefined} className={`flex min-h-16 flex-col items-center justify-center gap-1 px-1 text-[10px] ${path===href?"font-semibold text-brass-700":"text-graphite"}`}><Icon size={20}/>{label}</Link>)}</nav>;
}
