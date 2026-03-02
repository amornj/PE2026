import { ScoreCriterion } from '@/types/scores';

export const GENEVA_CRITERIA: ScoreCriterion[] = [
  {
    id: 'priorDvtPe',
    label: 'Previous DVT or PE',
    points: 3,
  },
  {
    id: 'heartRate75to94',
    label: 'Heart rate 75-94 bpm',
    points: 3,
  },
  {
    id: 'heartRate95plus',
    label: 'Heart rate ≥ 95 bpm',
    points: 5,
    description: 'Mutually exclusive with HR 75-94',
  },
  {
    id: 'surgeryFracture',
    label: 'Surgery or fracture within 1 month',
    points: 2,
  },
  {
    id: 'activeCancer',
    label: 'Active malignancy (or considered cured < 1 year)',
    points: 2,
  },
  {
    id: 'unilateralLegPain',
    label: 'Unilateral lower-limb pain',
    points: 3,
  },
  {
    id: 'legPalpationEdema',
    label: 'Pain on lower-limb deep venous palpation and unilateral edema',
    points: 4,
  },
  {
    id: 'hemoptysis',
    label: 'Hemoptysis',
    points: 2,
  },
  {
    id: 'ageOver65',
    label: 'Age > 65 years',
    points: 1,
  },
];

export const GENEVA_THREE_TIER = {
  low: { min: 0, max: 3, label: 'Low probability' },
  intermediate: { min: 4, max: 10, label: 'Intermediate probability' },
  high: { min: 11, max: Infinity, label: 'High probability' },
} as const;
