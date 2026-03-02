'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { Alert } from '@/components/ui/Alert';
import type { HemodynamicStatus } from '@/types/classification';

interface HemodynamicsPanelProps {
  hemodynamics: HemodynamicStatus;
  onChange: (hemodynamics: HemodynamicStatus) => void;
}

export function HemodynamicsPanel({ hemodynamics, onChange }: HemodynamicsPanelProps) {
  const update = (field: keyof HemodynamicStatus, value: boolean) => {
    onChange({ ...hemodynamics, [field]: value });
  };

  const hasAnyInstability =
    hemodynamics.cardiacArrest ||
    hemodynamics.refractoryShock ||
    hemodynamics.cardiogenicShock ||
    hemodynamics.hypotension ||
    hemodynamics.transientHypotension;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hemodynamic Assessment</CardTitle>
        <CardDescription>
          Determines Category D/E classification. Hemodynamic instability takes priority in the classification hierarchy.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-3">
            <Checkbox
              label="Cardiac arrest (PEA, asystole, or VF attributed to PE)"
              checked={hemodynamics.cardiacArrest}
              onChange={(c) => update('cardiacArrest', c)}
            />
            <Checkbox
              label="Refractory shock (not responding to maximal vasopressor/inotrope support)"
              checked={hemodynamics.refractoryShock}
              onChange={(c) => update('refractoryShock', c)}
            />
            <Checkbox
              label="Cardiogenic shock (SCAI stage C: SBP < 90 requiring vasopressors + hypoperfusion)"
              checked={hemodynamics.cardiogenicShock}
              onChange={(c) => update('cardiogenicShock', c)}
            />
            <Checkbox
              label="Persistent hypotension (SBP < 90 mmHg for > 15 minutes)"
              checked={hemodynamics.hypotension}
              onChange={(c) => update('hypotension', c)}
            />
            <Checkbox
              label="Transient hypotension (responds to IV fluid resuscitation)"
              checked={hemodynamics.transientHypotension}
              onChange={(c) => update('transientHypotension', c)}
            />
            <Checkbox
              label="End-organ dysfunction (altered mental status, cool/mottled skin, oliguria, elevated lactate)"
              checked={hemodynamics.endOrganDysfunction}
              onChange={(c) => update('endOrganDysfunction', c)}
            />
          </div>

          {hasAnyInstability && (
            <Alert variant="error" title="Hemodynamic Instability Detected">
              {hemodynamics.cardiacArrest || hemodynamics.refractoryShock ? (
                <p>Category E2 -- Cardiac arrest / refractory shock. Emergent intervention required.</p>
              ) : hemodynamics.cardiogenicShock ? (
                <p>Category E1 -- Cardiogenic shock. Emergent reperfusion consideration.</p>
              ) : hemodynamics.hypotension && hemodynamics.endOrganDysfunction ? (
                <p>Category D2 -- Persistent hypotension with end-organ dysfunction.</p>
              ) : (
                <p>Category D1 -- Transient or responsive hypotension.</p>
              )}
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
