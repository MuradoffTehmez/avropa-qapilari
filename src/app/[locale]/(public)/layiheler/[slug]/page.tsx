import { notFound } from "next/navigation";
import { projects } from "@/mock/content";
import { ProjectDetail } from "@/components/product/ProjectDetail";
import { ButtonLink } from "@/components/ui/Button";
export default async function Page({params}: {params: Promise<{locale:string;slug:string}>}) {
 const {locale,slug}=await params; const project=projects.find(p=>p.slug===slug); if(!project) notFound();
 return <div className="container-page py-10"><p className="text-xs uppercase tracking-widest text-stone">Nümunə layihə · {project.location}</p><h1 className="my-4 text-3xl font-semibold">{project.title}</h1><div className="grid gap-8 lg:grid-cols-2"><ProjectDetail accent={project.accent} title={project.title}/><div className="space-y-5"><h2 className="text-xl font-semibold">Girişin yenilənməsi</h2><p>Bu nümunə layihədə mövcud giriş ölçülür, açılma istiqaməti seçilir və interyerə uyğun qapı quraşdırılır. Son mərhələdə kilid, menteşə və izolyasiya yoxlanılır.</p><dl className="space-y-3 border-y py-5"><dt>Model: {project.doorModel}</dt><dt>Rəng: {project.color}</dt><dt>Layihə növü: {project.category}</dt><dt>İl: {project.year}</dt></dl><h2 className="font-semibold">İş mərhələləri</h2><ol className="list-inside list-decimal space-y-2"><li>Ölçü və məsləhət</li><li>Konfiqurasiya və qiymətin təsdiqi</li><li>Çatdırılma və quraşdırma</li><li>Keyfiyyət yoxlaması və zəmanət</li></ol><ButtonLink href={`/${locale}/olcu`}>Oxşar layihə üçün ölçü sifariş et</ButtonLink></div></div></div>;
}
