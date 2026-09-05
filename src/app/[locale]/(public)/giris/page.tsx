import { AuthDemo } from "@/components/account/AuthDemo";
export const metadata = {title: "Giriş və qeydiyyat", robots: {index:false,follow:false}};
export default async function Page({params}: {params:Promise<{locale:string}>}) {const {locale}=await params;return <AuthDemo locale={locale}/>;}
