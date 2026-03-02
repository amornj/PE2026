'use client';

import { useState, useMemo } from 'react';
import { SPESI_CRITERIA } from '@/data/spesiCriteria';
import { calculateSPESI } from '@/lib/scoring/spesi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { ScoreResultDisplay } from './ScoreResultDisplay';

export function SPESICalculator() {
  const [criteria, setCriteria] = useState<Record<string, boolean>>({});

  const result = useMemo(() => calculateSPESI(criteria), [criteria]);

  const handleToggle = (id: string, checked: boolean) => {
    setCriteria((prev) => ({ ...prev, [id]: checked }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Simplified PESI (sPESI) Criteria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {SPESI_CRITERIA.map((criterion) => (
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
        title="sPESI Score"
        score={result.total}
        interpretation={result.interpretation}
        riskLevel={result.riskLevel}
        details={result.simplified === 0 ? '30-day mortality ~1.0%' : '30-day mortality ~10.9%'}
      />
    </div>
  );
}
