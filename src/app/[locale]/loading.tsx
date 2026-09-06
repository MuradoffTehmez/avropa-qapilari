import { az } from "@/i18n/dictionaries/az";

/**
 * Route keçidləri üçün fallback.
 * Ölçüsü sabitdir — məzmun gələndə layout sıçramır (CLS 0).
 */
export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[60dvh] flex-col items-center justify-center gap-4 px-6"
    >
      <span className="sr-only">{az.errors.loading}</span>
      <span
        aria-hidden
        className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-gold-500"
      />
    </div>
  );
}
