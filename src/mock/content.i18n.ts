import type { BlogPost, FaqItem, Locale, Project, Review } from "@/types";
import { blogPosts, faq, projects, reviews } from "@/mock/content";

/**
 * Redaksiya məzmununun EN/RU tərcümələri.
 *
 * AZ mətnlər `content.ts`-dədir. CMS qoşulanda hər ikisi
 * `*Translation` cədvəlləri ilə əvəz olunacaq (PRD §106, §141).
 * Şəhər və rayon adları tərcümə olunmur — yerli toponimlərdir.
 */

type FaqText = { group: string; question: string; answer: string };

const faqEn: Record<string, FaqText> = {
  "f-1": {
    group: "Measurement",
    question: "How is the door measured?",
    answer:
      "The technician comes to your address and records the width and height of the opening, the frame depth, the wall thickness and the opening direction. When you place an order, the measurement is free.",
  },
  "f-2": {
    group: "Delivery",
    question: "How long does delivery take?",
    answer:
      "Models held in stock are delivered within 3–7 working days. Made-to-order models take 21–35 working days.",
  },
  "f-3": {
    group: "Installation",
    question: "Is installation included in the price?",
    answer:
      "No, installation is a separate service and is chosen in the configurator. Standard installation costs 120 AZN; full installation, which includes removing the old door and taking away the waste, costs 220 AZN.",
  },
  "f-4": {
    group: "Warranty",
    question: "How many years is the warranty?",
    answer:
      "Between 3 and 10 years depending on the model. The warranty is tied to the door's serial number, the service history is kept in the system and can be checked through the QR code.",
  },
  "f-5": {
    group: "Measurement",
    question: "Are custom sizes possible?",
    answer:
      "Yes. Every model has an allowed minimum and maximum size range. For sizes outside that range the system automatically redirects you to a quote request.",
  },
  "f-6": {
    group: "Measurement",
    question: "How do I tell whether the door is left- or right-hand?",
    answer:
      "Stand in front of the door. If the hinges are on the right it is right-hand; if they are on the left it is left-hand. The configurator shows both options visually.",
  },
  "f-7": {
    group: "Payment",
    question: "Which payment methods are available?",
    answer: "Card online, cash on delivery and bank transfer.",
  },
  "f-8": {
    group: "Repair",
    question: "Do you repair doors whose warranty has expired?",
    answer:
      "Yes. We also repair doors that were not bought from us. The technician confirms the cost of the work after the diagnosis.",
  },
};

const faqRu: Record<string, FaqText> = {
  "f-1": {
    group: "Замер",
    question: "Как снимаются размеры двери?",
    answer:
      "Мастер приезжает по адресу и фиксирует ширину и высоту проёма, глубину коробки, толщину стены и направление открывания. При оформлении заказа замер бесплатный.",
  },
  "f-2": {
    group: "Доставка",
    question: "Сколько дней занимает доставка?",
    answer:
      "Модели со склада доставляются за 3–7 рабочих дней. Изготовление под заказ занимает 21–35 рабочих дней.",
  },
  "f-3": {
    group: "Установка",
    question: "Входит ли установка в цену?",
    answer:
      "Нет, установка — отдельная услуга и выбирается в конфигураторе. Стандартная установка стоит 120 AZN, полная установка с демонтажом старой двери и вывозом мусора — 220 AZN.",
  },
  "f-4": {
    group: "Гарантия",
    question: "Сколько лет гарантии?",
    answer:
      "От 3 до 10 лет в зависимости от модели. Гарантия привязана к серийному номеру двери, сервисная история хранится в системе и проверяется по QR-коду.",
  },
  "f-5": {
    group: "Замер",
    question: "Возможны ли нестандартные размеры?",
    answer:
      "Да. У каждой модели есть допустимый минимальный и максимальный диапазон размеров. Для размеров вне диапазона система автоматически направляет на запрос индивидуальной цены.",
  },
  "f-6": {
    group: "Замер",
    question: "Как определить, правая дверь или левая?",
    answer:
      "Встаньте перед дверью. Если петли справа — дверь правая, если слева — левая. В конфигураторе оба варианта показаны наглядно.",
  },
  "f-7": {
    group: "Оплата",
    question: "Какие способы оплаты доступны?",
    answer: "Картой онлайн, наличными при доставке и банковским переводом.",
  },
  "f-8": {
    group: "Ремонт",
    question: "Ремонтируете ли двери после окончания гарантии?",
    answer:
      "Да. Мы обслуживаем и двери, купленные не у нас. Мастер подтверждает стоимость работ после диагностики.",
  },
};

const faqTexts: Partial<Record<Locale, Record<string, FaqText>>> = { en: faqEn, ru: faqRu };

export function localizedFaq(locale: Locale): FaqItem[] {
  const t = faqTexts[locale];
  if (!t) return faq;
  return faq.map((f) => ({ ...f, ...(t[f.id] ?? {}) }));
}

/* ------------------------------ layihələr ------------------------------ */

type ProjectText = { title: string; location: string; category: string };

const projectTexts: Partial<Record<Locale, Record<string, ProjectText>>> = {
  en: {
    "pj-1": { title: "Mərdəkan Villa", location: "Mərdəkan, Baku", category: "Villa" },
  },
  ru: {
    "pj-1": { title: "Вилла в Мардакане", location: "Мардакан, Баку", category: "Вилла" },
  },
};

export function localizedProjects(locale: Locale): Project[] {
  const t = projectTexts[locale];
  if (!t) return projects;
  return projects.map((p) => ({ ...p, ...(t[p.id] ?? {}) }));
}

/* -------------------------------- rəylər ------------------------------- */

type ReviewText = { city: string; text: string };

const reviewTexts: Partial<Record<Locale, Record<string, ReviewText>>> = {
  en: {
    "rv-1": {
      city: "Baku",
      text: "The technician arrived on time and the door was ready in three weeks. The sound insulation turned out better than I expected — almost nothing comes through from the corridor.",
    },
  },
  ru: {
    "rv-1": {
      city: "Баку",
      text: "Замерщик приехал вовремя, дверь была готова за три недели. Шумоизоляция оказалась лучше, чем я ожидал — из коридора почти ничего не слышно.",
    },
  },
};

/** Bazadan gələn rəy üçün tərcümə; yoxdursa `undefined`. */
export function reviewTranslation(id: string, locale: Locale): ReviewText | undefined {
  return reviewTexts[locale]?.[id];
}

export function localizedReviews(locale: Locale): Review[] {
  const t = reviewTexts[locale];
  if (!t) return reviews;
  return reviews.map((r) => ({ ...r, ...(t[r.id] ?? {}) }));
}

/* --------------------------------- bloq -------------------------------- */

type PostText = { title: string; excerpt: string; category: string };

const postTexts: Partial<Record<Locale, Record<string, PostText>>> = {
  en: {
    "bp-1": {
      title: "What to look for when choosing an entrance door",
      excerpt:
        "Security class, sound insulation, thermal figure and lock system — which parameter matters most for you?",
      category: "Guide",
    },
  },
  ru: {
    "bp-1": {
      title: "На что смотреть при выборе входной двери",
      excerpt:
        "Класс безопасности, шумоизоляция, теплоизоляция и система замка — какой параметр критичен именно для вас?",
      category: "Гид",
    },
  },
};

export function localizedPosts(locale: Locale): BlogPost[] {
  const t = postTexts[locale];
  if (!t) return blogPosts;
  return blogPosts.map((p) => ({ ...p, ...(t[p.id] ?? {}) }));
}
