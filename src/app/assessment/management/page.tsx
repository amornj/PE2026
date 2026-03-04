'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAssessmentStore } from '@/store/assessmentStore';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { CategoryDisplay } from '@/components/assessment/CategoryDisplay';
import { AnticoagulationHelper } from '@/components/assessment/AnticoagulationHelper';
import { AdvancedTherapyPanel } from '@/components/assessment/AdvancedTherapyPanel';
import { PERTChecklist } from '@/components/assessment/PERTChecklist';
import { IVCFilterDecisionTree } from '@/components/assessment/IVCFilterDecisionTree';
import { StepSummaryBox } from '@/components/assessment/StepSummaryBox';
import type { SpecialPopulation, AnticoagulationPlan, AdvancedTherapyPlan } from '@/types/assessment';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ManagementPage() {
  const router = useRouter();
  const stratification = useAssessmentStore((s) => s.stratification);
  const management = useAssessmentStore((s) => s.management);
  const updateManagement = useAssessmentStore((s) => s.updateManagement);
  const setStep = useAssessmentStore((s) => s.setStep);

  const category = stratification.category;
  const subcategory = category?.subcategory ?? 'B2';

  const handleSpecialPopulationsChange = useCallback(
    (pops: SpecialPopulation[]) => {
      updateManagement({
        anticoagulation: { ...management.anticoagulation, specialPopulation: pops },
      });
    },
    [management.anticoagulation, updateManagement],
  );

  const handleAnticoagPlanChange = useCallback(
    (plan: AnticoagulationPlan) => {
      updateManagement({ anticoagulation: plan });
    },
    [updateManagement],
  );

  const handleAdvancedTherapyChange = useCallback(
    (plan: AdvancedTherapyPlan) => {
      updateManagement({ advancedTherapy: plan });
    },
    [updateManagement],
  );

  const handlePertChange = useCallback(
    (activated: boolean) => {
      updateManagement({ pertActivated: activated });
    },
    [updateManagement],
  );

  const handleIVCFilterChange = useCallback(
    (considered: boolean, indicated: boolean) => {
      updateManagement({
        ivcFilterConsidered: considered,
        ivcFilterIndicated: indicated,
      });
    },
    [updateManagement],
  );

  const handlePrev = () => {
    setStep('stratification');
    router.push('/assessment/stratification');
  };

  const handleNext = () => {
    setStep('followup');
    router.push('/assessment/followup');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Step 3: Management</h1>
        <p className="mt-1 text-gray-600">
          Anticoagulation, advanced therapy recommendations, PERT activation, and IVC filter consideration.
        </p>
      </div>

      {/* Show current category as context */}
      {category && (
        <div className="mb-2">
          <CategoryDisplay category={category} />
        </div>
      )}

      {!category && (
        <Alert variant="warning">
          No PE category assigned yet. Complete Risk Stratification (Step 2) first for
          accurate management recommendations.
        </Alert>
      )}

      <AnticoagulationHelper
        subcategory={subcategory}
        specialPopulations={management.anticoagulation.specialPopulation}
        onSpecialPopulationsChange={handleSpecialPopulationsChange}
        onPlanChange={handleAnticoagPlanChange}
      />

      <AdvancedTherapyPanel
        subcategory={subcategory}
        onPlanChange={handleAdvancedTherapyChange}
      />

      <PERTChecklist
        subcategory={subcategory}
        pertActivated={management.pertActivated}
        onPertActivatedChange={handlePertChange}
      />

      <IVCFilterDecisionTree onFilterChange={handleIVCFilterChange} />

      {/* Step summary box */}
      <StepSummaryBox step="management" />

      <div className="flex justify-between pt-4 border-t border-gray-200">
        <Button variant="secondary" onClick={handlePrev} size="lg">
          <ChevronLeft className="h-4 w-4" />
          Previous: Stratification
        </Button>
        <Button onClick={handleNext} size="lg">
          Next: Follow-up
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <Alert variant="warning" className="mt-2">
        Management recommendations are based on the 2026 AHA/ACC guideline. Always verify
        with the full guideline and apply clinical judgment to individual patient circumstances.
      </Alert>
    </div>
  );
}
