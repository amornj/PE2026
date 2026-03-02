'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { SEVERITY_COLORS } from '@/types/guideline';
import type { PECategory } from '@/types/classification';
import { cn } from '@/lib/utils';

interface CategoryDisplayProps {
  category: PECategory | null;
}

const SEVERITY_LABELS: Record<string, string> = {
  subclinical: 'Subclinical',
  low: 'Low Risk',
  elevated: 'Elevated Risk (Submassive)',
  'incipient-failure': 'Incipient Cardiopulmonary Failure',
  'cardiopulmonary-failure': 'Cardiopulmonary Failure (Massive)',
};

const MONITORING_RECS: Record<string, string> = {
  A: 'Outpatient management appropriate for most patients.',
  B: 'Consider outpatient management if Hestia-eligible. Otherwise, brief observation.',
  C: 'Hospital admission required. Stepdown/telemetry for C2/C3. Monitor for deterioration.',
  D: 'ICU admission required. Prepare for potential escalation to advanced therapy.',
  E: 'ICU admission with emergent intervention required.',
};

export function CategoryDisplay({ category }: CategoryDisplayProps) {
  if (!category) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-gray-500">
            Complete the assessments above to determine PE category classification.
          </p>
        </CardContent>
      </Card>
    );
  }

  const colors = SEVERITY_COLORS[category.letter];
  const severityLabel = SEVERITY_LABELS[category.severity] ?? category.severity;
  const monitoring = MONITORING_RECS[category.letter] ?? '';

  return (
    <Card className={cn('border-2', colors?.border)}>
      <CardContent className="pt-6">
        <div className={cn('rounded-lg p-6', colors?.bg)}>
          <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
            <div className={cn(
              'flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-2xl font-bold',
              colors?.bg,
              colors?.text,
              'border-2',
              colors?.border,
            )}>
              {category.displayLabel.split(' ')[0]}
            </div>
            <div className="flex-1">
              <h2 className={cn('text-xl font-bold', colors?.text)}>
                {category.displayLabel}
              </h2>
              <p className="mt-1 text-sm text-gray-700">{category.description}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge variant="severity" severity={category.letter}>
                  {severityLabel}
                </Badge>
                {category.rModifier && (
                  <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-800">
                    (R) Respiratory Compromise
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <Alert variant={
            category.letter === 'E' ? 'error' :
            category.letter === 'D' ? 'error' :
            category.letter === 'C' ? 'warning' :
            'info'
          }>
            <strong>Monitoring Level:</strong> {monitoring}
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
}
