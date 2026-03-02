'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { NumberInput } from '@/components/ui/NumberInput';
import { Alert } from '@/components/ui/Alert';
import { evaluateDDimer } from '@/lib/ddimer';
import type { DDimerResult } from '@/types/assessment';

interface DDimerInterpreterProps {
  result: DDimerResult | null;
  ddimerValue: number | undefined;
  onDdimerValueChange: (value: number | undefined) => void;
  onResultChange: (result: DDimerResult) => void;
}

export function DDimerInterpreter({ result, ddimerValue, onDdimerValueChange, onResultChange }: DDimerInterpreterProps) {
  const [age, setAge] = useState<number | undefined>(undefined);

  const handleCalculate = (newAge: number | undefined, newValue: number | undefined) => {
    if (newAge != null && newValue != null && newAge > 0) {
      const evaluated = evaluateDDimer(newAge, newValue);
      onResultChange(evaluated);
    }
  };

  const handleAgeChange = (v: number | undefined) => {
    setAge(v);
    handleCalculate(v, ddimerValue);
  };

  const handleValueChange = (v: number | undefined) => {
    onDdimerValueChange(v);
    handleCalculate(age, v);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>D-dimer Interpretation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberInput
            label="Patient Age"
            value={age}
            onChange={handleAgeChange}
            min={1}
            max={120}
            placeholder="e.g. 65"
            unit="years"
          />
          <NumberInput
            label="D-dimer Value"
            value={ddimerValue}
            onChange={handleValueChange}
            min={0}
            step={10}
            placeholder="e.g. 600"
            unit="ng/mL"
          />
        </div>

        {result && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
              <span className="text-sm text-gray-700">
                Age-adjusted threshold: <strong>{result.ageAdjustedThreshold} ng/mL</strong>
                {age != null && age > 50 && (
                  <span className="ml-1 text-xs text-gray-500">({age} x 10)</span>
                )}
              </span>
            </div>

            <Alert variant={result.isPositive ? 'warning' : 'success'}>
              <strong>D-dimer {result.isPositive ? 'POSITIVE' : 'NEGATIVE'}</strong>
              <span className="ml-1">
                ({result.value} ng/mL {result.isPositive ? '>=' : '<'} {result.ageAdjustedThreshold} ng/mL threshold)
              </span>
              {!result.isPositive && (
                <p className="mt-1 text-sm">
                  PE can be safely excluded in patients with low-to-intermediate pre-test probability and a negative age-adjusted D-dimer.
                </p>
              )}
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
