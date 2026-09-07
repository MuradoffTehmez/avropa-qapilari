/**
 * Platformanın qəbul etdiyi mütləq ölçü hüdudları (mm).
 *
 * Client sıxması, paylaşma linkinin oxunması və server validasiyası eyni
 * mənbədən oxuyur. Ayrı-ayrı yazılanda istifadəçi serverin qəbul etdiyi
 * ölçünü konfiquratorda daxil edə bilmirdi.
 *
 * Məhsulun öz `minWidth`/`maxWidth` aralığı bundan dardır — ondan kənar
 * ölçü sifarişi bloklamır, qiymət təklifinə yönləndirir (PRD §130).
 */
export const SIZE_LIMITS = {
  minWidth: 400,
  maxWidth: 3000,
  minHeight: 1200,
  maxHeight: 3500,
} as const;

export function withinSizeLimits(width: number, height: number): boolean {
  return (
    Number.isFinite(width) &&
    Number.isFinite(height) &&
    width >= SIZE_LIMITS.minWidth &&
    width <= SIZE_LIMITS.maxWidth &&
    height >= SIZE_LIMITS.minHeight &&
    height <= SIZE_LIMITS.maxHeight
  );
}
