import type { Locale } from "@/types";
import { brand } from "@/config/brand";

/**
 * Hüquqi sənədlər — TEST MƏTNİ.
 * Hüquqşünas mətni gələndə yalnız bu fayl dəyişir.
 * CMS qoşulanda `LegalPageTranslation` cədvəli ilə əvəz olunacaq (PRD §106).
 */
export interface LegalPage {
  slug: string;
  title: string;
  updated: string;
  sections: { heading: string; body: string[] }[];
}

const UPDATED = "2026-09-01";

/** Əlaqə e-poçtu boşdursa sətir göstərilmir. */
function contactLine(prefix: string): string[] {
  return brand.contact.email ? [`${prefix} ${brand.contact.email}`] : [];
}

const az: LegalPage[] = [
  {
    slug: "privacy",
    title: "Məxfilik siyasəti",
    updated: UPDATED,
    sections: [
      {
        heading: "Topladığımız məlumatlar",
        body: [
          "Sifariş, ölçü və təmir müraciətlərini emal etmək üçün ad, telefon, e-poçt və ünvan məlumatlarını toplayırıq.",
          "Saytın işini yaxşılaşdırmaq üçün anonim texniki məlumatlar (brauzer, cihaz tipi, səhifə baxışları) qeydə alınır.",
        ],
      },
      {
        heading: "Məlumatların istifadəsi",
        body: [
          "Məlumatlar yalnız xidmətin göstərilməsi, sifarişin icrası, zəmanətin idarə olunması və sizinlə əlaqə üçün istifadə edilir.",
          "Marketinq bildirişləri yalnız açıq razılığınız olduqda göndərilir və istənilən vaxt ləğv edilə bilər.",
        ],
      },
      {
        heading: "Saxlanma müddəti",
        body: [
          "Sifariş və zəmanət qeydləri qanunvericiliyin tələb etdiyi müddət ərzində saxlanılır.",
          "Hesab silindikdə şəxsi məlumatlar anonimləşdirilir; maliyyə sənədləri qanuni müddət bitənədək qalır.",
        ],
      },
      {
        heading: "Hüquqlarınız",
        body: [
          "Məlumatlarınıza baxmaq, düzəliş etmək və silinməsini tələb etmək hüququnuz var.",
          ...contactLine("Müraciət üçün:"),
        ],
      },
    ],
  },
  {
    slug: "terms",
    title: "İstifadə şərtləri",
    updated: UPDATED,
    sections: [
      {
        heading: "Ümumi müddəalar",
        body: [
          "Saytdan istifadə etməklə bu şərtləri qəbul etmiş olursunuz.",
          "Saytdakı qiymətlər və mövcudluq məlumatı dəyişə bilər; yekun qiymət sifariş təsdiqi zamanı müəyyən edilir.",
        ],
      },
      {
        heading: "Sifariş",
        body: [
          "Sifariş operator tərəfindən təsdiqləndikdən sonra icraya alınır.",
          "Fərdi ölçülü və sifarişlə hazırlanan məhsullar üçün əlavə şərtlər tətbiq oluna bilər.",
        ],
      },
      {
        heading: "Məsuliyyət",
        body: [
          "Düzgün olmayan ölçü məlumatı müştəri tərəfindən verildikdə yaranan xərclər müştərinin üzərinə düşür.",
          "Zəmanət şərtləri ayrıca sənədlə tənzimlənir.",
        ],
      },
    ],
  },
  {
    slug: "cookies",
    title: "Kuki siyasəti",
    updated: UPDATED,
    sections: [
      {
        heading: "Zəruri kukilər",
        body: [
          "Səbət, seçilmiş dil və sessiya kimi funksiyaların işləməsi üçün istifadə olunur. Bunlar söndürülə bilməz.",
        ],
      },
      {
        heading: "Analitik kukilər",
        body: ["Saytın istifadə statistikasını anonim şəkildə toplayır. Yalnız razılığınızla aktivləşir."],
      },
      {
        heading: "Marketinq kukiləri",
        body: ["Reklam kampaniyalarının effektivliyini ölçmək üçün istifadə olunur. Yalnız razılığınızla aktivləşir."],
      },
    ],
  },
  {
    slug: "warranty",
    title: "Zəmanət şərtləri",
    updated: UPDATED,
    sections: [
      {
        heading: "Zəmanət müddəti",
        body: [
          "Modeldən asılı olaraq 3–10 il. Müddət quraşdırma tarixindən başlayır.",
          "Hər qapıya unikal serial nömrə verilir; zəmanət həmin nömrəyə bağlanır.",
        ],
      },
      {
        heading: "Zəmanətə daxildir",
        body: ["Konstruksiya qüsurları, örtük dəfekti, menteşə və kilid mexanizminin zavod nasazlığı."],
      },
      {
        heading: "Zəmanətə daxil deyil",
        body: [
          "Mexaniki zədələr, düzgün olmayan istismar, üçüncü tərəfin müdaxiləsi və təbii aşınma.",
          "Şirkətimizdən kənar quraşdırma zamanı yaranan problemlər.",
        ],
      },
    ],
  },
  {
    slug: "delivery",
    title: "Çatdırılma şərtləri",
    updated: UPDATED,
    sections: [
      {
        heading: "Müddət",
        body: ["Anbarda olan modellər: 3–7 iş günü.", "Sifarişlə hazırlanan modellər: 21–35 iş günü."],
      },
      {
        heading: "Qiymət",
        body: [
          "Bakı daxili çatdırılma 40 AZN, regionlara 95 AZN-dən başlayır.",
          "Anbardan özünüz götürdükdə çatdırılma pulsuzdur.",
        ],
      },
    ],
  },
  {
    slug: "returns",
    title: "Geri qaytarma",
    updated: UPDATED,
    sections: [
      {
        heading: "Standart məhsullar",
        body: [
          "Quraşdırılmamış və zədəsiz standart məhsullar təhvildən sonra 14 gün ərzində geri qaytarıla bilər.",
        ],
      },
      {
        heading: "Fərdi sifarişlər",
        body: ["Fərdi ölçü və fərdi rənglə hazırlanan məhsullar zavod qüsuru olmadıqda geri qaytarılmır."],
      },
    ],
  },
];

