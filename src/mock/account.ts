import type {
  Appointment,
  DoorAsset,
  MeasurementRequest,
  Order,
  OrderStatus,
  OrderTimelineEntry,
  Quote,
  RepairRequest,
  Warranty,
} from "@/types";

/** DEMO DATA — auth və sifariş API-ları hazır olana qədər statik. */

export const demoUser = {
  id: "usr-demo",
  name: "Tahmaz",
  surname: "Muradov",
  email: "demo@europorta.az",
  phone: "+994 50 000 00 00",
  language: "az",
  marketingConsent: true,
  memberSince: "2025-11-03",
};

const timelineOrder: { status: OrderStatus; label: string }[] = [
  { status: "CONFIRMED", label: "Sifariş yaradıldı" },
  { status: "PAID", label: "Ödəniş təsdiqləndi" },
  { status: "MANUFACTURING", label: "Hazırlanır" },
  { status: "SHIPPED", label: "Çatdırılma hazırlanır" },
  { status: "INSTALLATION_SCHEDULED", label: "Quraşdırma" },
  { status: "COMPLETED", label: "Tamamlandı" },
];

function buildTimeline(reachedIndex: number, startIso: string): OrderTimelineEntry[] {
  const start = new Date(startIso);
  return timelineOrder.map((step, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i * 6);
    return {
      status: step.status,
      label: step.label,
      date: i <= reachedIndex ? d.toISOString() : null,
      state: i < reachedIndex ? "done" : i === reachedIndex ? "current" : "pending",
    };
  });
}

export const orders: Order[] = [
  {
    id: "ord-1",
    number: "ORD-2026-000184",
    createdAt: "2026-08-02T10:15:00.000Z",
    status: "MANUFACTURING",
    total: 2340,
    itemCount: 1,
    customerName: "Tahmaz Muradov",
    city: "Bakı",
    installation: true,
    items: [
      {
        id: "oi-1",
        productId: "prd-001",
        productSlug: "milano-security-720",
        productName: "Milano Security 720",
        sku: "MIL-720",
        panelHex: "#383e42",
        quantity: 1,
        unitPrice: 2340,
        snapshot: {
          width: 960,
          height: 2050,
          lines: [
            { group: "Xarici rəng", value: "RAL 7016 Antrasit" },
            { group: "Daxili rəng", value: "Klassik ağ" },
            { group: "Dəstək", value: "Premium mat qara" },
            { group: "Kilid", value: "Çoxnöqtəli avtomatik" },
            { group: "Smart lock", value: "Smart Lock X2" },
            { group: "Quraşdırma", value: "Tam quraşdırma" },
          ],
        },
      },
    ],
    timeline: buildTimeline(2, "2026-08-02T10:15:00.000Z"),
  },
  {
    id: "ord-2",
    number: "ORD-2026-000121",
    createdAt: "2026-05-18T09:40:00.000Z",
    status: "COMPLETED",
    total: 1860,
    itemCount: 3,
    customerName: "Tahmaz Muradov",
    city: "Bakı",
    installation: true,
    items: [
      {
        id: "oi-2",
        productId: "prd-005",
        productSlug: "vienna-classic-210",
        productName: "Vienna Classic 210",
        sku: "VIE-210",
        panelHex: "#ece4d5",
        quantity: 3,
        unitPrice: 620,
        snapshot: {
          width: 800,
          height: 2050,
          lines: [
            { group: "Xarici rəng", value: "Fil sümüyü" },
            { group: "Daxili rəng", value: "Fil sümüyü" },
            { group: "Dəstək", value: "Fırçalanmış bürünc" },
            { group: "Quraşdırma", value: "Standart quraşdırma" },
          ],
        },
      },
    ],
    timeline: buildTimeline(5, "2026-05-18T09:40:00.000Z"),
  },
  {
    id: "ord-3",
    number: "ORD-2026-000067",
    createdAt: "2026-02-11T14:20:00.000Z",
    status: "CANCELLED",
    total: 980,
    itemCount: 1,
    customerName: "Tahmaz Muradov",
    city: "Bakı",
    installation: false,
    items: [
      {
        id: "oi-3",
        productId: "prd-002",
        productSlug: "milano-glass-340",
        productName: "Milano Glass 340",
        sku: "MIL-340",
        panelHex: "#c9ced1",
        quantity: 1,
        unitPrice: 980,
        snapshot: {
          width: 800,
          height: 2050,
          lines: [
            { group: "Şüşə", value: "Satin mat" },
            { group: "Dəstək", value: "Paslanmayan polad" },
          ],
        },
      },
    ],
    timeline: buildTimeline(0, "2026-02-11T14:20:00.000Z"),
  },
];

