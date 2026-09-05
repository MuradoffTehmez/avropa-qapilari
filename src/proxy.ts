import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, locales } from "@/i18n/config";

const PUBLIC_FILE = /\.(.*)$/;
const LOCALE_COOKIE = "ep-locale";

/** Brauzerin Accept-Language başlığından dəstəklənən ilk dili seçir. */
function detectLocale(header: string | null): string | null {
  if (!header) return null;

  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: tag.trim().toLowerCase(), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const base = tag.split("-")[0];
    if (base === "az" || base === "tr") return "az";
    if (base === "ru") return "ru";
    if (base === "en") return "en";
  }
  return null;
}

/**
 * Locale prefiksi olmayan URL-ləri yönləndirir.
 * Prioritet: kuki → Accept-Language → default (az).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const current = locales.find((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));

  if (current) {
    // İstifadəçi dili dəyişdirsə, seçimi yadda saxlayırıq
    const response = NextResponse.next();
    if (request.cookies.get(LOCALE_COOKIE)?.value !== current) {
      response.cookies.set(LOCALE_COOKIE, current, {
        path: "/",
        maxAge: 31_536_000,
        sameSite: "lax",
      });
    }
    return response;
  }

  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  const preferred =
    (saved && isLocale(saved) ? saved : null) ??
    detectLocale(request.headers.get("accept-language")) ??
    defaultLocale;

  const url = request.nextUrl.clone();
  url.pathname = `/${preferred}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
