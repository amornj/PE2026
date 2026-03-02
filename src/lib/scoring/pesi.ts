import { PESIResult } from '@/types/scores';
import { PESI_CLASSES } from '@/data/pesiCriteria';

export interface PESIInput {
  age: number;
  male: boolean;
  cancer: boolean;
  heartFailure: boolean;
  chronicLung: boolean;
  heartRateGte110: boolean;
  sbpLt100: boolean;
  rrGte30: boolean;
  tempLt36: boolean;
  alteredMental: boolean;
  spo2Lt90: boolean;
}

export function calculatePESI(input: PESIInput): PESIResult {
  let total = input.age; // Age in years is the baseline

  if (input.male) total += 10;
  if (input.cancer) total += 30;
  if (input.heartFailure) total += 10;
  if (input.chronicLung) total += 10;
  if (input.heartRateGte110) total += 20;
  if (input.sbpLt100) total += 30;
  if (input.rrGte30) total += 20;
  if (input.tempLt36) total += 20;
  if (input.alteredMental) total += 60;
  if (input.spo2Lt90) total += 20;

  const pesiClass = PESI_CLASSES.find(c => total >= c.min && total <= c.max);
  const classNum = pesiClass?.class ?? 5;
  const mortality = pesiClass?.mortality ?? '>10%';
  const label = pesiClass?.label ?? 'Class V (Very high risk)';

  let riskLevel: 'low' | 'moderate' | 'high';
  if (classNum <= 2) {
    riskLevel = 'low';
  } else if (classNum <= 3) {
    riskLevel = 'moderate';
  } else {
    riskLevel = 'high';
  }

  return {
    total,
    interpretation: `${label}. 30-day mortality: ${mortality}`,
    riskLevel,
    class: classNum,
    mortality30Day: mortality,
  };
}
