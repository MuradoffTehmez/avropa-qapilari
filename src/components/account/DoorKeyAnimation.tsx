"use client";

import { cn } from "@/lib/utils";

export type DoorState = "locked" | "unlocking" | "open";

/**
 * Giriş ekranlarının vizualı: portal, qapı qanadı və açar.
 *
 * `locked` — açar deşikdə, sakit parıltı
 * `unlocking` — açar dönür, riqellər geri çəkilir
 * `open` — qanad açılır, arxadan qızıl işıq düşür
 *
 * Loqonun həndəsəsini təkrarlayır (portal + pilləli baza), rənglər
 * `globals.css`-dəki tokenlərdən gəlir. `prefers-reduced-motion`
 * seçilibsə hərəkət dayanır, yalnız son hal göstərilir.
 */
export function DoorKeyAnimation({
  state = "locked",
  className,
}: {
  state?: DoorState;
  className?: string;
}) {
  return (
    <div className={cn("door-key relative", className)} data-state={state}>
      <svg viewBox="0 0 320 420" className="h-full w-full" role="img" aria-hidden>
        <defs>
          <linearGradient id="dk-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e8c17a" />
            <stop offset="45%" stopColor="#d3a54f" />
            <stop offset="100%" stopColor="#8f6529" />
          </linearGradient>
          <linearGradient id="dk-panel" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0d2138" />
            <stop offset="55%" stopColor="#0b1d34" />
            <stop offset="100%" stopColor="#071322" />
          </linearGradient>
          <radialGradient id="dk-glow" cx="50%" cy="55%" r="60%">
            <stop offset="0%" stopColor="#f3d9a6" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#d3a54f" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#d3a54f" stopOpacity="0" />
          </radialGradient>
          <clipPath id="dk-opening">
            <rect x="72" y="60" width="176" height="300" />
          </clipPath>
        </defs>

        {/* divar kölgəsi */}
        <rect x="40" y="34" width="240" height="332" fill="#0a1626" opacity="0.35" />

        {/* açırımın arxası — qapı açılanda görünən işıq */}
        <g clipPath="url(#dk-opening)">
          <rect x="72" y="60" width="176" height="300" fill="#050d18" />
          <ellipse className="dk-glow" cx="160" cy="230" rx="120" ry="150" fill="url(#dk-glow)" />
        </g>

        {/* qapı qanadı — sol kənardan açılır */}
        <g className="dk-panel">
          <rect x="72" y="60" width="176" height="300" fill="url(#dk-panel)" />

          {/* frezə xətləri */}
          <g stroke="#132b47" strokeWidth="2" fill="none">
            <rect x="90" y="80" width="140" height="118" />
            <rect x="90" y="222" width="140" height="118" />
          </g>
          <g stroke="#0a1a2e" strokeWidth="1" opacity="0.8">
            <line x1="102" y1="104" x2="218" y2="104" />
            <line x1="102" y1="128" x2="218" y2="128" />
            <line x1="102" y1="152" x2="218" y2="152" />
            <line x1="102" y1="246" x2="218" y2="246" />
            <line x1="102" y1="270" x2="218" y2="270" />
            <line x1="102" y1="294" x2="218" y2="294" />
          </g>

          {/* menteşələr */}
          <rect x="72" y="104" width="7" height="26" rx="1.5" fill="url(#dk-gold)" opacity="0.75" />
          <rect x="72" y="284" width="7" height="26" rx="1.5" fill="url(#dk-gold)" opacity="0.75" />

          {/* bar dəstək — sağ kənarda */}
          <rect x="232" y="140" width="7" height="140" rx="3.5" fill="url(#dk-gold)" />
          <rect x="230" y="140" width="11" height="7" rx="2" fill="url(#dk-gold)" opacity="0.7" />
          <rect x="230" y="273" width="11" height="7" rx="2" fill="url(#dk-gold)" opacity="0.7" />

          {/* kilid plitəsi və açar deşiyi */}
          <rect x="192" y="186" width="30" height="62" rx="4" fill="#0a1a2e" stroke="url(#dk-gold)" strokeWidth="1.6" />
          <circle cx="207" cy="204" r="6.4" fill="#040b14" />
          <path d="M203.6 208 h6.8 l-1.6 16 h-3.6 z" fill="#040b14" />

          {/* riqellər — açılanda geri çəkilir */}
          <g className="dk-bolts" fill="url(#dk-gold)">
            <rect x="248" y="150" width="14" height="9" rx="1.5" />
            <rect x="248" y="206" width="14" height="9" rx="1.5" />
            <rect x="248" y="262" width="14" height="9" rx="1.5" />
          </g>
        </g>

        {/* açar — deşikdə oturur və dönür */}
        <g className="dk-key">
          <g transform="translate(207 204)">
            {/* saplama */}
            <rect x="-2.6" y="-2" width="5.2" height="44" rx="2.6" fill="url(#dk-gold)" />
            {/* dişlər */}
            <rect x="2.2" y="26" width="11" height="4.6" rx="2.3" fill="url(#dk-gold)" />
            <rect x="2.2" y="34" width="8" height="4.6" rx="2.3" fill="url(#dk-gold)" />
            {/* halqa */}
            <circle cx="0" cy="-14" r="11.5" fill="none" stroke="url(#dk-gold)" strokeWidth="4.6" />
            <circle cx="0" cy="-14" r="4.2" fill="#040b14" />
          </g>
        </g>

        {/* portal çərçivəsi */}
        <g fill="none" stroke="url(#dk-gold)" strokeWidth="3.5" strokeLinejoin="round">
          <path d="M160 22 262 66 v300 H58 V66z" />
        </g>
        <rect x="66" y="54" width="188" height="312" fill="none" stroke="url(#dk-gold)" strokeWidth="2" opacity="0.55" />

        {/* pilləli baza */}
        <rect x="70" y="366" width="180" height="10" fill="url(#dk-gold)" opacity="0.85" />
        <rect x="52" y="376" width="216" height="10" fill="url(#dk-gold)" opacity="0.65" />
        <rect x="32" y="386" width="256" height="11" rx="2" fill="url(#dk-gold)" opacity="0.45" />
      </svg>
    </div>
  );
}
