"use client";

import { useState } from "react";
import { DoorScene } from "./DoorScene";
import type { Dictionary } from "@/i18n";

/** Əvvəl / sonra müqayisə sürgüsü. */
export function ProjectDetail({ accent, title, dict }: { accent: string; title: string; dict: Dictionary }) {
  const [position, setPosition] = useState(50);

  return (
    <div>
      <div className="relative aspect-4/3 overflow-hidden border border-line">
        <DoorScene color={accent} title={`${title}: ${dict.projectDetail.after}`} variant={1} />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
          <DoorScene color="#8b8070" title={`${title}: ${dict.projectDetail.before}`} variant={0} />
        </div>
        <div
          aria-hidden
          className="absolute inset-y-0 w-0.5 bg-paper shadow-[0_0_0_1px_rgba(0,0,0,0.15)]"
          style={{ left: `${position}%` }}
        />
        <span className="absolute left-3 top-3 bg-ink px-2.5 py-1 text-[12px] font-medium uppercase tracking-wider text-paper">
          {dict.projectDetail.before}
        </span>
        <span className="absolute right-3 top-3 bg-ink px-2.5 py-1 text-[12px] font-medium uppercase tracking-wider text-paper">
          {dict.projectDetail.after}
        </span>
      </div>

      <label className="mt-4 block text-[13px] font-medium text-graphite">
        {dict.projectDetail.comparison}
        <input
          className="mt-2 h-11 w-full accent-gold-500"
          type="range"
          min="0"
          max="100"
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
        />
      </label>
    </div>
  );
}
