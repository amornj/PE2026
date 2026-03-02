'use client';

import { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { ANTICOAG_DURATION_RULES } from '@/data/anticoagDuration';
import type { AnticoagDuration } from '@/types/assessment';

interface AnticoagDurationCalculatorProps {
  duration: AnticoagDuration;
  onDurationChange: (duration: AnticoagDuration) => void;
}

export function AnticoagDurationCalculator({
  duration,
  onDurationChange,
}: AnticoagDurationCalculatorProps) {
  const selectedRule = useMemo(
    () => ANTICOAG_DURATION_RULES.find((r) => r.riskCategory === duration.riskCategory),
    [duration.riskCategory],
  );

  const handleCategoryChange = (value: string) => {
    const rule = ANTICOAG_DURATION_RULES.find((r) => r.riskCategory === value);
    if (rule) {
      onDurationChange({
        riskCategory: rule.riskCategory,
        recommendedDuration: rule.recommendedDuration,
        extendedPhase: rule.extendedPhaseOption,
        halfDoseEligible: rule.halfDoseOption,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Anticoagulation Duration</CardTitle>
        <CardDescription>
          Duration is determined by the provoking factor category
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <RadioGroup
            name="riskCategory"
            label="Provoking Factor"
            options={ANTICOAG_DURATION_RULES.map((rule) => ({
              value: rule.riskCategory,
              label: rule.label,
              description: rule.examples.slice(0, 3).join(', '),
            }))}
            value={duration.riskCategory}
            onChange={handleCategoryChange}
          />

          {selectedRule && (
            <div className="space-y-3 rounded-lg border border-gray-200 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">
                  Recommended Duration:
                </span>
                <span className="text-sm font-bold text-blue-700">
                  {selectedRule.recommendedDuration}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="cor" cor={selectedRule.cor} />
                <Badge variant="loe" loe={selectedRule.loe} />
              </div>

              <p className="text-xs text-gray-500">
                Annual recurrence risk if stopped: {selectedRule.annualRecurrenceIfStopped}
              </p>

              {selectedRule.extendedPhaseOption && (
                <Alert variant="info" title="Extended Phase Option Available">
                  <p className="text-sm">
                    Extended-phase anticoagulation may be considered.
                    {selectedRule.halfDoseOption && (
                      <span>
                        {' '}Half-dose options are available: apixaban 2.5 mg BID or rivaroxaban 10 mg daily
                        for the extended phase, which reduce recurrence with lower bleeding risk.
                      </span>
                    )}
                  </p>
                </Alert>
              )}

              <div>
                <p className="text-xs font-medium text-gray-700 mb-1">Examples:</p>
                <ul className="space-y-1">
                  {selectedRule.examples.map((ex, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                      <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-gray-400" />
                      {ex}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
