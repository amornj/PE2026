import { ScoreCriterion } from '@/types/scores';

export const HESTIA_CRITERIA: ScoreCriterion[] = [
  {
    id: 'hemodynamicallyUnstable',
    label: 'Hemodynamically unstable',
    points: 1,
    description: 'SBP <100, HR >100, ICU admission needed, or vasopressor required',
  },
  {
    id: 'lysisOrEmbolectomy',
    label: 'Thrombolysis or embolectomy needed',
    points: 1,
  },
  {
    id: 'activeBleedingRisk',
    label: 'Active bleeding or high risk of bleeding',
    points: 1,
    description: 'GI bleed or surgery within 2 weeks, stroke within 1 month, bleeding disorder, thrombocytopenia <75,000',
  },
  {
    id: 'oxygenOver24h',
    label: '>24 hours of supplemental O2 needed to maintain SpO2 >90%',
    points: 1,
  },
  {
    id: 'peOnAnticoag',
    label: 'PE diagnosed while on therapeutic anticoagulation',
    points: 1,
  },
  {
    id: 'severePainIV',
    label: 'Severe pain needing IV analgesics for >24 hours',
    points: 1,
  },
  {
    id: 'crclLt30',
    label: 'Creatinine clearance < 30 mL/min',
    points: 1,
  },
  {
    id: 'severeLiverDisease',
    label: 'Severe liver impairment',
    points: 1,
    description: 'Cirrhosis or elevated transaminases >2x ULN',
  },
  {
    id: 'pregnant',
    label: 'Pregnant',
    points: 1,
  },
  {
    id: 'hit',
    label: 'Documented history of HIT',
    points: 1,
    description: 'Heparin-induced thrombocytopenia',
  },
  {
    id: 'socialOrMedical',
    label: 'Social or medical reason for hospital admission',
    points: 1,
    description: 'Inability to arrange outpatient follow-up or patient preference',
  },
];
