import { Award, Flame, ShieldCheck, Volume2 } from "lucide-react";

import type { Dictionary } from "@/i18n";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Sertifikat və zəmanət nişanları.
 * Təhlükəsizlik qapısı satışında inamı artıran əsas elementdir.
 */
export function CertificateBadges({
  product,
  dict,
  className,
}: {
  product: Product;
  dict: Dictionary;
  className?: string;
}) {
  const badges = [
    product.securityClass !== "—" && {
      icon: ShieldCheck,
      code: product.securityClass,
      standard: "EN 1627",
      label: dict.catalog.securityClass,
    },
    product.fireRating && {
      icon: Flame,
      code: product.fireRating,
      standard: "EN 13501-2",
      label: dict.catalog.fireRating,
    },
    {
      icon: Volume2,
      code: `${product.soundInsulationDb} dB`,
      standard: "EN ISO 10140",
      label: dict.catalog.soundInsulation,
    },
    {
      icon: Award,
      code: `${product.warrantyYears} ${dict.common.years}`,
      standard: dict.warranty.serialNumber,
      label: dict.product.warrantyPeriod,
    },
  ].filter(Boolean) as {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    code: string;
    standard: string;
    label: string;
  }[];

  return (
    <ul
      className={cn(
        "grid grid-cols-2 gap-px overflow-hidden border border-line bg-line",
        badges.length === 4 ? "sm:grid-cols-4" : "sm:grid-cols-3",
        className,
      )}
    >
      {badges.map(({ icon: Icon, code, standard, label }) => (
        <li key={label} className="flex flex-col items-center bg-paper px-3 py-4 text-center">
          <Icon size={18} className="text-gold-500" />
          <span className="mt-2 text-[15px] font-semibold tracking-tight text-ink">{code}</span>
          <span className="mt-0.5 text-[11px] leading-tight text-stone">{label}</span>
          <span className="mt-1.5 border-t border-line pt-1.5 text-[10px] uppercase tracking-[0.1em] text-mist">
            {standard}
          </span>
        </li>
      ))}
    </ul>
  );
}
