import { FollowUpData, AnticoagDuration, CTEPDScreening } from '@/types/assessment';
import { PESubcategory } from '@/types/classification';
import { FOLLOWUP_SCHEDULE } from '@/data/followupSchedule';
import { ANTICOAG_DURATION_RULES } from '@/data/anticoagDuration';

export interface FollowUpInput {
  riskCategory: AnticoagDuration['riskCategory'];
  persistentDyspnea: boolean;
  functionalLimitation: boolean;
}

/**
 * Generate a follow-up plan based on PE category and risk factors.
 */
export function getFollowUpPlan(
  category: PESubcategory,
  input: FollowUpInput
): FollowUpData {
  const oneWeekChecklist = getOneWeekChecklist(category);
  const threeMonthChecklist = getThreeMonthChecklist(category);
  const anticoagDuration = getAnticoagDuration(input.riskCategory);
  const ctephdScreening = getCTEPDScreening(input.persistentDyspnea, input.functionalLimitation);

  return {
    oneWeekChecklist,
    threeMonthChecklist,
    anticoagDuration,
    ctephdScreening,
  };
}

function getOneWeekChecklist(category: PESubcategory): string[] {
  const base = FOLLOWUP_SCHEDULE[0].checklist;

  const additions: string[] = [];
  if (['D1', 'D2', 'E1', 'E2'].includes(category)) {
    additions.push('Assess for post-ICU recovery and functional status');
    additions.push('Reassess hemodynamic stability off vasopressors');
  }
  if (['C2', 'C3'].includes(category)) {
    additions.push('Repeat echocardiography if RV dysfunction at diagnosis');
    additions.push('Repeat troponin to confirm downtrending');
  }

  return [...base, ...additions];
}

function getThreeMonthChecklist(category: PESubcategory): string[] {
  const base = FOLLOWUP_SCHEDULE[1].checklist;

  const additions: string[] = [];
  if (['C3', 'D1', 'D2', 'E1', 'E2'].includes(category)) {
    additions.push('Formal exercise capacity assessment (6MWT or CPET)');
    additions.push('Consider V/Q scan for CTEPD screening');
  }

  return [...base, ...additions];
}

function getAnticoagDuration(
  riskCategory: AnticoagDuration['riskCategory']
): AnticoagDuration {
  const rule = ANTICOAG_DURATION_RULES.find(r => r.riskCategory === riskCategory);

  if (!rule) {
    return {
      riskCategory: 'unprovoked',
      recommendedDuration: 'Extended (indefinite)',
      extendedPhase: true,
      halfDoseEligible: true,
    };
  }

  return {
    riskCategory: rule.riskCategory,
    recommendedDuration: rule.recommendedDuration,
    extendedPhase: rule.extendedPhaseOption,
    halfDoseEligible: rule.halfDoseOption,
  };
}

function getCTEPDScreening(
  persistentDyspnea: boolean,
  functionalLimitation: boolean
): CTEPDScreening {
  const referralIndicated = persistentDyspnea || functionalLimitation;

  return {
    persistentDyspnea,
    functionalLimitation,
    referralIndicated,
    screeningInterval: referralIndicated
      ? 'Refer to CTEPH center for evaluation'
      : 'Screen at 3-6 months post-PE; sooner if symptoms develop',
  };
}
