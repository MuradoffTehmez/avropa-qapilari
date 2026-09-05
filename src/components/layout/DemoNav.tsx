import Link from "next/link";
export function DemoNav({locale}: {locale:string}) {
 return <div className="border-b border-brass-200 bg-brass-50 px-4 py-2 text-xs text-brass-700"><div className="container-page flex flex-wrap items-center justify-between gap-2"><span>Müştəri təqdimatı · Nümunə məlumatlar · Real sifariş və ödəniş yoxdur</span><Link className="font-semibold underline underline-offset-2" href={`/${locale}/demo`}>İmkanları kəşf et →</Link></div></div>;
}
