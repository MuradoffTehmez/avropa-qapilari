/**
 * PRD icra vəziyyəti.
 *
 * Hər fəsil üç dəyərdən birini alır:
 *   done    — tələb kodda tam qarşılanır
 *   partial — bir hissəsi var (təfərrüat `note` sahəsindədir)
 *   todo    — hələ yazılmayıb
 *   spec    — icra tələb etməyən sənəd fəsli (məqsəd, vizyon, faza planı)
 *
 * `npm run prd:status` cədvəli `docs/PRD-STATUS.md` faylına yazır.
 */
import { readFileSync, writeFileSync } from "node:fs";

type State = "done" | "partial" | "todo" | "spec";

const status: Record<number, [State, string?]> = {
  1: ["spec"],
  2: ["spec"],
  3: ["spec"],
  4: ["partial", "CUSTOMER / TECHNICIAN / ADMIN var; Redaktor və Super Admin rolları yoxdur"],
  5: ["todo"],
  6: ["todo"],
  7: ["done"],
  8: ["partial", "SQLite lokal işləyir (D1 ilə eyni motor); D1-ə deployment yoxdur"],
  9: ["done"],
  10: ["todo"],
  11: ["partial", "Prisma tranzaksiyaları işlənir; D1-ə xas strategiya yoxdur"],
  12: ["todo"],
  13: ["todo"],
  14: ["todo"],
  15: ["todo"],
  16: ["todo"],
  17: ["todo"],
  18: ["todo"],
  19: ["todo"],
  20: ["todo"],
  21: ["todo"],
  22: ["todo"],
  23: ["done"],
  24: ["done"],
  25: ["done"],
  26: ["done"],
  27: ["done"],
  28: ["done"],
  29: ["done"],
  30: ["done"],
  31: ["done"],
  32: ["done"],
  33: ["done"],
  34: ["done"],
  35: ["done"],
  36: ["done"],
  37: ["done"],
  38: ["done"],
  39: ["done"],
  40: ["done"],
  41: ["done"],
  42: ["done"],
  43: ["done"],
  44: ["done"],
  45: ["done"],
  46: ["done"],
  47: ["done"],
  48: ["done"],
  49: ["done"],
  50: ["done"],
  51: ["done"],
  52: ["done"],
  53: ["done"],
  54: ["done"],
  55: ["done"],
  56: ["done"],
  57: ["done"],
  58: ["done"],
  59: ["partial", "Səbət brauzerdə saxlanılır; server tərəfli Cart cədvəli yoxdur"],
  60: ["done"],
  61: ["partial", "Provayder abstraksiyası və Payment cədvəli var; real provayder qoşulmayıb"],
  62: ["done"],
  63: ["done"],
  64: ["done"],
  65: ["done"],
  66: ["done"],
  67: ["done"],
  68: ["done"],
  69: ["done"],
  70: ["done"],
  71: ["done"],
  72: ["todo", "Foto/video yükləmə R2 tələb edir"],
  73: ["done"],
  74: ["done"],
  75: ["done"],
  76: ["done"],
  77: ["done"],
  78: ["partial", "Appointment modeli və siyahılar var; planlaşdırma interfeysi yoxdur"],
  79: ["todo", "Vaxt toqquşmasının yoxlanışı yoxdur"],
  80: ["partial", "Quraşdırma sifariş seçimidir; ayrıca iş axını yoxdur"],
  81: ["done"],
  82: ["partial", "Serial nömrə saxlanılır; avtomatik generasiya yoxdur"],
  83: ["done"],
  84: ["partial", "Qapı pasportu hələ mock DoorAsset-dən oxuyur"],
  85: ["done"],
  86: ["done"],
  87: ["done"],
  88: ["done"],
  89: ["done"],
  90: ["done"],
  91: ["done"],
  92: ["done"],
  93: ["done"],
  94: ["partial", "Matris üç mövcud rolu göstərir; Super Admin və Redaktor yoxdur"],
  95: ["partial", "Siyahı bazadandır; məhsul yaratma və redaktə API-si yoxdur"],
  96: ["partial", "Option dəyərləri bazadan oxunur; redaktə yoxdur"],
  97: ["done"],
  98: ["todo"],
  99: ["todo"],
  100: ["todo"],
  101: ["todo"],
  102: ["todo"],
  103: ["done"],
  104: ["partial", "Layihələr statik məzmundur; admin CRUD yoxdur"],
  105: ["partial", "Bloq statik məzmundur; admin CRUD yoxdur"],
  106: ["partial", "ContentPage cədvəli və CRUD var; səhifə mətni hələ statikdir"],
  107: ["done"],
  108: ["done"],
  109: ["done"],
  110: ["done"],
  111: ["done"],
  112: ["done"],
  113: ["done"],
  114: ["done"],
  115: ["done"],
  116: ["done"],
  117: ["done"],
  118: ["done"],
  119: ["done"],
  120: ["todo", "PRD özü bunu üçüncü fazaya saxlayır"],
  121: ["todo"],
  122: ["todo"],
  123: ["partial", "Bildiriş seçimləri interfeysdədir; göndəriş yoxdur"],
  124: ["todo"],
  125: ["todo"],
  126: ["todo", "Səhifə baxışı hadisələri toplanmır"],
  127: ["partial", "KPI-lar bazadan hesablanır; hadisə əsaslı metriklər yoxdur"],
  128: ["done"],
  129: ["done"],
  130: ["done"],
  131: ["todo"],
  132: ["done"],
  133: ["done"],
  134: ["done"],
  135: ["partial", "Sifariş, müraciət, endirim, məzmun, SEO, rəy və rol API-ləri var; məhsul CRUD yoxdur"],
  136: ["done"],
  137: ["done"],
  138: ["partial", "Əsas modellər var; kataloq tərcümə və media cədvəlləri yoxdur"],
  139: ["done"],
  140: ["partial", "Product cədvəli var; tərcümə, media və spesifikasiya sahələri mock-dadır"],
  141: ["todo"],
  142: ["done"],
  143: ["todo"],
  144: ["todo"],
  145: ["partial", "OptionValue cədvəli var; OptionGroup ayrıca cədvəl deyil"],
  146: ["done"],
  147: ["todo"],
  148: ["done"],
  149: ["partial", "Seçimlər JSON sahədə saxlanılır, ayrıca cədvəl yoxdur"],
  150: ["todo"],
  151: ["done"],
  152: ["done"],
  153: ["done"],
  154: ["done"],
  155: ["done"],
  156: ["todo"],
  157: ["todo"],
  158: ["todo"],
  159: ["done"],
  160: ["todo", "Soft delete yoxdur — silmə fiziki aparılır"],
  161: ["done"],
  162: ["partial", "Mühit dəyişənləri işlənir; mərhələli mühit strategiyası yoxdur"],
  163: ["partial", "Sirlər mühit faylındadır; secret manager yoxdur"],
  164: ["todo"],
  165: ["partial", "typecheck, lint və build var; CI-də məcburi deyil"],
  166: ["todo", "Test dəsti yoxdur"],
  167: ["todo"],
  168: ["partial", "Xəta jurnalı var; strukturlu logging yoxdur"],
  169: ["todo"],
  170: ["done"],
  171: ["todo"],
  172: ["done"],
  173: ["done"],
  174: ["spec"],
  175: ["spec"],
  176: ["spec"],
  177: ["spec"],
  178: ["done"],
  179: ["done"],
  180: ["done"],
  181: ["partial", "Göstəricilər hesablanır; hədəflərlə müqayisə yoxdur"],
  182: ["done"],
  183: ["done"],
  184: ["done"],
  185: ["partial", "Media yükləmə şərti qarşılanmır"],
  186: ["partial", "Məhsul CRUD şərti qarşılanmır"],
  187: ["done"],
  188: ["partial", "Struktur uyğundur; monorepo bölgüsü yoxdur"],
  189: ["todo"],
  190: ["partial", "Tətbiq modeli uyğundur; Cloudflare xidmətləri qoşulmayıb"],
  191: ["spec"],
  192: ["spec"],
};

