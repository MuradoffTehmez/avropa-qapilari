import type {
  DoorMaterial,
  OptionGroupKey,
  Product,
  ProductDocument,
  SecurityClass,
  SurfaceStyle,
} from "@/types";
import { slugify } from "@/lib/utils";

/** TEST DATA — hər kateqoriyadan bir model. Backend qoşulanda əvəzlənəcək. */

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
    name: "Nordheim Thermo 900", sku: "NOR-900", categorySlug: "villa-qapilari", brandSlug: "nordheim",
    collection: "Nordic", basePrice: 2340, material: "COMPOSITE", securityClass: "RC4",
    soundInsulationDb: 45, thermalW: 0.79, fireRating: "EI60", warrantyYears: 10, style: "MODERN",
    hasGlass: true, smartLockReady: true, inStock: false, madeToOrder: true, isBestseller: true,
    rating: 4.9, reviewCount: 88, panelHexes: ["#33312e", "#5b3a26", "#f1f0ea"],
    short: "0.79 W/m²K termo göstərici, RC4 sertifikatı və 10 il zəmanət.", wide: true,
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
    name: "Aurea Flat 100", sku: "AUR-100", categorySlug: "otaq-qapilari", brandSlug: "aurea",
    collection: "Aurea Line", basePrice: 890, material: "MDF", securityClass: "—",
    soundInsulationDb: 31, thermalW: 1.9, fireRating: null, warrantyYears: 6, style: "MINIMAL",
    hasGlass: false, smartLockReady: false, inStock: true, madeToOrder: false, isNew: true,
    rating: 4.6, reviewCount: 39, panelHexes: ["#f5f4f0", "#17161a", "#8e8b85"],
    short: "Tam hündürlüklü panel, gizli çərçivə və maqnit kilid.", interior: true,
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
    name: "Smart Guard S1", sku: "SMG-S1", categorySlug: "smart-qapilar", brandSlug: "milano-porte",
    collection: "Milano", basePrice: 2280, material: "STEEL", securityClass: "RC3",
    soundInsulationDb: 41, thermalW: 1.15, fireRating: "EI30", warrantyYears: 7, style: "MODERN",
    hasGlass: false, smartLockReady: true, inStock: true, madeToOrder: false, isNew: true, isBestseller: true,
    rating: 4.9, reviewCount: 74, panelHexes: ["#33312e", "#0e0e10", "#383e42"],
    short: "Zavod quraşdırmalı Smart Lock X2, barmaq izi və mobil tətbiq nəzarəti.",
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
