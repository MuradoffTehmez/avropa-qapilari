import type { NextConfig } from "next";

/**
 * PRD §24 — lokalizə olunmuş URL seqmentləri.
 * Fayl sistemi AZ seqmentlərindən istifadə edir; EN/RU seqmentləri
 * eyni route-lara rewrite olunur (məs. /en/doors → /en/qapilar).
 */
const localizedSegments: { from: string; to: string; locale: "en" | "ru" }[] = [
  { locale: "en", from: "doors", to: "qapilar" },
  { locale: "en", from: "door", to: "qapi" },
  { locale: "en", from: "configurator", to: "konfiqurator" },
  { locale: "en", from: "services", to: "xidmetler" },
  { locale: "en", from: "repair", to: "temir" },
  { locale: "en", from: "measurement", to: "olcu" },
  { locale: "en", from: "projects", to: "layiheler" },
  { locale: "en", from: "about", to: "haqqimizda" },
  { locale: "en", from: "contact", to: "elaqe" },
  { locale: "en", from: "cart", to: "sebet" },
  { locale: "en", from: "checkout", to: "sifaris" },
  { locale: "en", from: "favorites", to: "favoritler" },
  { locale: "en", from: "compare", to: "muqayise" },
  { locale: "en", from: "account", to: "hesab" },
  { locale: "en", from: "login", to: "giris" },
  { locale: "en", from: "register", to: "qeydiyyat" },
  { locale: "en", from: "password", to: "parol" },
  { locale: "en", from: "technician", to: "usta" },
  { locale: "ru", from: "dveri", to: "qapilar" },
  { locale: "ru", from: "dver", to: "qapi" },
  { locale: "ru", from: "konfigurator", to: "konfiqurator" },
  { locale: "ru", from: "uslugi", to: "xidmetler" },
  { locale: "ru", from: "remont", to: "temir" },
  { locale: "ru", from: "zamer", to: "olcu" },
  { locale: "ru", from: "proekty", to: "layiheler" },
  { locale: "ru", from: "o-nas", to: "haqqimizda" },
  { locale: "ru", from: "kontakty", to: "elaqe" },
  { locale: "ru", from: "korzina", to: "sebet" },
  { locale: "ru", from: "oformlenie", to: "sifaris" },
  { locale: "ru", from: "izbrannoe", to: "favoritler" },
  { locale: "ru", from: "sravnenie", to: "muqayise" },
  { locale: "ru", from: "kabinet", to: "hesab" },
  { locale: "ru", from: "vhod", to: "giris" },
  { locale: "ru", from: "registraciya", to: "qeydiyyat" },
  { locale: "ru", from: "master", to: "usta" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Dev göstəricisi mobil düymələri örtür
  devIndicators: false,

  // Layihə kökünü açıq göstəririk (yuxarı qovluqdakı lockfile ilə qarışmasın)
  turbopack: { root: import.meta.dirname },

  images: {
    formats: ["image/avif", "image/webp"],
  },

  async rewrites() {
    return localizedSegments.flatMap(({ locale, from, to }) => [
      { source: `/${locale}/${from}`, destination: `/${locale}/${to}` },
      { source: `/${locale}/${from}/:path*`, destination: `/${locale}/${to}/:path*` },
    ]);
  },

  async headers() {
    // PRD §129 — təhlükəsizlik başlıqları.
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
