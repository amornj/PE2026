'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAssessmentStore } from '@/store/assessmentStore';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { ClinicalSuspicionForm } from '@/components/assessment/ClinicalSuspicionForm';
import { PreTestProbabilityPanel, type PTPCriteriaState } from '@/components/assessment/PreTestProbabilityPanel';
import { PERCAssessment, type PTPSyncedFindings } from '@/components/assessment/PERCAssessment';
import { DDimerInterpreter } from '@/components/assessment/DDimerInterpreter';
import { YearsAlgorithm, type YEARSSyncedFromWells } from '@/components/assessment/YearsAlgorithm';
import { ImagingRecommendation } from '@/components/assessment/ImagingRecommendation';
import { ChevronRight, ArrowDown } from 'lucide-react';
import type { DDimerResult, YEARSResult, ImagingResult } from '@/types/assessment';
import type { WellsResult, GenevaResult } from '@/types/scores';
import type { PERCResult } from '@/lib/scoring/perc';

type ProbabilityTier = 'low' | 'intermediate' | 'high';

const TIER_CONFIG: Record<ProbabilityTier, { label: string; pct: string; color: string; border: string; bg: string }> = {
  low:          { label: 'Low',          pct: '<15%',    color: 'text-green-700', border: 'border-green-400', bg: 'bg-green-50' },
  intermediate: { label: 'Intermediate', pct: '15–50%',  color: 'text-amber-700', border: 'border-amber-400', bg: 'bg-amber-50' },
  high:         { label: 'High',         pct: '>50%',    color: 'text-red-700',   border: 'border-red-400',   bg: 'bg-red-50' },
};

