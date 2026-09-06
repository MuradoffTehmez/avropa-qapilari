import type { OptionGroup, OptionGroupKey, OptionValue } from "@/types";

/**
 * OPTION SYSTEM.
 * Variant explosion yoxdur: bir məhsul + konfiqurasiya olunan option-lar.
 * Qiymətlər təxminidir; real cədvəl gələndə yalnız `priceDelta` dəyişir.
 */

/* ------------------------------ panel stili ---------------------------- */

const panelStyles: OptionValue[] = [
  { id: "ps-modern", groupKey: "PANEL_STYLE", code: "MODERN", label: "Müasir — üfüqi frezə", description: "Ensiz üfüqi xətlər", priceDelta: 0 },
  { id: "ps-minimal", groupKey: "PANEL_STYLE", code: "MINIMAL", label: "Minimalist — hamar", description: "Şaquli tək xətt, sakit səth", priceDelta: 0 },
  { id: "ps-classic", groupKey: "PANEL_STYLE", code: "CLASSIC", label: "Klassik — qabarıq panel", description: "İki çərçivəli panel", priceDelta: 90 },
  { id: "ps-neoclassic", groupKey: "PANEL_STYLE", code: "NEOCLASSIC", label: "Neoklassik — rozetli", description: "Üç panel, mərkəzi rozet", priceDelta: 160 },
  { id: "ps-loft", groupKey: "PANEL_STYLE", code: "LOFT", label: "Loft — şəbəkə", description: "Metal şəbəkə bölgü", priceDelta: 140 },
];

/* --------------------------------- rəng -------------------------------- */

const outsideColors: OptionValue[] = [
  { id: "oc-ral9016", groupKey: "OUTSIDE_COLOR", code: "RAL 9016", label: "Trafik ağ", priceDelta: 0, hex: "#f1f0ea" },
  { id: "oc-ral9010", groupKey: "OUTSIDE_COLOR", code: "RAL 9010", label: "Saf ağ", priceDelta: 0, hex: "#efeee4" },
  { id: "oc-ral7016", groupKey: "OUTSIDE_COLOR", code: "RAL 7016", label: "Antrasit boz", priceDelta: 50, hex: "#383e42", badge: "Populyar" },
  { id: "oc-ral7039", groupKey: "OUTSIDE_COLOR", code: "RAL 7039", label: "Kvars boz", priceDelta: 45, hex: "#6b665e" },
  { id: "oc-ral7024", groupKey: "OUTSIDE_COLOR", code: "RAL 7024", label: "Qrafit boz", priceDelta: 50, hex: "#474a51" },
  { id: "oc-ral9005", groupKey: "OUTSIDE_COLOR", code: "RAL 9005", label: "Mat qara", priceDelta: 60, hex: "#0e0e10" },
  { id: "oc-ral8017", groupKey: "OUTSIDE_COLOR", code: "RAL 8017", label: "Şokolad qəhvəyi", priceDelta: 55, hex: "#45322e" },
  { id: "oc-ral6009", groupKey: "OUTSIDE_COLOR", code: "RAL 6009", label: "Küknar yaşılı", priceDelta: 65, hex: "#27352a" },
  { id: "oc-ral5011", groupKey: "OUTSIDE_COLOR", code: "RAL 5011", label: "Polad mavisi", priceDelta: 65, hex: "#1a2b3c" },
  { id: "oc-ral1015", groupKey: "OUTSIDE_COLOR", code: "RAL 1015", label: "Açıq fil sümüyü", priceDelta: 40, hex: "#e6d2b5" },
  { id: "oc-oak-gold", groupKey: "OUTSIDE_COLOR", code: "OAK_GOLD", label: "Qızılı palıd", priceDelta: 120, hex: "#a9743c", swatch: "linear-gradient(100deg,#b57f45,#8d5c2c 55%,#a9743c)" },
  { id: "oc-oak-light", groupKey: "OUTSIDE_COLOR", code: "OAK_LIGHT", label: "Açıq palıd", priceDelta: 120, hex: "#c8a678", swatch: "linear-gradient(100deg,#d3b083,#b4906a 55%,#c8a678)" },
  { id: "oc-walnut", groupKey: "OUTSIDE_COLOR", code: "WALNUT", label: "Qoz ağacı", priceDelta: 140, hex: "#5b3a26", swatch: "linear-gradient(100deg,#6b452c,#42281a 55%,#5b3a26)" },
  { id: "oc-wenge", groupKey: "OUTSIDE_COLOR", code: "WENGE", label: "Venge", priceDelta: 145, hex: "#3a2a22", swatch: "linear-gradient(100deg,#453027,#2a1d17 55%,#3a2a22)" },
  { id: "oc-anthra-wood", groupKey: "OUTSIDE_COLOR", code: "ANTHRA_WOOD", label: "Antrasit ağac", priceDelta: 160, hex: "#33312e", swatch: "linear-gradient(100deg,#3b3936,#232120 55%,#33312e)" },
  { id: "oc-concrete", groupKey: "OUTSIDE_COLOR", code: "CONCRETE", label: "Beton effekti", priceDelta: 170, hex: "#8b8d8a", swatch: "linear-gradient(120deg,#9a9c99,#7c7e7b 60%,#8b8d8a)", badge: "Yeni" },
  { id: "oc-custom-ral", groupKey: "OUTSIDE_COLOR", code: "CUSTOM", label: "Fərdi RAL", description: "İstənilən RAL kodu — sifarişlə boyanır", priceDelta: 240, hex: "#b9c2cf", badge: "Sifarişlə" },
];

