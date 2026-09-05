import { getDictionary, isLocale } from "@/i18n";
import type { Locale } from "@/types";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";

export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typed = (isLocale(locale) ? locale : "az") as Locale;
  const dict = getDictionary(typed);

  return (
    <div className="flex min-h-dvh flex-col">
      <Header locale={typed} dict={dict} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer locale={typed} dict={dict} />
      <WhatsAppButton />
    </div>
  );
}
