import { PESubcategory } from '@/types/classification';

export interface CategoryRule {
  subcategory: PESubcategory;
  label: string;
  criteria: string[];
}

export const CATEGORY_RULES: CategoryRule[] = [
  {
    subcategory: 'E2',
    label: 'Cardiac Arrest / Refractory Shock',
    criteria: [
      'Cardiac arrest (PEA, asystole, VF) attributed to PE',
      'Refractory shock not responding to maximal vasopressor/inotrope support',
    ],
  },
  {
    subcategory: 'E1',
    label: 'Cardiogenic Shock (SCAI Stage C)',
    criteria: [
      'Cardiogenic shock with SBP < 90 mmHg requiring vasopressors',
      'Signs of hypoperfusion (cold extremities, altered mentation, elevated lactate)',
      'SCAI shock stage C or higher',
    ],
  },
  {
    subcategory: 'D2',
    label: 'Persistent Hypotension + End-Organ Dysfunction',
    criteria: [
      'SBP < 90 mmHg for > 15 minutes, not responsive to IV fluids alone',
      'End-organ dysfunction: altered mental status, cool/mottled skin, oliguria, elevated lactate',
    ],
  },
  {
    subcategory: 'D1',
    label: 'Transient Hypotension',
    criteria: [
      'SBP < 90 mmHg that resolves with IV fluid resuscitation',
      'Transient hemodynamic instability without persistent end-organ dysfunction',
    ],
  },
  {
    subcategory: 'A1',
    label: 'Incidental / Asymptomatic PE',
    criteria: [
      'PE discovered incidentally on imaging performed for another indication',
      'Patient is asymptomatic or has no PE-attributable symptoms',
    ],
  },
  {
    subcategory: 'B1',
    label: 'Low-Risk Subsegmental PE',
    criteria: [
      'Symptomatic PE',
      'Subsegmental distribution',
      'PESI class I-II (score ≤ 85)',
      'sPESI = 0',
    ],
  },
  {
    subcategory: 'B2',
    label: 'Low-Risk Segmental+ PE',
    criteria: [
      'Symptomatic PE',
      'Segmental or more proximal distribution',
      'PESI class I-II (score ≤ 85)',
      'sPESI = 0',
    ],
  },
  {
    subcategory: 'C1',
    label: 'Elevated Risk, RV-/Trop-',
    criteria: [
      'Symptomatic PE',
      'PESI class III+ or sPESI ≥ 1',
      'No RV dysfunction',
      'No elevated troponin',
    ],
  },
  {
    subcategory: 'C2',
    label: 'Elevated Risk, RV+ OR Trop+',
    criteria: [
      'Symptomatic PE',
      'RV dysfunction OR elevated troponin (but NOT both)',
      'PESI class III+ or sPESI ≥ 1 (or presence of RV dysfunction/troponin elevation itself upgrades risk)',
    ],
  },
  {
    subcategory: 'C3',
    label: 'Elevated Risk, RV+ AND Trop+',
    criteria: [
      'Symptomatic PE',
      'BOTH RV dysfunction AND elevated troponin',
      'Highest risk submassive PE',
    ],
  },
];