const insideColors: OptionValue[] = [
  { id: "ic-white", groupKey: "INSIDE_COLOR", code: "RAL 9016", label: "Klassik ağ", priceDelta: 0, hex: "#f5f4f0" },
  { id: "ic-ivory", groupKey: "INSIDE_COLOR", code: "RAL 1013", label: "Fil sümüyü", priceDelta: 30, hex: "#ece4d5" },
  { id: "ic-grey", groupKey: "INSIDE_COLOR", code: "RAL 7038", label: "Boz mat", priceDelta: 40, hex: "#8e8b85" },
  { id: "ic-anthracite", groupKey: "INSIDE_COLOR", code: "RAL 7016", label: "Antrasit", priceDelta: 50, hex: "#383e42" },
  { id: "ic-black", groupKey: "INSIDE_COLOR", code: "RAL 9005", label: "Mat qara", priceDelta: 60, hex: "#17161a" },
  { id: "ic-oak-light", groupKey: "INSIDE_COLOR", code: "OAK_LIGHT", label: "Açıq palıd", priceDelta: 90, hex: "#c8a678", swatch: "linear-gradient(100deg,#d3b083,#b4906a 55%,#c8a678)" },
  { id: "ic-oak-gold", groupKey: "INSIDE_COLOR", code: "OAK_GOLD", label: "Qızılı palıd", priceDelta: 90, hex: "#a9743c", swatch: "linear-gradient(100deg,#b57f45,#8d5c2c 55%,#a9743c)" },
  { id: "ic-walnut", groupKey: "INSIDE_COLOR", code: "WALNUT", label: "Qoz ağacı", priceDelta: 110, hex: "#5b3a26", swatch: "linear-gradient(100deg,#6b452c,#42281a 55%,#5b3a26)" },
];

/* ------------------------------- çərçivə ------------------------------- */

