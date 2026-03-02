import { WellsResult } from '@/types/scores';
import { WELLS_CRITERIA } from '@/data/wellsCriteria';

export function calculateWells(criteria: Record<string, boolean>): WellsResult {
  let total = 0;
  for (const criterion of WELLS_CRITERIA) {
    if (criteria[criterion.id]) {
      total += criterion.points;
    }
  }

  // Two-tier interpretation
  const probability: 'unlikely' | 'likely' = total <= 4 ? 'unlikely' : 'likely';

  // Three-tier interpretation
  let threeLevel: 'low' | 'moderate' | 'high';
  if (total <= 1) {
    threeLevel = 'low';
  } else if (total <= 6) {
    threeLevel = 'moderate';
  } else {
    threeLevel = 'high';
  }

  const riskLevel = threeLevel;

  let interpretation: string;
  if (probability === 'unlikely') {
    interpretation = `Wells score ${total}: PE unlikely (two-tier), ${threeLevel} probability (three-tier)`;
  } else {
    interpretation = `Wells score ${total}: PE likely (two-tier), ${threeLevel} probability (three-tier)`;
  }

  return {
    total,
    interpretation,
    riskLevel,
    probability,
    threeLevel,
  };
}
