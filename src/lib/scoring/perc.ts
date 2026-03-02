import { PERC_CRITERIA } from '@/data/percCriteria';

export interface PERCResult {
  total: number;
  allAbsent: boolean;
  interpretation: string;
}

/**
 * PERC (Pulmonary Embolism Rule-out Criteria).
 * If ALL 8 criteria are absent (score = 0), PE can be safely ruled out
 * in patients with low clinical probability (<15%).
 */
export function calculatePERC(criteria: Record<string, boolean>): PERCResult {
  let total = 0;
  for (const c of PERC_CRITERIA) {
    if (criteria[c.id]) {
      total += c.points;
    }
  }

  const allAbsent = total === 0;

  const interpretation = allAbsent
    ? 'PERC negative — all criteria absent. PE can be ruled out without further testing in low-probability patients.'
    : `PERC positive — ${total} criterion/criteria present. Cannot rule out PE by PERC alone. Proceed to D-dimer testing.`;

  return { total, allAbsent, interpretation };
}
