'use client';

import { useState, useMemo } from 'react';
import { HESTIA_CRITERIA } from '@/data/hestiaCriteria';
import { calculateHestia } from '@/lib/scoring/hestia';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { Alert } from '@/components/ui/Alert';
import { ScoreResultDisplay } from './ScoreResultDisplay';

export function HestiaCalculator() {
  const [criteria, setCriteria] = useState<Record<string, boolean>>({});

  const result = useMemo(() => calculateHestia(criteria), [criteria]);

  const handleToggle = (id: string, checked: boolean) => {
    setCriteria((prev) => ({ ...prev, [id]: checked }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Hestia Criteria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {HESTIA_CRITERIA.map((criterion) => (
              <div key={criterion.id}>
                <Checkbox
                  id={criterion.id}
                  label={criterion.label}
                  checked={criteria[criterion.id] ?? false}
                  onChange={(checked) => handleToggle(criterion.id, checked)}
                />
                {criterion.description && (
                  <p className="ml-7 text-xs text-gray-500">{criterion.description}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <ScoreResultDisplay
        title="Hestia Score"
        score={result.total}
        interpretation={result.interpretation}
        riskLevel={result.riskLevel}
      />

      <Alert variant={result.eligible ? 'success' : 'warning'}>
        {result.eligible
          ? 'Patient meets criteria for outpatient treatment (score = 0).'
          : `Patient does NOT meet criteria for outpatient treatment (${result.total} contraindication${result.total > 1 ? 's' : ''} present).`}
      </Alert>
    </div>
  );
}
