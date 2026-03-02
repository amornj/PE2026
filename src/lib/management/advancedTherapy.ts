import { AdvancedTherapyPlan, TherapyRecommendation, COR, LOE } from '@/types/assessment';
import { PESubcategory } from '@/types/classification';

/**
 * Get advanced therapy recommendations based on PE category.
 * Maps each category to evidence-based COR/LOE for each intervention.
 */
export function getAdvancedTherapyRecommendations(
  category: PESubcategory
): AdvancedTherapyPlan {
  switch (category) {
    case 'A1':
    case 'B1':
    case 'B2':
      return lowRiskTherapy();
    case 'C1':
      return c1Therapy();
    case 'C2':
      return c2Therapy();
    case 'C3':
      return c3Therapy();
    case 'D1':
    case 'D2':
      return dTherapy();
    case 'E1':
      return e1Therapy();
    case 'E2':
      return e2Therapy();
    default:
      return lowRiskTherapy();
  }
}

function makeRec(
  recommended: boolean,
  cor: COR,
  loe: LOE,
  notes: string
): TherapyRecommendation {
  return { recommended, cor, loe, notes };
}

function lowRiskTherapy(): AdvancedTherapyPlan {
  return {
    systemicLysis: makeRec(false, '3-harm', 'B-R', 'Systemic thrombolysis is harmful in low-risk PE.'),
    cdl: makeRec(false, '3-no-benefit', 'C-EO', 'Catheter-directed therapy offers no benefit in low-risk PE.'),
    mechanicalThrombectomy: makeRec(false, '3-no-benefit', 'C-EO', 'Mechanical thrombectomy offers no benefit in low-risk PE.'),
    surgicalEmbolectomy: makeRec(false, '3-no-benefit', 'C-EO', 'Surgical embolectomy offers no benefit in low-risk PE.'),
    ecmo: makeRec(false, '3-no-benefit', 'C-EO', 'ECMO is not indicated in low-risk PE.'),
  };
}

function c1Therapy(): AdvancedTherapyPlan {
  return {
    systemicLysis: makeRec(false, '3-harm', 'B-R', 'Systemic thrombolysis is harmful without hemodynamic compromise or RV strain.'),
    cdl: makeRec(false, '3-no-benefit', 'C-EO', 'No benefit without RV dysfunction or biomarker elevation.'),
    mechanicalThrombectomy: makeRec(false, '3-no-benefit', 'C-EO', 'No benefit without RV dysfunction or biomarker elevation.'),
    surgicalEmbolectomy: makeRec(false, '3-no-benefit', 'C-EO', 'No benefit without hemodynamic compromise.'),
    ecmo: makeRec(false, '3-no-benefit', 'C-EO', 'ECMO is not indicated without hemodynamic failure.'),
  };
}

function c2Therapy(): AdvancedTherapyPlan {
  return {
    systemicLysis: makeRec(false, '3-harm', 'B-R', 'Routine systemic thrombolysis is harmful. May reconsider only if deteriorating.'),
    cdl: makeRec(false, '2b', 'B-NR', 'May be considered if clinical deterioration occurs. PERT consultation recommended.'),
    mechanicalThrombectomy: makeRec(false, '2b', 'B-NR', 'May be considered if clinical deterioration occurs. PERT consultation recommended.'),
    surgicalEmbolectomy: makeRec(false, '3-no-benefit', 'C-EO', 'No benefit at this stage.'),
    ecmo: makeRec(false, '3-no-benefit', 'C-EO', 'ECMO is not indicated without hemodynamic failure.'),
  };
}

function c3Therapy(): AdvancedTherapyPlan {
  return {
    systemicLysis: makeRec(false, '2b', 'B-R', 'May be considered if signs of clinical deterioration. Close monitoring required.'),
    cdl: makeRec(false, '2b', 'B-NR', 'May be considered. PERT consultation recommended for this highest-risk submassive group.'),
    mechanicalThrombectomy: makeRec(false, '2b', 'B-NR', 'May be considered. PERT consultation recommended.'),
    surgicalEmbolectomy: makeRec(false, '3-no-benefit', 'C-EO', 'No benefit unless deterioration to hemodynamic instability.'),
    ecmo: makeRec(false, '3-no-benefit', 'C-EO', 'ECMO is not indicated without hemodynamic failure.'),
  };
}

function dTherapy(): AdvancedTherapyPlan {
  return {
    systemicLysis: makeRec(true, '2b', 'B-R', 'May be considered for hemodynamically significant PE.'),
    cdl: makeRec(true, '2b', 'B-NR', 'May be considered if institutional expertise available.'),
    mechanicalThrombectomy: makeRec(true, '2b', 'B-NR', 'May be considered if institutional expertise available.'),
    surgicalEmbolectomy: makeRec(true, '2b', 'C-LD', 'May be considered if other interventions fail or unavailable.'),
    ecmo: makeRec(false, '3-no-benefit', 'C-EO', 'ECMO may be considered if progressing to refractory shock.'),
  };
}

function e1Therapy(): AdvancedTherapyPlan {
  return {
    systemicLysis: makeRec(true, '2a', 'B-R', 'Reasonable as first-line reperfusion in cardiogenic shock.'),
    cdl: makeRec(true, '2a', 'B-NR', 'Reasonable if interventional expertise available. Consider as alternative to systemic lysis.'),
    mechanicalThrombectomy: makeRec(true, '2a', 'B-NR', 'Reasonable if interventional expertise available.'),
    surgicalEmbolectomy: makeRec(true, '2a', 'C-LD', 'Reasonable if cardiac surgical expertise available.'),
    ecmo: makeRec(false, '2b', 'C-LD', 'May be considered as bridge to definitive therapy if deteriorating.'),
  };
}

function e2Therapy(): AdvancedTherapyPlan {
  return {
    systemicLysis: makeRec(true, '2a', 'C-LD', 'Reasonable during cardiac arrest. Administer during CPR.'),
    cdl: makeRec(false, '3-no-benefit', 'C-EO', 'Not applicable during active cardiac arrest. Reconsider post-ROSC.'),
    mechanicalThrombectomy: makeRec(false, '3-no-benefit', 'C-EO', 'Not applicable during active cardiac arrest. Reconsider post-ROSC.'),
    surgicalEmbolectomy: makeRec(false, '3-no-benefit', 'C-EO', 'Not applicable during active cardiac arrest. Reconsider post-ROSC.'),
    ecmo: makeRec(true, '2a', 'C-LD', 'ECMO should be considered for refractory arrest or post-ROSC hemodynamic support.'),
  };
}
