/* =========================================================================
   Domain tipləri–§158 data modelinə uyğun frontend proyeksiyası.
   Backend hazır olduqda bu tiplər API kontraktına map ediləcək.
   ========================================================================= */

export type Locale = "az" | "en" | "ru";

/** AZN (minor unit deyil). */
export type Money = number;

/* ------------------------------- Catalog ------------------------------- */

export interface Category {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  productCount: number;
  featured: boolean;
  accent: string;
}

export interface Brand {
  id: string;
  slug: string;
  name: string;
  country: string;
  founded: number;
  description: string;
  productCount: number;
}

export type SecurityClass = "RC2" | "RC3" | "RC4" | "RC5" | "—";

export type DoorMaterial =
  | "STEEL"
  | "SOLID_WOOD"
  | "MDF"
  | "ALUMINIUM"
  | "COMPOSITE"
  | "GLASS";

export type SurfaceStyle = "MODERN" | "CLASSIC" | "MINIMAL" | "LOFT" | "NEOCLASSIC";

/** Qapının konstruksiya qatı — kəsik görünüşü üçün. */
export interface ConstructionLayer {
  id: string;
  name: string;
  thicknessMm: number;
  role: string;
  color: string;
  /** Naxış: düz, lifli, hüceyrəli */
  pattern?: "solid" | "fiber" | "honeycomb" | "metal";
}

export interface ProductSpec {
  group: string;
  label: string;
  value: string;
}

/**
 * Məhsul şəkli. İstehsalçı kataloqundan gələn fayllar `public/products/`
 * qovluğuna qoyulur və burada qeyd olunur. Boş massiv olduqda
 * komponentlər avtomatik SVG vizuala keçir.
 */
export interface ProductImage {
  /** `/products/mil-720/01.webp` kimi yol */
  src: string;
  alt: string;
  /** Əsas kart şəkli */
  primary?: boolean;
  /** Hansı rəng variantına aiddir (option id) */
  colorOptionId?: string;
  width?: number;
  height?: number;
}

export interface ProductDocument {
  id: string;
  type: "TECH_SHEET" | "CERTIFICATE" | "INSTALLATION" | "WARRANTY";
  title: string;
  sizeKb: number;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  categorySlug: string;
  brandSlug: string;
  collection: string;
  shortDescription: string;
  description: string;
  basePrice: Money;
  oldPrice?: Money;
  currency: "AZN";
  rating: number;
  reviewCount: number;

  material: DoorMaterial;
  securityClass: SecurityClass;
  soundInsulationDb: number;
  thermalW: number;
  fireRating: string | null;
  warrantyYears: number;

  defaultWidth: number;
  defaultHeight: number;
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;

  style: SurfaceStyle;
  hasGlass: boolean;
  smartLockReady: boolean;
  customSizeAvailable: boolean;
  installationAvailable: boolean;
  madeToOrder: boolean;
  inStock: boolean;
  isNew: boolean;
  isBestseller: boolean;
  onSale: boolean;

  deliveryDays: [number, number];
  panelHexes: string[];
  /** İstehsalçı kataloqundan gələn fotolar; boş olduqda SVG vizual göstərilir. */
  images: ProductImage[];
  specs: ProductSpec[];
  documents: ProductDocument[];
  optionGroups: OptionGroupKey[];
}

/* ---------------------------- Configurator ----------------------------- */

export type OptionGroupKey =
  | "SIZE"
  | "OPENING_DIRECTION"
  | "PANEL_STYLE"
  | "OUTSIDE_COLOR"
  | "INSIDE_COLOR"
  | "FRAME"
  | "SIDELIGHT"
  | "GLASS"
  | "GLASS_PATTERN"
  | "HANDLE"
  | "HINGE"
  | "LOCK"
  | "CYLINDER"
  | "SMART_LOCK"
  | "THRESHOLD"
  | "INSULATION"
  | "ACCESSORY"
  | "INSTALLATION"
  | "DELIVERY";

export interface OptionValue {
  id: string;
  groupKey: OptionGroupKey;
  code: string;
  label: string;
  description?: string;
  /** Qiymətə əlavə, AZN */
  priceDelta: Money;
  hex?: string;
  swatch?: string;
  /** Uyğunluq: yalnız bu option id-lərindən biri seçilibsə mümkündür */
  requires?: string[];
  /** Bu dəyər yalnız sadalanan qruplarda seçim varsa göstərilir */
  requiresGroup?: OptionGroupKey;
  /** Bu dəyər seçilərsə qadağan olunan option id-ləri */
  excludes?: string[];
  badge?: string;
}

export interface OptionGroup {
  key: OptionGroupKey;
  title: string;
  hint: string;
  required: boolean;
  multi: boolean;
  values: OptionValue[];
}

export interface ConfigurationSelection {
  width: number;
  height: number;
  choices: Partial<Record<OptionGroupKey, string | string[]>>;
}

export interface PriceLine {
  key: string;
  label: string;
  amount: Money;
}

export interface PriceBreakdown {
  lines: PriceLine[];
  subtotal: Money;
  discount: Money;
  total: Money;
  requiresQuote: boolean;
  quoteReason?: string;
}

/* -------------------------------- Cart --------------------------------- */

export interface CartSnapshotLine {
  group: string;
  value: string;
}

