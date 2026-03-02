'use client';

import { useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { getAdvancedTherapyRecommendations } from '@/lib/management/advancedTherapy';
import { ADVANCED_THERAPY_OPTIONS } from '@/data/advancedTherapyOptions';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/Accordion';
import type { PESubcategory } from '@/types/classification';
import type { AdvancedTherapyPlan } from '@/types/assessment';
import { cn } from '@/lib/utils';

interface AdvancedTherapyPanelProps {
  subcategory: PESubcategory;
  onPlanChange: (plan: AdvancedTherapyPlan) => void;
}

const THERAPY_KEYS: (keyof AdvancedTherapyPlan)[] = [
  'systemicLysis',
  'cdl',
  'mechanicalThrombectomy',
  'surgicalEmbolectomy',
  'ecmo',
];

const THERAPY_LABELS: Record<string, string> = {
  systemicLysis: 'Systemic Thrombolysis',
  cdl: 'Catheter-Directed Therapy (CDL)',
  mechanicalThrombectomy: 'Mechanical Thrombectomy',
  surgicalEmbolectomy: 'Surgical Embolectomy',
  ecmo: 'ECMO',
};

export function AdvancedTherapyPanel({ subcategory, onPlanChange }: AdvancedTherapyPanelProps) {
  const plan = useMemo(
    () => getAdvancedTherapyRecommendations(subcategory),
    [subcategory],
  );

  useEffect(() => {
    onPlanChange(plan);
  }, [plan]);

  const hasRecommended = THERAPY_KEYS.some((k) => plan[k].recommended);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Therapy Recommendations</CardTitle>
        <CardDescription>
          COR/LOE-based recommendations for Category {subcategory}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!hasRecommended && (
            <Alert variant="info">
              No advanced therapies are recommended for Category {subcategory}. Anticoagulation alone is the standard of care.
            </Alert>
          )}

          <div className="space-y-3">
            {THERAPY_KEYS.map((key) => {
              const rec = plan[key];
              const label = THERAPY_LABELS[key];
              const isHarmful = rec.cor === '3-harm';
              const isNoBenefit = rec.cor === '3-no-benefit';
              const isRecommended = rec.recommended;

              return (
                <div
                  key={key}
                  className={cn(
                    'rounded-lg border p-4',
                    isRecommended ? 'border-green-200 bg-green-50' :
                    isHarmful ? 'border-red-100 bg-red-50/50' :
                    'border-gray-200',
                  )}
                >
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={cn(
                      'text-sm font-semibold',
                      isRecommended ? 'text-green-800' :
                      isHarmful ? 'text-red-700' :
                      'text-gray-900',
                    )}>
                      {label}
                    </span>
                    <Badge variant="cor" cor={rec.cor} />
                    <Badge variant="loe" loe={rec.loe} />
                  </div>
                  <p className="text-sm text-gray-700">{rec.notes}</p>
                </div>
              );
            })}
          </div>

          <Accordion type="single">
            <AccordionItem id="therapy-details">
              <AccordionTrigger id="therapy-details">
                Therapy Details (Indications, Contraindications, Complications)
              </AccordionTrigger>
              <AccordionContent id="therapy-details">
                <div className="space-y-4">
                  {ADVANCED_THERAPY_OPTIONS.map((therapy) => (
                    <div key={therapy.id} className="rounded-lg border border-gray-100 p-3">
                      <h4 className="font-medium text-sm text-gray-900">{therapy.name}</h4>
                      <p className="text-xs text-gray-600 mt-1">{therapy.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        <strong>Mechanism:</strong> {therapy.mechanism}
                      </p>
                      {therapy.contraindications.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-red-700">Contraindications:</p>
                          <ul className="text-xs text-gray-600 list-disc list-inside">
                            {therapy.contraindications.map((c, i) => (
                              <li key={i}>{c}</li>
                            ))}
                          </ul>
                        </div>
                      )}
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
