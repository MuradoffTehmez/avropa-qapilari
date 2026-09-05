import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

import { getDictionary, isLocale, locales } from "@/i18n";
import type { Locale } from "@/types";
import { routes } from "@/lib/routes";
import { Accordion } from "@/components/ui/disclosure";
import { Breadcrumbs, Card, DataRow, Section, SectionHeading } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/Button";
import { faq } from "@/mock/content";

interface ServiceContent {
  slug: string;
  title: string;
  lead: string;
  steps: string[];
  includes: string[];
  pricing: { label: string; value: string }[];
  ctaLabel: string;
  ctaRoute: "measurement" | "repair" | "contact";
}

const services: ServiceContent[] = [
  {
    slug: "measurement",
    title: "Ölçü xidməti",
    lead: "Doğru ölçü — problemsiz quraşdırmanın 90%-i. Ustamız ünvana gəlir, açırımı ölçür və uyğun modelləri yerində təklif edir.",
    steps: [
      "Onlayn müraciət və ya zəng",
      "Uyğun tarix və saat aralığının təsdiqi",
      "Ustanın ünvana gəlişi",
      "Açırımın ölçülməsi və qeydiyyatı",
      "Model və qiymət təklifi",
    ],
    includes: [
      "Açırımın eni, hündürlüyü və dərinliyi",
      "Divar qalınlığı və çərçivə tipi",
      "Açılma istiqamətinin müəyyən edilməsi",
      "Foto qeydiyyat və ölçü protokolu",
    ],
    pricing: [
      { label: "Bakı daxili", value: "25 AZN" },
      { label: "Sifariş verildikdə", value: "Pulsuz" },
      { label: "Regionlar", value: "Fərdi razılaşma" },
    ],
    ctaLabel: "Ölçü ustası çağır",
    ctaRoute: "measurement",
  },
  {
    slug: "installation",
    title: "Quraşdırma xidməti",
    lead: "Sertifikatlı briqada Avropa standartlarına uyğun quraşdırma aparır. İş bitdikdən sonra qapı tənzimlənir və zəmanət açılır.",
    steps: [
      "Quraşdırma görüşünün planlanması",
      "Köhnə qapının sökülməsi (tam paketdə)",
      "Çərçivənin quraşdırılması və nivelirlənməsi",
      "Panelin quraşdırılması, kilid tənzimləməsi",
      "Təhvil, foto qeydiyyat və zəmanətin açılması",
    ],
    includes: [
      "Anker bərkitmə və köpük izolyasiya",
      "Kontur izolyasiyanın yoxlanması",
      "Kilid və menteşələrin tənzimlənməsi",
      "İş yerinin təmizlənməsi",
    ],
    pricing: [
      { label: "Standart quraşdırma", value: "120 AZN" },
      { label: "Tam quraşdırma", value: "220 AZN" },
      { label: "Villa / geniş açırım", value: "Fərdi hesablama" },
    ],
    ctaLabel: "Ölçü ustası çağır",
    ctaRoute: "measurement",
  },
  {
    slug: "repair",
    title: "Qapı təmiri",
    lead: "Kilid, menteşə, çərçivə, şüşə və smart lock problemləri. Bizdən alınmamış qapılara da xidmət göstəririk.",
    steps: [
      "Onlayn müraciət (foto/video ilə)",
      "Operator zəngi və ilkin diaqnostika",
      "Usta təyinatı və vaxt təsdiqi",
      "Ünvanda diaqnostika və qiymət razılaşması",
      "Təmir, ehtiyat hissə dəyişimi və təhvil",
    ],
    includes: [
      "Kilid mexanizminin dəyişdirilməsi və ya təmiri",
      "Menteşə tənzimləməsi və dəyişimi",
      "Çərçivə düzəldilməsi, qapı düzləndirilməsi",
      "İzolyasiya konturunun bərpası",
      "Smart lock proqram və aparat problemləri",
    ],
    pricing: [
      { label: "Diaqnostika", value: "25 AZN" },
      { label: "Kilid dəyişimi", value: "60 AZN-dən" },
      { label: "Menteşə tənzimləmə", value: "40 AZN-dən" },
      { label: "Ehtiyat hissələr", value: "Ayrıca hesablanır" },
    ],
    ctaLabel: "Usta çağır",
    ctaRoute: "repair",
  },
  {
    slug: "maintenance",
    title: "Texniki baxım",
    lead: "İllik profilaktik baxım qapının ömrünü uzadır və gözlənilməz nasazlıqların qarşısını alır.",
    steps: [
      "Baxım görüşünün planlanması",
      "Mexanizmlərin yoxlanması",
      "Yağlama və tənzimləmə",
      "İzolyasiya konturunun qiymətləndirilməsi",
      "Baxım protokolunun servis tarixçəsinə yazılması",
    ],
    includes: [
      "Kilid və silindr yağlanması",
      "Menteşə tənzimləməsi",
      "Kontur izolyasiyanın yoxlanması",
      "Astana və bərkidici elementlərin nəzarəti",
    ],
    pricing: [
      { label: "Tək qapı", value: "60 AZN" },
      { label: "3+ qapı", value: "45 AZN / qapı" },
      { label: "Zəmanət dövründə", value: "İldə 1 dəfə pulsuz" },
    ],
    ctaLabel: "Usta çağır",
    ctaRoute: "repair",
  },
];

