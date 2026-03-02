'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { NumberInput } from '@/components/ui/NumberInput';
import { Alert } from '@/components/ui/Alert';
import { yearsAlgorithm } from '@/lib/ddimer';
import type { YEARSResult } from '@/types/assessment';

export interface YEARSSyncedFromWells {
  clinicalSignsDVT: boolean;  // Wells dvtSymptoms
  hemoptysis: boolean;        // Wells hemoptysis
  peIsLikelyDiagnosis: boolean; // Wells peLikely
}

interface YearsAlgorithmProps {
  result: YEARSResult | null;
  ddimerValue: number | undefined;
  onDdimerValueChange: (value: number | undefined) => void;
  onResultChange: (result: YEARSResult) => void;
  syncedFromWells?: YEARSSyncedFromWells;
}

export function YearsAlgorithm({ result, ddimerValue, onDdimerValueChange, onResultChange, syncedFromWells }: YearsAlgorithmProps) {
  const [items, setItems] = useState({
    clinicalSignsDVT: false,
    hemoptysis: false,
    peIsLikelyDiagnosis: false,
  });

  // Sync from Wells criteria
  useEffect(() => {
    if (!syncedFromWells) return;
    setItems((prev) => {
      const next = {
        clinicalSignsDVT: syncedFromWells.clinicalSignsDVT || prev.clinicalSignsDVT,
        hemoptysis: syncedFromWells.hemoptysis || prev.hemoptysis,
        peIsLikelyDiagnosis: syncedFromWells.peIsLikelyDiagnosis || prev.peIsLikelyDiagnosis,
      };
      // Recalculate if d-dimer is available
      if (ddimerValue != null) {
        onResultChange(yearsAlgorithm(next, ddimerValue));
      }
      return next;
    });
  }, [syncedFromWells]); // eslint-disable-line react-hooks/exhaustive-deps

  const recalculate = (
    newItems: typeof items,
    newDdimer: number | undefined,
  ) => {
    if (newDdimer != null) {
      const res = yearsAlgorithm(newItems, newDdimer);
      onResultChange(res);
    }
  };

  const handleItemToggle = (key: keyof typeof items, checked: boolean) => {
    const next = { ...items, [key]: checked };
    setItems(next);
    recalculate(next, ddimerValue);
  };

  const handleDdimerChange = (v: number | undefined) => {
    onDdimerValueChange(v);
    recalculate(items, v);
  };

  const itemCount = Object.values(items).filter(Boolean).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>YEARS Algorithm</CardTitle>
        <CardDescription>
          Simplified diagnostic pathway combining clinical items with D-dimer thresholds
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-900">YEARS Items:</p>
            <div className="flex items-center gap-2">
              <Checkbox
                label="Clinical signs of DVT (leg swelling, pain)"
                checked={items.clinicalSignsDVT}
                onChange={(c) => handleItemToggle('clinicalSignsDVT', c)}
              />
              {syncedFromWells?.clinicalSignsDVT && (
                <span className="text-xs text-blue-600 font-medium">(from Wells)</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                label="Hemoptysis"
                checked={items.hemoptysis}
                onChange={(c) => handleItemToggle('hemoptysis', c)}
              />
              {syncedFromWells?.hemoptysis && (
                <span className="text-xs text-blue-600 font-medium">(from Wells)</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                label="PE is the most likely diagnosis"
                checked={items.peIsLikelyDiagnosis}
                onChange={(c) => handleItemToggle('peIsLikelyDiagnosis', c)}
              />
              {syncedFromWells?.peIsLikelyDiagnosis && (
                <span className="text-xs text-blue-600 font-medium">(from Wells)</span>
              )}
            </div>
          </div>

          <NumberInput
            label="D-dimer Value"
            value={ddimerValue}
            onChange={handleDdimerChange}
            min={0}
            step={10}
            placeholder="e.g. 450"
            unit="ng/mL"
          />

          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-sm text-gray-700">
              YEARS items present: <strong>{itemCount}</strong>
            </p>
            <p className="text-sm text-gray-700">
              D-dimer threshold:{' '}
              <strong>{itemCount === 0 ? '1000' : '500'} ng/mL</strong>
            </p>
          </div>

          {result && (
            <Alert variant={result.peExcluded ? 'success' : 'warning'}>
              {result.peExcluded ? (
                <>
                  <strong>PE Excluded by YEARS</strong>
                  <p className="mt-1 text-sm">
                    {result.yearsItemCount === 0
                      ? `0 YEARS items and D-dimer < 1000 ng/mL. No CTPA needed.`
                      : `D-dimer < 500 ng/mL despite ${result.yearsItemCount} YEARS item(s). No CTPA needed.`}
                  </p>
                </>
              ) : (
                <>
                  <strong>PE Not Excluded</strong>
                  <p className="mt-1 text-sm">
                    CTPA is indicated. D-dimer {result.dDimerValue} ng/mL exceeds threshold of{' '}
                    {result.dDimerThreshold} ng/mL
                    {result.yearsItemCount > 0 ? ` with ${result.yearsItemCount} YEARS item(s) present` : ''}.
                  </p>
                </>
              )}
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