const en: LegalPage[] = [
  {
    slug: "privacy",
    title: "Privacy policy",
    updated: UPDATED,
    sections: [
      {
        heading: "The data we collect",
        body: [
          "To process orders, measurement bookings and repair requests we collect your name, phone number, email address and address.",
          "To improve how the site works we record anonymous technical data (browser, device type, page views).",
        ],
      },
      {
        heading: "How the data is used",
        body: [
          "Data is used only to deliver the service, fulfil the order, manage the warranty and contact you.",
          "Marketing messages are sent only with your explicit consent and can be withdrawn at any time.",
        ],
      },
      {
        heading: "Retention period",
        body: [
          "Order and warranty records are kept for as long as the law requires.",
          "When an account is deleted, personal data is anonymised; financial documents remain until the statutory period ends.",
        ],
      },
      {
        heading: "Your rights",
        body: [
          "You have the right to access your data, have it corrected and request its deletion.",
          ...contactLine("To make a request:"),
        ],
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms of use",
    updated: UPDATED,
    sections: [
      {
        heading: "General provisions",
        body: [
          "By using this site you accept these terms.",
          "Prices and availability on the site may change; the final price is set when the order is confirmed.",
        ],
      },
      {
        heading: "Orders",
        body: [
          "An order goes into production once the operator has confirmed it.",
          "Additional terms may apply to custom-sized and made-to-order products.",
        ],
      },
      {
        heading: "Liability",
        body: [
          "Costs arising from incorrect measurement data supplied by the customer are borne by the customer.",
          "Warranty terms are governed by a separate document.",
        ],
      },
    ],
  },
  {
    slug: "cookies",
    title: "Cookie policy",
    updated: UPDATED,
    sections: [
      {
        heading: "Essential cookies",
        body: [
          "Used so that features such as the cart, the selected language and the session work. These cannot be turned off.",
        ],
      },
      {
        heading: "Analytics cookies",
        body: ["Collect anonymous statistics about how the site is used. Enabled only with your consent."],
      },
      {
        heading: "Marketing cookies",
        body: ["Used to measure the effectiveness of advertising campaigns. Enabled only with your consent."],
      },
    ],
  },
  {
    slug: "warranty",
    title: "Warranty terms",
    updated: UPDATED,
    sections: [
      {
        heading: "Warranty period",
        body: [
          "Between 3 and 10 years depending on the model. The period starts on the installation date.",
          "Every door is given a unique serial number and the warranty is tied to that number.",
        ],
      },
      {
        heading: "Covered by the warranty",
        body: ["Construction defects, coating defects and factory faults in the hinge and lock mechanisms."],
      },
      {
        heading: "Not covered by the warranty",
        body: [
          "Mechanical damage, improper use, third-party intervention and normal wear.",
          "Problems arising from installation carried out by anyone other than us.",
        ],
      },
    ],
  },
  {
    slug: "delivery",
    title: "Delivery terms",
    updated: UPDATED,
    sections: [
      {
        heading: "Lead time",
        body: ["Models held in stock: 3–7 working days.", "Made-to-order models: 21–35 working days."],
      },
      {
        heading: "Price",
        body: [
          "Delivery within Baku costs 40 AZN; delivery to the regions starts at 95 AZN.",
          "Collection from the warehouse is free.",
        ],
      },
    ],
  },
  {
    slug: "returns",
    title: "Returns",
    updated: UPDATED,
    sections: [
      {
        heading: "Standard products",
        body: [
          "Uninstalled and undamaged standard products can be returned within 14 days of handover.",
        ],
      },
      {
        heading: "Custom orders",
        body: ["Products made to a custom size or a custom colour cannot be returned unless they have a factory defect."],
      },
    ],
  },
];

const ru: LegalPage[] = [
  {
    slug: "privacy",
    title: "Политика конфиденциальности",
    updated: UPDATED,
    sections: [
      {
        heading: "Какие данные мы собираем",
        body: [
          "Для обработки заказов, заявок на замер и ремонт мы собираем имя, телефон, электронную почту и адрес.",
          "Для улучшения работы сайта фиксируются анонимные технические данные (браузер, тип устройства, просмотры страниц).",
        ],
      },
      {
        heading: "Как используются данные",
        body: [
          "Данные используются только для оказания услуги, исполнения заказа, управления гарантией и связи с вами.",
          "Маркетинговые уведомления отправляются только с вашего явного согласия и могут быть отозваны в любой момент.",
        ],
      },
      {
        heading: "Срок хранения",
        body: [
          "Записи о заказах и гарантии хранятся столько, сколько требует законодательство.",
          "При удалении аккаунта персональные данные обезличиваются; финансовые документы сохраняются до окончания установленного законом срока.",
        ],
      },
      {
        heading: "Ваши права",
        body: [
          "Вы вправе получить доступ к своим данным, исправить их и потребовать удаления.",
          ...contactLine("Для обращения:"),
        ],
      },
    ],
  },
  {
    slug: "terms",
    title: "Условия использования",
    updated: UPDATED,
    sections: [
      {
        heading: "Общие положения",
        body: [
          "Используя сайт, вы принимаете эти условия.",
          "Цены и наличие на сайте могут меняться; итоговая цена определяется при подтверждении заказа.",
        ],
      },
      {
        heading: "Заказ",
        body: [
          "Заказ передаётся в работу после подтверждения оператором.",
          "Для изделий нестандартного размера и под заказ могут применяться дополнительные условия.",
        ],
      },
      {
        heading: "Ответственность",
        body: [
          "Расходы, возникшие из-за неверных данных замера, предоставленных клиентом, несёт клиент.",
          "Условия гарантии регулируются отдельным документом.",
        ],
      },
    ],
  },
  {
    slug: "cookies",
    title: "Политика использования cookie",
    updated: UPDATED,
    sections: [
      {
        heading: "Необходимые cookie",
        body: [
          "Используются для работы корзины, выбранного языка и сессии. Их нельзя отключить.",
        ],
      },
      {
        heading: "Аналитические cookie",
        body: ["Собирают анонимную статистику использования сайта. Включаются только с вашего согласия."],
      },
      {
        heading: "Маркетинговые cookie",
        body: ["Используются для оценки эффективности рекламных кампаний. Включаются только с вашего согласия."],
      },
    ],
  },
  {
    slug: "warranty",
    title: "Условия гарантии",
    updated: UPDATED,
    sections: [
      {
        heading: "Срок гарантии",
        body: [
          "От 3 до 10 лет в зависимости от модели. Срок начинается с даты установки.",
          "Каждой двери присваивается уникальный серийный номер, к которому привязана гарантия.",
        ],
      },
      {
        heading: "Что покрывает гарантия",
        body: ["Дефекты конструкции, дефекты покрытия, заводские неисправности петель и механизма замка."],
      },
      {
        heading: "Что гарантия не покрывает",
        body: [
          "Механические повреждения, неправильную эксплуатацию, вмешательство третьих лиц и естественный износ.",
          "Проблемы, возникшие при установке силами сторонних исполнителей.",
        ],
      },
    ],
  },
  {
    slug: "delivery",
    title: "Условия доставки",
    updated: UPDATED,
    sections: [
      {
        heading: "Сроки",
        body: ["Модели со склада: 3–7 рабочих дней.", "Изготовление под заказ: 21–35 рабочих дней."],
      },
      {
        heading: "Стоимость",
        body: [
          "Доставка по Баку — 40 AZN, в регионы — от 95 AZN.",
          "Самовывоз со склада бесплатный.",
        ],
      },
    ],
  },
  {
    slug: "returns",
    title: "Возврат",
    updated: UPDATED,
    sections: [
      {
        heading: "Стандартные изделия",
        body: [
          "Неустановленные и неповреждённые стандартные изделия можно вернуть в течение 14 дней после передачи.",
        ],
      },
      {
        heading: "Индивидуальные заказы",
        body: ["Изделия нестандартного размера и цвета возврату не подлежат, если нет заводского дефекта."],
      },
    ],
  },
];

const byLocale: Record<Locale, LegalPage[]> = { az, en, ru };

export function legalPages(locale: Locale): LegalPage[] {
  return byLocale[locale] ?? az;
}

/** Route-lar üçün sabit slug siyahısı. */
export const legalSlugs = az.map((p) => p.slug);
