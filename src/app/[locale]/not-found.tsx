import Link from "next/link";
import { az } from "@/i18n/dictionaries/az";

export default function NotFound() {
  const dict = az;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-[13px] uppercase tracking-[0.24em] text-gold-600">404</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {dict.errors.notFound}
      </h1>
      <p className="mt-3 max-w-md text-[15px] leading-relaxed text-stone">
        {dict.errors.notFoundText}
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        <Link
          href="/az"
          className="inline-flex h-11 items-center justify-center rounded-[3px] border border-ink bg-ink px-5 text-sm font-medium text-paper transition-colors hover:bg-obsidian"
        >
          {dict.errors.goHome}
        </Link>
        <Link
          href="/az/qapilar"
          className="inline-flex h-11 items-center justify-center rounded-[3px] border border-line bg-bone px-5 text-sm font-medium text-ink transition-colors hover:border-mist"
        >
          {dict.catalog.title}
        </Link>
      </div>
    </div>
  );
}
