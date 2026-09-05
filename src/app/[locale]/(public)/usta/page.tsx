import { TechnicianPanel } from "@/components/account/TechnicianPanel";
export const metadata = {title: "Usta kabineti", robots: {index:false,follow:false}};
export default async function Page({params}: {params:Promise<{locale:string}>}) {const {locale}=await params;return <TechnicianPanel locale={locale}/>;}
