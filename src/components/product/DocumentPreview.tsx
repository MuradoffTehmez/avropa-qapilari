"use client";

import { Download } from "lucide-react";
import { brand } from "@/config/brand";

/** Sənəd faylları R2-yə yüklənənə qədər mətn önizləməsi verir. */
export function DocumentPreview({
  title,
  model,
  details,
  downloadLabel,
}: {
  title: string;
  model: string;
  details: string;
  downloadLabel: string;
}) {
  function download() {
    const content = `${brand.name.toUpperCase()} — ${title}\n\n${model}\n\n${details}\n`;
    const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `europorta-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      aria-label={`${title} — ${downloadLabel}`}
      onClick={download}
      className="flex shrink-0 items-center gap-1.5 text-[13px] font-medium text-gold-600 transition-colors hover:text-gold-700"
    >
      <Download size={15} />
      {downloadLabel}
    </button>
  );
}
