'use client';

import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAssessmentStore } from '@/store/assessmentStore';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { HemodynamicsPanel } from '@/components/assessment/HemodynamicsPanel';
import { SymptomAssessment } from '@/components/assessment/SymptomAssessment';
import { SeverityScorePanel } from '@/components/assessment/SeverityScorePanel';
import { BiomarkerPanel } from '@/components/assessment/BiomarkerPanel';
import { RVAssessmentPanel } from '@/components/assessment/RVAssessmentPanel';
import { RespiratoryStatusPanel } from '@/components/assessment/RespiratoryStatusPanel';
import { CategoryDisplay } from '@/components/assessment/CategoryDisplay';
import { assignCategory } from '@/lib/classification/category';
import type { HemodynamicStatus, RVAssessment, BiomarkerStatus, RespiratoryStatus } from '@/types/classification';
import type { PESIResult, SPESIResult } from '@/types/scores';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function StratificationPage() {
  const router = useRouter();
  const stratification = useAssessmentStore((s) => s.stratification);
  const updateStratification = useAssessmentStore((s) => s.updateStratification);
  const setStep = useAssessmentStore((s) => s.setStep);

  const { classificationInput } = stratification;

  // Recalculate category whenever classification input changes
  useEffect(() => {
    const category = assignCategory(classificationInput);
    updateStratification({ category });
  }, [classificationInput]);

  const updateClassificationInput = useCallback(
    (partial: Partial<typeof classificationInput>) => {
      updateStratification({
        classificationInput: { ...classificationInput, ...partial },
      });
    },
    [classificationInput, updateStratification],
  );

  const handleHemodynamicsChange = useCallback(
    (hemodynamics: HemodynamicStatus) => {
      updateClassificationInput({ hemodynamics });
    },
    [updateClassificationInput],
  );

  const handleSymptomChange = useCallback(
    (data: { isIncidental: boolean; isSymptomatic: boolean; isSubsegmental: boolean }) => {
      updateClassificationInput(data);
    },
    [updateClassificationInput],
  );

  const handlePESIChange = useCallback(
    (result: PESIResult) => {
      updateStratification({ pesiResult: result });
      updateClassificationInput({ pesiScore: result.total });
    },
    [updateStratification, updateClassificationInput],
  );

  const handleSPESIChange = useCallback(
    (result: SPESIResult) => {
      updateStratification({ spesiResult: result });
      updateClassificationInput({ spesiScore: result.total });
    },
    [updateStratification, updateClassificationInput],
  );

  const handleBiomarkersChange = useCallback(
    (biomarkers: BiomarkerStatus) => {
      updateClassificationInput({ biomarkers });
    },
    [updateClassificationInput],
  );

  const handleRVChange = useCallback(
    (rv: RVAssessment) => {
      updateClassificationInput({ rv });
    },
    [updateClassificationInput],
  );

  const handleRespiratoryChange = useCallback(
    (respiratory: RespiratoryStatus) => {
      updateClassificationInput({ respiratory });
    },
    [updateClassificationInput],
  );

  const hasHemodynamicInstability =
    classificationInput.hemodynamics.cardiacArrest ||
    classificationInput.hemodynamics.refractoryShock ||
    classificationInput.hemodynamics.cardiogenicShock ||
    classificationInput.hemodynamics.hypotension ||
    classificationInput.hemodynamics.transientHypotension;

  const handlePrev = () => {
    setStep('evaluation');
    router.push('/assessment/evaluation');
  };

  const handleNext = () => {
    setStep('management');
    router.push('/assessment/management');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Step 2: Risk Stratification</h1>
        <p className="mt-1 text-gray-600">
          Assess hemodynamics, severity, biomarkers, and RV function to determine PE category (A-E).
        </p>
      </div>

      {/* Hemodynamics first -- determines D/E immediately */}
      <HemodynamicsPanel
        hemodynamics={classificationInput.hemodynamics}
        onChange={handleHemodynamicsChange}
      />

      {/* If hemodynamically stable, show further classification */}
      {!hasHemodynamicInstability && (
        <>
          <SymptomAssessment
            isIncidental={classificationInput.isIncidental}
            isSymptomatic={classificationInput.isSymptomatic}
            isSubsegmental={classificationInput.isSubsegmental}
            onChange={handleSymptomChange}
          />

          {classificationInput.isSymptomatic && (
            <>
              <SeverityScorePanel
                pesiResult={stratification.pesiResult}
                spesiResult={stratification.spesiResult}
                onPESIChange={handlePESIChange}
                onSPESIChange={handleSPESIChange}
              />

              <BiomarkerPanel
                biomarkers={classificationInput.biomarkers}
                onChange={handleBiomarkersChange}
              />

              <RVAssessmentPanel
                rv={classificationInput.rv}
                onChange={handleRVChange}
              />
            </>
          )}
        </>
      )}

      <RespiratoryStatusPanel
        respiratory={classificationInput.respiratory}
        onChange={handleRespiratoryChange}
      />

      {/* Category Display -- THE key visual */}
      <CategoryDisplay category={stratification.category} />

      <div className="flex justify-between pt-4 border-t border-gray-200">
        <Button variant="secondary" onClick={handlePrev} size="lg">
          <ChevronLeft className="h-4 w-4" />
          Previous: Evaluation
        </Button>
        <Button onClick={handleNext} size="lg">
          Next: Management
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
