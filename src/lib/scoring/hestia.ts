import { HestiaResult } from '@/types/scores';
import { HESTIA_CRITERIA } from '@/data/hestiaCriteria';

export function calculateHestia(criteria: Record<string, boolean>): HestiaResult {
  let total = 0;
  for (const criterion of HESTIA_CRITERIA) {
    if (criteria[criterion.id]) {
      total += criterion.points;
    }
  }

  const eligible = total === 0;

  const interpretation = eligible
    ? 'Hestia score 0: Eligible for outpatient treatment.'
    : `Hestia score ${total}: NOT eligible for outpatient treatment (${total} contraindication${total > 1 ? 's' : ''} present).`;

  return {
    total,
    interpretation,
    riskLevel: eligible ? 'low' : 'high',
    eligible,
  };
}
