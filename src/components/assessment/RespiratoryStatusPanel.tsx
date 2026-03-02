'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { NumberInput } from '@/components/ui/NumberInput';
import { Alert } from '@/components/ui/Alert';
import type { RespiratoryStatus } from '@/types/classification';

interface RespiratoryStatusPanelProps {
  respiratory: RespiratoryStatus;
  onChange: (respiratory: RespiratoryStatus) => void;
}

export function RespiratoryStatusPanel({ respiratory, onChange }: RespiratoryStatusPanelProps) {
  const update = (field: keyof RespiratoryStatus, value: boolean | number | undefined) => {
    onChange({ ...respiratory, [field]: value });
  };

  const hasRModifier =
    respiratory.intubated ||
    respiratory.positivePresVent ||
    respiratory.nonRebreather ||
    respiratory.highFlowNC ||
    (respiratory.oxygenLiters != null && respiratory.oxygenLiters > 6);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Respiratory Status</CardTitle>
        <CardDescription>
          Determines the R modifier (significant respiratory compromise requiring advanced O2 support).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <NumberInput
            label="Supplemental O2 (if on nasal cannula)"
            value={respiratory.oxygenLiters}
            onChange={(v) => update('oxygenLiters', v)}
            min={0}
            max={15}
            step={1}
            unit="L/min"
            placeholder="e.g. 4"
          />

          <div className="space-y-3">
            <Checkbox
              label="Non-rebreather mask"
              checked={respiratory.nonRebreather}
              onChange={(c) => update('nonRebreather', c)}
            />
            <Checkbox
              label="High-flow nasal cannula (HFNC)"
              checked={respiratory.highFlowNC}
              onChange={(c) => update('highFlowNC', c)}
            />
            <Checkbox
              label="Positive pressure ventilation (NIV/BiPAP/CPAP)"
              checked={respiratory.positivePresVent}
              onChange={(c) => update('positivePresVent', c)}
            />
            <Checkbox
              label="Intubated / mechanical ventilation"
              checked={respiratory.intubated}
              onChange={(c) => update('intubated', c)}
            />
          </div>

          {hasRModifier && (
            <Alert variant="warning" title="R Modifier Applies">
              Significant respiratory compromise detected. The (R) modifier will be added to the
              PE category, indicating elevated respiratory risk regardless of hemodynamic status.
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
