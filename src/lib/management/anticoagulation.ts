import { AnticoagulationPlan, SpecialPopulation } from '@/types/assessment';
import { PESubcategory } from '@/types/classification';
import { ANTICOAGULATION_OPTIONS } from '@/data/anticoagulationOptions';

/**
 * Get anticoagulation recommendation based on PE category and special populations.
 * DOACs (apixaban/rivaroxaban) are preferred for most patients.
 * Special populations may require LMWH, UFH, or warfarin.
 */
export function getAnticoagRecommendation(
  category: PESubcategory,
  specialPopulations: SpecialPopulation[]
): AnticoagulationPlan {
  const contraindicationNotes: string[] = [];

  // Determine initial agent based on category and special populations
  const needsParenteral = needsParenteralAnticoag(category, specialPopulations);
  const initialAgent = selectInitialAgent(specialPopulations, needsParenteral);
  const maintenanceAgent = selectMaintenanceAgent(specialPopulations);

  // Add population-specific notes
  for (const pop of specialPopulations) {
    const notes = getPopulationNotes(pop);
    contraindicationNotes.push(...notes);
  }

  // Category-specific notes
  if (category === 'E1' || category === 'E2' || category === 'D1' || category === 'D2') {
    contraindicationNotes.push(
      'UFH preferred in hemodynamically unstable patients for short half-life and reversibility.'
    );
  }

  return {
    initialAgent,
    maintenanceAgent,
    specialPopulation: specialPopulations,
    contraindicationNotes,
  };
}

function needsParenteralAnticoag(
  category: PESubcategory,
  specialPopulations: SpecialPopulation[]
): boolean {
  // Hemodynamically unstable -> UFH preferred
  if (['D1', 'D2', 'E1', 'E2'].includes(category)) {
    return true;
  }

  // Pregnancy -> LMWH required
  if (specialPopulations.includes('pregnancy')) {
    return true;
  }

  // Severe renal impairment -> UFH may be needed
  if (specialPopulations.includes('renalImpairment')) {
    return true;
  }

  return false;
}

function selectInitialAgent(
  specialPopulations: SpecialPopulation[],
  needsParenteral: boolean
): string {
  if (specialPopulations.includes('pregnancy') || specialPopulations.includes('breastfeeding')) {
    return 'enoxaparin';
  }

  if (specialPopulations.includes('renalImpairment')) {
    return 'ufh';
  }

  if (needsParenteral) {
    return 'ufh';
  }

  // Default: DOAC (apixaban preferred for simpler dosing)
  if (specialPopulations.includes('cancer')) {
    return 'apixaban';
  }

  if (specialPopulations.includes('aps')) {
    return 'enoxaparin'; // Bridge to warfarin for APS
  }

  return 'apixaban';
}

function selectMaintenanceAgent(specialPopulations: SpecialPopulation[]): string {
  if (specialPopulations.includes('pregnancy') || specialPopulations.includes('breastfeeding')) {
    return 'enoxaparin';
  }

  if (specialPopulations.includes('aps')) {
    return 'warfarin';
  }

  if (specialPopulations.includes('cancer')) {
    return 'apixaban';
  }

  return 'apixaban';
}

function getPopulationNotes(population: SpecialPopulation): string[] {
  switch (population) {
    case 'cancer':
      return [
        'DOAC (apixaban or rivaroxaban) or LMWH preferred for cancer-associated VTE.',
        'Rivaroxaban: caution with GI/GU malignancies (higher mucosal bleeding risk).',
      ];
    case 'pregnancy':
      return [
        'LMWH is the only recommended anticoagulant during pregnancy.',
        'DOACs and warfarin are contraindicated.',
        'Weight-based dosing with anti-Xa monitoring.',
      ];
    case 'breastfeeding':
      return [
        'LMWH and warfarin are compatible with breastfeeding.',
        'DOACs: insufficient data; avoid if possible.',
      ];
    case 'aps':
      return [
        'Warfarin is the preferred anticoagulant for antiphospholipid syndrome.',
        'DOACs are contraindicated in APS (TRAPS trial).',
      ];
    case 'renalImpairment':
      return [
        'CrCl < 30 mL/min: UFH preferred (no renal clearance).',
        'CrCl 30-50 mL/min: LMWH with dose reduction, or reduced-dose DOAC with caution.',
        'Monitor anti-Xa levels if using LMWH with renal impairment.',
      ];
    case 'liverDisease':
      return [
        'Avoid DOACs in severe hepatic impairment (Child-Pugh C).',
        'LMWH or UFH preferred. Monitor closely for bleeding.',
      ];
    case 'obesity':
      return [
        'DOACs may be used with BMI > 40 or weight > 120 kg with drug-level monitoring.',
        'LMWH: weight-based dosing; consider anti-Xa monitoring if weight > 150 kg.',
      ];
    case 'elderly':
      return [
        'Increased bleeding risk. Careful risk-benefit assessment.',
        'Renal function must be assessed and monitored.',
      ];
    default:
      return [];
  }
}

/**
 * Get all available anticoagulation options with their details.
 */
export function getAnticoagOptions() {
  return ANTICOAGULATION_OPTIONS;
}
