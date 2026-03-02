import { ScoreCriterion } from '@/types/scores';

export const SPESI_CRITERIA: ScoreCriterion[] = [
  {
    id: 'ageOver80',
    label: 'Age > 80 years',
    points: 1,
  },
  {
    id: 'cancer',
    label: 'Active cancer',
    points: 1,
  },
  {
    id: 'cardiopulmonaryDisease',
    label: 'Chronic cardiopulmonary disease',
    points: 1,
    description: 'Chronic heart failure or chronic lung disease',
  },
  {
    id: 'heartRateGte110',
    label: 'Heart rate ≥ 110 bpm',
    points: 1,
  },
  {
    id: 'sbpLt100',
    label: 'Systolic BP < 100 mmHg',
    points: 1,
  },
  {
    id: 'spo2Lt90',
    label: 'SpO2 < 90%',
    points: 1,
  },
];