export const repairRequests: RepairRequest[] = [
  { id: "rp-1", number: "REP-2026-000128", createdAt: "2026-09-01T08:30:00.000Z", category: "SMART_LOCK", status: "TECHNICIAN_ASSIGNED", address: "Bakı, Yasamal, Şərifzadə 21", customerName: "Tahmaz Muradov", phone: "+994 50 000 00 00", technician: "Əli Məmmədov", scheduledAt: "2026-09-06T09:00:00.000Z", estimatedCost: 90 },
  { id: "rp-2", number: "REP-2026-000094", createdAt: "2026-06-22T12:10:00.000Z", category: "HINGE", status: "COMPLETED", address: "Bakı, Yasamal, Şərifzadə 21", customerName: "Tahmaz Muradov", phone: "+994 50 000 00 00", technician: "Rəşad Quliyev", scheduledAt: "2026-06-24T14:00:00.000Z", estimatedCost: 60 },
  { id: "rp-3", number: "REP-2026-000151", createdAt: "2026-09-04T17:45:00.000Z", category: "DRAFT", status: "NEW", address: "Bakı, Xətai, Babək pr. 88", customerName: "Nigar Abbasova", phone: "+994 55 111 11 11" },
];

export const measurements: MeasurementRequest[] = [
  { id: "ms-1", number: "MSR-2026-000212", createdAt: "2026-08-28T11:00:00.000Z", status: "SCHEDULED", propertyType: "APARTMENT", doorCount: 4, address: "Bakı, Yasamal, Şərifzadə 21", preferredDate: "2026-09-08", technician: "Samir Həsənov" },
  { id: "ms-2", number: "MSR-2026-000180", createdAt: "2026-04-14T15:30:00.000Z", status: "COMPLETED", propertyType: "VILLA", doorCount: 9, address: "Mərdəkan, Yeni Bağ 14", preferredDate: "2026-04-17", technician: "Samir Həsənov" },
];

export const appointments: Appointment[] = [
  { id: "ap-1", type: "REPAIR", date: "2026-09-06", startTime: "09:00", endTime: "10:30", technicianId: "tc-1", address: "Bakı, Yasamal, Şərifzadə 21", status: "CONFIRMED", reference: "REP-2026-000128" },
  { id: "ap-2", type: "MEASUREMENT", date: "2026-09-08", startTime: "14:00", endTime: "15:00", technicianId: "tc-3", address: "Bakı, Yasamal, Şərifzadə 21", status: "SCHEDULED", reference: "MSR-2026-000212" },
  { id: "ap-3", type: "INSTALLATION", date: "2026-09-19", startTime: "10:00", endTime: "14:00", technicianId: "tc-2", address: "Bakı, Yasamal, Şərifzadə 21", status: "SCHEDULED", reference: "ORD-2026-000184" },
];

export const warranties: Warranty[] = [
  { id: "wr-1", number: "WAR-2026-000091", productName: "Vienna Classic 210", serialNumber: "DR-2026-000341", orderNumber: "ORD-2026-000121", installationDate: "2026-06-04", startDate: "2026-06-04", endDate: "2031-06-04", coverage: "Konstruksiya, örtük, menteşə və kilid mexanizmi", status: "ACTIVE" },
  { id: "wr-2", number: "WAR-2025-000044", productName: "Belveder Prime 410", serialNumber: "DR-2025-000118", orderNumber: "ORD-2025-000318", installationDate: "2025-12-12", startDate: "2025-12-12", endDate: "2030-12-12", coverage: "Konstruksiya və kilid mexanizmi", status: "ACTIVE" },
];

export const quotes: Quote[] = [
  { id: "qt-1", number: "QTE-2026-000058", createdAt: "2026-08-30T09:15:00.000Z", status: "SENT", customerName: "Tahmaz Muradov", subject: "Villa Grande 1200 — 1450 × 2350 fərdi ölçü", amount: 4180 },
  { id: "qt-2", number: "QTE-2026-000061", createdAt: "2026-09-03T13:05:00.000Z", status: "REVIEWING", customerName: "Kamran Səfərov", subject: "9 otaq qapısı — toplu sifariş" },
];

