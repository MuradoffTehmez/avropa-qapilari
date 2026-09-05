import { AdminSection } from "@/components/admin/AdminSection";
import { isLocale } from "@/i18n";
export default async function Page({params}: {params:Promise<{locale:string;section:string}>}) { const {locale,section}=await params; return <AdminSection key={`${locale}/${section}`} locale={isLocale(locale)?locale:"az"} section={section}/>; }
