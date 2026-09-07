import type { CartSnapshotLine, Locale, OptionGroupKey, OptionValue } from "@/types";
import type { Dictionary } from "@/i18n";

/**
 * Option dəyərlərinin EN/RU tərcümələri.
 *
 * `src/mock/options.ts` AZ mətnləri saxlayır — bu fayl yalnız tərcümə
 * qatıdır. Backend qoşulduqda hər ikisi `OptionValueTranslation`
 * cədvəli ilə əvəz olunacaq (PRD §141), ona görə ayrı saxlanılır.
 */
export interface OptionText {
  label: string;
  description?: string;
  badge?: string;
}

type Texts = Record<string, OptionText>;

const en: Texts = {
  /* panel stili */
  "ps-modern": { label: "Modern — horizontal grooves", description: "Narrow horizontal lines" },
  "ps-minimal": { label: "Minimalist — flush", description: "One vertical line, calm surface" },
  "ps-classic": { label: "Classic — raised panel", description: "Two framed panels" },
  "ps-neoclassic": { label: "Neoclassical — with rosette", description: "Three panels, central rosette" },
  "ps-loft": { label: "Loft — grid", description: "Metal grid division" },

  /* xarici rəng */
  "oc-ral9016": { label: "Traffic white" },
  "oc-ral9010": { label: "Pure white" },
  "oc-ral7016": { label: "Anthracite grey", badge: "Popular" },
  "oc-ral7039": { label: "Quartz grey" },
  "oc-ral7024": { label: "Graphite grey" },
  "oc-ral9005": { label: "Matt black" },
  "oc-ral8017": { label: "Chocolate brown" },
  "oc-ral6009": { label: "Fir green" },
  "oc-ral5011": { label: "Steel blue" },
  "oc-ral1015": { label: "Light ivory" },
  "oc-oak-gold": { label: "Golden oak" },
  "oc-oak-light": { label: "Light oak" },
  "oc-walnut": { label: "Walnut" },
  "oc-wenge": { label: "Wenge" },
  "oc-anthra-wood": { label: "Anthracite wood" },
  "oc-concrete": { label: "Concrete effect", badge: "New" },
  "oc-custom-ral": {
    label: "Custom RAL",
    description: "Any RAL code — painted to order",
    badge: "To order",
  },

  /* daxili rəng */
  "ic-white": { label: "Classic white" },
  "ic-ivory": { label: "Ivory" },
  "ic-grey": { label: "Matt grey" },
  "ic-anthracite": { label: "Anthracite" },
  "ic-black": { label: "Matt black" },
  "ic-oak-light": { label: "Light oak" },
  "ic-oak-gold": { label: "Golden oak" },
  "ic-walnut": { label: "Walnut" },

  /* çərçivə */
  "fr-standard": { label: "Standard frame", description: "80–100 mm wall thickness" },
  "fr-telescopic": { label: "Telescopic frame", description: "100–200 mm adjustable" },
  "fr-wide": { label: "Wide telescopic", description: "For 200–320 mm thick walls" },
  "fr-hidden": { label: "Concealed frame", description: "Flush with the wall", badge: "Premium" },

  /* əlavə panel */
  "sd-none": { label: "No side panel" },
  "sd-left": { label: "Left side panel", description: "300 mm fixed panel" },
  "sd-right": { label: "Right side panel", description: "300 mm fixed panel" },
  "sd-both": { label: "Side panels on both sides" },
  "sd-transom": { label: "Transom panel", description: "400 mm above the door" },

  /* şüşə */
  "gl-none": { label: "No glazing" },
  "gl-satin": { label: "Satin frosted", description: "Lets light through, not the view" },
  "gl-clear": { label: "Clear tempered" },
  "gl-bronze": { label: "Bronze tinted" },
  "gl-triplex": { label: "Anti-vandal triplex", description: "Class P4A, laminated", badge: "Safe" },

  /* şüşə naxışı */
  "gp-plain": { label: "No pattern" },
  "gp-lines": { label: "Horizontal bands", description: "Sandblasted" },
  "gp-vertical": { label: "Vertical bands" },
  "gp-grid": { label: "Grid", description: "Square division" },
  "gp-edge": { label: "Sandblasted border", description: "Centre stays clear" },

  /* dəstək */
  "hd-inox": { label: "Stainless steel", description: "Standard handle" },
  "hd-black": { label: "Premium matt black", badge: "Popular" },
  "hd-brass": { label: "Brushed brass" },
  "hd-bronze": { label: "Antique bronze" },
  "hd-bar": { label: "Bar handle — steel", description: "Vertical, 1200 mm" },
  "hd-bar-black": { label: "Bar handle — matt black", description: "Vertical, 1600 mm" },
  "hd-bar-brass": { label: "Bar handle — brass", description: "Vertical, 1600 mm", badge: "Premium" },

  /* menteşə */
  "hg-standard": { label: "Visible hinge", description: "3 pcs, adjustable" },
  "hg-heavy": { label: "Reinforced hinge", description: "4 pcs, up to 160 kg" },
  "hg-hidden": { label: "Concealed hinge", description: "Invisible when the door is closed", badge: "Premium" },

  /* kilid */
  "lk-3point": { label: "3-point lock" },
  "lk-5point": { label: "5-point lock", description: "Top and bottom deadbolts" },
  "lk-multipoint": {
    label: "Automatic multipoint",
    description: "Locks by itself when the door closes",
    badge: "RC3+",
  },
  "lk-motor": { label: "Motorised lock", description: "9 points, electromechanical", badge: "RC4+" },

  /* silindr */
  "cy-standard": { label: "Standard cylinder", description: "5 keys" },
  "cy-knob": { label: "Thumb-turn cylinder", description: "Opens from inside without a key" },
  "cy-antidrill": { label: "Anti-drill cylinder", description: "Resists drilling and snapping" },
  "cy-card": { label: "Card-controlled cylinder", description: "Keys copied only with the card" },

  /* smart lock */
  "sl-none": { label: "No smart lock" },
  "sl-x1": { label: "Smart Lock X1", description: "Fingerprint + code" },
  "sl-x2": {
    label: "Smart Lock X2",
    description: "Fingerprint, code, card, mobile app",
    badge: "Recommended",
  },
  "sl-x3": { label: "Smart Lock X3 Pro", description: "Face recognition, camera and intercom integration" },

  /* astana */
  "th-standard": { label: "Standard threshold" },
  "th-thermal": { label: "Thermal threshold", description: "Breaks the thermal bridge" },
  "th-low": { label: "Low threshold", description: "20 mm — for accessibility" },
  "th-auto": {
    label: "Automatic threshold",
    description: "Drops when the door closes, lifts when it opens",
    badge: "Premium",
  },

  /* izolyasiya */
  "is-standard": { label: "Standard insulation", description: "Two seals" },
  "is-acoustic": { label: "Acoustic package", description: "Third seal, +4 dB" },
  "is-thermal": { label: "Thermal package", description: "Reinforced core insulation" },
  "is-max": { label: "Acoustic + thermal package", badge: "Maximum" },

  /* aksesuar */
  "ac-viewer": { label: "Digital viewer (with screen)" },
  "ac-viewer-optic": { label: "Optical viewer 200°" },
  "ac-closer": { label: "Door closer" },
  "ac-number": { label: "Apartment number (metal)" },
  "ac-chain": { label: "Security chain" },
  "ac-letterbox": { label: "Letter slot" },
  "ac-kickplate": { label: "Kick plate", description: "Against scratches" },
  "ac-bell": { label: "Bell push (illuminated)" },
  "ac-camera": { label: "Video intercom preparation", description: "Cable channel and socket" },

  /* açılma istiqaməti */
  "od-left-in": { label: "Left / inward" },
  "od-right-in": { label: "Right / inward" },
  "od-left-out": { label: "Left / outward" },
  "od-right-out": { label: "Right / outward" },

  /* quraşdırma */
  "in-none": { label: "No installation needed" },
  "in-standard": { label: "Standard installation", description: "Removal of the old door not included" },
  "in-full": {
    label: "Full installation",
    description: "Removal, installation and waste disposal",
    badge: "Recommended",
  },
  "in-premium": { label: "Full + reinstatement", description: "Preparing the opening and repairing the plaster" },

  /* çatdırılma */
  "dl-pickup": { label: "I will collect it myself" },
  "dl-baku": { label: "Delivery within Baku" },
  "dl-baku-floor": { label: "Within Baku + carry to the floor" },
  "dl-region": { label: "Delivery to the regions" },
};

