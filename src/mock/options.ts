import type { OptionGroup, OptionGroupKey, OptionValue } from "@/types";

/**
 * OPTION SYSTEM.
 * Variant explosion yoxdur: bir məhsul + konfiqurasiya olunan option-lar.
 */

const outsideColors: OptionValue[] = [
  { id: "oc-ral7016", groupKey: "OUTSIDE_COLOR", code: "RAL7016", label: "RAL 7016 Antrasit", priceDelta: 50, hex: "#383e42", badge: "Populyar" },
  { id: "oc-ral9005", groupKey: "OUTSIDE_COLOR", code: "RAL9005", label: "RAL 9005 Mat qara", priceDelta: 60, hex: "#0e0e10" },
  { id: "oc-ral9016", groupKey: "OUTSIDE_COLOR", code: "RAL9016", label: "RAL 9016 Trafik ağ", priceDelta: 0, hex: "#f1f0ea" },
  { id: "oc-ral7039", groupKey: "OUTSIDE_COLOR", code: "RAL7039", label: "RAL 7039 Kvars boz", priceDelta: 45, hex: "#6b665e" },
  { id: "oc-oak-gold", groupKey: "OUTSIDE_COLOR", code: "OAK_GOLD", label: "Qızılı palıd", priceDelta: 120, hex: "#a9743c", swatch: "linear-gradient(100deg,#b57f45,#8d5c2c 55%,#a9743c)" },
  { id: "oc-walnut", groupKey: "OUTSIDE_COLOR", code: "WALNUT", label: "Qoz ağacı", priceDelta: 140, hex: "#5b3a26", swatch: "linear-gradient(100deg,#6b452c,#42281a 55%,#5b3a26)" },
  { id: "oc-anthra-wood", groupKey: "OUTSIDE_COLOR", code: "ANTHRA_WOOD", label: "Antrasit ağac", priceDelta: 160, hex: "#33312e", swatch: "linear-gradient(100deg,#3b3936,#232120 55%,#33312e)" },
];

const insideColors: OptionValue[] = [
  { id: "ic-white", groupKey: "INSIDE_COLOR", code: "WHITE", label: "Klassik ağ", priceDelta: 0, hex: "#f5f4f0" },
  { id: "ic-ivory", groupKey: "INSIDE_COLOR", code: "IVORY", label: "Fil sümüyü", priceDelta: 30, hex: "#ece4d5" },
  { id: "ic-oak-light", groupKey: "INSIDE_COLOR", code: "OAK_LIGHT", label: "Açıq palıd", priceDelta: 90, hex: "#c8a678", swatch: "linear-gradient(100deg,#d3b083,#b4906a 55%,#c8a678)" },
  { id: "ic-grey", groupKey: "INSIDE_COLOR", code: "GREY", label: "Boz mat", priceDelta: 40, hex: "#8e8b85" },
  { id: "ic-black", groupKey: "INSIDE_COLOR", code: "BLACK", label: "Mat qara", priceDelta: 60, hex: "#17161a" },
];

const frames: OptionValue[] = [
  { id: "fr-standard", groupKey: "FRAME", code: "STD", label: "Standart çərçivə", description: "80–100 mm divar qalınlığı", priceDelta: 0 },
  { id: "fr-telescopic", groupKey: "FRAME", code: "TELE", label: "Teleskopik çərçivə", description: "100–200 mm tənzimlənən", priceDelta: 180 },
  { id: "fr-hidden", groupKey: "FRAME", code: "HIDDEN", label: "Gizli çərçivə", description: "Divarla eyni səviyyədə", priceDelta: 420, badge: "Premium" },
];

const glass: OptionValue[] = [
  { id: "gl-none", groupKey: "GLASS", code: "NONE", label: "Şüşəsiz", priceDelta: 0 },
  { id: "gl-satin", groupKey: "GLASS", code: "SATIN", label: "Satin mat", description: "Işıq keçirir, görüntü keçirmir", priceDelta: 190 },
  { id: "gl-clear", groupKey: "GLASS", code: "CLEAR", label: "Şəffaf tempered", priceDelta: 210 },
  { id: "gl-bronze", groupKey: "GLASS", code: "BRONZE", label: "Bürünc tonlu", priceDelta: 260 },
  { id: "gl-triplex", groupKey: "GLASS", code: "TRIPLEX", label: "Triplex antivandal", description: "P4A sinif", priceDelta: 480, badge: "Təhlükəsiz" },
];

