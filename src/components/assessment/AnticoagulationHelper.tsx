'use client';

import { useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/Accordion';
import { getAnticoagRecommendation, getAnticoagOptions } from '@/lib/management/anticoagulation';
import type { PESubcategory } from '@/types/classification';
import type { SpecialPopulation, AnticoagulationPlan } from '@/types/assessment';

const SPECIAL_POPULATIONS: { id: SpecialPopulation; label: string }[] = [
  { id: 'cancer', label: 'Active cancer' },
  { id: 'pregnancy', label: 'Pregnancy' },
  { id: 'breastfeeding', label: 'Breastfeeding' },
  { id: 'aps', label: 'Antiphospholipid syndrome (APS)' },
  { id: 'renalImpairment', label: 'Renal impairment (CrCl < 30 mL/min)' },
  { id: 'liverDisease', label: 'Liver disease' },
  { id: 'obesity', label: 'Obesity (BMI > 40 or weight > 120 kg)' },
  { id: 'elderly', label: 'Elderly (age > 75)' },
];

interface AnticoagulationHelperProps {
  subcategory: PESubcategory;
  specialPopulations: SpecialPopulation[];
  onSpecialPopulationsChange: (pops: SpecialPopulation[]) => void;
  onPlanChange: (plan: AnticoagulationPlan) => void;
}

export function AnticoagulationHelper({
  subcategory,
  specialPopulations,
  onSpecialPopulationsChange,
  onPlanChange,
}: AnticoagulationHelperProps) {
  const plan = useMemo(
    () => getAnticoagRecommendation(subcategory, specialPopulations),
    [subcategory, specialPopulations],
  );

  useEffect(() => {
    onPlanChange(plan);
  }, [plan]);

  const allOptions = getAnticoagOptions();

  const togglePopulation = (pop: SpecialPopulation, checked: boolean) => {
    const next = checked
      ? [...specialPopulations, pop]
      : specialPopulations.filter((p) => p !== pop);
    onSpecialPopulationsChange(next);
  };

  const initialDrug = allOptions.find((o) => o.id === plan.initialAgent);
  const maintenanceDrug = allOptions.find((o) => o.id === plan.maintenanceAgent);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Anticoagulation Recommendations</CardTitle>
        <CardDescription>
          Based on Category {subcategory} and selected special populations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium text-gray-900 mb-3">Special Populations:</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {SPECIAL_POPULATIONS.map((pop) => (
                <Checkbox
                  key={pop.id}
                  label={pop.label}
                  checked={specialPopulations.includes(pop.id)}
                  onChange={(c) => togglePopulation(pop.id, c)}
                />
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 divide-y divide-gray-200">
            {initialDrug && (
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold text-gray-900">Initial Therapy:</span>
                  <Badge variant="cor" cor={initialDrug.cor}>{initialDrug.name}</Badge>
                </div>
                <p className="text-sm text-gray-700">
                  <strong>Dose:</strong> {initialDrug.initialDose}
                </p>
                {initialDrug.renalAdjustment && (
                  <p className="text-xs text-gray-500 mt-1">
                    Renal: {initialDrug.renalAdjustment}
                  </p>
                )}
              </div>
            )}
            {maintenanceDrug && (
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold text-gray-900">Maintenance Therapy:</span>
                  <Badge variant="cor" cor={maintenanceDrug.cor}>{maintenanceDrug.name}</Badge>
                </div>
                <p className="text-sm text-gray-700">
                  <strong>Dose:</strong> {maintenanceDrug.maintenanceDose}
                </p>
              </div>
            )}
          </div>

          {plan.contraindicationNotes.length > 0 && (
            <Alert variant="warning" title="Population-Specific Considerations">
              <ul className="mt-1 space-y-1">
                {plan.contraindicationNotes.map((note, i) => (
                  <li key={i} className="text-sm">{note}</li>
                ))}
              </ul>
            </Alert>
          )}

          <Accordion type="single">
            <AccordionItem id="all-options">
              <AccordionTrigger id="all-options">
                View All Anticoagulation Options
              </AccordionTrigger>
              <AccordionContent id="all-options">
                <div className="space-y-4">
                  {allOptions.map((drug) => (
                    <div key={drug.id} className="rounded-lg border border-gray-100 p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{drug.name}</span>
                        <Badge>{drug.class}</Badge>
                        <Badge variant="cor" cor={drug.cor} />
                      </div>
                      <p className="text-xs text-gray-600">Initial: {drug.initialDose}</p>
                      <p className="text-xs text-gray-600">Maintenance: {drug.maintenanceDose}</p>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
}
