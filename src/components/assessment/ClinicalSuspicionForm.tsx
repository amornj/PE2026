'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';

const SYMPTOMS = [
  { id: 'dyspnea', label: 'Dyspnea (shortness of breath)' },
  { id: 'chestPain', label: 'Pleuritic chest pain' },
  { id: 'syncope', label: 'Syncope or presyncope' },
  { id: 'hemoptysis', label: 'Hemoptysis' },
  { id: 'tachycardia', label: 'Tachycardia (HR > 100 bpm)' },
  { id: 'legSwelling', label: 'Unilateral leg swelling / DVT signs' },
];

const RISK_FACTORS = [
  { id: 'priorVTE', label: 'Prior DVT/PE' },
  { id: 'cancer', label: 'Active malignancy' },
  { id: 'recentSurgery', label: 'Recent surgery (within 4 weeks)' },
  { id: 'immobilization', label: 'Immobilization (>3 days)' },
  { id: 'estrogenUse', label: 'Estrogen use (OCP, HRT)' },
  { id: 'obesity', label: 'Obesity (BMI > 30)' },
  { id: 'thrombophilia', label: 'Known thrombophilia' },
  { id: 'familyVTE', label: 'Family history of VTE' },
];

interface ClinicalSuspicionFormProps {
  symptoms: string[];
  riskFactors: string[];
  onSymptomsChange: (symptoms: string[]) => void;
  onRiskFactorsChange: (riskFactors: string[]) => void;
}

export function ClinicalSuspicionForm({
  symptoms,
  riskFactors,
  onSymptomsChange,
  onRiskFactorsChange,
}: ClinicalSuspicionFormProps) {
  const toggleSymptom = (id: string, checked: boolean) => {
    onSymptomsChange(
      checked ? [...symptoms, id] : symptoms.filter((s) => s !== id),
    );
  };

  const toggleRiskFactor = (id: string, checked: boolean) => {
    onRiskFactorsChange(
      checked ? [...riskFactors, id] : riskFactors.filter((r) => r !== id),
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Presenting Symptoms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {SYMPTOMS.map((s) => (
              <Checkbox
                key={s.id}
                label={s.label}
                checked={symptoms.includes(s.id)}
                onChange={(checked) => toggleSymptom(s.id, checked)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Risk Factors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {RISK_FACTORS.map((r) => (
              <Checkbox
                key={r.id}
                label={r.label}
                checked={riskFactors.includes(r.id)}
                onChange={(checked) => toggleRiskFactor(r.id, checked)}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
