'use client';

import { useState, useMemo } from 'react';
import { PESI_CRITERIA } from '@/data/pesiCriteria';
import { calculatePESI, type PESIInput } from '@/lib/scoring/pesi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { NumberInput } from '@/components/ui/NumberInput';
import { ScoreResultDisplay } from './ScoreResultDisplay';

export function PESICalculator() {
  const [age, setAge] = useState<number | undefined>(undefined);
  const [criteria, setCriteria] = useState<Record<string, boolean>>({});

  const result = useMemo(() => {
    const input: PESIInput = {
      age: age ?? 0,
      male: criteria.male ?? false,
      cancer: criteria.cancer ?? false,
      heartFailure: criteria.heartFailure ?? false,
      chronicLung: criteria.chronicLung ?? false,
      heartRateGte110: criteria.heartRateGte110 ?? false,
      sbpLt100: criteria.sbpLt100 ?? false,
      rrGte30: criteria.rrGte30 ?? false,
      tempLt36: criteria.tempLt36 ?? false,
      alteredMental: criteria.alteredMental ?? false,
      spo2Lt90: criteria.spo2Lt90 ?? false,
    };
    return calculatePESI(input);
  }, [age, criteria]);

  const handleToggle = (id: string, checked: boolean) => {
    setCriteria((prev) => ({ ...prev, [id]: checked }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>PESI Score Criteria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <NumberInput
              label="Patient age (years)"
              value={age}
              onChange={setAge}
              min={0}
              max={150}
              step={1}
              unit="years"
              placeholder="Enter age"
            />
            <div className="space-y-3">
              {PESI_CRITERIA.map((criterion) => (
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
          </div>
        </CardContent>
      </Card>

      <ScoreResultDisplay
        title="PESI Score"
        score={result.total}
        interpretation={result.interpretation}
        riskLevel={result.riskLevel}
        details={`Class ${result.class} | 30-day mortality: ${result.mortality30Day}`}
      />
    </div>
  );
}