/** PRD §83, §84 — QR ilə açılan qapı pasportu */
export const doorAssets: DoorAsset[] = [
  {
    serialNumber: "DR-2026-000341",
    productName: "Vienna Classic 210",
    model: "VIE-210 · Massiv palıd · Fil sümüyü",
    installedAt: "2026-06-04",
    warrantyStatus: "ACTIVE",
    warrantyEnd: "2031-06-04",
    privateHistory: [
      { type: "SALE", date: "2026-05-18", title: "Sifariş", detail: "ORD-2026-000121 · 3 ədəd" },
      { type: "INSTALLATION", date: "2026-06-04", title: "Quraşdırma", detail: "Usta: Rəşad Quliyev · 4 saat" },
      { type: "WARRANTY", date: "2026-06-04", title: "Zəmanət açıldı", detail: "WAR-2026-000091 · 5 il" },
      { type: "MAINTENANCE", date: "2026-08-20", title: "Profilaktik baxım", detail: "Menteşə yağlanması, kontur yoxlanışı" },
    ],
  },
  {
    serialNumber: "DR-2025-000118",
    productName: "Belveder Prime 410",
    model: "BEL-410 · Polad · RAL 7016",
    installedAt: "2025-12-12",
    warrantyStatus: "ACTIVE",
    warrantyEnd: "2030-12-12",
    privateHistory: [
      { type: "SALE", date: "2025-11-28", title: "Sifariş", detail: "ORD-2025-000318" },
      { type: "INSTALLATION", date: "2025-12-12", title: "Quraşdırma", detail: "Usta: Əli Məmmədov" },
      { type: "REPAIR", date: "2026-06-24", title: "Təmir", detail: "REP-2026-000094 · Menteşə tənzimləməsi" },
      { type: "PART", date: "2026-06-24", title: "Ehtiyat hissə", detail: "Yuxarı menteşə bilyəsi dəyişdirildi" },
    ],
  },
];

export function getDoorAsset(serial: string): DoorAsset | undefined {
  return doorAssets.find((d) => d.serialNumber.toLowerCase() === serial.toLowerCase());
}

export const notifications = [
  { id: "nt-1", date: "2026-09-04T09:12:00.000Z", title: "Təmir müraciətinizə usta təyin edildi", body: "REP-2026-000128 — Əli Məmmədov, 6 sentyabr 09:00.", read: false },
  { id: "nt-2", date: "2026-08-29T16:40:00.000Z", title: "Sifarişiniz istehsalata verildi", body: "ORD-2026-000184 hazırlanma mərhələsindədir.", read: false },
  { id: "nt-3", date: "2026-08-28T11:05:00.000Z", title: "Ölçü sifarişi təsdiqləndi", body: "MSR-2026-000212 — 8 sentyabr, 14:00.", read: true },
  { id: "nt-4", date: "2026-08-02T10:20:00.000Z", title: "Ödəniş qəbul edildi", body: "ORD-2026-000184 üçün 2 340 AZN ödənildi.", read: true },
];

export const addresses = [
  { id: "ad-1", label: "Ev", city: "Bakı", district: "Yasamal", street: "Şərifzadə", building: "21", apartment: "48", floor: "6", isDefault: true },
  { id: "ad-2", label: "Villa", city: "Bakı", district: "Mərdəkan", street: "Yeni Bağ", building: "14", apartment: "", floor: "", isDefault: false },
  { id: "ad-3", label: "Ofis", city: "Bakı", district: "Nəsimi", street: "Nizami", building: "203", apartment: "12", floor: "3", isDefault: false },
];

export const savedConfigurations = [
  { id: "CFG-26-A7X4K2M9", productSlug: "nordheim-thermo-900", productName: "Nordheim Thermo 900", date: "2026-08-25", total: 3120, summary: "1200 × 2100 · Antrasit ağac · Smart Lock X2" },
  { id: "CFG-26-P3D8L1QZ", productSlug: "milano-bronze-880", productName: "Milano Bronze 880", date: "2026-08-11", total: 3480, summary: "960 × 2050 · Bürünc dəstək · Triplex şüşə" },
];
