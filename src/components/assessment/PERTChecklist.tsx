'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { Alert } from '@/components/ui/Alert';
import type { PESubcategory } from '@/types/classification';

interface PERTChecklistProps {
  subcategory: PESubcategory;
  pertActivated: boolean;
  onPertActivatedChange: (activated: boolean) => void;
}

const PERT_CRITERIA = [
  'Hemodynamic instability (Category D or E)',
  'RV dysfunction with biomarker elevation (Category C2-C3)',
  'Clinical deterioration despite anticoagulation',
  'Need for advanced therapy decision-making',
  'Complex patient factors (e.g., bleeding risk, pregnancy, recent surgery)',
];

const PERT_RECOMMENDED_CATEGORIES: PESubcategory[] = [
  'C2', 'C3', 'D1', 'D2', 'E1', 'E2',
];

export function PERTChecklist({
  subcategory,
  pertActivated,
  onPertActivatedChange,
}: PERTChecklistProps) {
  const isRecommended = PERT_RECOMMENDED_CATEGORIES.includes(subcategory);

  return (
    <Card>
      <CardHeader>
        <CardTitle>PERT Activation</CardTitle>
        <CardDescription>
          Pulmonary Embolism Response Team -- multidisciplinary rapid consultation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isRecommended ? (
            <Alert variant="warning" title="PERT Activation Recommended">
              Category {subcategory} meets criteria for PERT activation. Multidisciplinary
              consultation is recommended for advanced therapy decision-making.
            </Alert>
          ) : (
            <Alert variant="info">
              PERT activation is not routinely needed for Category {subcategory}, but may be
              considered if clinical deterioration occurs or complex factors are present.
            </Alert>
          )}

          <div>
            <p className="text-sm font-medium text-gray-900 mb-3">PERT Activation Criteria:</p>
            <ul className="space-y-2">
              {PERT_CRITERIA.map((criterion, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                  {criterion}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <Checkbox
              label="PERT has been activated for this patient"
              checked={pertActivated}
              onChange={onPertActivatedChange}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
