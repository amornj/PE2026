import { GenevaResult } from '@/types/scores';
import { GENEVA_CRITERIA } from '@/data/genevaCriteria';

export function calculateGeneva(criteria: Record<string, boolean>): GenevaResult {
  let total = 0;
  for (const criterion of GENEVA_CRITERIA) {
    // HR 75-94 and HR >= 95 are mutually exclusive; if both checked, use only the higher
    if (criterion.id === 'heartRate75to94' && criteria['heartRate95plus']) {
      continue;
    }
    if (criteria[criterion.id]) {
      total += criterion.points;
    }
  }

  let probability: 'low' | 'intermediate' | 'high';
  let riskLevel: 'low' | 'moderate' | 'high';

  if (total <= 3) {
    probability = 'low';
    riskLevel = 'low';
  } else if (total <= 10) {
    probability = 'intermediate';
    riskLevel = 'moderate';
  } else {
    probability = 'high';
    riskLevel = 'high';
  }

  const interpretation = `Revised Geneva score ${total}: ${probability} clinical probability of PE`;

  return {
    total,
    interpretation,
    riskLevel,
    probability,
  };
}
