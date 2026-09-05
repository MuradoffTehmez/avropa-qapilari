import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { getDictionary, isLocale } from "@/i18n";
import type { Locale } from "@/types";
import { routes } from "@/lib/routes";
import { brand, hasContact } from "@/config/brand";
import { Breadcrumbs, Card, Section } from "@/components/ui/primitives";
import { ContactForm } from "@/components/layout/ContactForm";

export const metadata: Metadata = {
  title: "Əlaqə",
  description: "Sual verin — operatorumuz cavablandırsın. Ölçü, quraşdırma və təmir üzrə əlaqə.",
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

  const rows = [
    brand.contact.phone && {
      icon: Phone,
      label: dict.common.phone,
      content: (
        <a href={`tel:${brand.contact.phoneHref}`} className="hover:underline">
          {brand.contact.phone}
        </a>
      ),
    },
    whatsapp && {
      icon: MessageCircle,
      label: "WhatsApp",
      content: (
        <a
          href={`https://wa.me/${whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          {brand.contact.whatsapp}
        </a>
      ),
    },
    brand.contact.email && {
      icon: Mail,
      label: dict.common.email,
      content: (
        <a href={`mailto:${brand.contact.email}`} className="hover:underline">
          {brand.contact.email}
        </a>
      ),
    },
    brand.contact.address && {
      icon: MapPin,
      label: dict.common.address,
      content: brand.contact.address,
    },
    brand.contact.workingHours && {
      icon: Clock,
      label: dict.common.date,
      content: brand.contact.workingHours,
    },
  ].filter(Boolean) as {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    label: string;
    content: React.ReactNode;
  }[];

  return (
    <>
      <div className="border-b border-line bg-bone">
        <div className="container-page py-8 sm:py-10">
          <Breadcrumbs
            items={[{ label: dict.nav.home, href: r.home }, { label: dict.nav.contact }]}
          />
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-ink sm:text-3xl lg:text-[2.35rem]">
            {dict.nav.contact}
          </h1>
        </div>
      </div>

      <Section>
        <div
          className={
            hasContact
              ? "container-page grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:gap-16"
              : "container-page mx-auto max-w-2xl"
          }
        >
          {hasContact && (
            <div className="space-y-3">
              <Card className="p-5">
                <div className="space-y-4">
                  {rows.map(({ icon: Icon, label, content }) => (
                    <div key={label} className="flex items-start gap-3">
                      <Icon size={17} className="mt-0.5 shrink-0 text-gold-500" />
                      <div className="min-w-0">
                        <p className="text-[11px] uppercase tracking-[0.14em] text-stone">
                          {label}
                        </p>
                        <p className="mt-0.5 break-words text-[14.5px] text-ink">{content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {brand.contact.address && (
                <Card className="overflow-hidden">
                  <div
                    className="relative flex h-52 items-center justify-center bg-sand"
                    aria-label={dict.common.address}
                  >
                    <div
                      aria-hidden
                      className="absolute inset-0 opacity-40"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(0deg,#b5bfcc 0 1px,transparent 1px 28px),repeating-linear-gradient(90deg,#b5bfcc 0 1px,transparent 1px 28px)",
                      }}
                    />
                    <div className="relative flex flex-col items-center px-6 text-center">
                      <MapPin size={26} className="text-gold-600" />
                      <p className="mt-2 text-[13px] font-medium text-graphite">
                        {brand.contact.address}
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}

          <ContactForm dict={dict} />
        </div>
      </Section>
    </>
  );
}
