import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import "@/app/globals.css";

import { getDictionary, isLocale, locales } from "@/i18n";
import type { Locale } from "@/types";
import { brand } from "@/config/brand";
import { ToastHost } from "@/components/ui/overlays";
import { CookieBar } from "@/components/layout/CookieBar";

const inter = Inter({
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1a1917",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "az");

  return {
    metadataBase: new URL(brand.siteUrl),
    title: {
      default: `${brand.name} — ${dict.meta.titleSuffix}`,
      template: `%s · ${brand.name}`,
    },
    description: dict.meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
    },
    openGraph: {
      type: "website",
      siteName: brand.name,
      title: `${brand.name} — ${dict.meta.titleSuffix}`,
      description: dict.meta.description,
      locale,
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const typedLocale = locale as Locale;
  const dict = getDictionary(typedLocale);

  return (
    <html lang={typedLocale} className={inter.variable}>
      <body className="min-h-dvh bg-paper antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-200 focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-paper"
        >
          Əsas məzmuna keç
        </a>
        {children}
        <ToastHost />
        <CookieBar dict={dict} />
      </body>
    </html>
  );
}