const frames: OptionValue[] = [
  { id: "fr-standard", groupKey: "FRAME", code: "STD", label: "Standart çərçivə", description: "80–100 mm divar qalınlığı", priceDelta: 0 },
  { id: "fr-telescopic", groupKey: "FRAME", code: "TELE", label: "Teleskopik çərçivə", description: "100–200 mm tənzimlənən", priceDelta: 180 },
  { id: "fr-wide", groupKey: "FRAME", code: "WIDE", label: "Geniş teleskopik", description: "200–320 mm qalın divarlar üçün", priceDelta: 280 },
  { id: "fr-hidden", groupKey: "FRAME", code: "HIDDEN", label: "Gizli çərçivə", description: "Divarla eyni səviyyədə", priceDelta: 420, badge: "Premium" },
];

const sidelights: OptionValue[] = [
  { id: "sd-none", groupKey: "SIDELIGHT", code: "NONE", label: "Əlavə panel yoxdur", priceDelta: 0 },
  { id: "sd-left", groupKey: "SIDELIGHT", code: "LEFT", label: "Sol yan panel", description: "300 mm sabit panel", priceDelta: 420 },
  { id: "sd-right", groupKey: "SIDELIGHT", code: "RIGHT", label: "Sağ yan panel", description: "300 mm sabit panel", priceDelta: 420 },
  { id: "sd-both", groupKey: "SIDELIGHT", code: "BOTH", label: "İki tərəfli yan panel", priceDelta: 780 },
  { id: "sd-transom", groupKey: "SIDELIGHT", code: "TRANSOM", label: "Üst panel (transom)", description: "Qapının üstündə 400 mm", priceDelta: 340 },
];

/* --------------------------------- şüşə -------------------------------- */

const glass: OptionValue[] = [
  { id: "gl-none", groupKey: "GLASS", code: "NONE", label: "Şüşəsiz", priceDelta: 0 },
  { id: "gl-satin", groupKey: "GLASS", code: "SATIN", label: "Satin mat", description: "İşıq keçirir, görüntü keçirmir", priceDelta: 190 },
  { id: "gl-clear", groupKey: "GLASS", code: "CLEAR", label: "Şəffaf tempered", priceDelta: 210 },
  { id: "gl-bronze", groupKey: "GLASS", code: "BRONZE", label: "Bürünc tonlu", priceDelta: 260 },
  { id: "gl-triplex", groupKey: "GLASS", code: "TRIPLEX", label: "Triplex antivandal", description: "P4A sinif, laylı", priceDelta: 480, badge: "Təhlükəsiz" },
];

const glassGlazed = ["gl-satin", "gl-clear", "gl-bronze", "gl-triplex"];

const glassPatterns: OptionValue[] = [
  { id: "gp-plain", groupKey: "GLASS_PATTERN", code: "PLAIN", label: "Naxışsız", priceDelta: 0, requires: glassGlazed },
  { id: "gp-lines", groupKey: "GLASS_PATTERN", code: "LINES", label: "Üfüqi zolaq", description: "Qumlama ilə", priceDelta: 80, requires: glassGlazed },
  { id: "gp-vertical", groupKey: "GLASS_PATTERN", code: "VERTICAL", label: "Şaquli zolaq", priceDelta: 80, requires: glassGlazed },
  { id: "gp-grid", groupKey: "GLASS_PATTERN", code: "GRID", label: "Şəbəkə", description: "Kvadrat bölgü", priceDelta: 110, requires: glassGlazed },
  { id: "gp-edge", groupKey: "GLASS_PATTERN", code: "EDGE", label: "Kənar qumlama", description: "Mərkəz şəffaf qalır", priceDelta: 95, requires: ["gl-clear", "gl-bronze", "gl-triplex"] },
];

/* ------------------------------- dəstək -------------------------------- */

