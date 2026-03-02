import { DDimerResult, YEARSResult } from '@/types/assessment';

/**
 * Calculate age-adjusted D-dimer threshold.
 * For patients > 50 years: threshold = age x 10 ng/mL (or age x 0.01 ug/L FEU)
 * For patients <= 50 years: standard threshold of 500 ng/mL
 */
export function ageAdjustedDDimer(age: number): number {
  if (age <= 50) {
    return 500; // ng/mL standard threshold
  }
  return age * 10; // ng/mL
}

/**
 * Evaluate D-dimer result against age-adjusted threshold.
 */
export function evaluateDDimer(age: number, value: number): DDimerResult {
  const threshold = ageAdjustedDDimer(age);
  return {
    value,
    unit: 'ng/mL',
    ageAdjustedThreshold: threshold,
    isPositive: value >= threshold,
  };
}

/**
 * YEARS algorithm for PE diagnosis.
 * 3 YEARS items: clinical signs of DVT, hemoptysis, PE is most likely diagnosis.
 *
 * If 0 YEARS items: PE excluded if D-dimer < 1000 ng/mL
 * If >= 1 YEARS item: PE excluded if D-dimer < 500 ng/mL
 * Otherwise: CTPA indicated.
 */
export function yearsAlgorithm(
  items: {
    clinicalSignsDVT: boolean;
    hemoptysis: boolean;
    peIsLikelyDiagnosis: boolean;
  },
  dDimerValue: number
): YEARSResult {
  const yearsItemCount =
    (items.clinicalSignsDVT ? 1 : 0) +
    (items.hemoptysis ? 1 : 0) +
    (items.peIsLikelyDiagnosis ? 1 : 0);

  const dDimerThreshold = yearsItemCount === 0 ? 1000 : 500;
  const peExcluded = dDimerValue < dDimerThreshold;

  return {
    items,
    dDimerValue,
    yearsItemCount,
    dDimerThreshold,
    peExcluded,
  };
}
