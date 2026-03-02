import type { ScoreCriterion } from '@/types/scores';

export const PERC_CRITERIA: ScoreCriterion[] = [
  { id: 'age50plus', label: 'Age ≥ 50', points: 1 },
  { id: 'hr100plus', label: 'Heart rate ≥ 100 bpm', points: 1 },
  { id: 'spo2Below95', label: 'SpO₂ < 95% on room air', points: 1 },
  { id: 'priorDvtPe', label: 'Prior history of DVT/PE', points: 1 },
  { id: 'recentSurgeryTrauma', label: 'Recent surgery or trauma (within 4 weeks)', points: 1 },
  { id: 'hemoptysis', label: 'Hemoptysis', points: 1 },
  { id: 'estrogenUse', label: 'Exogenous estrogen use (OCP, HRT)', points: 1 },
  { id: 'unilateralLegSwelling', label: 'Unilateral leg swelling', points: 1 },
];
