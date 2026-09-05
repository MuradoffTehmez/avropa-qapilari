import { getDictionary, isLocale } from "@/i18n";
import type { Locale } from "@/types";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AccountNav } from "@/components/account/AccountNav";
import { Notice } from "@/components/ui/primitives";
import { accountUser } from "@/mock/account";

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
        <div className="border-b border-line bg-bone">
          <div className="container-page py-8">
            <p className="text-[11px] uppercase tracking-[0.16em] text-stone">
              {dict.account.title}
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              {accountUser.name} {accountUser.surname}
            </h1>
            <p className="mt-1 text-[13px] text-stone">
              {accountUser.email} · {accountUser.phone}
            </p>
          </div>
        </div>

        <div className="container-page grid gap-8 py-8 lg:grid-cols-[220px_1fr] lg:gap-12 lg:py-10">
          <AccountNav locale={typed} dict={dict} />
          <div className="min-w-0">
            {children}
          </div>
        </div>
      </main>

      <Footer locale={typed} dict={dict} />
    </div>
  );
}
