import { SPESIResult } from '@/types/scores';
import { SPESI_CRITERIA } from '@/data/spesiCriteria';

export function calculateSPESI(criteria: Record<string, boolean>): SPESIResult {
  let total = 0;
  for (const criterion of SPESI_CRITERIA) {
    if (criteria[criterion.id]) {
      total += criterion.points;
    }
  }

  const simplified: 0 | 1 = total === 0 ? 0 : 1;
  const riskLevel: 'low' | 'moderate' | 'high' = total === 0 ? 'low' : 'high';

  const interpretation = total === 0
    ? 'sPESI = 0: Low risk. 30-day mortality ~1.0%.'
    : `sPESI = ${total}: High risk (≥1 point). 30-day mortality ~10.9%.`;

  return {
    total,
    interpretation,
    riskLevel,
    simplified,
  };
}
