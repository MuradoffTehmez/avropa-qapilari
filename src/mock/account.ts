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

/**
 * TEST DATA — hər modeldən bir qeyd.
 * Backend qoşulanda bu fayl repository qatı ilə əvəzlənəcək.
 */

export const accountUser = {
  id: "usr-001",
  name: "Test",
  surname: "İstifadəçi",
  email: "test@europorta.az",
  phone: "+994 00 000 00 00",
  language: "az",
  marketingConsent: true,
  memberSince: "2026-01-15",
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
    number: "ORD-2026-000101",
    createdAt: "2026-08-02T10:15:00.000Z",
    status: "MANUFACTURING",
    total: 2340,
    itemCount: 1,
    customerName: "Test İstifadəçi",
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
];

export const repairRequests: RepairRequest[] = [
  {
    id: "rp-1",
    number: "REP-2026-000101",
    createdAt: "2026-09-01T08:30:00.000Z",
    category: "SMART_LOCK",
    status: "TECHNICIAN_ASSIGNED",
    address: "Bakı, Yasamal",
    customerName: "Test İstifadəçi",
    phone: "+994 00 000 00 00",
    technician: "Usta 1",
    scheduledAt: "2026-09-08T09:00:00.000Z",
    estimatedCost: 90,
  },
];

export const measurements: MeasurementRequest[] = [
  {
    id: "ms-1",
    number: "MSR-2026-000101",
    createdAt: "2026-08-28T11:00:00.000Z",
    status: "SCHEDULED",
    propertyType: "APARTMENT",
    doorCount: 4,
    address: "Bakı, Yasamal",
    preferredDate: "2026-09-10",
    technician: "Usta 2",
  },
];

export const appointments: Appointment[] = [
  {
    id: "ap-1",
    type: "MEASUREMENT",
    date: "2026-09-10",
    startTime: "14:00",
    endTime: "15:00",
    technicianId: "tc-1",
    address: "Bakı, Yasamal",
    status: "SCHEDULED",
    reference: "MSR-2026-000101",
  },
];

export const warranties: Warranty[] = [
  {
    id: "wr-1",
    number: "WAR-2026-000101",
    productName: "Milano Security 720",
    serialNumber: "DR-2026-000101",
    orderNumber: "ORD-2026-000101",
    installationDate: "2026-06-04",
    startDate: "2026-06-04",
    endDate: "2033-06-04",
    coverage: "Konstruksiya, örtük, menteşə və kilid mexanizmi",
    status: "ACTIVE",
  },
];

export const quotes: Quote[] = [
  {
    id: "qt-1",
    number: "QTE-2026-000101",
    createdAt: "2026-08-30T09:15:00.000Z",
    status: "SENT",
    customerName: "Test İstifadəçi",
    subject: "Villa Grande 1200 — 1450 × 2350 fərdi ölçü",
    amount: 4180,
  },
];

/** QR ilə açılan qapı pasportu */
export const doorAssets: DoorAsset[] = [
  {
    serialNumber: "DR-2026-000101",
    productName: "Milano Security 720",
    model: "MIL-720 · Polad · RAL 7016 Antrasit",
    installedAt: "2026-06-04",
    warrantyStatus: "ACTIVE",
    warrantyEnd: "2033-06-04",
    privateHistory: [
      { type: "SALE", date: "2026-05-18", title: "Sifariş", detail: "ORD-2026-000101" },
      { type: "INSTALLATION", date: "2026-06-04", title: "Quraşdırma", detail: "Usta 1 · 4 saat" },
      { type: "WARRANTY", date: "2026-06-04", title: "Zəmanət açıldı", detail: "WAR-2026-000101 · 7 il" },
      { type: "MAINTENANCE", date: "2026-08-20", title: "Profilaktik baxım", detail: "Menteşə yağlanması, kontur yoxlanışı" },
    ],
  },
];

export function getDoorAsset(serial: string): DoorAsset | undefined {
  return doorAssets.find((d) => d.serialNumber.toLowerCase() === serial.toLowerCase());
}

export const notifications = [
  {
    id: "nt-1",
    date: "2026-09-04T09:12:00.000Z",
    title: "Təmir müraciətinizə usta təyin edildi",
    body: "REP-2026-000101 — 8 sentyabr, 09:00.",
    read: false,
  },
];

export const addresses = [
  {
    id: "ad-1",
    label: "Ev",
    city: "Bakı",
    district: "Yasamal",
    street: "",
    building: "",
    apartment: "",
    floor: "",
    isDefault: true,
  },
];

export const savedConfigurations = [
  {
    id: "CFG-26-000101",
    productSlug: "nordheim-thermo-900",
    productName: "Nordheim Thermo 900",
    date: "2026-08-25",
    total: 3120,
    summary: "1200 × 2100 · Antrasit ağac · Smart Lock X2",
  },
];
