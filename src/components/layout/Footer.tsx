import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon, TiktokIcon } from "@/components/ui/SocialIcons";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/types";
import { routes } from "@/lib/routes";
import { brand, hasContact, hasSocial } from "@/config/brand";
import { Logo } from "@/components/layout/Logo";
import { categories } from "@/mock/taxonomy";
import { categoryName } from "@/lib/i18n-format";

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const r = routes(locale);
  const year = new Date().getFullYear();
  const whatsapp = brand.contact.whatsapp.replace(/[^0-9]/g, "");

  const columns = [
    {
      title: dict.footer.products,
      links: categories.slice(0, 6).map((c) => ({ label: categoryName(c, dict), href: r.category(c.slug) })),
    },
    {
      title: dict.footer.services,
      links: [
        { label: dict.services.measurement, href: r.serviceMeasurement },
        { label: dict.services.installation, href: r.serviceInstallation },
        { label: dict.services.repair, href: r.serviceRepair },
        { label: dict.services.maintenance, href: r.serviceMaintenance },
        { label: dict.actions.requestQuote, href: r.quote },
      ],
    },
    {
      title: dict.footer.company,
      links: [
        { label: dict.nav.about, href: r.about },
        { label: dict.nav.showroom, href: r.showroom },
        { label: dict.nav.projects, href: r.projects },
        { label: dict.nav.brands, href: r.brands },
        { label: dict.nav.blog, href: r.blog },
        { label: dict.nav.contact, href: r.contact },
      ],
    },
    {
      title: dict.footer.support,
      links: [
        { label: dict.nav.faq, href: r.faq },
        { label: dict.account.orders, href: r.accountSection("orders") },
        { label: dict.footer.warrantyPolicy, href: r.legal("warranty") },
        { label: dict.footer.deliveryPolicy, href: r.legal("delivery") },
        { label: dict.footer.returns, href: r.legal("returns") },
      ],
    },
  ];

  return (
    <footer className="border-t border-line bg-ink text-paper">
      <div className="container-page py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_3fr] lg:gap-14">
          <div>
            <Logo tone="paper" tagline={dict.meta.slogan} />
            <p className="mt-5 max-w-xs text-[14px] leading-relaxed text-paper/55">
              {dict.meta.description}
            </p>

            {hasContact && (
              <div className="mt-6 flex flex-col gap-2.5 text-[14px] text-paper/70">
                {brand.contact.phone && (
                  <a
                    href={`tel:${brand.contact.phoneHref}`}
                    className="flex items-center gap-2.5 transition-colors hover:text-paper"
                  >
                    <Phone size={15} className="shrink-0 text-gold-400" /> {brand.contact.phone}
                  </a>
                )}
                {whatsapp && (
                  <a
                    href={`https://wa.me/${whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 transition-colors hover:text-paper"
                  >
                    <MessageCircle size={15} className="shrink-0 text-gold-400" /> WhatsApp
                  </a>
                )}
                {brand.contact.email && (
                  <a
                    href={`mailto:${brand.contact.email}`}
                    className="flex items-center gap-2.5 transition-colors hover:text-paper"
                  >
                    <Mail size={15} className="shrink-0 text-gold-400" /> {brand.contact.email}
                  </a>
                )}
                {brand.contact.address && (
                  <p className="flex items-start gap-2.5">
                    <MapPin size={15} className="mt-0.5 shrink-0 text-gold-400" />
                    {brand.contact.address}
                  </p>
                )}
              </div>
            )}

            {hasSocial && (
              <div className="mt-6 flex items-center gap-3">
                {brand.social.instagram && (
                  <a
                    href={brand.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="flex h-10 w-10 items-center justify-center border border-paper/15 text-paper/60 transition-colors hover:border-paper/40 hover:text-paper"
                  >
                    <InstagramIcon size={16} />
                  </a>
                )}
                {brand.social.facebook && (
                  <a
                    href={brand.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="flex h-10 w-10 items-center justify-center border border-paper/15 text-paper/60 transition-colors hover:border-paper/40 hover:text-paper"
                  >
                    <FacebookIcon size={16} />
                  </a>
                )}
                {brand.social.tiktok && (
                  <a
                    href={brand.social.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok"
                    className="flex h-10 w-10 items-center justify-center border border-paper/15 text-paper/60 transition-colors hover:border-paper/40 hover:text-paper"
                  >
                    <TiktokIcon size={16} />
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 sm:gap-8">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-300">
                  {col.title}
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className="text-[13.5px] text-paper/60 transition-colors hover:text-paper"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-paper/10">
        <div className="container-page flex flex-col gap-3 py-5 text-xs text-paper/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {brand.legalName}. {dict.footer.rights}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href={r.legal("privacy")} className="transition-colors hover:text-paper/80">
              {dict.footer.privacy}
            </Link>
            <Link href={r.legal("terms")} className="transition-colors hover:text-paper/80">
              {dict.footer.terms}
            </Link>
            <Link href={r.legal("cookies")} className="transition-colors hover:text-paper/80">
              {dict.footer.cookies}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
