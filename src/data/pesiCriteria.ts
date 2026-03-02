import { ScoreCriterion } from '@/types/scores';

export const PESI_CRITERIA: ScoreCriterion[] = [
  {
    id: 'male',
    label: 'Male sex',
    points: 10,
  },
  {
    id: 'cancer',
    label: 'Cancer',
    points: 30,
    description: 'Active or diagnosed within past 6 months',
  },
  {
    id: 'heartFailure',
    label: 'Heart failure',
    points: 10,
  },
  {
    id: 'chronicLung',
    label: 'Chronic lung disease',
    points: 10,
  },
  {
    id: 'heartRateGte110',
    label: 'Heart rate ≥ 110 bpm',
    points: 20,
  },
  {
    id: 'sbpLt100',
    label: 'Systolic BP < 100 mmHg',
    points: 30,
  },
  {
    id: 'rrGte30',
    label: 'Respiratory rate ≥ 30/min',
    points: 20,
  },
  {
    id: 'tempLt36',
    label: 'Temperature < 36°C',
    points: 20,
  },
  {
    id: 'alteredMental',
    label: 'Altered mental status',
    points: 60,
    description: 'Disorientation, lethargy, stupor, or coma',
  },
  {
    id: 'spo2Lt90',
    label: 'SpO2 < 90%',
    points: 20,
  },
];

export const PESI_CLASSES = [
  { class: 1 as const, min: 0, max: 65, label: 'Class I (Very low risk)', mortality: '0-1.6%' },
  { class: 2 as const, min: 66, max: 85, label: 'Class II (Low risk)', mortality: '1.7-3.5%' },
  { class: 3 as const, min: 86, max: 105, label: 'Class III (Intermediate risk)', mortality: '3.2-7.1%' },
  { class: 4 as const, min: 106, max: 125, label: 'Class IV (High risk)', mortality: '4.0-11.4%' },
  { class: 5 as const, min: 126, max: Infinity, label: 'Class V (Very high risk)', mortality: '10.0-24.5%' },
] as const;
