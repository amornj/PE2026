'use client';

import { useState, useMemo } from 'react';
import { WELLS_CRITERIA } from '@/data/wellsCriteria';
import { calculateWells } from '@/lib/scoring/wells';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { ScoreResultDisplay } from './ScoreResultDisplay';

export function WellsCalculator() {
  const [criteria, setCriteria] = useState<Record<string, boolean>>({});

  const result = useMemo(() => calculateWells(criteria), [criteria]);

  const handleToggle = (id: string, checked: boolean) => {
    setCriteria((prev) => ({ ...prev, [id]: checked }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Wells Score Criteria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {WELLS_CRITERIA.map((criterion) => (
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
        title="Wells Score"
        score={result.total}
        interpretation={result.interpretation}
        riskLevel={result.riskLevel}
        details={`Two-tier: PE ${result.probability} | Three-tier: ${result.threeLevel} probability`}
      />
    </div>
  );
}
