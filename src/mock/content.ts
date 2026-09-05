import type { BlogPost, FaqItem, Project, Review, Technician } from "@/types";

/** DEMO DATA — CMS (PRD §106) hazır olana qədər statik. */

export const projects: Project[] = [
  { id: "pj-1", slug: "merdekan-villa", title: "Mərdəkan Villa", location: "Mərdəkan, Bakı", doorModel: "Villa Grande 1200", color: "RAL 7016", year: 2025, category: "Villa", accent: "#4d4237" },
  { id: "pj-2", slug: "port-baku-residence", title: "Port Baku Residence", location: "Nəsimi, Bakı", doorModel: "Milano Security 720", color: "Antrasit ağac", year: 2025, category: "Mənzil", accent: "#3f3b36" },
  { id: "pj-3", slug: "sea-breeze", title: "Sea Breeze Resort", location: "Nardaran, Bakı", doorModel: "Nordheim Thermo 900", color: "Qoz ağacı", year: 2024, category: "Kompleks", accent: "#5b3a26" },
  { id: "pj-4", slug: "white-city-office", title: "White City Ofis", location: "Xətai, Bakı", doorModel: "Lumia Loft 150", color: "Mat qara", year: 2025, category: "Ofis", accent: "#2f2e2b" },
  { id: "pj-5", slug: "gebele-cottage", title: "Qəbələ Kotteci", location: "Qəbələ", doorModel: "Villa Terra 1000", color: "RAL 7039", year: 2024, category: "Villa", accent: "#6b6156" },
  { id: "pj-6", slug: "ganclik-mall-tech", title: "Gənclik Texniki Bloklar", location: "Nərimanov, Bakı", doorModel: "Metal Tech 60 Fire", color: "Boz", year: 2024, category: "Kommersiya", accent: "#4a4844" },
];

export const reviews: Review[] = [
  { id: "rv-1", author: "Elvin M.", city: "Bakı", rating: 5, date: "2026-07-12", productName: "Milano Security 720", text: "Ölçü ustası vaxtında gəldi, qapı 3 həftəyə hazır oldu. Səs izolyasiyası gözlədiyimdən yaxşı çıxdı — koridordan səs demək olar ki gəlmir.", verified: true },
  { id: "rv-2", author: "Nigar A.", city: "Sumqayıt", rating: 5, date: "2026-06-28", productName: "Vienna Classic 210", text: "Otaq qapılarını konfiquratorda özüm yığdım, rəngi interyerə tam uyğun gəldi. Quraşdırma 4 saat çəkdi, arxalarınca təmizlik də etdilər.", verified: true },
  { id: "rv-3", author: "Rəşad H.", city: "Bakı", rating: 4, date: "2026-06-09", productName: "Belveder Prime 410", text: "Qiymətinə görə çox yaxşı qapıdır. Çatdırılma bir gün gecikdi, amma operator əvvəlcədən xəbər verdi.", verified: true },
  { id: "rv-4", author: "Aysel Q.", city: "Bakı", rating: 5, date: "2026-05-21", productName: "Smart Guard S1", text: "Barmaq izi ilə açılan qapı uşaqlar üçün çox rahat oldu. Tətbiqdən kimin nə vaxt girdiyini görürəm.", verified: true },
  { id: "rv-5", author: "Kamran S.", city: "Gəncə", rating: 5, date: "2026-05-03", productName: "Nordheim Thermo 900", text: "Villa üçün aldıq. Qışda dəhlizdə temperatur fərqi hiss olunur — termo göstərici işləyir.", verified: true },
  { id: "rv-6", author: "Leyla İ.", city: "Bakı", rating: 4, date: "2026-04-17", productName: "Lumia Loft 150", text: "Şüşəli qapı otağı işıqlandırdı. Yeganə qeyd: barmaq izləri şüşədə tez görünür.", verified: true },
];

export const faq: FaqItem[] = [
  { id: "f-1", group: "Ölçü", question: "Qapının ölçüsü necə götürülür?", answer: "Ölçü ustası ünvana gəlir və açırımın enini, hündürlüyünü, çərçivə dərinliyini, divar qalınlığını və açılma istiqamətini qeyd edir. Ölçü xidməti sifariş verildikdə pulsuzdur." },
  { id: "f-2", group: "Çatdırılma", question: "Çatdırılma neçə gün çəkir?", answer: "Anbarda olan modellər 3–7 iş günü ərzində çatdırılır. Sifarişlə hazırlanan (made-to-order) modellər üçün müddət 21–35 iş günüdür." },
  { id: "f-3", group: "Quraşdırma", question: "Quraşdırma qiymətə daxildir?", answer: "Xeyr, quraşdırma ayrıca xidmətdir və konfiquratorda seçilir. Standart quraşdırma 120 AZN, köhnə qapının sökülməsi və tullantının aparılması daxil olan tam quraşdırma 220 AZN-dir." },
  { id: "f-4", group: "Zəmanət", question: "Zəmanət neçə ildir?", answer: "Modeldən asılı olaraq 3–10 il. Zəmanət qapının serial nömrəsinə bağlanır, servis tarixçəsi sistemdə saxlanılır və QR kod vasitəsilə yoxlanıla bilər." },
  { id: "f-5", group: "Ölçü", question: "Custom ölçü mümkündürmü?", answer: "Bəli. Hər modelin icazə verilən minimum və maksimum ölçü aralığı var. Aralıqdan kənar ölçülər üçün sistem avtomatik olaraq fərdi qiymət təklifi sorğusuna yönləndirir." },
  { id: "f-6", group: "Ölçü", question: "Qapının sağ/sol açılması necə müəyyən edilir?", answer: "Qapının qarşısında dayanın. Menteşələr sağ tərəfdədirsə — sağ açılan, sol tərəfdədirsə — sol açılan qapıdır. Konfiquratorda hər iki variant üçün vizual göstərici var." },
  { id: "f-7", group: "Ödəniş", question: "Hansı ödəniş üsulları var?", answer: "Onlayn kart, çatdırılma zamanı nağd və bank köçürməsi. Ödəniş provayderi inteqrasiyası backend mərhələsində aktivləşəcək." },
  { id: "f-8", group: "Təmir", question: "Zəmanət müddəti bitibsə təmir edirsiniz?", answer: "Bəli. Bizdən alınmamış qapılar üçün də təmir xidməti göstəririk. Usta diaqnostikadan sonra işin dəyərini təsdiqləyir." },
];

