'use client';

import { useMemo } from 'react';
import { ClipboardList } from 'lucide-react';
import { useAssessmentStore } from '@/store/assessmentStore';
import { cn } from '@/lib/utils';
import type { WizardStep } from '@/types/assessment';

interface StepSummaryBoxProps {
  step: WizardStep;
}

/* ───────── colour map per step ───────── */
const STEP_STYLE: Record<WizardStep, { border: string; bg: string; icon: string; title: string }> = {
  evaluation:      { border: 'border-blue-300',   bg: 'bg-blue-50',    icon: 'text-blue-600',   title: 'Evaluation Summary' },
  stratification:  { border: 'border-amber-300',  bg: 'bg-amber-50',   icon: 'text-amber-600',  title: 'Stratification Summary' },
  management:      { border: 'border-purple-300', bg: 'bg-purple-50',  icon: 'text-purple-600', title: 'Management Summary' },
  followup:        { border: 'border-teal-300',   bg: 'bg-teal-50',    icon: 'text-teal-600',   title: 'Follow-up Summary' },
};

/* ───────── helper: join list naturally ───────── */
function naturalList(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  return items.slice(0, -1).join(', ') + ' and ' + items[items.length - 1];
}

/* ───────── summary generators per step ───────── */

function useEvaluationSummary(): string[] {
  const { suspicion, wellsScore, genevaScore, percResult, dDimer, yearsAlgorithm, peConfirmed } =
    useAssessmentStore((s) => s.evaluation);

  return useMemo(() => {
    const lines: string[] = [];
    const prob = suspicion.clinicalProbability;

    if (!prob) {
      lines.push('Complete the clinical suspicion and pre-test probability assessment to generate a summary.');
      return lines;
    }

    // Symptoms & risk factors
    const sxCount = suspicion.symptoms.length;
    const rfCount = suspicion.riskFactors.length;
    if (sxCount > 0 || rfCount > 0) {
      lines.push(
        `Patient presents with ${sxCount} symptom${sxCount !== 1 ? 's' : ''} and ${rfCount} risk factor${rfCount !== 1 ? 's' : ''} for PE.`,
      );
    }

    // PTP
    const tierLabel = prob === 'low' ? 'low (<15%)' : prob === 'intermediate' ? 'intermediate (15–50%)' : 'high (>50%)';
    const scores: string[] = [];
    if (wellsScore) scores.push(`Wells ${wellsScore.total}`);
    if (genevaScore) scores.push(`Geneva ${genevaScore.total}`);
    lines.push(
      `Pre-test probability is ${tierLabel}${scores.length ? ` (${scores.join(', ')})` : ''}.`,
    );

    // Pathway followed
    if (prob === 'low') {
      if (percResult) {
        if (percResult.allAbsent) {
          lines.push('PERC is NEGATIVE (all 8 criteria absent) — PE can be safely ruled out without further testing.');
        } else {
          lines.push(`PERC is POSITIVE (${percResult.total} criterion/criteria present) — cannot rule out PE by PERC alone, proceed to D-dimer.`);
        }
      } else {
        lines.push('Per guideline, PERC rule should be assessed first for low PTP.');
      }
    } else if (prob === 'intermediate') {
      lines.push('Per guideline, D-dimer and YEARS algorithm were applied.');
    } else {
      lines.push('Per guideline, the patient should proceed directly to diagnostic imaging (D-dimer should NOT be used to exclude PE).');
    }

    // D-dimer
    if (dDimer) {
      const val = dDimer.value != null ? `${dDimer.value} ${dDimer.unit}` : 'value entered';
      const thresh = `age-adjusted threshold ${dDimer.ageAdjustedThreshold} ${dDimer.unit}`;
      lines.push(
        dDimer.isPositive
          ? `D-dimer is POSITIVE (${val}, above ${thresh}) — further imaging required.`
          : `D-dimer is NEGATIVE (${val}, below ${thresh}).`,
      );
    }

    // YEARS
    if (yearsAlgorithm) {
      const yItems = yearsAlgorithm.yearsItemCount;
      lines.push(
        yearsAlgorithm.peExcluded
          ? `YEARS algorithm (${yItems} item${yItems !== 1 ? 's' : ''} positive): PE safely EXCLUDED.`
          : `YEARS algorithm (${yItems} item${yItems !== 1 ? 's' : ''} positive): PE NOT excluded — imaging indicated.`,
      );
    }

    // PE confirmed
    if (peConfirmed === true) {
      lines.push('PE is CONFIRMED on imaging. Proceed to risk stratification.');
    } else if (peConfirmed === false) {
      lines.push('PE is EXCLUDED on imaging. Consider alternative diagnoses.');
    }

    return lines;
  }, [suspicion, wellsScore, genevaScore, percResult, dDimer, yearsAlgorithm, peConfirmed]);
}