const ru: Texts = {
  /* panel stili */
  "ps-modern": { label: "Модерн — горизонтальные фрезы", description: "Узкие горизонтальные линии" },
  "ps-minimal": { label: "Минимализм — гладкая", description: "Одна вертикальная линия, спокойная поверхность" },
  "ps-classic": { label: "Классика — филёнка", description: "Две обрамлённые панели" },
  "ps-neoclassic": { label: "Неоклассика — с розеткой", description: "Три панели, центральная розетка" },
  "ps-loft": { label: "Лофт — решётка", description: "Металлическое решётчатое деление" },

  /* xarici rəng */
  "oc-ral9016": { label: "Транспортный белый" },
  "oc-ral9010": { label: "Чисто-белый" },
  "oc-ral7016": { label: "Антрацитово-серый", badge: "Популярно" },
  "oc-ral7039": { label: "Кварцевый серый" },
  "oc-ral7024": { label: "Графитовый серый" },
  "oc-ral9005": { label: "Матовый чёрный" },
  "oc-ral8017": { label: "Шоколадно-коричневый" },
  "oc-ral6009": { label: "Пихтовый зелёный" },
  "oc-ral5011": { label: "Стальной синий" },
  "oc-ral1015": { label: "Светлая слоновая кость" },
  "oc-oak-gold": { label: "Золотой дуб" },
  "oc-oak-light": { label: "Светлый дуб" },
  "oc-walnut": { label: "Орех" },
  "oc-wenge": { label: "Венге" },
  "oc-anthra-wood": { label: "Антрацитовое дерево" },
  "oc-concrete": { label: "Эффект бетона", badge: "Новинка" },
  "oc-custom-ral": {
    label: "Индивидуальный RAL",
    description: "Любой код RAL — окраска под заказ",
    badge: "Под заказ",
  },

  /* daxili rəng */
  "ic-white": { label: "Классический белый" },
  "ic-ivory": { label: "Слоновая кость" },
  "ic-grey": { label: "Серый матовый" },
  "ic-anthracite": { label: "Антрацит" },
  "ic-black": { label: "Матовый чёрный" },
  "ic-oak-light": { label: "Светлый дуб" },
  "ic-oak-gold": { label: "Золотой дуб" },
  "ic-walnut": { label: "Орех" },

  /* çərçivə */
  "fr-standard": { label: "Стандартная коробка", description: "Толщина стены 80–100 мм" },
  "fr-telescopic": { label: "Телескопическая коробка", description: "Регулируется 100–200 мм" },
  "fr-wide": { label: "Широкая телескопическая", description: "Для стен 200–320 мм" },
  "fr-hidden": { label: "Скрытая коробка", description: "Заподлицо со стеной", badge: "Премиум" },

  /* əlavə panel */
  "sd-none": { label: "Без боковой панели" },
  "sd-left": { label: "Левая боковая панель", description: "Глухая панель 300 мм" },
  "sd-right": { label: "Правая боковая панель", description: "Глухая панель 300 мм" },
  "sd-both": { label: "Боковые панели с двух сторон" },
  "sd-transom": { label: "Верхняя панель (фрамуга)", description: "400 мм над дверью" },

  /* şüşə */
  "gl-none": { label: "Без стекла" },
  "gl-satin": { label: "Сатин матовый", description: "Пропускает свет, но не вид" },
  "gl-clear": { label: "Прозрачное закалённое" },
  "gl-bronze": { label: "Бронзовое тонированное" },
  "gl-triplex": { label: "Антивандальный триплекс", description: "Класс P4A, многослойное", badge: "Безопасно" },

  /* şüşə naxışı */
  "gp-plain": { label: "Без рисунка" },
  "gp-lines": { label: "Горизонтальные полосы", description: "Пескоструйная обработка" },
  "gp-vertical": { label: "Вертикальные полосы" },
  "gp-grid": { label: "Решётка", description: "Квадратное деление" },
  "gp-edge": { label: "Пескоструй по краю", description: "Центр остаётся прозрачным" },

  /* dəstək */
  "hd-inox": { label: "Нержавеющая сталь", description: "Стандартная ручка" },
  "hd-black": { label: "Премиум матовый чёрный", badge: "Популярно" },
  "hd-brass": { label: "Шлифованная латунь" },
  "hd-bronze": { label: "Античная бронза" },
  "hd-bar": { label: "Ручка-скоба — сталь", description: "Вертикальная, 1200 мм" },
  "hd-bar-black": { label: "Ручка-скоба — матовый чёрный", description: "Вертикальная, 1600 мм" },
  "hd-bar-brass": { label: "Ручка-скоба — латунь", description: "Вертикальная, 1600 мм", badge: "Премиум" },

  /* menteşə */
  "hg-standard": { label: "Видимая петля", description: "3 шт., регулируемые" },
  "hg-heavy": { label: "Усиленная петля", description: "4 шт., до 160 кг" },
  "hg-hidden": { label: "Скрытая петля", description: "Не видна при закрытой двери", badge: "Премиум" },

  /* kilid */
  "lk-3point": { label: "3-точечный замок" },
  "lk-5point": { label: "5-точечный замок", description: "Верхний и нижний ригели" },
  "lk-multipoint": {
    label: "Автоматический многоточечный",
    description: "Запирается сам при закрытии двери",
    badge: "RC3+",
  },
  "lk-motor": { label: "Моторизованный замок", description: "9 точек, электромеханический", badge: "RC4+" },

  /* silindr */
  "cy-standard": { label: "Стандартный цилиндр", description: "5 ключей" },
  "cy-knob": { label: "Цилиндр с вертушкой", description: "Изнутри открывается без ключа" },
  "cy-antidrill": { label: "Противовзломный цилиндр", description: "Устойчив к сверлению и слому" },
  "cy-card": { label: "Цилиндр с картой", description: "Ключи копируются только по карте" },

  /* smart lock */
  "sl-none": { label: "Без смарт-замка" },
  "sl-x1": { label: "Smart Lock X1", description: "Отпечаток пальца + код" },
  "sl-x2": {
    label: "Smart Lock X2",
    description: "Отпечаток, код, карта, мобильное приложение",
    badge: "Рекомендуем",
  },
  "sl-x3": { label: "Smart Lock X3 Pro", description: "Распознавание лица, камера и интеграция с домофоном" },

  /* astana */
  "th-standard": { label: "Стандартный порог" },
  "th-thermal": { label: "Термопорог", description: "Разрывает мостик холода" },
  "th-low": { label: "Низкий порог", description: "20 мм — для доступности" },
  "th-auto": {
    label: "Автоматический порог",
    description: "Опускается при закрытии двери и поднимается при открытии",
    badge: "Премиум",
  },

  /* izolyasiya */
  "is-standard": { label: "Стандартная изоляция", description: "Два контура" },
  "is-acoustic": { label: "Шумопакет", description: "Третий контур, +4 дБ" },
  "is-thermal": { label: "Термопакет", description: "Усиленная изоляция сердечника" },
  "is-max": { label: "Шумо- и термопакет", badge: "Максимум" },

  /* aksesuar */
  "ac-viewer": { label: "Цифровой глазок (с экраном)" },
  "ac-viewer-optic": { label: "Оптический глазок 200°" },
  "ac-closer": { label: "Доводчик двери" },
  "ac-number": { label: "Номер квартиры (металл)" },
  "ac-chain": { label: "Цепочка безопасности" },
  "ac-letterbox": { label: "Почтовая щель" },
  "ac-kickplate": { label: "Защитная накладка снизу", description: "Против царапин" },
  "ac-bell": { label: "Кнопка звонка (с подсветкой)" },
  "ac-camera": { label: "Подготовка под видеодомофон", description: "Кабель-канал и гнездо" },

  /* açılma istiqaməti */
  "od-left-in": { label: "Левая / внутрь" },
  "od-right-in": { label: "Правая / внутрь" },
  "od-left-out": { label: "Левая / наружу" },
  "od-right-out": { label: "Правая / наружу" },

  /* quraşdırma */
  "in-none": { label: "Установка не нужна" },
  "in-standard": { label: "Стандартная установка", description: "Демонтаж старой двери не входит" },
  "in-full": {
    label: "Полная установка",
    description: "Демонтаж, установка и вывоз мусора",
    badge: "Рекомендуем",
  },
  "in-premium": { label: "Полная + восстановление", description: "Подготовка проёма и восстановление штукатурки" },

  /* çatdırılma */
  "dl-pickup": { label: "Заберу со склада сам" },
  "dl-baku": { label: "Доставка по Баку" },
  "dl-baku-floor": { label: "По Баку + подъём на этаж" },
  "dl-region": { label: "Доставка в регионы" },
};