export const blogPosts: BlogPost[] = [
  { id: "bp-1", slug: "giris-qapisi-secimi", title: "Giriş qapısı seçərkən nələrə diqqət etməli?", excerpt: "Təhlükəsizlik sinfi, səs izolyasiyası, termo göstərici və kilid sistemi — hansı parametr sizin üçün kritikdir?", date: "2026-08-14", readMinutes: 7, category: "Bələdçi", accent: "#3f3b36" },
  { id: "bp-2", slug: "rc-tehlukesizlik-sinifleri", title: "RC2, RC3, RC4: təhlükəsizlik sinifləri nə deməkdir?", excerpt: "Avropa standartı EN 1627 üzrə müqavimət siniflərinin praktik izahı.", date: "2026-07-30", readMinutes: 5, category: "Texniki", accent: "#2f2e2b" },
  { id: "bp-3", slug: "smart-lock-secimi", title: "Smart lock seçimi: barmaq izi, kod, yoxsa kart?", excerpt: "Elektron kilidlərin üstünlükləri, məhdudiyyətləri və mexaniki kilidlə birgə işləmə prinsipi.", date: "2026-07-08", readMinutes: 6, category: "Smart", accent: "#35403f" },
  { id: "bp-4", slug: "qapi-baximi", title: "Qapıya illik baxım: 6 sadə addım", excerpt: "Menteşənin yağlanması, kontur izolyasiyanın yoxlanması və kilid tənzimləməsi.", date: "2026-06-19", readMinutes: 4, category: "Baxım", accent: "#6b6156" },
  { id: "bp-5", slug: "ses-izolyasiyasi", title: "42 dB nə deməkdir? Səs izolyasiyası haqqında", excerpt: "Desibel göstəricisinin real həyatda nə ifadə etdiyini izah edirik.", date: "2026-05-27", readMinutes: 5, category: "Texniki", accent: "#4a4844" },
  { id: "bp-6", slug: "interyer-qapi-rengleri", title: "2026 interyer qapı rəngləri trendi", excerpt: "Mat qara, isti palıd və gizli qapı sistemləri — ilin əsas istiqamətləri.", date: "2026-05-06", readMinutes: 4, category: "Dizayn", accent: "#8b877f" },
];

export const technicians: Technician[] = [
  { id: "tc-1", name: "Əli Məmmədov", phone: "+994 50 111 22 33", specialization: ["Kilid", "Smart lock", "Tənzimləmə"], serviceAreas: ["Yasamal", "Nəsimi", "Nərimanov"], rating: 4.9, completedJobs: 412, status: "ON_JOB" },
  { id: "tc-2", name: "Rəşad Quliyev", phone: "+994 55 222 33 44", specialization: ["Quraşdırma", "Çərçivə", "Menteşə"], serviceAreas: ["Xətai", "Sabunçu", "Suraxanı"], rating: 4.8, completedJobs: 356, status: "AVAILABLE" },
  { id: "tc-3", name: "Samir Həsənov", phone: "+994 70 333 44 55", specialization: ["Ölçü", "Quraşdırma"], serviceAreas: ["Binəqədi", "Xırdalan", "Sumqayıt"], rating: 4.7, completedJobs: 289, status: "AVAILABLE" },
  { id: "tc-4", name: "Tural Əliyev", phone: "+994 51 444 55 66", specialization: ["Şüşə", "Alüminium", "Sürüşən sistem"], serviceAreas: ["Səbail", "Nəsimi"], rating: 4.9, completedJobs: 197, status: "OFF" },
];

export const cities = [
  "Bakı", "Sumqayıt", "Gəncə", "Xırdalan", "Mingəçevir", "Şirvan", "Naxçıvan", "Şəki", "Lənkəran", "Quba",
];

export const bakuDistricts = [
  "Yasamal", "Nəsimi", "Nərimanov", "Xətai", "Səbail", "Binəqədi", "Sabunçu", "Suraxanı", "Nizami", "Qaradağ", "Xəzər", "Pirallahı",
];
