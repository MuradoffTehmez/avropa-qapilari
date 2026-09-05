import type {
  DoorMaterial,
  OptionGroupKey,
  Product,
  ProductDocument,
  SecurityClass,
  SurfaceStyle,
} from "@/types";
import { slugify } from "@/lib/utils";

/** DEMO DATA — backend hazır olduqda D1/Prisma-dan gələcək. */

const entranceGroups: OptionGroupKey[] = [
  "SIZE",
  "OPENING_DIRECTION",
  "OUTSIDE_COLOR",
  "INSIDE_COLOR",
  "FRAME",
  "GLASS",
  "HANDLE",
  "LOCK",
  "SMART_LOCK",
  "ACCESSORY",
  "INSTALLATION",
  "DELIVERY",
];

const interiorGroups: OptionGroupKey[] = [
  "SIZE",
  "OPENING_DIRECTION",
  "OUTSIDE_COLOR",
  "INSIDE_COLOR",
  "FRAME",
  "GLASS",
  "HANDLE",
  "LOCK",
  "ACCESSORY",
  "INSTALLATION",
  "DELIVERY",
];

const docs = (name: string): ProductDocument[] => [
  { id: `${slugify(name)}-tech`, type: "TECH_SHEET", title: "Texniki vərəqə (PDF)", sizeKb: 480 },
  { id: `${slugify(name)}-cert`, type: "CERTIFICATE", title: "Avropa uyğunluq sertifikatı", sizeKb: 320 },
  { id: `${slugify(name)}-inst`, type: "INSTALLATION", title: "Quraşdırma təlimatı", sizeKb: 1140 },
  { id: `${slugify(name)}-war`, type: "WARRANTY", title: "Zəmanət sənədi", sizeKb: 210 },
];

interface Seed {
  name: string;
  sku: string;
  categorySlug: string;
  brandSlug: string;
  collection: string;
  basePrice: number;
  oldPrice?: number;
  material: DoorMaterial;
  securityClass: SecurityClass;
  soundInsulationDb: number;
  thermalW: number;
  fireRating: string | null;
  warrantyYears: number;
  style: SurfaceStyle;
  hasGlass: boolean;
  smartLockReady: boolean;
  inStock: boolean;
  madeToOrder: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  rating: number;
  reviewCount: number;
  panelHexes: string[];
  short: string;
  wide?: boolean;
  interior?: boolean;
}

