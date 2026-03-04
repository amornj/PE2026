'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAssessmentStore } from '@/store/assessmentStore';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { CategoryDisplay } from '@/components/assessment/CategoryDisplay';
import { FollowUpTimeline } from '@/components/assessment/FollowUpTimeline';
import { AnticoagDurationCalculator } from '@/components/assessment/AnticoagDurationCalculator';
import { CTEPDScreening } from '@/components/assessment/CTEPDScreening';
import { StepSummaryBox } from '@/components/assessment/StepSummaryBox';
import type { AnticoagDuration, CTEPDScreening as CTEPDScreeningData } from '@/types/assessment';
import { ChevronLeft, RotateCcw } from 'lucide-react';

export default function FollowUpPage() {
  const router = useRouter();
  const stratification = useAssessmentStore((s) => s.stratification);
  const followup = useAssessmentStore((s) => s.followup);
  const updateFollowup = useAssessmentStore((s) => s.updateFollowup);
  const resetAssessment = useAssessmentStore((s) => s.resetAssessment);
  const setStep = useAssessmentStore((s) => s.setStep);

  const category = stratification.category;
  const subcategory = category?.subcategory ?? 'B2';

  const handleDurationChange = useCallback(
    (duration: AnticoagDuration) => {
      updateFollowup({ anticoagDuration: duration });
    },
    [updateFollowup],
  );

  const handleScreeningChange = useCallback(
    (screening: CTEPDScreeningData) => {
      updateFollowup({ ctephdScreening: screening });
    },
    [updateFollowup],
  );

  const handleChecklistChange = useCallback(
    (oneWeek: string[], threeMonth: string[]) => {
      updateFollowup({
        oneWeekChecklist: oneWeek,
        threeMonthChecklist: threeMonth,
      });
    },
    [updateFollowup],
  );

  const handlePrev = () => {
    setStep('management');
    router.push('/assessment/management');
  };

  const handleStartOver = () => {
    resetAssessment();
    router.push('/assessment');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Step 4: Follow-up</h1>
        <p className="mt-1 text-gray-600">
          Monitoring timeline, anticoagulation duration, and CTEPD screening.
        </p>
      </div>

      {/* Show current category as context */}
      {category && (
        <div className="mb-2">
          <CategoryDisplay category={category} />
        </div>
      )}

      <FollowUpTimeline
        subcategory={subcategory}
        riskCategory={followup.anticoagDuration.riskCategory}
        persistentDyspnea={followup.ctephdScreening.persistentDyspnea}
        functionalLimitation={followup.ctephdScreening.functionalLimitation}
        oneWeekChecklist={followup.oneWeekChecklist}
        threeMonthChecklist={followup.threeMonthChecklist}
        onChecklistChange={handleChecklistChange}
      />

      <AnticoagDurationCalculator
        duration={followup.anticoagDuration}
        onDurationChange={handleDurationChange}
      />

      <CTEPDScreening
        screening={followup.ctephdScreening}
        onScreeningChange={handleScreeningChange}
      />

      {/* Step summary box */}
      <StepSummaryBox step="followup" />

      <div className="flex justify-between pt-4 border-t border-gray-200">
        <Button variant="secondary" onClick={handlePrev} size="lg">
          <ChevronLeft className="h-4 w-4" />
          Previous: Management
        </Button>
        <Button variant="secondary" onClick={handleStartOver} size="lg">
          <RotateCcw className="h-4 w-4" />
          Start New Assessment
        </Button>
      </div>

      <Alert variant="warning" className="mt-2">
        Follow-up recommendations are based on the 2026 AHA/ACC guideline.
        Anticoagulation duration decisions should incorporate individual patient risk-benefit
        assessment, bleeding risk, and shared decision-making.
      </Alert>

      <Alert variant="info" className="mt-2">
        This assessment tool does not store any patient data. Results are held in memory only
        for the duration of this session.
      </Alert>
    </div>
  );
}
