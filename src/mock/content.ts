import type { BlogPost, FaqItem, Project, Review, Technician } from "@/types";

/** TEST DATA — hər modeldən bir qeyd. CMS qoşulanda əvəzlənəcək. */

export const projects: Project[] = [
  {
    id: "pj-1",
    slug: "merdekan-villa",
    title: "Mərdəkan Villa",
    location: "Mərdəkan, Bakı",
    doorModel: "Nordheim Thermo 900",
    color: "RAL 7016",
    year: 2026,
    category: "Villa",
    accent: "#4d4237",
  },
];

export const reviews: Review[] = [
  {
    id: "rv-1",
    author: "E. M.",
    city: "Bakı",
    rating: 5,
    date: "2026-07-12",
    productName: "Milano Security 720",
    text: "Ölçü ustası vaxtında gəldi, qapı üç həftəyə hazır oldu. Səs izolyasiyası gözlədiyimdən yaxşı çıxdı — koridordan səs demək olar ki gəlmir.",
    verified: true,
  },
];

export const faq: FaqItem[] = [
  {
    id: "f-1",
    group: "Ölçü",
    question: "Qapının ölçüsü necə götürülür?",
    answer:
      "Ölçü ustası ünvana gəlir və açırımın enini, hündürlüyünü, çərçivə dərinliyini, divar qalınlığını və açılma istiqamətini qeyd edir. Sifariş verildikdə ölçü xidməti pulsuzdur.",
  },
  {
    id: "f-2",
    group: "Çatdırılma",
    question: "Çatdırılma neçə gün çəkir?",
    answer:
      "Anbarda olan modellər 3–7 iş günü ərzində çatdırılır. Sifarişlə hazırlanan modellər üçün müddət 21–35 iş günüdür.",
  },
  {
    id: "f-3",
    group: "Quraşdırma",
    question: "Quraşdırma qiymətə daxildir?",
    answer:
      "Xeyr, quraşdırma ayrıca xidmətdir və konfiquratorda seçilir. Standart quraşdırma 120 AZN, köhnə qapının sökülməsi və tullantının aparılması daxil olan tam quraşdırma 220 AZN-dir.",
  },
  {
    id: "f-4",
    group: "Zəmanət",
    question: "Zəmanət neçə ildir?",
    answer:
      "Modeldən asılı olaraq 3–10 il. Zəmanət qapının serial nömrəsinə bağlanır, servis tarixçəsi sistemdə saxlanılır və QR kod vasitəsilə yoxlanıla bilər.",
  },
  {
    id: "f-5",
    group: "Ölçü",
    question: "Fərdi ölçü mümkündürmü?",
    answer:
      "Bəli. Hər modelin icazə verilən minimum və maksimum ölçü aralığı var. Aralıqdan kənar ölçülər üçün sistem avtomatik olaraq fərdi qiymət təklifi sorğusuna yönləndirir.",
  },
  {
    id: "f-6",
    group: "Ölçü",
    question: "Qapının sağ/sol açılması necə müəyyən edilir?",
    answer:
      "Qapının qarşısında dayanın. Menteşələr sağ tərəfdədirsə — sağ açılan, sol tərəfdədirsə — sol açılan qapıdır. Konfiquratorda hər iki variant üçün vizual göstərici var.",
  },
  {
    id: "f-7",
    group: "Ödəniş",
    question: "Hansı ödəniş üsulları var?",
    answer: "Onlayn kart, çatdırılma zamanı nağd və bank köçürməsi.",
  },
  {
    id: "f-8",
    group: "Təmir",
    question: "Zəmanət müddəti bitibsə təmir edirsiniz?",
    answer:
      "Bəli. Bizdən alınmamış qapılar üçün də təmir xidməti göstəririk. Usta diaqnostikadan sonra işin dəyərini təsdiqləyir.",
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: "bp-1",
    slug: "giris-qapisi-secimi",
    title: "Giriş qapısı seçərkən nələrə diqqət etməli?",
    excerpt:
      "Təhlükəsizlik sinfi, səs izolyasiyası, termo göstərici və kilid sistemi — hansı parametr sizin üçün kritikdir?",
    date: "2026-08-14",
    readMinutes: 7,
    category: "Bələdçi",
    accent: "#3f3b36",
  },
];

export const technicians: Technician[] = [
  {
    id: "tc-1",
    name: "Usta 1",
    phone: "+994 00 000 00 00",
    specialization: ["lock", "smartLock", "alignment"],
    serviceAreas: ["Yasamal", "Nəsimi", "Nərimanov"],
    rating: 4.9,
    completedJobs: 412,
    status: "AVAILABLE",
  },
];

export const cities = [
  "Bakı",
  "Sumqayıt",
  "Gəncə",
  "Xırdalan",
  "Mingəçevir",
  "Şirvan",
  "Naxçıvan",
  "Şəki",
  "Lənkəran",
  "Quba",
];

export const bakuDistricts = [
  "Yasamal",
  "Nəsimi",
  "Nərimanov",
  "Xətai",
  "Səbail",
  "Binəqədi",
  "Sabunçu",
  "Suraxanı",
  "Nizami",
  "Qaradağ",
  "Xəzər",
  "Pirallahı",
];
