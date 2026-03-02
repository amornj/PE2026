import { ScoreCriterion } from '@/types/scores';

export const WELLS_CRITERIA: ScoreCriterion[] = [
  {
    id: 'dvtSymptoms',
    label: 'Clinical signs/symptoms of DVT',
    points: 3,
    description: 'Leg swelling, pain with palpation of deep veins',
  },
  {
    id: 'peLikely',
    label: 'PE is #1 diagnosis, or equally likely',
    points: 3,
    description: 'Alternative diagnosis less likely than PE',
  },
  {
    id: 'heartRate',
    label: 'Heart rate > 100 bpm',
    points: 1.5,
  },
  {
    id: 'immobilization',
    label: 'Immobilization (≥3 days) or surgery in previous 4 weeks',
    points: 1.5,
  },
  {
    id: 'priorDvtPe',
    label: 'Previous DVT/PE',
    points: 1.5,
  },
  {
    id: 'hemoptysis',
    label: 'Hemoptysis',
    points: 1,
  },
  {
    id: 'cancer',
    label: 'Malignancy (treatment within 6 months or palliative)',
    points: 1,
    description: 'Active cancer or cancer treated within 6 months',
  },
];

export const WELLS_TWO_TIER = {
  unlikely: { max: 4, label: 'PE Unlikely' },
  likely: { min: 4.5, label: 'PE Likely' },
} as const;

export const WELLS_THREE_TIER = {
  low: { min: 0, max: 1, label: 'Low probability' },
  moderate: { min: 2, max: 6, label: 'Moderate probability' },
  high: { min: 7, max: Infinity, label: 'High probability' },
} as const;