const handles: OptionValue[] = [
  { id: "hd-inox", groupKey: "HANDLE", code: "INOX", label: "Paslanmayan polad", priceDelta: 0, hex: "#b9bcc0" },
  { id: "hd-black", groupKey: "HANDLE", code: "BLACK", label: "Premium mat qara", priceDelta: 85, hex: "#1b1b1d", badge: "Populyar" },
  { id: "hd-brass", groupKey: "HANDLE", code: "BRASS", label: "Fırçalanmış bürünc", priceDelta: 140, hex: "#ad7d38" },
  { id: "hd-bar", groupKey: "HANDLE", code: "BAR", label: "Uzun bar dəstək 1200 mm", priceDelta: 260, hex: "#8d9094" },
];

const locks: OptionValue[] = [
  { id: "lk-3point", groupKey: "LOCK", code: "3P", label: "3 nöqtəli kilid", priceDelta: 0 },
  { id: "lk-5point", groupKey: "LOCK", code: "5P", label: "5 nöqtəli kilid", description: "Yuxarı/aşağı riqel", priceDelta: 180 },
  { id: "lk-multipoint", groupKey: "LOCK", code: "MP", label: "Çoxnöqtəli avtomatik", description: "Qapı bağlananda avtomatik kilidlənir", priceDelta: 340, badge: "RC3+" },
];

const smartLocks: OptionValue[] = [
  { id: "sl-none", groupKey: "SMART_LOCK", code: "NONE", label: "Smart lock yoxdur", priceDelta: 0 },
  {
    id: "sl-x1",
    groupKey: "SMART_LOCK",
    code: "X1",
    label: "Smart Lock X1",
    description: "Barmaq izi + kod",
    priceDelta: 420,
    requires: ["lk-5point", "lk-multipoint"],
  },
  {
    id: "sl-x2",
    groupKey: "SMART_LOCK",
    code: "X2",
    label: "Smart Lock X2",
    description: "Barmaq izi, kod, kart, mobil tətbiq",
    priceDelta: 690,
    requires: ["lk-multipoint"],
    badge: "Tövsiyə",
  },
];

const accessories: OptionValue[] = [
  { id: "ac-viewer", groupKey: "ACCESSORY", code: "VIEWER", label: "Rəqəmsal göz (ekranlı)", priceDelta: 180 },
  { id: "ac-threshold", groupKey: "ACCESSORY", code: "THRESHOLD", label: "Termo astana", priceDelta: 95 },
  { id: "ac-closer", groupKey: "ACCESSORY", code: "CLOSER", label: "Qapı bağlayıcı (doorcloser)", priceDelta: 130 },
  { id: "ac-number", groupKey: "ACCESSORY", code: "NUMBER", label: "Mənzil nömrəsi (metal)", priceDelta: 45 },
  { id: "ac-chain", groupKey: "ACCESSORY", code: "CHAIN", label: "Təhlükəsizlik zənciri", priceDelta: 35 },
  { id: "ac-seal", groupKey: "ACCESSORY", code: "SEAL", label: "Əlavə səs izolyasiya konturu", priceDelta: 110 },
];

const openingDirections: OptionValue[] = [
  { id: "od-left-in", groupKey: "OPENING_DIRECTION", code: "LEFT_INWARD", label: "Sol / içəri", priceDelta: 0 },
  { id: "od-right-in", groupKey: "OPENING_DIRECTION", code: "RIGHT_INWARD", label: "Sağ / içəri", priceDelta: 0 },
  { id: "od-left-out", groupKey: "OPENING_DIRECTION", code: "LEFT_OUTWARD", label: "Sol / çölə", priceDelta: 0 },
  { id: "od-right-out", groupKey: "OPENING_DIRECTION", code: "RIGHT_OUTWARD", label: "Sağ / çölə", priceDelta: 0 },
];