function useStratificationSummary(): string[] {
  const { classificationInput, category, pesiResult, spesiResult } =
    useAssessmentStore((s) => s.stratification);

  return useMemo(() => {
    const lines: string[] = [];
    const hemo = classificationInput.hemodynamics;

    if (!category) {
      lines.push('Complete hemodynamic assessment and severity scoring to determine PE category.');
      return lines;
    }

    // Hemodynamics
    const hemoFindings: string[] = [];
    if (hemo.cardiacArrest) hemoFindings.push('cardiac arrest');
    if (hemo.refractoryShock) hemoFindings.push('refractory shock');
    if (hemo.cardiogenicShock) hemoFindings.push('cardiogenic shock (SCAI C)');
    if (hemo.hypotension) hemoFindings.push('sustained hypotension');
    if (hemo.transientHypotension) hemoFindings.push('transient hypotension');
    if (hemo.endOrganDysfunction) hemoFindings.push('end-organ dysfunction');

    if (hemoFindings.length > 0) {
      lines.push(`Hemodynamically UNSTABLE: ${naturalList(hemoFindings)}.`);
    } else {
      lines.push('Patient is hemodynamically STABLE.');
    }

    // Incidental vs symptomatic
    if (classificationInput.isIncidental) {
      lines.push('PE was incidentally discovered (asymptomatic).');
    }
    if (classificationInput.isSubsegmental) {
      lines.push('PE involves subsegmental arteries only.');
    }

    // PESI / sPESI
    const scoreItems: string[] = [];
    if (pesiResult) {
      scoreItems.push(`PESI ${pesiResult.total}, Class ${pesiResult.class} (${pesiResult.interpretation})`);
    }
    if (spesiResult) {
      scoreItems.push(`sPESI ${spesiResult.total} (${spesiResult.total === 0 ? 'low risk' : 'elevated risk'})`);
    }
    if (scoreItems.length > 0) {
      lines.push(`Severity scores: ${scoreItems.join(', ')}.`);
    }

    // Biomarkers
    const bioFindings: string[] = [];
    if (classificationInput.biomarkers.troponinElevated) bioFindings.push('troponin');
    if (classificationInput.biomarkers.bnpElevated) bioFindings.push('BNP/NT-proBNP');
    if (classificationInput.biomarkers.lactateElevated) bioFindings.push('lactate');
    if (bioFindings.length > 0) {
      lines.push(`Elevated biomarkers: ${naturalList(bioFindings)}.`);
    }

    // RV
    const rvFindings: string[] = [];
    if (classificationInput.rv.rvDysfunction) rvFindings.push('RV dysfunction');
    if (classificationInput.rv.rvDilated) rvFindings.push('RV dilation');
    if (classificationInput.rv.mcConnellSign) rvFindings.push('McConnell sign');
    if (rvFindings.length > 0) {
      lines.push(`RV assessment: ${naturalList(rvFindings)} present.`);
    }

    // Respiratory
    const respFindings: string[] = [];
    if (classificationInput.respiratory.intubated) respFindings.push('intubated');
    if (classificationInput.respiratory.positivePresVent) respFindings.push('positive-pressure ventilation');
    if (classificationInput.respiratory.highFlowNC) respFindings.push('high-flow nasal cannula');
    if (classificationInput.respiratory.nonRebreather) respFindings.push('non-rebreather mask');
    if (respFindings.length > 0) {
      lines.push(`Respiratory support: ${naturalList(respFindings)}.`);
    }

    // Category assignment
    lines.push(
      `Based on the above, this patient is classified as Category ${category.displayLabel} — ${category.description}.`,
    );

    if (category.rModifier) {
      lines.push('(R) modifier applied due to respiratory compromise — consider escalation.');
    }

    return lines;
  }, [classificationInput, category, pesiResult, spesiResult]);
}