const seeds: Seed[] = [
  {
    name: "Milano Security 720", sku: "MIL-720", categorySlug: "giris-qapilari", brandSlug: "milano-porte",
    collection: "Milano", basePrice: 1450, oldPrice: 1690, material: "STEEL", securityClass: "RC3",
    soundInsulationDb: 42, thermalW: 1.1, fireRating: "EI30", warrantyYears: 7, style: "MODERN",
    hasGlass: false, smartLockReady: true, inStock: true, madeToOrder: false, isBestseller: true,
    rating: 4.8, reviewCount: 126, panelHexes: ["#383e42", "#0e0e10", "#6b665e"],
    short: "Çoxqatlı polad konstruksiya, 42 dB səs izolyasiyası və RC3 sertifikatı.",
  },
  {
    name: "Milano Glass 340", sku: "MIL-340", categorySlug: "shuseli-qapilar", brandSlug: "milano-porte",
    collection: "Milano", basePrice: 980, material: "GLASS", securityClass: "—",
    soundInsulationDb: 28, thermalW: 2.4, fireRating: null, warrantyYears: 5, style: "MINIMAL",
    hasGlass: true, smartLockReady: false, inStock: true, madeToOrder: false, isNew: true,
    rating: 4.6, reviewCount: 41, panelHexes: ["#c9ced1", "#8fa0a5", "#f1f0ea"],
    short: "Tempered şüşə panel və nazik alüminium profil — işıqlı interyerlər üçün.", interior: true,
  },
  {
    name: "Nordheim Thermo 900", sku: "NOR-900", categorySlug: "villa-qapilari", brandSlug: "nordheim",
    collection: "Nordic", basePrice: 2340, material: "COMPOSITE", securityClass: "RC4",
    soundInsulationDb: 45, thermalW: 0.79, fireRating: "EI60", warrantyYears: 10, style: "MODERN",
    hasGlass: true, smartLockReady: true, inStock: false, madeToOrder: true, isBestseller: true,
    rating: 4.9, reviewCount: 88, panelHexes: ["#33312e", "#5b3a26", "#f1f0ea"],
    short: "0.79 W/m²K termo göstərici, RC4 sertifikatı və 10 il zəmanət.", wide: true,
  },
  {
    name: "Nordheim Silent 610", sku: "NOR-610", categorySlug: "giris-qapilari", brandSlug: "nordheim",
    collection: "Nordic", basePrice: 1780, material: "STEEL", securityClass: "RC3",
    soundInsulationDb: 47, thermalW: 0.95, fireRating: "EI30", warrantyYears: 8, style: "MINIMAL",
    hasGlass: false, smartLockReady: true, inStock: true, madeToOrder: false,
    rating: 4.7, reviewCount: 64, panelHexes: ["#6b665e", "#383e42", "#0e0e10"],
    short: "Üçqat kontur izolyasiyası ilə 47 dB — mərkəzi küçələr üçün.",
  },
  {
    name: "Vienna Classic 210", sku: "VIE-210", categorySlug: "otaq-qapilari", brandSlug: "vienna-tur",
    collection: "Vienna Classic", basePrice: 620, material: "SOLID_WOOD", securityClass: "—",
    soundInsulationDb: 26, thermalW: 2.1, fireRating: null, warrantyYears: 5, style: "CLASSIC",
    hasGlass: false, smartLockReady: false, inStock: true, madeToOrder: false, isBestseller: true,
    rating: 4.7, reviewCount: 152, panelHexes: ["#f5f4f0", "#ece4d5", "#c8a678"],
    short: "Massiv palıd, əl işi freze naxış və klassik profil.", interior: true,
  },
  {
    name: "Vienna Neo 305", sku: "VIE-305", categorySlug: "otaq-qapilari", brandSlug: "vienna-tur",
    collection: "Vienna Classic", basePrice: 740, oldPrice: 860, material: "SOLID_WOOD", securityClass: "—",
    soundInsulationDb: 29, thermalW: 2.0, fireRating: null, warrantyYears: 5, style: "NEOCLASSIC",
    hasGlass: true, smartLockReady: false, inStock: true, madeToOrder: false,
    rating: 4.5, reviewCount: 73, panelHexes: ["#ece4d5", "#f5f4f0", "#8e8b85"],
    short: "Neoklassik xətlər, satin şüşə inserti və gizli menteşələr.", interior: true,
  },
  {
    name: "Aurea Flat 100", sku: "AUR-100", categorySlug: "otaq-qapilari", brandSlug: "aurea",
    collection: "Aurea Line", basePrice: 890, material: "MDF", securityClass: "—",
    soundInsulationDb: 31, thermalW: 1.9, fireRating: null, warrantyYears: 6, style: "MINIMAL",
    hasGlass: false, smartLockReady: false, inStock: true, madeToOrder: false, isNew: true,
    rating: 4.6, reviewCount: 39, panelHexes: ["#f5f4f0", "#17161a", "#8e8b85"],
    short: "Tam hündürlüklü panel, gizli çərçivə və maqnit kilid.", interior: true,
  },
  {
    name: "Aurea Invisible 220", sku: "AUR-220", categorySlug: "otaq-qapilari", brandSlug: "aurea",
    collection: "Aurea Line", basePrice: 1290, material: "MDF", securityClass: "—",
    soundInsulationDb: 33, thermalW: 1.85, fireRating: null, warrantyYears: 6, style: "MINIMAL",
    hasGlass: false, smartLockReady: false, inStock: false, madeToOrder: true, isNew: true,
    rating: 4.8, reviewCount: 21, panelHexes: ["#f1f0ea", "#c8a678", "#17161a"],
    short: "Divarla eyni səviyyədə gizli qapı sistemi — boyanmağa hazır səth.", interior: true,
  },
  {
    name: "Belveder Prime 410", sku: "BEL-410", categorySlug: "giris-qapilari", brandSlug: "belveder",
    collection: "Belveder Prime", basePrice: 1120, oldPrice: 1280, material: "STEEL", securityClass: "RC2",
    soundInsulationDb: 36, thermalW: 1.3, fireRating: null, warrantyYears: 5, style: "MODERN",
    hasGlass: false, smartLockReady: true, inStock: true, madeToOrder: false, isBestseller: true,
    rating: 4.4, reviewCount: 198, panelHexes: ["#383e42", "#a9743c", "#6b665e"],
    short: "Ən çox seçilən giriş qapısı — balanslı qiymət və 5 nöqtəli kilid.",
  },
  {
    name: "Belveder Fortis 520", sku: "BEL-520", categorySlug: "tehlukesizlik-qapilari", brandSlug: "belveder",
    collection: "Belveder Prime", basePrice: 1960, material: "STEEL", securityClass: "RC4",
    soundInsulationDb: 44, thermalW: 1.05, fireRating: "EI60", warrantyYears: 8, style: "MODERN",
    hasGlass: false, smartLockReady: true, inStock: true, madeToOrder: false,
    rating: 4.8, reviewCount: 57, panelHexes: ["#0e0e10", "#383e42", "#33312e"],
    short: "İki müstəqil kilid sistemi, zirehli plitə və anti-drill silindr.",
  },
  {
    name: "Fortis Armor 780", sku: "BEL-780", categorySlug: "tehlukesizlik-qapilari", brandSlug: "nordheim",
    collection: "Nordic", basePrice: 3150, material: "STEEL", securityClass: "RC5",
    soundInsulationDb: 49, thermalW: 0.88, fireRating: "EI90", warrantyYears: 10, style: "MODERN",
    hasGlass: false, smartLockReady: true, inStock: false, madeToOrder: true,
    rating: 5.0, reviewCount: 18, panelHexes: ["#2f2e2b", "#0e0e10", "#4a4844"],
    short: "RC5 sinif — bank, seyf otağı və yüksək risk obyektləri üçün.",
  },
  {
    name: "Smart Guard S1", sku: "SMG-S1", categorySlug: "smart-qapilar", brandSlug: "milano-porte",
    collection: "Milano", basePrice: 2280, material: "STEEL", securityClass: "RC3",
    soundInsulationDb: 41, thermalW: 1.15, fireRating: "EI30", warrantyYears: 7, style: "MODERN",
    hasGlass: false, smartLockReady: true, inStock: true, madeToOrder: false, isNew: true, isBestseller: true,
    rating: 4.9, reviewCount: 74, panelHexes: ["#33312e", "#0e0e10", "#383e42"],
    short: "Zavod quraşdırmalı Smart Lock X2, barmaq izi və mobil tətbiq nəzarəti.",
  },
  {
    name: "Smart Guard S2 Pro", sku: "SMG-S2", categorySlug: "smart-qapilar", brandSlug: "nordheim",
    collection: "Nordic", basePrice: 2890, material: "COMPOSITE", securityClass: "RC4",
    soundInsulationDb: 46, thermalW: 0.84, fireRating: "EI60", warrantyYears: 10, style: "MODERN",
    hasGlass: true, smartLockReady: true, inStock: false, madeToOrder: true, isNew: true,
    rating: 4.9, reviewCount: 32, panelHexes: ["#33312e", "#5b3a26", "#0e0e10"],
    short: "Üz tanıma, kamera və interkom inteqrasiyası ilə tam smart giriş.", wide: true,
  },
  {
    name: "Lumia Loft 150", sku: "LUM-150", categorySlug: "shuseli-qapilar", brandSlug: "lumia",
    collection: "Lumia Glass", basePrice: 1180, material: "ALUMINIUM", securityClass: "—",
    soundInsulationDb: 30, thermalW: 2.2, fireRating: null, warrantyYears: 5, style: "LOFT",
    hasGlass: true, smartLockReady: false, inStock: true, madeToOrder: false, isBestseller: true,
    rating: 4.7, reviewCount: 96, panelHexes: ["#1b1b1d", "#8fa0a5", "#4a4844"],
    short: "Qara alüminium şəbəkə və şəffaf şüşə — loft interyerlərin klassiki.", interior: true, wide: true,
  },
  {
    name: "Lumia Slide 260", sku: "LUM-260", categorySlug: "shuseli-qapilar", brandSlug: "lumia",
    collection: "Lumia Glass", basePrice: 1420, material: "ALUMINIUM", securityClass: "—",
    soundInsulationDb: 27, thermalW: 2.5, fireRating: null, warrantyYears: 5, style: "MINIMAL",
    hasGlass: true, smartLockReady: false, inStock: true, madeToOrder: false, isNew: true,
    rating: 4.5, reviewCount: 28, panelHexes: ["#c9ced1", "#8fa0a5", "#1b1b1d"],
    short: "Sürüşən sistem, yumşaq bağlanma mexanizmi və gizli relslər.", interior: true, wide: true,
  },
  {
    name: "Villa Grande 1200", sku: "MIL-1200", categorySlug: "villa-qapilari", brandSlug: "milano-porte",
    collection: "Milano", basePrice: 3480, material: "SOLID_WOOD", securityClass: "RC3",
    soundInsulationDb: 43, thermalW: 1.0, fireRating: "EI30", warrantyYears: 8, style: "CLASSIC",
    hasGlass: true, smartLockReady: true, inStock: false, madeToOrder: true,
    rating: 4.9, reviewCount: 24, panelHexes: ["#5b3a26", "#a9743c", "#33312e"],
    short: "1200 mm enində massiv qoz ağacı panel və üfüqi şüşə vitraj.", wide: true,
  },
  {
    name: "Villa Terra 1000", sku: "BEL-1000", categorySlug: "villa-qapilari", brandSlug: "belveder",
    collection: "Belveder Prime", basePrice: 2140, oldPrice: 2450, material: "COMPOSITE", securityClass: "RC3",
    soundInsulationDb: 40, thermalW: 0.98, fireRating: "EI30", warrantyYears: 7, style: "MODERN",
    hasGlass: false, smartLockReady: true, inStock: true, madeToOrder: false,
    rating: 4.6, reviewCount: 51, panelHexes: ["#6b665e", "#33312e", "#f1f0ea"],
    short: "UV davamlı örtük, termo körpü kəsilməsi və gücləndirilmiş menteşələr.", wide: true,
  },
  {
    name: "Nordic Frame 480", sku: "NOR-480", categorySlug: "giris-qapilari", brandSlug: "nordheim",
    collection: "Nordic", basePrice: 1560, material: "STEEL", securityClass: "RC3",
    soundInsulationDb: 39, thermalW: 1.2, fireRating: "EI30", warrantyYears: 8, style: "MINIMAL",
    hasGlass: true, smartLockReady: true, inStock: true, madeToOrder: false,
    rating: 4.5, reviewCount: 47, panelHexes: ["#383e42", "#f1f0ea", "#6b665e"],
    short: "Şaquli şüşə zolaq və teleskopik çərçivə ilə standart mənzil girişi.",
  },
  {
    name: "Metal Tech 40", sku: "MTL-040", categorySlug: "metal-qapilar", brandSlug: "belveder",
    collection: "Belveder Prime", basePrice: 540, material: "STEEL", securityClass: "RC2",
    soundInsulationDb: 24, thermalW: 1.8, fireRating: null, warrantyYears: 3, style: "MINIMAL",
    hasGlass: false, smartLockReady: false, inStock: true, madeToOrder: false,
    rating: 4.1, reviewCount: 63, panelHexes: ["#6b665e", "#383e42", "#8e8b85"],
    short: "Texniki otaq və anbarlar üçün sadə, davamlı metal qapı.",
  },
  {
    name: "Metal Tech 60 Fire", sku: "MTL-060", categorySlug: "yangin-qapilari", brandSlug: "nordheim",
    collection: "Nordic", basePrice: 890, material: "STEEL", securityClass: "RC2",
    soundInsulationDb: 32, thermalW: 1.5, fireRating: "EI60", warrantyYears: 5, style: "MINIMAL",
    hasGlass: false, smartLockReady: false, inStock: true, madeToOrder: false,
    rating: 4.4, reviewCount: 29, panelHexes: ["#8e8b85", "#6b665e", "#383e42"],
    short: "EI60 sertifikatlı, anti-panik bar ilə uyğun yanğın qapısı.",
  },
  {
    name: "Aurea Duo 340", sku: "AUR-340", categorySlug: "otaq-qapilari", brandSlug: "aurea",
    collection: "Aurea Line", basePrice: 1650, material: "MDF", securityClass: "—",
    soundInsulationDb: 30, thermalW: 1.95, fireRating: null, warrantyYears: 6, style: "MODERN",
    hasGlass: true, smartLockReady: false, inStock: true, madeToOrder: false,
    rating: 4.6, reviewCount: 35, panelHexes: ["#f1f0ea", "#8e8b85", "#c8a678"],
    short: "İkiqanadlı sistem, salon və qonaq otağı keçidləri üçün.", interior: true, wide: true,
  },
  {
    name: "Vienna Oak 415", sku: "VIE-415", categorySlug: "otaq-qapilari", brandSlug: "vienna-tur",
    collection: "Vienna Classic", basePrice: 980, material: "SOLID_WOOD", securityClass: "—",
    soundInsulationDb: 28, thermalW: 2.05, fireRating: null, warrantyYears: 5, style: "CLASSIC",
    hasGlass: false, smartLockReady: false, inStock: true, madeToOrder: false,
    rating: 4.7, reviewCount: 82, panelHexes: ["#c8a678", "#a9743c", "#ece4d5"],
    short: "Təbii palıd şpon, açıq məsaməli lak və isti ton.", interior: true,
  },
  {
    name: "Milano Bronze 880", sku: "MIL-880", categorySlug: "giris-qapilari", brandSlug: "milano-porte",
    collection: "Milano", basePrice: 2650, material: "STEEL", securityClass: "RC4",
    soundInsulationDb: 45, thermalW: 1.02, fireRating: "EI60", warrantyYears: 8, style: "NEOCLASSIC",
    hasGlass: true, smartLockReady: true, inStock: false, madeToOrder: true, isNew: true,
    rating: 4.9, reviewCount: 16, panelHexes: ["#33312e", "#a9844a", "#0e0e10"],
    short: "Bürünc detallar, freze naxış və triplex vitraj panel.",
  },
  {
    name: "Nordic Compact 320", sku: "NOR-320", categorySlug: "giris-qapilari", brandSlug: "nordheim",
    collection: "Nordic", basePrice: 1290, oldPrice: 1450, material: "STEEL", securityClass: "RC2",
    soundInsulationDb: 35, thermalW: 1.35, fireRating: null, warrantyYears: 6, style: "MINIMAL",
    hasGlass: false, smartLockReady: true, inStock: true, madeToOrder: false,
    rating: 4.3, reviewCount: 110, panelHexes: ["#f1f0ea", "#6b665e", "#383e42"],
    short: "Kompakt mənzillər üçün yüngül konstruksiya və sürətli quraşdırma.",
  },
];