const installation: OptionValue[] = [
  { id: "in-none", groupKey: "INSTALLATION", code: "NONE", label: "Quraşdırma lazım deyil", priceDelta: 0 },
  { id: "in-standard", groupKey: "INSTALLATION", code: "STD", label: "Standart quraşdırma", description: "Köhnə qapının sökülməsi daxil deyil", priceDelta: 120 },
  { id: "in-full", groupKey: "INSTALLATION", code: "FULL", label: "Tam quraşdırma", description: "Sökülmə, quraşdırma, tullantının aparılması", priceDelta: 220, badge: "Tövsiyə" },
];

const delivery: OptionValue[] = [
  { id: "dl-pickup", groupKey: "DELIVERY", code: "PICKUP", label: "Anbardan özüm götürəcəyəm", priceDelta: 0 },
  { id: "dl-baku", groupKey: "DELIVERY", code: "BAKU", label: "Bakı daxili çatdırılma", priceDelta: 40 },
  { id: "dl-region", groupKey: "DELIVERY", code: "REGION", label: "Regionlara çatdırılma", priceDelta: 95 },
];

export const optionGroups: Record<OptionGroupKey, OptionGroup> = {
  SIZE: {
    key: "SIZE",
    title: "Ölçü",
    hint: "Standart ölçü seçin və ya fərdi ölçü daxil edin.",
    required: true,
    multi: false,
    values: [],
  },
  OPENING_DIRECTION: {
    key: "OPENING_DIRECTION",
    title: "Açılma istiqaməti",
    hint: "Qapının qarşısında dayanaraq menteşələrin tərəfini seçin.",
    required: true,
    multi: false,
    values: openingDirections,
  },
  OUTSIDE_COLOR: {
    key: "OUTSIDE_COLOR",
    title: "Xarici rəng",
    hint: "Çöl tərəfin rəngi və faktura seçimi.",
    required: true,
    multi: false,
    values: outsideColors,
  },
  INSIDE_COLOR: {
    key: "INSIDE_COLOR",
    title: "Daxili rəng",
    hint: "İç tərəf ayrıca rəngdə ola bilər.",
    required: true,
    multi: false,
    values: insideColors,
  },
  FRAME: {
    key: "FRAME",
    title: "Çərçivə",
    hint: "Divar qalınlığına uyğun çərçivə tipi.",
    required: true,
    multi: false,
    values: frames,
  },
  GLASS: {
    key: "GLASS",
    title: "Şüşə",
    hint: "Şüşə paneli əlavə edin və ya şüşəsiz saxlayın.",
    required: false,
    multi: false,
    values: glass,
  },
  HANDLE: {
    key: "HANDLE",
    title: "Dəstək",
    hint: "Dəstək materialı və finiş.",
    required: true,
    multi: false,
    values: handles,
  },
  LOCK: {
    key: "LOCK",
    title: "Kilid",
    hint: "Kilid sistemi təhlükəsizlik sinfinə təsir edir.",
    required: true,
    multi: false,
    values: locks,
  },
  SMART_LOCK: {
    key: "SMART_LOCK",
    title: "Smart lock",
    hint: "Elektron kilid yalnız uyğun mexaniki kilidlə birlikdə işləyir.",
    required: false,
    multi: false,
    values: smartLocks,
  },
  ACCESSORY: {
    key: "ACCESSORY",
    title: "Aksesuarlar",
    hint: "Bir neçəsini seçə bilərsiniz.",
    required: false,
    multi: true,
    values: accessories,
  },
  INSTALLATION: {
    key: "INSTALLATION",
    title: "Quraşdırma",
    hint: "Sertifikatlı usta xidməti.",
    required: true,
    multi: false,
    values: installation,
  },
  DELIVERY: {
    key: "DELIVERY",
    title: "Çatdırılma",
    hint: "Çatdırılma üsulu.",
    required: true,
    multi: false,
    values: delivery,
  },
};

export const allOptionValues: OptionValue[] = Object.values(optionGroups).flatMap(
  (g) => g.values,
);

export function findOptionValue(id: string): OptionValue | undefined {
  return allOptionValues.find((v) => v.id === id);
}

/** Standart ölçü presetləri (mm) */
export const standardSizes: { label: string; width: number; height: number }[] = [
  { label: "860 × 2050", width: 860, height: 2050 },
  { label: "900 × 2050", width: 900, height: 2050 },
  { label: "960 × 2050", width: 960, height: 2050 },
  { label: "1000 × 2100", width: 1000, height: 2100 },
  { label: "1200 × 2100", width: 1200, height: 2100 },
];