const texts: Partial<Record<Locale, Texts>> = { en, ru };

/** Option dəyərinin cari dildəki mətni; tərcümə yoxdursa AZ qalır. */
export function optionText(value: OptionValue, locale: Locale): OptionText {
  const t = texts[locale]?.[value.id];
  if (!t) return { label: value.label, description: value.description, badge: value.badge };
  return {
    label: t.label,
    description: t.description ?? (locale === "az" ? value.description : undefined),
    badge: t.badge ?? (locale === "az" ? value.badge : undefined),
  };
}

/** Yalnız etiket lazım olduqda. */
export function optionLabel(value: OptionValue, locale: Locale): string {
  return texts[locale]?.[value.id]?.label ?? value.label;
}

/** Yalnız id məlum olanda (məsələn baza sətri) tərcüməni tapır. */
export function optionLabelById(id: string, locale: Locale, fallback: string): string {
  return texts[locale]?.[id]?.label ?? fallback;
}

/* --------------------- səbət / sifariş snapshot-u ---------------------- */

/**
 * Snapshot sətrini cari dildə göstərir.
 *
 * `group` option qrupunun açarı, `value` isə option id-sidir — belə saxlanır ki,
 * müştəri sifarişi başqa dildə açanda da öz konfiqurasiyasını oxuya bilsin.
 * Açar tanınmırsa mətn olduğu kimi qalır (əvvəl yadda saxlanmış səbətlər üçün).
 *
 * `resolve` option id-sini bazadan gələn dəyərlərdə axtarır — adminin
 * yaratdığı seçimlər də adı ilə görünsün deyə.
 */
export function snapshotLine(
  line: CartSnapshotLine,
  locale: Locale,
  dict: Dictionary,
  resolve: (id: string) => OptionValue | undefined,
): CartSnapshotLine {
  const steps = dict.configurator.steps;
  const group =
    line.group in steps
      ? steps[line.group as OptionGroupKey]
      : line.group === "BASE"
        ? dict.configurator.baseLayer
        : line.group;

  const option = resolve(line.value);
  return { group, value: option ? optionLabel(option, locale) : line.value };
}
