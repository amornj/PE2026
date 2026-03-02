import { PECategory, ClassificationInput, PESubcategory } from '@/types/classification';
import { CATEGORY_DEFINITIONS } from '@/data/categoryDefinitions';
import { assessRModifier } from './rModifier';

/**
 * Core PE classification algorithm.
 * Assigns a patient to category A1-E2 based on hemodynamic status,
 * RV function, biomarkers, symptom status, and clot burden.
 *
 * Classification hierarchy (evaluated top-down):
 * 1. Cardiac arrest or refractory shock -> E2
 * 2. Cardiogenic shock (SCAI C) -> E1
 * 3. Hypotension + end-organ dysfunction -> D2
 * 4. Transient hypotension (responds to fluids) -> D1
 * 5. Incidental/asymptomatic -> A1
 * 6. Symptomatic + low PESI/sPESI -> B1 (subsegmental) or B2 (segmental+)
 * 7. Symptomatic + elevated severity:
 *    - RV dysfunction AND troponin elevated -> C3
 *    - RV dysfunction OR troponin elevated -> C2
 *    - Neither -> C1
 * 8. R modifier applied based on respiratory status
 */
export function assignCategory(input: ClassificationInput): PECategory {
  const subcategory = determineSubcategory(input);
  const rModifier = assessRModifier(input.respiratory);

  const baseCategory = CATEGORY_DEFINITIONS[subcategory];

  return {
    ...baseCategory,
    rModifier,
    displayLabel: rModifier
      ? `${baseCategory.displayLabel} (R)`
      : baseCategory.displayLabel,
  };
}

function determineSubcategory(input: ClassificationInput): PESubcategory {
  const { hemodynamics, rv, biomarkers } = input;

  // Step 1: Cardiac arrest or refractory shock -> E2
  if (hemodynamics.cardiacArrest || hemodynamics.refractoryShock) {
    return 'E2';
  }

  // Step 2: Cardiogenic shock (SCAI stage C) -> E1
  if (hemodynamics.cardiogenicShock) {
    return 'E1';
  }

  // Step 3: Persistent hypotension + end-organ dysfunction -> D2
  if (hemodynamics.hypotension && hemodynamics.endOrganDysfunction) {
    return 'D2';
  }

  // Step 4: Transient hypotension (responds to fluids) -> D1
  if (hemodynamics.transientHypotension) {
    return 'D1';
  }

  // For non-hemodynamically compromised patients with any hypotension
  // but no end-organ dysfunction, still classify as D1
  if (hemodynamics.hypotension) {
    return 'D1';
  }

  // Step 5: Incidental / asymptomatic -> A1
  if (input.isIncidental || !input.isSymptomatic) {
    return 'A1';
  }

  // Step 6: Symptomatic - check PESI / sPESI for low risk
  const isLowRisk = isLowRiskByScores(input);

  if (isLowRisk) {
    // B1 for subsegmental, B2 for segmental or more proximal
    return input.isSubsegmental ? 'B1' : 'B2';
  }

  // Step 7: Symptomatic with elevated severity markers
  const hasRVDysfunction = rv.rvDysfunction || rv.rvDilated || rv.mcConnellSign ||
    (rv.rvLvRatio != null && rv.rvLvRatio >= 1.0) ||
    (rv.tapse != null && rv.tapse < 1.6);
  const hasTroponin = biomarkers.troponinElevated;

  if (hasRVDysfunction && hasTroponin) {
    return 'C3';
  }

  if (hasRVDysfunction || hasTroponin) {
    return 'C2';
  }

  return 'C1';
}

/**
 * Determine if patient is low-risk based on PESI and sPESI scores.
 * Low risk = PESI class I-II (score <= 85) AND sPESI = 0
 */
function isLowRiskByScores(input: ClassificationInput): boolean {
  const { pesiScore, spesiScore } = input;

  // If scores are not available, cannot classify as low risk
  if (pesiScore == null && spesiScore == null) {
    return false;
  }

  // If PESI provided, must be class I-II (<=85)
  if (pesiScore != null && pesiScore > 85) {
    return false;
  }

  // If sPESI provided, must be 0
  if (spesiScore != null && spesiScore > 0) {
    return false;
  }

  return true;
}
