import { getDictionary, isLocale } from "@/i18n";
import type { Locale } from "@/types";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AccountNav } from "@/components/account/AccountNav";
import { AccountHeader } from "@/components/account/AccountHeader";
import { AuthGuard } from "@/components/account/AuthGuard";

export default async function AccountLayout({
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
        <AuthGuard locale={typed} dict={dict}>
          <AccountHeader dict={dict} />

          <div className="container-page grid gap-8 py-8 lg:grid-cols-[220px_1fr] lg:gap-12 lg:py-10">
            <AccountNav locale={typed} dict={dict} />
            <div className="min-w-0">{children}</div>
          </div>
        </AuthGuard>
      </main>

      <Footer locale={typed} dict={dict} />
    </div>
  );
}
