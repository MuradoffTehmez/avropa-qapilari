"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";

import { az } from "@/i18n/dictionaries/az";

/**
 * Locale seqmenti üçün xəta sərhədi.
 *
 * Client komponentdir və `params`-a çıxışı yoxdur, ona görə mətn AZ
 * lüğətindən götürülür — locale-i oxumaq üçün əlavə client məntiqi
 * bu ekranın dəyərini artırmır.
 */
export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      id="main"
      className="flex min-h-dvh flex-col items-center justify-center px-6 text-center"
    >
      <p className="font-mono text-[13px] uppercase tracking-[0.24em] text-gold-600">500</p>
      <h1 className="font-display mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {az.errors.somethingWrong}
      </h1>
      <p className="mt-3 max-w-md text-[15px] leading-relaxed text-stone">
        {az.errors.somethingWrongText}
      </p>

      <button
        type="button"
        onClick={reset}
        className="mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-[3px] border border-ink bg-ink px-5 text-sm font-medium text-paper transition-colors hover:bg-obsidian focus-visible:outline-2 focus-visible:outline-gold-500 focus-visible:outline-offset-2"
      >
        <RotateCcw size={15} aria-hidden />
        {az.errors.tryAgain}
      </button>
    </main>
  );
}
