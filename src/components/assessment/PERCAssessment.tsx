'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { NumberInput } from '@/components/ui/NumberInput';
import { Alert } from '@/components/ui/Alert';
import { type PERCResult } from '@/lib/scoring/perc';

/** Overlapping findings derived from Wells/Geneva criteria */
export interface PTPSyncedFindings {
  hemoptysis: boolean;
  priorDvtPe: boolean;
  unilateralLegSwelling: boolean;
  recentSurgeryTrauma: boolean;
  hrElevated: boolean;   // Wells HR>100 or Geneva HR≥95
  ageOver65: boolean;    // Geneva age>65 → definitely ≥50
}

interface PERCAssessmentProps {
  onResult: (result: PERCResult) => void;
  syncedFromPTP?: PTPSyncedFindings;
}

const BINARY_CRITERIA = [
  { id: 'hemoptysis', label: 'Hemoptysis' },
  { id: 'estrogenUse', label: 'Exogenous estrogen use (OCP, HRT)' },
  { id: 'priorDvtPe', label: 'Prior DVT or PE' },
  { id: 'unilateralLegSwelling', label: 'Unilateral leg swelling' },
  { id: 'recentSurgeryTrauma', label: 'Surgery/trauma requiring hospitalization within prior 4 weeks' },
];

function evaluatePerc(
  age: number | undefined,
  heartRate: number | undefined,
  spo2: number | undefined,
  binaryCriteria: Record<string, boolean>,
): PERCResult {
  const fails: string[] = [];

  if (age != null && age >= 50) fails.push('Age ≥ 50');
  if (heartRate != null && heartRate >= 100) fails.push('HR ≥ 100');
  if (spo2 != null && spo2 < 95) fails.push('SpO₂ < 95%');
  for (const c of BINARY_CRITERIA) {
    if (binaryCriteria[c.id]) fails.push(c.label);
  }

  const numericsComplete = age != null && heartRate != null && spo2 != null;
  const allAbsent = numericsComplete && fails.length === 0;

  return {
    total: fails.length,
    allAbsent,
    interpretation: allAbsent
      ? 'PERC negative — all criteria absent.'
      : fails.length > 0
        ? `PERC positive — ${fails.length} failed: ${fails.join(', ')}.`
        : 'Enter age, heart rate, and SpO₂ to complete PERC assessment.',
  };
}

