'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { Checkbox } from '@/components/ui/Checkbox';

interface SymptomAssessmentProps {
  isIncidental: boolean;
  isSymptomatic: boolean;
  isSubsegmental: boolean;
  onChange: (data: {
    isIncidental: boolean;
    isSymptomatic: boolean;
    isSubsegmental: boolean;
  }) => void;
}

export function SymptomAssessment({
  isIncidental,
  isSymptomatic,
  isSubsegmental,
  onChange,
}: SymptomAssessmentProps) {
  const symptomStatus = isIncidental
    ? 'incidental'
    : isSymptomatic
      ? 'symptomatic'
      : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Symptom Assessment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <RadioGroup
            name="symptomStatus"
            label="How was the PE identified?"
            options={[
              {
                value: 'symptomatic',
                label: 'Symptomatic PE',
                description:
                  'PE diagnosed based on presenting symptoms (dyspnea, chest pain, etc.)',
              },
              {
                value: 'incidental',
                label: 'Incidental PE',
                description:
                  'PE discovered on imaging performed for another indication',
              },
            ]}
            value={symptomStatus}
            onChange={(v) =>
              onChange({
                isIncidental: v === 'incidental',
                isSymptomatic: v === 'symptomatic',
                isSubsegmental,
              })
            }
          />

          {isSymptomatic && (
            <Checkbox
              label="Subsegmental PE only (no segmental or more proximal clot)"
              checked={isSubsegmental}
              onChange={(c) =>
                onChange({ isIncidental, isSymptomatic, isSubsegmental: c })
              }
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
