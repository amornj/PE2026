'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import type { BiomarkerStatus } from '@/types/classification';

interface BiomarkerPanelProps {
  biomarkers: BiomarkerStatus;
  onChange: (biomarkers: BiomarkerStatus) => void;
}

export function BiomarkerPanel({ biomarkers, onChange }: BiomarkerPanelProps) {
  const update = (field: keyof BiomarkerStatus, value: boolean) => {
    onChange({ ...biomarkers, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Biomarkers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Checkbox
            label="Troponin elevated (above institutional upper limit of normal)"
            checked={biomarkers.troponinElevated}
            onChange={(c) => update('troponinElevated', c)}
          />
          <Checkbox
            label="BNP / NT-proBNP elevated"
            checked={biomarkers.bnpElevated}
            onChange={(c) => update('bnpElevated', c)}
          />
          <Checkbox
            label="Lactate elevated (> 2 mmol/L)"
            checked={biomarkers.lactateElevated}
            onChange={(c) => update('lactateElevated', c)}
          />
        </div>

        {(biomarkers.troponinElevated || biomarkers.bnpElevated || biomarkers.lactateElevated) && (
          <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-3">
            <p className="text-sm text-amber-800">
              {biomarkers.troponinElevated && (
                <span className="block">
                  Elevated troponin suggests myocardial injury from RV strain and is a key determinant for Category C2/C3 classification.
                </span>
              )}
              {biomarkers.lactateElevated && (
                <span className="block mt-1">
                  Elevated lactate may indicate tissue hypoperfusion and end-organ dysfunction.
                </span>
              )}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