function build(seed: Seed, index: number): Product {
  const slug = slugify(seed.name);
  const wide = seed.wide ?? false;

  return {
    id: `prd-${String(index + 1).padStart(3, "0")}`,
    slug,
    sku: seed.sku,
    name: seed.name,
    categorySlug: seed.categorySlug,
    brandSlug: seed.brandSlug,
    collection: seed.collection,
    shortDescription: seed.short,
    description: `${seed.short} ${seed.name} modeli Avropa istehsal standartlarına uyğun hazırlanır və sifariş əsasında rəng, ölçü, kilid, dəstək və aksesuar konfiqurasiyası ilə təchiz olunur. Konfiquratorda seçdiyiniz hər parametr yekun qiymətə real vaxtda əks olunur.`,
    basePrice: seed.basePrice,
    oldPrice: seed.oldPrice,
    currency: "AZN",
    rating: seed.rating,
    reviewCount: seed.reviewCount,

    material: seed.material,
    securityClass: seed.securityClass,
    soundInsulationDb: seed.soundInsulationDb,
    thermalW: seed.thermalW,
    fireRating: seed.fireRating,
    warrantyYears: seed.warrantyYears,

    defaultWidth: wide ? 1200 : 960,
    defaultHeight: wide ? 2100 : 2050,
    minWidth: wide ? 1000 : 760,
    maxWidth: wide ? 1600 : 1100,
    minHeight: 1900,
    maxHeight: wide ? 2400 : 2200,

    style: seed.style,
    hasGlass: seed.hasGlass,
    smartLockReady: seed.smartLockReady,
    customSizeAvailable: true,
    installationAvailable: true,
    madeToOrder: seed.madeToOrder,
    inStock: seed.inStock,
    isNew: seed.isNew ?? false,
    isBestseller: seed.isBestseller ?? false,
    onSale: seed.oldPrice !== undefined,

    deliveryDays: seed.madeToOrder ? [21, 35] : [3, 7],
    panelHexes: seed.panelHexes,

    specs: [
      { group: "Konstruksiya", label: "Material", value: materialLabel(seed.material) },
      { group: "Konstruksiya", label: "Panel qalınlığı", value: wide ? "90 mm" : "75 mm" },
      { group: "Konstruksiya", label: "Menteşə sayı", value: wide ? "4 ədəd" : "3 ədəd" },
      { group: "Təhlükəsizlik", label: "Təhlükəsizlik sinfi", value: seed.securityClass },
      { group: "Təhlükəsizlik", label: "Kilid nöqtəsi", value: seed.securityClass === "RC5" ? "9 nöqtə" : "5 nöqtə" },
      { group: "Təhlükəsizlik", label: "Anti-drill silindr", value: seed.securityClass === "—" ? "Yoxdur" : "Var" },
      { group: "İzolyasiya", label: "Səs izolyasiyası", value: `${seed.soundInsulationDb} dB` },
      { group: "İzolyasiya", label: "İstilik ötürmə", value: `${seed.thermalW} W/m²K` },
      { group: "İzolyasiya", label: "Yanğın davamlılığı", value: seed.fireRating ?? "Sertifikatsız" },
      { group: "Ölçü", label: "Standart ölçü", value: wide ? "1200 × 2100 mm" : "960 × 2050 mm" },
      { group: "Ölçü", label: "Fərdi ölçü", value: "Mümkündür" },
      { group: "Zəmanət", label: "Zəmanət müddəti", value: `${seed.warrantyYears} il` },
      { group: "Zəmanət", label: "Servis dəstəyi", value: "Ömürlük texniki dəstək" },
    ],

    documents: docs(seed.name),
    optionGroups: seed.interior ? interiorGroups : entranceGroups,
  };
}

function materialLabel(m: DoorMaterial): string {
  const map: Record<DoorMaterial, string> = {
    STEEL: "Polad",
    SOLID_WOOD: "Massiv ağac",
    MDF: "MDF",
    ALUMINIUM: "Alüminium",
    COMPOSITE: "Kompozit",
    GLASS: "Şüşə",
  };
  return map[m];
}

export const materialLabels: Record<DoorMaterial, string> = {
  STEEL: "Polad",
  SOLID_WOOD: "Massiv ağac",
  MDF: "MDF",
  ALUMINIUM: "Alüminium",
  COMPOSITE: "Kompozit",
  GLASS: "Şüşə",
};

export const styleLabels: Record<SurfaceStyle, string> = {
  MODERN: "Müasir",
  CLASSIC: "Klassik",
  MINIMAL: "Minimalist",
  LOFT: "Loft",
  NEOCLASSIC: "Neoklassik",
};

export const products: Product[] = seeds.map(build);

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getFeaturedProducts(limit = 8): Product[] {
  return [...products]
    .sort((a, b) => Number(b.isBestseller) - Number(a.isBestseller) || b.rating - a.rating)
    .slice(0, limit);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.id !== product.id && p.categorySlug === product.categorySlug)
    .slice(0, limit);
}
