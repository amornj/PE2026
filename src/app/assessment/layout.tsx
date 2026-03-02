'use client';

import { usePathname } from 'next/navigation';
import type { WizardStep } from '@/types/assessment';
import { WizardStepper } from '@/components/layout/WizardStepper';
import { PageContainer } from '@/components/layout/PageContainer';

const WIZARD_STEPS: { key: WizardStep; path: string }[] = [
  { key: 'evaluation', path: '/assessment/evaluation' },
  { key: 'stratification', path: '/assessment/stratification' },
  { key: 'management', path: '/assessment/management' },
  { key: 'followup', path: '/assessment/followup' },
];

export default function AssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentIndex = WIZARD_STEPS.findIndex((s) => pathname.startsWith(s.path));
  const currentStep = currentIndex >= 0 ? WIZARD_STEPS[currentIndex].key : 'evaluation';
  const completedSteps = WIZARD_STEPS.slice(0, Math.max(0, currentIndex)).map((s) => s.key);

  return (
    <PageContainer>
      <div className="mb-8">
        <WizardStepper
          currentStep={currentStep}
          completedSteps={completedSteps}
        />
      </div>
      {children}
    </PageContainer>
  );
}