const GROUPS: { name: string; from: number; to: number }[] = [
  { name: "Konsepsiya və rollar", from: 1, to: 4 },
  { name: "Cloudflare infrastrukturu", from: 5, to: 22 },
  { name: "Sayt və kataloq", from: 23, to: 46 },
  { name: "Konfiqurator və qiymət", from: 47, to: 57 },
  { name: "Səbət, sifariş, ödəniş", from: 58, to: 68 },
  { name: "Servis, usta, zəmanət", from: 69, to: 84 },
  { name: "Hesab və autentifikasiya", from: 85, to: 89 },
  { name: "Admin panel", from: 90, to: 106 },
  { name: "SEO, performans, əlçatanlıq", from: 107, to: 120 },
  { name: "Bildiriş və analitika", from: 121, to: 128 },
  { name: "Təhlükəsizlik və API", from: 129, to: 137 },
  { name: "Data modeli", from: 138, to: 161 },
  { name: "Əməliyyat və keyfiyyət", from: 162, to: 173 },
  { name: "Axınlar və qəbul şərtləri", from: 174, to: 186 },
  { name: "Arxitektura yekunu", from: 187, to: 192 },
];

const titles = new Map<number, string>();
for (const line of readFileSync("docs/PRD.md", "utf8").split("\n")) {
  const match = /^# (\d+)\.\s*(.+?)\s*$/.exec(line);
  if (match) titles.set(Number(match[1]), match[2]);
}

