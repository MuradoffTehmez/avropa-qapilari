/**
 * DEMO BRAND CONFIGURATION
 * ------------------------
 * Rəsmi ad və loqo hazır olmadığı üçün müvəqqəti (demo) dəyərlər istifadə olunur.
 * Real brend məlumatı gələndə YALNIZ bu faylı dəyişmək kifayətdir.
 */
export const brand = {
  /** Demo ad — dəyişdirilməlidir */
  name: "EuroPorta",
  legalName: "EuroPorta MMC",
  tagline: "Avropa qapıları",
  /** Demo domen */
  domain: "europorta.az",
  siteUrl: "https://europorta.az",
  isDemo: true,

  contact: {
    phone: "+994 12 000 00 00",
    phoneHref: "+994120000000",
    whatsapp: "+994500000000",
    email: "info@europorta.az",
    address: "Bakı, Xətai rayonu, Nizami küç. 1",
    workingHours: "B.e — Şənbə, 09:00 – 19:00",
  },

  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    tiktok: "https://tiktok.com/",
  },
} as const;

export type Brand = typeof brand;
