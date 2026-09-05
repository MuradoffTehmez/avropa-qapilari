/**
 * EuroPorta — brend konfiqurasiyası.
 * Şirkət əlaqə məlumatları təsdiqlənənə qədər boş saxlanılır;
 * boş sahələr UI-də avtomatik gizlədilir.
 */
export const brand = {
  name: "EuroPorta",
  legalName: "EuroPorta",
  slogan: "Girişin yeni standartı",
  tagline: "Doors · Sales · Installation · Repair",

  domain: "europorta.az",
  siteUrl: "https://europorta.az",

  /** Boş sahələr göstərilmir — məlumat gələndə doldurun. */
  contact: {
    phone: "",
    phoneHref: "",
    whatsapp: "",
    email: "",
    address: "",
    workingHours: "",
  },

  social: {
    instagram: "",
    facebook: "",
    tiktok: "",
  },
} as const;

export type Brand = typeof brand;

/** Əlaqə blokunda göstəriləcək sahə varmı? */
export const hasContact = Object.values(brand.contact).some((v) => v !== "");
export const hasSocial = Object.values(brand.social).some((v) => v !== "");
