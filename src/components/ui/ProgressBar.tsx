import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export interface ProgressBarProps {
  steps: string[];
  currentStep: number;
  completedSteps: number[];
  className?: string;
}

export function ProgressBar({ steps, currentStep, completedSteps, className }: ProgressBarProps) {
  return (
    <nav aria-label="Progress" className={cn('w-full', className)}>
      <ol className="flex items-center">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(index);
          const isCurrent = index === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <li
              key={step}
              className={cn('flex items-center', !isLast && 'flex-1')}
            >
              <div className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors',
                    isCompleted && 'bg-green-600 text-white',
                    isCurrent && !isCompleted && 'bg-blue-600 text-white',
                    !isCurrent && !isCompleted && 'border-2 border-gray-300 text-gray-500',
                  )}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={cn(
                    'text-xs font-medium whitespace-nowrap',
                    isCurrent ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500',
                  )}
                >
                  {step}
                </span>
              </div>
              {!isLast && (
                <div
                  className={cn(
                    'mx-2 h-0.5 flex-1',
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