export function generateStaticParams() {
  return locales.flatMap((locale) => services.map((s) => ({ locale, service: s.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string }>;
}): Promise<Metadata> {
  const { service } = await params;
  const item = services.find((s) => s.slug === service);
  if (!item) return {};
  return { title: item.title, description: item.lead };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; service: string }>;
}) {
  const { locale: raw, service } = await params;
  const locale = (isLocale(raw) ? raw : "az") as Locale;
  const dict = getDictionary(locale);
  const r = routes(locale);

  const item = services.find((s) => s.slug === service);
  if (!item) notFound();

  const ctaHref =
    item.ctaRoute === "measurement" ? r.measurement : item.ctaRoute === "repair" ? r.repair : r.contact;

  return (
    <>
      <div className="border-b border-line bg-bone">
        <div className="container-page py-8 sm:py-10">
          <Breadcrumbs
            items={[
              { label: "Ana səhifə", href: r.home },
              { label: dict.nav.services, href: r.services },
              { label: item.title },
            ]}
          />
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-ink sm:text-3xl lg:text-[2.35rem]">
            {item.title}
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-stone">{item.lead}</p>
          <ButtonLink href={ctaHref} size="lg" className="mt-6">
            {item.ctaLabel}
          </ButtonLink>
        </div>
      </div>

      <Section>
        <div className="container-page grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            <SectionHeading title="Proses" className="!mb-6" />
            <ol className="border-t border-line">
              {item.steps.map((step, i) => (
                <li key={step} className="flex items-start gap-4 border-b border-line py-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-line text-xs font-semibold tabular-nums text-graphite">
                    {i + 1}
                  </span>
                  <span className="pt-0.5 text-[15px] text-ink">{step}</span>
                </li>
              ))}
            </ol>

            <h2 className="mb-4 mt-10 text-lg font-semibold tracking-tight text-ink">
              Xidmətə daxildir
            </h2>
            <ul className="space-y-2.5">
              {item.includes.map((inc) => (
                <li key={inc} className="flex items-start gap-2.5 text-[14.5px] text-graphite">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-brass-500" />
                  {inc}
                </li>
              ))}
            </ul>
          </div>

          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <Card className="p-5">
              <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone">
                Qiymətlər
              </h2>
              <dl>
                {item.pricing.map((p) => (
                  <DataRow key={p.label} label={p.label} value={p.value} />
                ))}
              </dl>
              <ButtonLink href={ctaHref} full className="mt-5">
                {item.ctaLabel}
              </ButtonLink>
              <p className="mt-3 text-xs leading-relaxed text-stone">
                Qiymətlər təxminidir və obyektin xüsusiyyətlərinə görə dəyişə bilər.
              </p>
            </Card>
          </aside>
        </div>
      </Section>

      <Section tone="bone" className="border-t border-line">
        <div className="container-page">
          <SectionHeading title={dict.home.faqTitle} />
          <Accordion
            className="lg:max-w-3xl"
            items={faq.slice(0, 5).map((f) => ({ id: f.id, title: f.question, content: f.answer }))}
          />
        </div>
      </Section>
    </>
  );
}