function useManagementSummary(): string[] {
  const category = useAssessmentStore((s) => s.stratification.category);
  const management = useAssessmentStore((s) => s.management);

  return useMemo(() => {
    const lines: string[] = [];

    if (!category) {
      lines.push('Complete risk stratification first. Management recommendations depend on PE category.');
      return lines;
    }

    lines.push(`Managing as Category ${category.displayLabel} PE.`);

    // Anticoagulation
    const ac = management.anticoagulation;
    if (ac.initialAgent || ac.maintenanceAgent) {
      const parts: string[] = [];
      if (ac.initialAgent) parts.push(`initial: ${ac.initialAgent}`);
      if (ac.maintenanceAgent) parts.push(`maintenance: ${ac.maintenanceAgent}`);
      lines.push(`Anticoagulation plan — ${parts.join('; ')}.`);
    } else {
      lines.push('Anticoagulation agent selection pending.');
    }

    // Special populations
    if (ac.specialPopulation.length > 0) {
      const popLabels: Record<string, string> = {
        cancer: 'active cancer', pregnancy: 'pregnancy', breastfeeding: 'breastfeeding',
        aps: 'antiphospholipid syndrome', renalImpairment: 'renal impairment',
        liverDisease: 'liver disease', obesity: 'obesity', elderly: 'elderly',
      };
      const pops = ac.specialPopulation.map((p) => popLabels[p] || p);
      lines.push(`Special population considerations: ${naturalList(pops)}.`);
    }

    // Advanced therapies
    const at = management.advancedTherapy;
    const recommended: string[] = [];
    if (at.systemicLysis.recommended) recommended.push('systemic thrombolysis');
    if (at.cdl.recommended) recommended.push('catheter-directed lysis');
    if (at.mechanicalThrombectomy.recommended) recommended.push('mechanical thrombectomy');
    if (at.surgicalEmbolectomy.recommended) recommended.push('surgical embolectomy');
    if (at.ecmo.recommended) recommended.push('ECMO');

    if (recommended.length > 0) {
      lines.push(`Advanced therapies recommended: ${naturalList(recommended)}.`);
    } else if (['D', 'E'].includes(category.letter)) {
      lines.push('Advanced therapy options should be considered given hemodynamic instability. Review recommendations above.');
    } else {
      lines.push('No advanced therapies indicated for this category.');
    }

    // PERT
    if (management.pertActivated) {
      lines.push('PERT (Pulmonary Embolism Response Team) has been activated.');
    } else if (['C', 'D', 'E'].includes(category.letter)) {
      lines.push('Consider PERT activation for multidisciplinary decision-making.');
    }

    // IVC filter
    if (management.ivcFilterIndicated) {
      lines.push('IVC filter is indicated (absolute contraindication to anticoagulation or recurrent PE despite adequate anticoagulation).');
    } else if (management.ivcFilterConsidered) {
      lines.push('IVC filter was considered but not indicated at this time.');
    }

    return lines;
  }, [category, management]);
}

