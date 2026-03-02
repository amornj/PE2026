'use client';

import { useState, useMemo } from 'react';
import { GENEVA_CRITERIA } from '@/data/genevaCriteria';
import { calculateGeneva } from '@/lib/scoring/geneva';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { ScoreResultDisplay } from './ScoreResultDisplay';

export function GenevaCalculator() {
  const [criteria, setCriteria] = useState<Record<string, boolean>>({});

  const result = useMemo(() => calculateGeneva(criteria), [criteria]);

  const handleToggle = (id: string, checked: boolean) => {
    setCriteria((prev) => ({ ...prev, [id]: checked }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Revised Geneva Score Criteria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {GENEVA_CRITERIA.map((criterion) => (
              <div key={criterion.id}>
                <Checkbox
                  id={criterion.id}
                  label={`${criterion.label} (+${criterion.points})`}
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
        title="Revised Geneva Score"
        score={result.total}
        interpretation={result.interpretation}
        riskLevel={result.riskLevel}
        details={`Clinical probability: ${result.probability}`}
      />
    </div>
  );
}
