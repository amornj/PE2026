'use client';

import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { NumberInput } from '@/components/ui/NumberInput';
import { Alert } from '@/components/ui/Alert';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { PESI_CRITERIA } from '@/data/pesiCriteria';
import { SPESI_CRITERIA } from '@/data/spesiCriteria';
import { calculatePESI, type PESIInput } from '@/lib/scoring/pesi';
import { calculateSPESI } from '@/lib/scoring/spesi';
import type { PESIResult, SPESIResult } from '@/types/scores';

interface SeverityScorePanelProps {
  pesiResult: PESIResult | null;
  spesiResult: SPESIResult | null;
  onPESIChange: (result: PESIResult) => void;
  onSPESIChange: (result: SPESIResult) => void;
}

export function SeverityScorePanel({
  pesiResult,
  spesiResult,
  onPESIChange,
  onSPESIChange,
}: SeverityScorePanelProps) {
  const [pesiAge, setPesiAge] = useState<number | undefined>(undefined);
  const [pesiCriteria, setPesiCriteria] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    PESI_CRITERIA.forEach((c) => { init[c.id] = false; });
    return init;
  });

  const [spesiCriteria, setSpesiCriteria] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    SPESI_CRITERIA.forEach((c) => { init[c.id] = false; });
    return init;
  });

  const recalcPESI = (criteria: Record<string, boolean>, age: number | undefined) => {
    if (age == null) return;
    const input: PESIInput = {
      age,
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
    onPESIChange(calculatePESI(input));
  };

  const handlePesiToggle = (id: string, checked: boolean) => {
    const next = { ...pesiCriteria, [id]: checked };
    setPesiCriteria(next);
    recalcPESI(next, pesiAge);
  };

  const handleSpesiToggle = (id: string, checked: boolean) => {
    const next = { ...spesiCriteria, [id]: checked };
    setSpesiCriteria(next);
    onSPESIChange(calculateSPESI(next));
  };

  const riskColorClass = (level: string) => {
    if (level === 'low') return 'bg-green-100 text-green-800';
    if (level === 'moderate') return 'bg-amber-100 text-amber-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Severity Scores (PESI / sPESI)</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="spesi">
          <TabsList>
            <TabsTrigger value="spesi">sPESI (Simplified)</TabsTrigger>
            <TabsTrigger value="pesi">PESI (Original)</TabsTrigger>
          </TabsList>

          <TabsContent value="spesi">
            <div className="space-y-3">
              {SPESI_CRITERIA.map((criterion) => (
                <Checkbox
                  key={criterion.id}
                  label={criterion.label}
                  checked={spesiCriteria[criterion.id]}
                  onChange={(c) => handleSpesiToggle(criterion.id, c)}
                />
              ))}
              {spesiResult && (
                <div className="mt-4 flex items-center justify-between rounded-lg bg-gray-50 p-3">
                  <span className="text-sm font-semibold text-gray-900">
                    sPESI: {spesiResult.total}
                  </span>
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${riskColorClass(spesiResult.riskLevel)}`}>
                    {spesiResult.simplified === 0 ? 'Low Risk' : 'High Risk'}
                  </span>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="pesi">
            <div className="space-y-3">
              <NumberInput
                label="Patient Age (baseline PESI points)"
                value={pesiAge}
                onChange={(v) => {
                  setPesiAge(v);
                  recalcPESI(pesiCriteria, v);
                }}
                min={1}
                max={120}
                placeholder="e.g. 65"
                unit="years"
              />
              {PESI_CRITERIA.map((criterion) => (
                <div key={criterion.id} className="flex items-start justify-between gap-2">
                  <Checkbox
                    label={criterion.label}
                    checked={pesiCriteria[criterion.id]}
                    onChange={(c) => handlePesiToggle(criterion.id, c)}
                  />
                  <span className="shrink-0 text-xs font-medium text-gray-500">
                    +{criterion.points}
                  </span>
                </div>
              ))}
              {pesiResult && (
                <div className="mt-4 space-y-2 rounded-lg bg-gray-50 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">
                      PESI: {pesiResult.total}
                    </span>
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${riskColorClass(pesiResult.riskLevel)}`}>
                      Class {pesiResult.class}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    30-day mortality: {pesiResult.mortality30Day}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
