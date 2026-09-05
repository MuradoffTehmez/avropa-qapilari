"use client";
import { Download } from "lucide-react";
export function DemoDocument({title,model,details}:{title:string;model:string;details:string}) {
 return <button aria-label={`${title} sənədini endir`} className="flex shrink-0 items-center gap-2 text-sm text-brass-700" onClick={()=>{const content=`EUROPORTA — DEMO SƏNƏD\n\n${title}\n${model}\n\n${details}\n\nBu sənəd müştəri təqdimatı üçün nümunədir. Rəsmi sertifikat, zəmanət və ya ödəniş sənədi deyil.`;const url=URL.createObjectURL(new Blob([content],{type:"text/plain;charset=utf-8"}));const link=document.createElement("a");link.href=url;link.download="europorta-demo-sened.txt";link.click();URL.revokeObjectURL(url);}}><Download size={16}/>Endir</button>;
}
