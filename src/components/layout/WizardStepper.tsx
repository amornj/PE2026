import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WizardStep } from '@/types/assessment';

const WIZARD_STEPS: { key: WizardStep; label: string }[] = [
  { key: 'evaluation', label: 'Evaluation' },
  { key: 'stratification', label: 'Stratification' },
  { key: 'management', label: 'Management' },
  { key: 'followup', label: 'Follow-up' },
];

export interface WizardStepperProps {
  currentStep: WizardStep;
  completedSteps: WizardStep[];
  onStepClick?: (step: WizardStep) => void;
  className?: string;
}

export function WizardStepper({ currentStep, completedSteps, onStepClick, className }: WizardStepperProps) {
  const currentIndex = WIZARD_STEPS.findIndex((s) => s.key === currentStep);

  return (
    <nav aria-label="Assessment progress" className={cn('w-full', className)}>
      <ol className="flex items-center">
        {WIZARD_STEPS.map((step, index) => {
          const isCompleted = completedSteps.includes(step.key);
          const isCurrent = step.key === currentStep;
          const isLast = index === WIZARD_STEPS.length - 1;
          const isClickable = onStepClick && (isCompleted || index <= currentIndex);

          return (
            <li
              key={step.key}
              className={cn('flex items-center', !isLast && 'flex-1')}
            >
              <div className="flex flex-col items-center gap-1">
                <button
                  type="button"
                  onClick={() => isClickable && onStepClick(step.key)}
                  disabled={!isClickable}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors',
                    isCompleted && 'bg-green-600 text-white',
                    isCurrent && !isCompleted && 'bg-blue-600 text-white',
                    !isCurrent && !isCompleted && 'border-2 border-gray-300 text-gray-500',
                    isClickable && 'cursor-pointer hover:ring-2 hover:ring-offset-1',
                    !isClickable && 'cursor-default',
                  )}
                  aria-current={isCurrent ? 'step' : undefined}
                  aria-label={`${step.label}${isCompleted ? ' (completed)' : isCurrent ? ' (current)' : ''}`}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    index + 1
                  )}
                </button>
                <span
                  className={cn(
                    'hidden text-xs font-medium sm:block',
                    isCurrent ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500',
                  )}
                >
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div
                  className={cn(
                    'mx-1 h-0.5 flex-1 sm:mx-2',
                    isCompleted ? 'bg-green-600' : 'bg-gray-200',
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
