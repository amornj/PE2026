'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { NumberInput } from '@/components/ui/NumberInput';
import type { RVAssessment } from '@/types/classification';

interface RVAssessmentPanelProps {
  rv: RVAssessment;
  onChange: (rv: RVAssessment) => void;
}

export function RVAssessmentPanel({ rv, onChange }: RVAssessmentPanelProps) {
  const update = (field: keyof RVAssessment, value: boolean | number | undefined) => {
    onChange({ ...rv, [field]: value });
  };

  const hasAnyRVDysfunction =
    rv.rvDysfunction || rv.rvDilated || rv.mcConnellSign ||
    (rv.rvLvRatio != null && rv.rvLvRatio >= 1.0) ||
    (rv.tapse != null && rv.tapse < 1.6);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Right Ventricular Assessment</CardTitle>
        <CardDescription>
          RV dysfunction is a key determinant for C2/C3 classification and advanced therapy consideration.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-3">
            <Checkbox
              label="RV dysfunction on echocardiography"
              checked={rv.rvDysfunction}
              onChange={(c) => update('rvDysfunction', c)}
            />
            <Checkbox
              label="RV dilation (qualitative or RV > LV)"
              checked={rv.rvDilated}
              onChange={(c) => update('rvDilated', c)}
            />
            <Checkbox
              label="McConnell sign (RV free wall akinesia with apical sparing)"
              checked={rv.mcConnellSign}
              onChange={(c) => update('mcConnellSign', c)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <NumberInput
              label="RV/LV Ratio (CT or Echo)"
              value={rv.rvLvRatio}
              onChange={(v) => update('rvLvRatio', v)}
              min={0}
              max={5}
              step={0.1}
              placeholder="e.g. 1.2"
            />
            <NumberInput
              label="TAPSE"
              value={rv.tapse}
              onChange={(v) => update('tapse', v)}
              min={0}
              max={5}
              step={0.1}
              unit="cm"
              placeholder="e.g. 1.4"
            />
          </div>

          {hasAnyRVDysfunction && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
              <p className="text-sm font-medium text-amber-800">
                RV dysfunction detected.
              </p>
              <p className="text-sm text-amber-700 mt-1">
                This finding, combined with troponin status, determines C2 vs C3 classification.
                {rv.rvLvRatio != null && rv.rvLvRatio >= 1.0 && (
                  <span className="block mt-1">RV/LV ratio {rv.rvLvRatio.toFixed(1)} (abnormal: ≥ 1.0)</span>
                )}
                {rv.tapse != null && rv.tapse < 1.6 && (
                  <span className="block mt-1">TAPSE {rv.tapse.toFixed(1)} cm (abnormal: &lt; 1.6 cm)</span>
                )}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