const handles: OptionValue[] = [
  { id: "hd-inox", groupKey: "HANDLE", code: "INOX", label: "Paslanmayan polad", description: "Standart dəstək", priceDelta: 0, hex: "#b9bcc0" },
  { id: "hd-black", groupKey: "HANDLE", code: "BLACK", label: "Premium mat qara", priceDelta: 85, hex: "#1b1b1d", badge: "Populyar" },
  { id: "hd-brass", groupKey: "HANDLE", code: "BRASS", label: "Fırçalanmış bürünc", priceDelta: 140, hex: "#ad7d38" },
  { id: "hd-bronze", groupKey: "HANDLE", code: "BRONZE", label: "Antik bürünc", priceDelta: 150, hex: "#6f5030" },
  { id: "hd-bar", groupKey: "HANDLE", code: "BAR", label: "Bar dəstək — polad", description: "Şaquli, 1200 mm", priceDelta: 260, hex: "#8d9094" },
  { id: "hd-bar-black", groupKey: "HANDLE", code: "BAR", label: "Bar dəstək — mat qara", description: "Şaquli, 1600 mm", priceDelta: 320, hex: "#1b1b1d" },
  { id: "hd-bar-brass", groupKey: "HANDLE", code: "BAR", label: "Bar dəstək — bürünc", description: "Şaquli, 1600 mm", priceDelta: 390, hex: "#ad7d38", badge: "Premium" },
];

const hinges: OptionValue[] = [
  { id: "hg-standard", groupKey: "HINGE", code: "STD", label: "Görünən menteşə", description: "3 ədəd, tənzimlənən", priceDelta: 0 },
  { id: "hg-heavy", groupKey: "HINGE", code: "HEAVY", label: "Gücləndirilmiş menteşə", description: "4 ədəd, 160 kq-a qədər", priceDelta: 130 },
  { id: "hg-hidden", groupKey: "HINGE", code: "HIDDEN", label: "Gizli menteşə", description: "Qapı bağlı olduqda görünmür", priceDelta: 220, badge: "Premium" },
];

/* -------------------------------- kilid -------------------------------- */

const locks: OptionValue[] = [
  { id: "lk-3point", groupKey: "LOCK", code: "3P", label: "3 nöqtəli kilid", priceDelta: 0 },
  { id: "lk-5point", groupKey: "LOCK", code: "5P", label: "5 nöqtəli kilid", description: "Yuxarı/aşağı riqel", priceDelta: 180 },
  { id: "lk-multipoint", groupKey: "LOCK", code: "MP", label: "Çoxnöqtəli avtomatik", description: "Qapı bağlananda avtomatik kilidlənir", priceDelta: 340, badge: "RC3+" },
  { id: "lk-motor", groupKey: "LOCK", code: "MOTOR", label: "Motorlu kilid", description: "9 nöqtə, elektromexaniki", priceDelta: 620, badge: "RC4+" },
];

const cylinders: OptionValue[] = [
  { id: "cy-standard", groupKey: "CYLINDER", code: "STD", label: "Standart silindr", description: "5 açar", priceDelta: 0 },
  { id: "cy-knob", groupKey: "CYLINDER", code: "KNOB", label: "İçəridən düyməli silindr", description: "Açarsız açılır", priceDelta: 90 },
  { id: "cy-antidrill", groupKey: "CYLINDER", code: "ANTI_DRILL", label: "Anti-drill silindr", description: "Deşilməyə və qırılmaya davamlı", priceDelta: 120 },
  { id: "cy-card", groupKey: "CYLINDER", code: "CARD", label: "Kartlı sistem silindr", description: "Açar yalnız kartla çoxaldılır", priceDelta: 210 },
];

const smartLocks: OptionValue[] = [
  { id: "sl-none", groupKey: "SMART_LOCK", code: "NONE", label: "Smart lock yoxdur", priceDelta: 0 },
  { id: "sl-x1", groupKey: "SMART_LOCK", code: "X1", label: "Smart Lock X1", description: "Barmaq izi + kod", priceDelta: 420, requires: ["lk-5point", "lk-multipoint", "lk-motor"] },
  { id: "sl-x2", groupKey: "SMART_LOCK", code: "X2", label: "Smart Lock X2", description: "Barmaq izi, kod, kart, mobil tətbiq", priceDelta: 690, requires: ["lk-multipoint", "lk-motor"], badge: "Tövsiyə" },
  { id: "sl-x3", groupKey: "SMART_LOCK", code: "X3", label: "Smart Lock X3 Pro", description: "Üz tanıma, kamera və interkom inteqrasiyası", priceDelta: 1180, requires: ["lk-motor"] },
];

