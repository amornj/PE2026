import { ScoreCriterion } from '@/types/scores';

export const BOVA_CRITERIA: ScoreCriterion[] = [
  {
    id: 'sbp90to100',
    label: 'Systolic BP 90-100 mmHg',
    points: 2,
  },
  {
    id: 'elevatedTroponin',
    label: 'Elevated cardiac troponin',
    points: 2,
    description: 'Above institutional upper limit of normal',
  },
  {
    id: 'rvDysfunction',
    label: 'RV dysfunction on imaging',
    points: 2,
    description: 'Echo or CT RV/LV ratio ≥ 1.0',
  },
  {
    id: 'heartRateGte110',
    label: 'Heart rate ≥ 110 bpm',
    points: 1,
  },
];

export const BOVA_STAGES = [
  { stage: 1 as const, min: 0, max: 2, label: 'Stage I (Low risk)', complicationRisk: '<4.2% PE-related complications at 30 days' },
  { stage: 2 as const, min: 3, max: 4, label: 'Stage II (Intermediate risk)', complicationRisk: '2.8-10.7% PE-related complications at 30 days' },
  { stage: 3 as const, min: 5, max: Infinity, label: 'Stage III (High risk)', complicationRisk: '>18% PE-related complications at 30 days' },
] as const;
