'use client';

import { cn } from '@/lib/utils';

const RISK_STYLES = {
  low: {
    bg: 'bg-green-50 border-green-200',
    badge: 'bg-green-100 text-green-800',
    score: 'text-green-700',
    label: 'Low Risk',
  },
  moderate: {
    bg: 'bg-amber-50 border-amber-200',
    badge: 'bg-amber-100 text-amber-800',
    score: 'text-amber-700',
    label: 'Moderate Risk',
  },
  high: {
    bg: 'bg-red-50 border-red-200',
    badge: 'bg-red-100 text-red-800',
    score: 'text-red-700',
    label: 'High Risk',
  },
} as const;

export interface ScoreResultDisplayProps {
  title: string;
  score: number;
  interpretation: string;
  riskLevel: 'low' | 'moderate' | 'high';
  details?: string;
  className?: string;
}

export function ScoreResultDisplay({
  title,
  score,
  interpretation,
  riskLevel,
  details,
  className,
}: ScoreResultDisplayProps) {
  const style = RISK_STYLES[riskLevel];

  return (
    <div className={cn('rounded-lg border p-4 sm:p-6', style.bg, className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <p className={cn('text-4xl font-bold', style.score)}>{score}</p>
        </div>
        <span
          className={cn(
            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
            style.badge,
          )}
          role="status"
        >
          {style.label}
        </span>
      </div>
      <p className="mt-3 text-sm font-medium text-gray-800">{interpretation}</p>
      {details && <p className="mt-1 text-sm text-gray-600">{details}</p>}
    </div>
  );
}