const LABEL: Record<State, string> = {
  done: "hazır",
  partial: "qismən",
  todo: "yoxdur",
  spec: "sənəd",
};

function score(from: number, to: number) {
  let done = 0;
  let partial = 0;
  let todo = 0;

  for (let i = from; i <= to; i += 1) {
    const state = status[i]?.[0];
    if (state === "done") done += 1;
    else if (state === "partial") partial += 1;
    else if (state === "todo") todo += 1;
  }

  const total = done + partial + todo;
  return { done, partial, todo, total, pct: total ? ((done + partial * 0.5) / total) * 100 : 0 };
}

const lines: string[] = [
  "# PRD icra vəziyyəti",
  "",
  "Bu fayl `npm run prd:status` ilə yaradılır. Qiymətləndirmə",
  "`scripts/prd-status.ts` faylındadır — kod dəyişəndə orada yenilənir.",
  "",
  "Faiz belə hesablanır: hazır = 1, qismən = 0.5, yoxdur = 0.",
  "Sənəd fəsilləri (məqsəd, vizyon, faza planı) hesaba daxil edilmir.",
  "",
  "## Yekun",
  "",
  "| Sahə | Hazır | Qismən | Yoxdur | Tamamlanma |",
  "|---|---:|---:|---:|---:|",
];

for (const group of GROUPS) {
  const s = score(group.from, group.to);
  if (s.total === 0) continue;
  lines.push(
    `| ${group.name} (§${group.from}–§${group.to}) | ${s.done} | ${s.partial} | ${s.todo} | **${s.pct.toFixed(0)}%** |`,
  );
}

const overall = score(1, 192);
lines.push(
  `| **Cəmi** | **${overall.done}** | **${overall.partial}** | **${overall.todo}** | **${overall.pct.toFixed(0)}%** |`,
  "",
  "## Fəsillər",
  "",
  "| № | Fəsil | Vəziyyət | Qeyd |",
  "|---:|---|---|---|",
);

for (let i = 1; i <= 192; i += 1) {
  const [state, note] = status[i] ?? ["todo"];
  lines.push(`| ${i} | ${titles.get(i) ?? ""} | ${LABEL[state]} | ${note ?? ""} |`);
}

writeFileSync("docs/PRD-STATUS.md", `${lines.join("\n")}\n`, "utf8");

console.log(
  `hazır=${overall.done} qismən=${overall.partial} yoxdur=${overall.todo} → ${overall.pct.toFixed(1)}%`,
);

for (const group of GROUPS) {
  const s = score(group.from, group.to);
  if (s.total === 0) continue;
  console.log(`${group.name.padEnd(30)} ${s.pct.toFixed(0).padStart(3)}%  (${s.done}/${s.partial}/${s.todo})`);
}
