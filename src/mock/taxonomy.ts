import type { Brand, Category } from "@/types";

/** DEMO DATA — backend hazır olduqda D1/Prisma-dan gələcək. */

export const categories: Category[] = [
  {
    id: "cat-1",
    slug: "giris-qapilari",
    name: "Giriş qapıları",
    shortName: "Giriş",
    description:
      "Mənzil və ev girişləri üçün çoxqatlı metal konstruksiya, RC2–RC4 təhlükəsizlik sinfi və yüksək səs izolyasiyası.",
    productCount: 42,
    featured: true,
    accent: "#3f3b36",
  },
  {
    id: "cat-2",
    slug: "villa-qapilari",
    name: "Villa qapıları",
    shortName: "Villa",
    description:
      "Böyük ölçülü, termo-izolyasiyalı və hava şəraitinə davamlı xarici giriş qapıları.",
    productCount: 27,
    featured: true,
    accent: "#4d4237",
  },
  {
    id: "cat-3",
    slug: "otaq-qapilari",
    name: "Otaq qapıları",
    shortName: "Otaq",
    description:
      "İnteryer üçün massiv ağac, MDF və şüşəli həllər — minimalist və klassik xətlərdə.",
    productCount: 58,
    featured: true,
    accent: "#6b6156",
  },
  {
    id: "cat-4",
    slug: "tehlukesizlik-qapilari",
    name: "Təhlükəsizlik qapıları",
    shortName: "Təhlükəsizlik",
    description:
      "RC4–RC5 sinifli, çoxnöqtəli kilid sistemli və sertifikatlı zirehli qapılar.",
    productCount: 19,
    featured: true,
    accent: "#2f2e2b",
  },
  {
    id: "cat-5",
    slug: "smart-qapilar",
    name: "Smart qapılar",
    shortName: "Smart",
    description:
      "Barmaq izi, kod, kart və mobil tətbiq ilə idarə olunan elektron kilid sistemləri.",
    productCount: 16,
    featured: true,
    accent: "#35403f",
  },
  {
    id: "cat-6",
    slug: "shuseli-qapilar",
    name: "Şüşəli qapılar",
    shortName: "Şüşəli",
    description:
      "Tempered və lakobel şüşə panelli, işıq keçirən interyer və ofis həlləri.",
    productCount: 23,
    featured: true,
    accent: "#5a6467",
  },
  {
    id: "cat-7",
    slug: "metal-qapilar",
    name: "Metal qapılar",
    shortName: "Metal",
    description: "Texniki otaqlar, anbar və giriş blokları üçün funksional metal qapılar.",
    productCount: 14,
    featured: false,
    accent: "#4a4844",
  },
  {
    id: "cat-8",
    slug: "yangin-qapilari",
    name: "Yanğın qapıları",
    shortName: "Yanğın",
    description: "EI30–EI90 sertifikatlı, yanğına davamlı təhlükəsizlik qapıları.",
    productCount: 9,
    featured: false,
    accent: "#5c3f38",
  },
];

export const brands: Brand[] = [
  {
    id: "br-1",
    slug: "milano-porte",
    name: "Milano Porte",
    country: "İtaliya",
    founded: 1978,
    description:
      "İtalyan dizayn məktəbinin premium giriş qapıları. Çoxqatlı konstruksiya və əl işi finiş.",
    productCount: 34,
  },
  {
    id: "br-2",
    slug: "nordheim",
    name: "Nordheim",
    country: "Almaniya",
    founded: 1965,
    description:
      "Alman mühəndisliyi: yüksək termo göstəricilər, RC4 sertifikatı və 10 il zəmanət.",
    productCount: 28,
  },
  {
    id: "br-3",
    slug: "vienna-tur",
    name: "Vienna Tür",
    country: "Avstriya",
    founded: 1991,
    description: "Neoklassik interyer qapıları və massiv ağac emalında ixtisaslaşma.",
    productCount: 22,
  },
  {
    id: "br-4",
    slug: "aurea",
    name: "Aurea",
    country: "İspaniya",
    founded: 2003,
    description: "Müasir minimalizm, gizli menteşələr və tam hündürlüklü panellər.",
    productCount: 19,
  },
  {
    id: "br-5",
    slug: "belveder",
    name: "Belveder",
    country: "Polşa",
    founded: 1998,
    description: "Qiymət/keyfiyyət balansı ilə seçilən Avropa istehsalı giriş qapıları.",
    productCount: 26,
  },
  {
    id: "br-6",
    slug: "lumia",
    name: "Lumia",
    country: "Çexiya",
    founded: 2010,
    description: "Şüşə və alüminium konstruksiyalar, ofis və loft interyerləri üçün.",
    productCount: 17,
  },
];

export const collections = [
  "Milano",
  "Nordic",
  "Vienna Classic",
  "Aurea Line",
  "Belveder Prime",
  "Lumia Glass",
] as const;

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getBrand(slug: string): Brand | undefined {
  return brands.find((b) => b.slug === slug);
}