export default function EvaluationPage() {
  const router = useRouter();
  const evaluation = useAssessmentStore((s) => s.evaluation);
  const updateEvaluation = useAssessmentStore((s) => s.updateEvaluation);
  const setStep = useAssessmentStore((s) => s.setStep);

  const [sharedDdimerValue, setSharedDdimerValue] = useState<number | undefined>(undefined);
  const [percResult, setPercResult] = useState<PERCResult | null>(null);
  const [ptpSynced, setPtpSynced] = useState<PTPSyncedFindings>({
    hemoptysis: false,
    priorDvtPe: false,
    unilateralLegSwelling: false,
    recentSurgeryTrauma: false,
    hrElevated: false,
    ageOver65: false,
  });
  const [yearsSynced, setYearsSynced] = useState<YEARSSyncedFromWells>({
    clinicalSignsDVT: false,
    hemoptysis: false,
    peIsLikelyDiagnosis: false,
  });

  const probability = evaluation.suspicion.clinicalProbability;

  // Map Wells/Geneva criteria → PERC + YEARS synced findings
  const handlePTPCriteriaChange = useCallback((criteria: PTPCriteriaState) => {
    const w = criteria.wellsCriteria;
    const g = criteria.genevaCriteria;
    setPtpSynced({
      hemoptysis: w.hemoptysis || g.hemoptysis,
      priorDvtPe: w.priorDvtPe || g.priorDvtPe,
      unilateralLegSwelling: w.dvtSymptoms || g.unilateralLegPain || g.legPalpationEdema,
      recentSurgeryTrauma: w.immobilization || g.surgeryFracture,
      hrElevated: w.heartRate || g.heartRate95plus,
      ageOver65: g.ageOver65,
    });
    setYearsSynced({
      clinicalSignsDVT: w.dvtSymptoms,
      hemoptysis: w.hemoptysis,
      peIsLikelyDiagnosis: w.peLikely,
    });
  }, []);

  // --- Handlers ---
  const handleSymptomsChange = useCallback(
    (symptoms: string[]) => {
      updateEvaluation({ suspicion: { ...evaluation.suspicion, symptoms } });
    },
    [evaluation.suspicion, updateEvaluation],
  );

  const handleRiskFactorsChange = useCallback(
    (riskFactors: string[]) => {
      updateEvaluation({ suspicion: { ...evaluation.suspicion, riskFactors } });
    },
    [evaluation.suspicion, updateEvaluation],
  );

  const handleWellsChange = useCallback(
    (result: WellsResult) => { updateEvaluation({ wellsScore: result }); },
    [updateEvaluation],
  );

  const handleGenevaChange = useCallback(
    (result: GenevaResult) => { updateEvaluation({ genevaScore: result }); },
    [updateEvaluation],
  );

  const handleProbabilityChange = useCallback(
    (p: ProbabilityTier) => {
      updateEvaluation({ suspicion: { ...evaluation.suspicion, clinicalProbability: p } });
    },
    [evaluation.suspicion, updateEvaluation],
  );

  const handleDdimerValueChange = useCallback(
    (value: number | undefined) => { setSharedDdimerValue(value); },
    [],
  );

  const handleDDimerChange = useCallback(
    (result: DDimerResult) => { updateEvaluation({ dDimer: result }); },
    [updateEvaluation],
  );

  const handleYearsChange = useCallback(
    (result: YEARSResult) => { updateEvaluation({ yearsAlgorithm: result }); },
    [updateEvaluation],
  );

  const handleImagingChange = useCallback(
    (imaging: Partial<ImagingResult>) => {
      updateEvaluation({ imaging: { ...evaluation.imaging, ...imaging } });
    },
    [evaluation.imaging, updateEvaluation],
  );

  const handlePEConfirmedChange = useCallback(
    (confirmed: boolean | null) => { updateEvaluation({ peConfirmed: confirmed }); },
    [updateEvaluation],
  );

  const handleNext = () => {
    setStep('stratification');
    router.push('/assessment/stratification');
  };

  // --- Derived state for branching ---
  const percNegative = percResult?.allAbsent === true;
  const showDdimer = probability === 'intermediate' || (probability === 'low' && !percNegative);
  const showImaging = probability === 'high'
    || (showDdimer && evaluation.dDimer?.isPositive)
    || (showDdimer && evaluation.yearsAlgorithm && !evaluation.yearsAlgorithm.peExcluded);
  const peExcludedByPerc = probability === 'low' && percNegative;
  const peExcludedByDdimer = showDdimer
    && ((evaluation.dDimer && !evaluation.dDimer.isPositive)
      || (evaluation.yearsAlgorithm?.peExcluded));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Step 1: Evaluation</h1>
        <p className="mt-1 text-gray-600">
          Assess clinical suspicion, quantify pre-test probability, and follow the diagnostic algorithm.
        </p>
      </div>

      {/* 1. Clinical suspicion */}
      <ClinicalSuspicionForm
        symptoms={evaluation.suspicion.symptoms}
        riskFactors={evaluation.suspicion.riskFactors}
        onSymptomsChange={handleSymptomsChange}
        onRiskFactorsChange={handleRiskFactorsChange}
      />

      {/* 2. Pre-test probability (Wells / Geneva) */}
      <PreTestProbabilityPanel
        wellsResult={evaluation.wellsScore}
        genevaResult={evaluation.genevaScore}
        onWellsChange={handleWellsChange}
        onGenevaChange={handleGenevaChange}
        onProbabilityChange={handleProbabilityChange}
        onCriteriaChange={handlePTPCriteriaChange}
      />

      {/* 3. Probability tier display + branching */}
      {probability && (
        <>
          {/* Tier indicator */}
          <div className={`rounded-lg border-2 p-4 ${TIER_CONFIG[probability].border} ${TIER_CONFIG[probability].bg}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-semibold ${TIER_CONFIG[probability].color}`}>
                  Clinical Probability
                </p>
                <p className={`text-2xl font-bold ${TIER_CONFIG[probability].color}`}>
                  {TIER_CONFIG[probability].label} ({TIER_CONFIG[probability].pct})
                </p>
              </div>
              <div className="flex gap-1">
                {(['low', 'intermediate', 'high'] as ProbabilityTier[]).map((tier) => (
                  <div
                    key={tier}
                    className={`h-3 w-10 rounded-full ${
                      tier === probability
                        ? tier === 'low' ? 'bg-green-500' : tier === 'intermediate' ? 'bg-amber-500' : 'bg-red-500'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className={`mt-2 text-sm ${TIER_CONFIG[probability].color}`}>
              {probability === 'low' && 'Assess PERC rule-out criteria. If all absent, PE can be excluded without further testing.'}
              {probability === 'intermediate' && 'Perform D-dimer testing and assess YEARS criteria (COR 2a).'}
              {probability === 'high' && 'Proceed directly to diagnostic imaging (COR 1). D-dimer should NOT be used to exclude PE.'}
            </p>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="h-6 w-6 text-gray-400" />
          </div>

          {/* LOW probability branch: PERC first */}
          {probability === 'low' && (
            <>
              <PERCAssessment onResult={setPercResult} syncedFromPTP={ptpSynced} />

              {peExcludedByPerc && (
                <Alert variant="success">
                  <strong>PE Excluded by PERC</strong>
                  <p className="mt-1 text-sm">
                    Very low clinical probability with all PERC criteria absent.
                    No further testing is recommended.
                  </p>
                </Alert>
              )}

              {percResult && !percNegative && (
                <>
                  <div className="flex justify-center">
                    <ArrowDown className="h-6 w-6 text-gray-400" />
                  </div>
                  <Alert variant="info">
                    PERC positive &mdash; proceed to D-dimer testing and YEARS assessment.
                  </Alert>
                </>
              )}
            </>
          )}

          {/* D-dimer + YEARS: shown for intermediate, or low with PERC positive */}
          {showDdimer && (
            <>
              <DDimerInterpreter
                result={evaluation.dDimer}
                ddimerValue={sharedDdimerValue}
                onDdimerValueChange={handleDdimerValueChange}
                onResultChange={handleDDimerChange}
              />

              <YearsAlgorithm
                result={evaluation.yearsAlgorithm}
                ddimerValue={sharedDdimerValue}
                onDdimerValueChange={handleDdimerValueChange}
                onResultChange={handleYearsChange}
                syncedFromWells={yearsSynced}
              />

              {peExcludedByDdimer && (
                <Alert variant="success">
                  <strong>PE Excluded</strong>
                  <p className="mt-1 text-sm">
                    {evaluation.yearsAlgorithm?.peExcluded
                      ? 'PE excluded by YEARS algorithm. No further imaging required.'
                      : 'Negative age-adjusted D-dimer with low/intermediate pre-test probability. PE can be safely excluded.'}
                  </p>
                </Alert>
              )}
            </>
          )}

          {/* HIGH probability or D-dimer/YEARS not excluding: Imaging */}
          {(probability === 'high' || showImaging) && !peExcludedByPerc && !peExcludedByDdimer && (
            <>
              <div className="flex justify-center">
                <ArrowDown className="h-6 w-6 text-gray-400" />
              </div>

              {probability === 'high' && (
                <Alert variant="warning">
                  <strong>High clinical probability (&gt;50%)</strong> &mdash; proceed directly to diagnostic
                  imaging. Do not use D-dimer to exclude PE (COR 1).
                </Alert>
              )}

              <ImagingRecommendation
                wellsResult={evaluation.wellsScore}
                genevaResult={evaluation.genevaScore}
                ddimerResult={evaluation.dDimer}
                yearsResult={evaluation.yearsAlgorithm}
                imaging={evaluation.imaging}
                peConfirmed={evaluation.peConfirmed}
                onImagingChange={handleImagingChange}
                onPEConfirmedChange={handlePEConfirmedChange}
              />
            </>
          )}

          {/* Final PE status */}
          {evaluation.peConfirmed === true && (
            <Alert variant="info">
              PE confirmed. Proceed to Risk Stratification to determine PE category (A&ndash;E) and guide management.
            </Alert>
          )}

          {evaluation.peConfirmed === false && (
            <Alert variant="success">
              PE excluded by imaging. No further PE-specific workup needed. Consider alternative diagnoses.
            </Alert>
          )}
        </>
      )}

      <div className="flex justify-end pt-4 border-t border-gray-200">
        <Button onClick={handleNext} size="lg">
          Next: Risk Stratification
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <Alert variant="warning" className="mt-2">
        This tool is for clinical decision support only. It does not replace clinical judgment.
        Always verify recommendations against the full guideline.
      </Alert>
    </div>
  );
}