/* ------------------------- astana və izolyasiya ------------------------ */

const thresholds: OptionValue[] = [
  { id: "th-standard", groupKey: "THRESHOLD", code: "STD", label: "Standart astana", priceDelta: 0 },
  { id: "th-thermal", groupKey: "THRESHOLD", code: "THERMAL", label: "Termo astana", description: "İstilik körpüsü kəsilir", priceDelta: 95 },
  { id: "th-low", groupKey: "THRESHOLD", code: "LOW", label: "Alçaq astana", description: "20 mm — əlçatanlıq üçün", priceDelta: 140 },
  { id: "th-auto", groupKey: "THRESHOLD", code: "AUTO", label: "Avtomatik astana", description: "Qapı bağlananda enir, açılanda qalxır", priceDelta: 260, badge: "Premium" },
];

const insulationPackages: OptionValue[] = [
  { id: "is-standard", groupKey: "INSULATION", code: "STD", label: "Standart izolyasiya", description: "İki kontur", priceDelta: 0 },
  { id: "is-acoustic", groupKey: "INSULATION", code: "ACOUSTIC", label: "Səs paketi", description: "Üçüncü kontur, +4 dB", priceDelta: 190 },
  { id: "is-thermal", groupKey: "INSULATION", code: "THERMAL", label: "Termo paket", description: "Gücləndirilmiş nüvə izolyasiyası", priceDelta: 240 },
  { id: "is-max", groupKey: "INSULATION", code: "MAX", label: "Səs + termo paket", priceDelta: 380, badge: "Maksimum" },
];

/* ------------------------------ aksesuar ------------------------------- */

const accessories: OptionValue[] = [
  { id: "ac-viewer", groupKey: "ACCESSORY", code: "VIEWER", label: "Rəqəmsal göz (ekranlı)", priceDelta: 180 },
  { id: "ac-viewer-optic", groupKey: "ACCESSORY", code: "VIEWER_OPTIC", label: "Optik göz 200°", priceDelta: 45 },
  { id: "ac-closer", groupKey: "ACCESSORY", code: "CLOSER", label: "Qapı bağlayıcı (doorcloser)", priceDelta: 130 },
  { id: "ac-number", groupKey: "ACCESSORY", code: "NUMBER", label: "Mənzil nömrəsi (metal)", priceDelta: 45 },
  { id: "ac-chain", groupKey: "ACCESSORY", code: "CHAIN", label: "Təhlükəsizlik zənciri", priceDelta: 35 },
  { id: "ac-letterbox", groupKey: "ACCESSORY", code: "LETTERBOX", label: "Məktub yeri", priceDelta: 120 },
  { id: "ac-kickplate", groupKey: "ACCESSORY", code: "KICKPLATE", label: "Alt qoruyucu lövhə", description: "Cızıqlara qarşı", priceDelta: 95 },
  { id: "ac-bell", groupKey: "ACCESSORY", code: "BELL", label: "Zəng düyməsi (işıqlı)", priceDelta: 60 },
  { id: "ac-camera", groupKey: "ACCESSORY", code: "CAMERA", label: "Videodomofon hazırlığı", description: "Kabel kanalı və yuva", priceDelta: 150 },
];

/* --------------------------- açılma və xidmət -------------------------- */

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
  { id: "in-premium", groupKey: "INSTALLATION", code: "PREMIUM", label: "Tam + bərpa işləri", description: "Açırımın hazırlanması və suvaq bərpası", priceDelta: 420 },
];