export function PERCAssessment({ onResult, syncedFromPTP }: PERCAssessmentProps) {
  const [age, setAge] = useState<number | undefined>(undefined);
  const [heartRate, setHeartRate] = useState<number | undefined>(undefined);
  const [spo2, setSpo2] = useState<number | undefined>(undefined);
  const [binaryCriteria, setBinaryCriteria] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const c of BINARY_CRITERIA) init[c.id] = false;
    return init;
  });

  // Sync overlapping criteria from Wells/Geneva
  useEffect(() => {
    if (!syncedFromPTP) return;
    setBinaryCriteria((prev) => ({
      ...prev,
      hemoptysis: syncedFromPTP.hemoptysis || prev.hemoptysis,
      priorDvtPe: syncedFromPTP.priorDvtPe || prev.priorDvtPe,
      unilateralLegSwelling: syncedFromPTP.unilateralLegSwelling || prev.unilateralLegSwelling,
      recentSurgeryTrauma: syncedFromPTP.recentSurgeryTrauma || prev.recentSurgeryTrauma,
    }));
    // If Geneva says age>65, that's definitely ≥50 for PERC
    if (syncedFromPTP.ageOver65 && (age == null || age < 65)) {
      setAge(66);
    }
    // If Wells/Geneva says HR elevated, set HR to 100 if not already set higher
    if (syncedFromPTP.hrElevated && (heartRate == null || heartRate < 100)) {
      setHeartRate(100);
    }
  }, [syncedFromPTP]); // eslint-disable-line react-hooks/exhaustive-deps

  const result = useMemo(
    () => evaluatePerc(age, heartRate, spo2, binaryCriteria),
    [age, heartRate, spo2, binaryCriteria],
  );

  // Notify parent only when result actually changes
  const prevRef = useRef<string>('');
  useEffect(() => {
    const key = `${result.total}-${result.allAbsent}`;
    if (key !== prevRef.current) {
      prevRef.current = key;
      onResult(result);
    }
  }, [result, onResult]);

  const handleToggle = (id: string, checked: boolean) => {
    setBinaryCriteria((prev) => ({ ...prev, [id]: checked }));
  };

  const numericsComplete = age != null && heartRate != null && spo2 != null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>PERC Rule-out Criteria</CardTitle>
        <CardDescription>
          For low clinical probability (&lt;15%) patients only. If ALL 8 criteria are met,
          PE can be excluded without D-dimer testing (COR 2a).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {/* Numeric vital signs */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <NumberInput
                label="Age"
                value={age}
                onChange={setAge}
                min={1}
                max={120}
                placeholder="e.g. 42"
                unit="years"
              />
              {age != null && (
                <p className={`mt-1 text-xs font-medium ${age < 50 ? 'text-green-600' : 'text-red-600'}`}>
                  {age < 50 ? '< 50 ✓' : '≥ 50 ✗'}
                </p>
              )}
            </div>
            <div>
              <NumberInput
                label="Heart Rate"
                value={heartRate}
                onChange={setHeartRate}
                min={0}
                max={300}
                placeholder="e.g. 88"
                unit="bpm"
              />
              {heartRate != null && (
                <p className={`mt-1 text-xs font-medium ${heartRate < 100 ? 'text-green-600' : 'text-red-600'}`}>
                  {heartRate < 100 ? '< 100 ✓' : '≥ 100 ✗'}
                </p>
              )}
            </div>
            <div>
              <NumberInput
                label="SpO₂ (room air)"
                value={spo2}
                onChange={setSpo2}
                min={0}
                max={100}
                placeholder="e.g. 98"
                unit="%"
              />
              {spo2 != null && (
                <p className={`mt-1 text-xs font-medium ${spo2 >= 95 ? 'text-green-600' : 'text-red-600'}`}>
                  {spo2 >= 95 ? '≥ 95% ✓' : '< 95% ✗'}
                </p>
              )}
            </div>
          </div>

          {/* Binary criteria */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-900">
              Are any of the following present?
            </p>
            {BINARY_CRITERIA.map((c) => {
              const isSynced =
                syncedFromPTP &&
                ((c.id === 'hemoptysis' && syncedFromPTP.hemoptysis) ||
                  (c.id === 'priorDvtPe' && syncedFromPTP.priorDvtPe) ||
                  (c.id === 'unilateralLegSwelling' && syncedFromPTP.unilateralLegSwelling) ||
                  (c.id === 'recentSurgeryTrauma' && syncedFromPTP.recentSurgeryTrauma));
              return (
                <div key={c.id} className="flex items-center gap-2">
                  <Checkbox
                    label={c.label}
                    checked={binaryCriteria[c.id]}
                    onChange={(checked) => handleToggle(c.id, checked)}
                  />
                  {isSynced && (
                    <span className="text-xs text-blue-600 font-medium">(from Wells/Geneva)</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4">
          {!numericsComplete ? (
            <Alert variant="info">
              Enter age, heart rate, and SpO₂ to complete PERC assessment.
            </Alert>
          ) : result.allAbsent ? (
            <Alert variant="success">
              <strong>PERC Negative</strong>
              <p className="mt-1 text-sm">
                All 8 criteria met (age &lt;50, HR &lt;100, SpO₂ ≥95%, no hemoptysis,
                no estrogen, no prior DVT/PE, no leg swelling, no recent surgery/trauma).
                PE can be safely excluded without further testing.
              </p>
            </Alert>
          ) : (
            <Alert variant="warning">
              <strong>PERC Positive</strong> &mdash; {result.total} criterion/criteria failed.
              <p className="mt-1 text-sm">
                Cannot rule out PE by PERC alone. Proceed to D-dimer testing and YEARS assessment.
              </p>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
