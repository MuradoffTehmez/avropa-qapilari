import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getDictionary, isLocale, locales } from "@/i18n";
import type { Locale } from "@/types";
import { routes } from "@/lib/routes";
import { brand } from "@/config/brand";
import { formatDateLong } from "@/lib/utils";
import { Breadcrumbs, Section } from "@/components/ui/primitives";

interface LegalPage {
  slug: string;
  title: string;
  updated: string;
  sections: { heading: string; body: string[] }[];
}

const pages: LegalPage[] = [
  {
    slug: "privacy",
    title: "Məxfilik siyasəti",
    updated: "2026-09-01",
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
          `Müraciət üçün: ${brand.contact.email}`,
        ],
      },
    ],
  },
  {
    slug: "terms",
    title: "İstifadə şərtləri",
    updated: "2026-09-01",
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
    updated: "2026-09-01",
    sections: [
      {
        heading: "Zəruri kukilər",
        body: [
          "Səbət, seçilmiş dil və sessiya kimi funksiyaların işləməsi üçün istifadə olunur. Bunlar söndürülə bilməz.",
        ],
      },
      {
        heading: "Analitik kukilər",
        body: [
          "Saytın istifadə statistikasını anonim şəkildə toplayır. Yalnız razılığınızla aktivləşir.",
        ],
      },
      {
        heading: "Marketinq kukiləri",
        body: [
          "Reklam kampaniyalarının effektivliyini ölçmək üçün istifadə olunur. Yalnız razılığınızla aktivləşir.",
        ],
      },
    ],
  },
  {
    slug: "warranty",
    title: "Zəmanət şərtləri",
    updated: "2026-09-01",
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
        body: [
          "Konstruksiya qüsurları, örtük dəfekti, menteşə və kilid mexanizminin zavod nasazlığı.",
        ],
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
    updated: "2026-09-01",
    sections: [
      {
        heading: "Müddət",
        body: [
          "Anbarda olan modellər: 3–7 iş günü.",
          "Sifarişlə hazırlanan modellər: 21–35 iş günü.",
        ],
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
    updated: "2026-09-01",
    sections: [
      {
        heading: "Standart məhsullar",
        body: [
          "Quraşdırılmamış və zədəsiz standart məhsullar təhvildən sonra 14 gün ərzində geri qaytarıla bilər.",
        ],
      },
      {
        heading: "Fərdi sifarişlər",
        body: [
          "Fərdi ölçü və fərdi rənglə hazırlanan məhsullar zavod qüsuru olmadıqda geri qaytarılmır.",
        ],
      },
    ],
  },
];

export function generateStaticParams() {
  return locales.flatMap((locale) => pages.map((p) => ({ locale, page: p.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const { page } = await params;
  const item = pages.find((p) => p.slug === page);
  if (!item) return {};
  return { title: item.title };
}

export default async function LegalPageView({
  params,
}: {
  params: Promise<{ locale: string; page: string }>;
}) {
  const { locale: raw, page } = await params;
  const locale = (isLocale(raw) ? raw : "az") as Locale;
  const dict = getDictionary(locale);
  const r = routes(locale);

  const item = pages.find((p) => p.slug === page);
  if (!item) notFound();

  return (
    <>
      <div className="border-b border-line bg-bone">
        <div className="container-page py-8 sm:py-10">
          <Breadcrumbs
            items={[{ label: dict.nav.home, href: r.home }, { label: dict.footer.legal }, { label: item.title }]}
          />
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            {item.title}
          </h1>
          <p className="mt-2 text-[13px] text-stone">
            Son yenilənmə: {formatDateLong(item.updated)}
          </p>
        </div>
      </div>

      <Section>
        <div className="container-page">
          <article className="max-w-2xl space-y-8">
            {item.sections.map((s) => (
              <section key={s.heading}>
                <h2 className="text-lg font-semibold tracking-tight text-ink">{s.heading}</h2>
                <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-graphite">
                  {s.body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </section>
            ))}

          </article>
        </div>
      </Section>
    </>
  );
}