const delivery: OptionValue[] = [
  { id: "dl-pickup", groupKey: "DELIVERY", code: "PICKUP", label: "Anbardan özüm götürəcəyəm", priceDelta: 0 },
  { id: "dl-baku", groupKey: "DELIVERY", code: "BAKU", label: "Bakı daxili çatdırılma", priceDelta: 40 },
  { id: "dl-baku-floor", groupKey: "DELIVERY", code: "BAKU_FLOOR", label: "Bakı daxili + mərtəbəyə qaldırma", priceDelta: 75 },
  { id: "dl-region", groupKey: "DELIVERY", code: "REGION", label: "Regionlara çatdırılma", priceDelta: 95 },
];

/* ------------------------------------------------------------------ */

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
  PANEL_STYLE: {
    key: "PANEL_STYLE",
    title: "Panel naxışı",
    hint: "Səthin frezə və bölgü xətti — önizləmədə dərhal görünür.",
    required: true,
    multi: false,
    values: panelStyles,
  },
  OUTSIDE_COLOR: {
    key: "OUTSIDE_COLOR",
    title: "Xarici rəng",
    hint: "RAL kataloqu, ağac dekorları və fərdi rəng seçimi.",
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
  SIDELIGHT: {
    key: "SIDELIGHT",
    title: "Əlavə panel",
    hint: "Geniş açırımlar üçün yan və ya üst panel.",
    required: false,
    multi: false,
    values: sidelights,
  },
  GLASS: {
    key: "GLASS",
    title: "Şüşə",
    hint: "Şüşə paneli əlavə edin və ya şüşəsiz saxlayın.",
    required: false,
    multi: false,
    values: glass,
  },
  GLASS_PATTERN: {
    key: "GLASS_PATTERN",
    title: "Şüşə naxışı",
    hint: "Qumlama naxışı — yalnız şüşə seçildikdə mümkündür.",
    required: false,
    multi: false,
    values: glassPatterns,
  },
  HANDLE: {
    key: "HANDLE",
    title: "Dəstək",
    hint: "Dəstək forması, ölçüsü və finişi.",
    required: true,
    multi: false,
    values: handles,
  },
  HINGE: {
    key: "HINGE",
    title: "Menteşə",
    hint: "Görünən, gücləndirilmiş və ya gizli menteşə.",
    required: true,
    multi: false,
    values: hinges,
  },
  LOCK: {
    key: "LOCK",
    title: "Kilid",
    hint: "Kilid sistemi təhlükəsizlik sinfinə təsir edir.",
    required: true,
    multi: false,
    values: locks,
  },
  CYLINDER: {
    key: "CYLINDER",
    title: "Silindr",
    hint: "Açar sistemi və deşilməyə davamlılıq.",
    required: true,
    multi: false,
    values: cylinders,
  },
  SMART_LOCK: {
    key: "SMART_LOCK",
    title: "Smart lock",
    hint: "Elektron kilid yalnız uyğun mexaniki kilidlə birlikdə işləyir.",
    required: false,
    multi: false,
    values: smartLocks,
  },
  THRESHOLD: {
    key: "THRESHOLD",
    title: "Astana",
    hint: "İzolyasiya və əlçatanlıq üçün astana tipi.",
    required: true,
    multi: false,
    values: thresholds,
  },
  INSULATION: {
    key: "INSULATION",
    title: "İzolyasiya paketi",
    hint: "Səs və istilik göstəricilərini artırır.",
    required: true,
    multi: false,
    values: insulationPackages,
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
  { label: "800 × 2000", width: 800, height: 2000 },
  { label: "860 × 2050", width: 860, height: 2050 },
  { label: "900 × 2050", width: 900, height: 2050 },
  { label: "960 × 2050", width: 960, height: 2050 },
  { label: "1000 × 2100", width: 1000, height: 2100 },
  { label: "1100 × 2100", width: 1100, height: 2100 },
  { label: "1200 × 2100", width: 1200, height: 2100 },
];
