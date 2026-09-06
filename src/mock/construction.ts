import type { ConstructionLayer, DoorMaterial } from "@/types";

/**
 * Qapı konstruksiyasının qat quruluşu — çöl tərəfdən iç tərəfə doğru.
 * Kəsik görünüşündə istifadə olunur.
 */
const stacks: Record<DoorMaterial, ConstructionLayer[]> = {
  STEEL: [
    { id: "s1", name: "Xarici polad təbəqə", thicknessMm: 1.5, role: "Zərbəyə davamlı örtük", color: "#8e99a8", pattern: "metal" },
    { id: "s2", name: "Anti-korroziya qrunt", thicknessMm: 0.3, role: "Nəmdən qoruma", color: "#b8a37a" },
    { id: "s3", name: "Gücləndirici qabırğalar", thicknessMm: 12, role: "Deformasiyaya qarşı karkas", color: "#6b7683", pattern: "honeycomb" },
    { id: "s4", name: "Mineral yun", thicknessMm: 40, role: "Səs və istilik izolyasiyası", color: "#d8cfae", pattern: "fiber" },
    { id: "s5", name: "Buxar baryeri", thicknessMm: 0.5, role: "Kondensata qarşı", color: "#9fb3c8" },
    { id: "s6", name: "Daxili polad təbəqə", thicknessMm: 1.2, role: "Struktur bütövlüyü", color: "#8e99a8", pattern: "metal" },
    { id: "s7", name: "MDF üz paneli", thicknessMm: 16, role: "Dekorativ iç səth", color: "#c9a97a" },
    { id: "s8", name: "Örtük / şpon", thicknessMm: 0.6, role: "Rəng və faktura", color: "#a8763f" },
  ],
  COMPOSITE: [
    { id: "c1", name: "Kompozit örtük", thicknessMm: 2, role: "UV və hava davamlılığı", color: "#7d848e" },
    { id: "c2", name: "Alüminium profil", thicknessMm: 3, role: "Ölçü sabitliyi", color: "#aab3bd", pattern: "metal" },
    { id: "c3", name: "Termo körpü kəsici", thicknessMm: 8, role: "İstilik itkisinin qarşısı", color: "#4d5b6b" },
    { id: "c4", name: "Poliuretan köpük", thicknessMm: 48, role: "0.79 W/m²K termo nüvə", color: "#e3dcc6", pattern: "honeycomb" },
    { id: "c5", name: "Daxili alüminium profil", thicknessMm: 3, role: "Struktur", color: "#aab3bd", pattern: "metal" },
    { id: "c6", name: "İç panel", thicknessMm: 14, role: "Dekorativ səth", color: "#c9a97a" },
  ],
  SOLID_WOOD: [
    { id: "w1", name: "Lak / yağ örtüyü", thicknessMm: 0.4, role: "Səthin qorunması", color: "#b98a4e" },
    { id: "w2", name: "Massiv palıd lamel", thicknessMm: 18, role: "Xarici üz qatı", color: "#b07d43" },
    { id: "w3", name: "Çarpaz lamel nüvə", thicknessMm: 24, role: "Əyilməyə qarşı sabitlik", color: "#8f6437", pattern: "fiber" },
    { id: "w4", name: "Massiv palıd lamel", thicknessMm: 18, role: "Daxili üz qatı", color: "#b07d43" },
    { id: "w5", name: "Lak / yağ örtüyü", thicknessMm: 0.4, role: "Səthin qorunması", color: "#b98a4e" },
  ],
  MDF: [
    { id: "m1", name: "Emal örtüyü", thicknessMm: 0.3, role: "Cızıqlara davamlılıq", color: "#d6d2cb" },
    { id: "m2", name: "MDF lövhə", thicknessMm: 8, role: "Xarici üz", color: "#c4a880" },
    { id: "m3", name: "Bal pətəyi doldurucu", thicknessMm: 22, role: "Yüngül karkas", color: "#e0d6bd", pattern: "honeycomb" },
    { id: "m4", name: "MDF lövhə", thicknessMm: 8, role: "Daxili üz", color: "#c4a880" },
    { id: "m5", name: "Emal örtüyü", thicknessMm: 0.3, role: "Cızıqlara davamlılıq", color: "#d6d2cb" },
  ],
  ALUMINIUM: [
    { id: "a1", name: "Anodlanmış alüminium", thicknessMm: 2, role: "Xarici profil", color: "#9aa4ae", pattern: "metal" },
    { id: "a2", name: "Termo körpü kəsici", thicknessMm: 6, role: "İstilik ayırıcı", color: "#4d5b6b" },
    { id: "a3", name: "Tempered şüşə paket", thicknessMm: 24, role: "İşıq keçirən nüvə", color: "#c3d3d9" },
    { id: "a4", name: "Termo körpü kəsici", thicknessMm: 6, role: "İstilik ayırıcı", color: "#4d5b6b" },
    { id: "a5", name: "Anodlanmış alüminium", thicknessMm: 2, role: "Daxili profil", color: "#9aa4ae", pattern: "metal" },
  ],
  GLASS: [
    { id: "g1", name: "Tempered şüşə", thicknessMm: 8, role: "Xarici təbəqə", color: "#c3d3d9" },
    { id: "g2", name: "PVB laylı film", thicknessMm: 1.5, role: "Qırılmaya qarşı", color: "#e8eef0" },
    { id: "g3", name: "Tempered şüşə", thicknessMm: 8, role: "Daxili təbəqə", color: "#c3d3d9" },
  ],
};

export function constructionLayers(material: DoorMaterial): ConstructionLayer[] {
  return stacks[material];
}

export function totalThickness(material: DoorMaterial): number {
  return Math.round(stacks[material].reduce((sum, l) => sum + l.thicknessMm, 0));
}
