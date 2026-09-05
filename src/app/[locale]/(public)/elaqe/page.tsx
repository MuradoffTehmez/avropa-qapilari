import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { getDictionary, isLocale } from "@/i18n";
import type { Locale } from "@/types";
import { routes } from "@/lib/routes";
import { brand } from "@/config/brand";
import { Breadcrumbs, Card, Section } from "@/components/ui/primitives";
import { ContactForm } from "@/components/layout/ContactForm";

export const metadata: Metadata = {
  title: "Əlaqə",
  description: "Ünvan, telefon, WhatsApp və iş saatları. Sual verin — operatorumuz cavablandırsın.",
};

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "az") as Locale;
  const dict = getDictionary(locale);
  const r = routes(locale);

  const whatsapp = brand.contact.whatsapp.replace(/[^0-9]/g, "");

  return (
    <>
      <div className="border-b border-line bg-bone">
        <div className="container-page py-8 sm:py-10">
          <Breadcrumbs items={[{ label: "Ana səhifə", href: r.home }, { label: dict.nav.contact }]} />
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-ink sm:text-3xl lg:text-[2.35rem]">
            {dict.nav.contact}
          </h1>
        </div>
      </div>

      <Section>
        <div className="container-page grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <div className="space-y-3">
            <Card className="p-5">
              <div className="space-y-4">
                <ContactRow icon={Phone} label={dict.common.phone}>
                  <a href={`tel:${brand.contact.phoneHref}`} className="hover:underline">
                    {brand.contact.phone}
                  </a>
                </ContactRow>
                <ContactRow icon={MessageCircle} label="WhatsApp">
                  <a
                    href={`https://wa.me/${whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {brand.contact.whatsapp}
                  </a>
                </ContactRow>
                <ContactRow icon={Mail} label={dict.common.email}>
                  <a href={`mailto:${brand.contact.email}`} className="hover:underline">
                    {brand.contact.email}
                  </a>
                </ContactRow>
                <ContactRow icon={MapPin} label={dict.common.address}>
                  {brand.contact.address}
                </ContactRow>
                <ContactRow icon={Clock} label="İş saatları">
                  {brand.contact.workingHours}
                </ContactRow>
              </div>
            </Card>

            <Card className="overflow-hidden">
              <div
                className="relative flex h-52 items-center justify-center bg-sand"
                aria-label="Xəritə yeri"
              >
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg,#c9c5be 0 1px,transparent 1px 28px),repeating-linear-gradient(90deg,#c9c5be 0 1px,transparent 1px 28px)",
                  }}
                />
                <div className="relative flex flex-col items-center">
                  <MapPin size={26} className="text-brass-600" />
                  <p className="mt-2 text-[13px] font-medium text-graphite">Showroom</p>
                  <p className="text-xs text-stone">Xəritə inteqrasiyası sonrakı mərhələdə</p>
                </div>
              </div>
            </Card>
          </div>

          <ContactForm dict={dict} />
        </div>
      </Section>
    </>
  );
}

function ContactRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={17} className="mt-0.5 shrink-0 text-brass-500" />
      <div>
        <p className="text-[11px] uppercase tracking-[0.14em] text-stone">{label}</p>
        <p className="mt-0.5 text-[14.5px] text-ink">{children}</p>
      </div>
    </div>
  );
}
