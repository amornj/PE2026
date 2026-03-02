import { BovaResult } from '@/types/scores';
import { BOVA_CRITERIA, BOVA_STAGES } from '@/data/bovaCriteria';

export function calculateBova(criteria: Record<string, boolean>): BovaResult {
  let total = 0;
  for (const criterion of BOVA_CRITERIA) {
    if (criteria[criterion.id]) {
      total += criterion.points;
    }
  }

  const bovaStage = BOVA_STAGES.find(s => total >= s.min && total <= s.max);
  const stage = bovaStage?.stage ?? 3;
  const complicationRisk = bovaStage?.complicationRisk ?? '>18% PE-related complications at 30 days';
  const label = bovaStage?.label ?? 'Stage III (High risk)';

  let riskLevel: 'low' | 'moderate' | 'high';
  if (stage === 1) {
    riskLevel = 'low';
  } else if (stage === 2) {
    riskLevel = 'moderate';
  } else {
    riskLevel = 'high';
  }

  return {
    total,
    interpretation: `Bova score ${total}: ${label}. ${complicationRisk}`,
    riskLevel,
    stage,
    complicationRisk,
  };
}
