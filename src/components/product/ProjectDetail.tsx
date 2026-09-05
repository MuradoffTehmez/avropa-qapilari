"use client";
import { useState } from "react";
import { DoorScene } from "./DoorScene";

export function ProjectDetail({ accent, title }: { accent: string; title: string }) {
  const [position, setPosition] = useState(50);
  return <div><div className="relative aspect-[4/3] overflow-hidden border"><DoorScene color={accent} title={`${title}: sonra`} variant={1} /><div className="absolute inset-0" style={{ clipPath: `inset(0 ${100-position}% 0 0)` }}><DoorScene color="#8b8070" title={`${title}: əvvəl`} variant={0} /></div><div className="absolute inset-y-0 w-0.5 bg-white shadow" style={{ left: `${position}%` }} /><span className="absolute left-3 top-3 bg-ink px-3 py-1 text-xs text-white">Əvvəl</span><span className="absolute right-3 top-3 bg-ink px-3 py-1 text-xs text-white">Sonra</span></div><label className="mt-4 block text-sm">Əvvəl / sonra müqayisəsi<input className="mt-2 w-full accent-amber-700" type="range" min="0" max="100" value={position} onChange={(e) => setPosition(Number(e.target.value))} /></label><p className="mt-2 text-xs text-stone">Nümunə layihə və illüstrasiyalar — real portfolio təqdim edildikdə əvəzlənəcək.</p></div>;
}