function useFollowupSummary(): string[] {
  const category = useAssessmentStore((s) => s.stratification.category);
  const followup = useAssessmentStore((s) => s.followup);

  return useMemo(() => {
    const lines: string[] = [];

    if (!category) {
      lines.push('Complete earlier steps to generate follow-up recommendations.');
      return lines;
    }

    // Anticoag duration
    const dur = followup.anticoagDuration;
    const riskLabels: Record<string, string> = {
      'major-reversible': 'major reversible/surgical provocation',
      'minor-reversible': 'minor reversible provocation',
      persistent: 'persistent risk factor (e.g., cancer, autoimmune)',
      unprovoked: 'unprovoked PE',
    };
    lines.push(
      `This PE event is categorized as ${riskLabels[dur.riskCategory] || dur.riskCategory}.`,
    );

    if (dur.recommendedDuration) {
      lines.push(`Recommended anticoagulation duration: ${dur.recommendedDuration}.`);
    } else {
      // Provide default guidance
      if (dur.riskCategory === 'major-reversible') {
        lines.push('Guideline suggests 3 months of anticoagulation for major reversible provocation.');
      } else if (dur.riskCategory === 'minor-reversible') {
        lines.push('Guideline suggests 3 months minimum; consider extended phase based on bleeding risk.');
      } else if (dur.riskCategory === 'persistent') {
        lines.push('Extended (indefinite) anticoagulation is generally recommended while the risk factor persists.');
      } else {
        lines.push('Unprovoked PE typically warrants consideration of extended-phase anticoagulation beyond 3 months.');
      }
    }

    if (dur.extendedPhase) {
      lines.push(
        dur.halfDoseEligible
          ? 'Patient may be eligible for half-dose DOAC in the extended phase (after initial 6 months, if low bleeding risk).'
          : 'Extended-phase anticoagulation recommended at full dose.',
      );
    }

    // CTEPD
    const ctepd = followup.ctephdScreening;
    if (ctepd.persistentDyspnea || ctepd.functionalLimitation) {
      lines.push('Persistent dyspnea or functional limitation detected — screen for CTEPD (chronic thromboembolic pulmonary disease).');
    }
    if (ctepd.referralIndicated) {
      lines.push('Referral to a CTEPD expert center is indicated for further evaluation (V/Q scan, right heart catheterization).');
    } else {
      lines.push(`CTEPD screening interval: ${ctepd.screeningInterval}.`);
    }

    // Checklists
    const w1 = followup.oneWeekChecklist.length;
    const m3 = followup.threeMonthChecklist.length;
    if (w1 > 0 || m3 > 0) {
      lines.push(`Follow-up checklists: ${w1} item${w1 !== 1 ? 's' : ''} for 1-week visit, ${m3} item${m3 !== 1 ? 's' : ''} for 3-month visit.`);
    }

    return lines;
  }, [category, followup]);
}

/* ───────── the component ───────── */

export function StepSummaryBox({ step }: StepSummaryBoxProps) {
  const evalLines = useEvaluationSummary();
  const stratLines = useStratificationSummary();
  const mgmtLines = useManagementSummary();
  const fuLines = useFollowupSummary();

  const lines =
    step === 'evaluation' ? evalLines :
    step === 'stratification' ? stratLines :
    step === 'management' ? mgmtLines :
    fuLines;

  const style = STEP_STYLE[step];

  // Don't render if the only line is the placeholder prompt
  const isPlaceholder = lines.length === 1 && lines[0].startsWith('Complete');

  return (
    <div className={cn('rounded-lg border-2 p-4', style.border, style.bg)}>
      <div className="flex items-center gap-2 mb-3">
        <ClipboardList className={cn('h-5 w-5', style.icon)} />
        <h3 className={cn('text-sm font-bold uppercase tracking-wide', style.icon)}>
          {style.title}
        </h3>
      </div>
      {isPlaceholder ? (
        <p className="text-sm text-gray-500 italic">{lines[0]}</p>
      ) : (
        <ul className="space-y-1.5">
          {lines.map((line, i) => (
            <li key={i} className="flex gap-2 text-sm text-gray-800">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