export interface CartItem {
  id: string;
  productId: string;
  productSlug: string;
  productName: string;
  sku: string;
  panelHex: string;
  quantity: number;
  unitPrice: Money;
  includedServices?: number;
  /** order snapshot */
  snapshot: {
    width: number;
    height: number;
    lines: CartSnapshotLine[];
  };
}

/* ------------------------------- Orders -------------------------------- */

export type OrderStatus =
  | "DRAFT"
  | "PENDING_PAYMENT"
  | "PAID"
  | "CONFIRMED"
  | "PROCESSING"
  | "MANUFACTURING"
  | "READY"
  | "SHIPPED"
  | "DELIVERED"
  | "INSTALLATION_SCHEDULED"
  | "INSTALLED"
  | "COMPLETED"
  | "CANCELLED"
  | "REFUNDED";

export interface OrderTimelineEntry {
  status: OrderStatus;
  date: string | null;
  state: "done" | "current" | "pending";
}

export interface Order {
  id: string;
  number: string;
  createdAt: string;
  status: OrderStatus;
  total: Money;
  itemCount: number;
  customerName: string;
  city: string;
  installation: boolean;
  items: CartItem[];
  timeline: OrderTimelineEntry[];
}

/* ------------------------------- Repair -------------------------------- */

export type RepairCategoryKey =
  | "LOCK"
  | "HANDLE"
  | "HINGE"
  | "FRAME"
  | "GLASS"
  | "ALIGNMENT"
  | "SMART_LOCK"
  | "INSULATION"
  | "DOOR_NOT_CLOSING"
  | "DOOR_NOT_OPENING"
  | "NOISE"
  | "DRAFT"
  | "DAMAGED_PANEL"
  | "OTHER";

export type RepairStatus =
  | "NEW"
  | "REVIEWING"
  | "QUOTE_REQUIRED"
  | "WAITING_CUSTOMER"
  | "SCHEDULED"
  | "TECHNICIAN_ASSIGNED"
  | "ON_THE_WAY"
  | "IN_PROGRESS"
  | "WAITING_FOR_PART"
  | "COMPLETED"
  | "CANCELLED";

export interface RepairRequest {
  id: string;
  number: string;
  createdAt: string;
  category: RepairCategoryKey;
  status: RepairStatus;
  address: string;
  customerName: string;
  phone: string;
  technician?: string;
  scheduledAt?: string;
  estimatedCost?: Money;
}

/* --------------------------- Measurement ------------------------------- */

export type MeasurementStatus =
  | "NEW"
  | "CONFIRMED"
  | "TECHNICIAN_ASSIGNED"
  | "SCHEDULED"
  | "COMPLETED"
  | "CANCELLED";

export type PropertyType = "APARTMENT" | "VILLA" | "OFFICE" | "COMMERCIAL" | "OTHER";

export interface MeasurementRequest {
  id: string;
  number: string;
  createdAt: string;
  status: MeasurementStatus;
  propertyType: PropertyType;
  doorCount: number;
  address: string;
  preferredDate: string;
  technician?: string;
}

/* ------------------------------- Quote --------------------------------- */

export type QuoteStatus =
  | "NEW"
  | "REVIEWING"
  | "PRICED"
  | "SENT"
  | "ACCEPTED"
  | "REJECTED"
  | "EXPIRED"
  | "CONVERTED";

export interface Quote {
  id: string;
  number: string;
  createdAt: string;
  status: QuoteStatus;
  customerName: string;
  subject: string;
  amount?: Money;
}

/* ----------------------------- Warranty -------------------------------- */

export interface Warranty {
  id: string;
  number: string;
  productName: string;
  serialNumber: string;
  orderNumber: string;
  installationDate: string;
  startDate: string;
  endDate: string;
  /** Boşdursa `warranty.coverageDefault` göstərilir. */
  coverage?: string;
  status: "ACTIVE" | "EXPIRED" | "VOID";
}

export type DoorAssetEventType =
  | "SALE"
  | "INSTALLATION"
  | "WARRANTY"
  | "REPAIR"
  | "PART"
  | "MAINTENANCE";

export interface DoorAssetEvent {
  type: DoorAssetEventType;
  date: string;
  detail: string;
}

export interface DoorAsset {
  serialNumber: string;
  productName: string;
  model: string;
  installedAt: string;
  warrantyStatus: "ACTIVE" | "EXPIRED";
  warrantyEnd: string;
  /** Public QR-də göstərilmir */
  privateHistory: DoorAssetEvent[];
}

/* ------------------------------ Content -------------------------------- */

export interface Project {
  id: string;
  slug: string;
  title: string;
  location: string;
  doorModel: string;
  color: string;
  year: number;
  category: string;
  accent: string;
}

export interface Review {
  id: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  productName: string;
  text: string;
  verified: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  group: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readMinutes: number;
  category: string;
  accent: string;
}

export interface Technician {
  id: string;
  name: string;
  phone: string;
  specialization: string[];
  serviceAreas: string[];
  rating: number;
  completedJobs: number;
  status: "AVAILABLE" | "ON_JOB" | "OFF";
}

export interface Appointment {
  id: string;
  type: "MEASUREMENT" | "INSTALLATION" | "REPAIR" | "MAINTENANCE" | "CONSULTATION";
  date: string;
  startTime: string;
  endTime: string;
  technicianId: string;
  address: string;
  status: "SCHEDULED" | "CONFIRMED" | "DONE" | "CANCELLED";
  reference: string;
}
