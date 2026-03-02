'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { Alert } from '@/components/ui/Alert';
import { CTEPHD_SCREENING_CRITERIA, SPECIALIZED_CLINIC_REFERRALS } from '@/data/ctephdScreening';
import type { CTEPDScreening as CTEPDScreeningData } from '@/types/assessment';

interface CTEPDScreeningProps {
  screening: CTEPDScreeningData;
  onScreeningChange: (screening: CTEPDScreeningData) => void;
}

export function CTEPDScreening({ screening, onScreeningChange }: CTEPDScreeningProps) {
  const handleChange = (field: 'persistentDyspnea' | 'functionalLimitation', value: boolean) => {
    const next = { ...screening, [field]: value };
    next.referralIndicated = next.persistentDyspnea || next.functionalLimitation;
    next.screeningInterval = next.referralIndicated
      ? 'Refer to CTEPH center for evaluation'
      : 'Screen at 3-6 months post-PE; sooner if symptoms develop';
    onScreeningChange(next);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>CTEPD / CTEPH Screening</CardTitle>
        <CardDescription>
          Screen at every visit for at least 1 year post-PE. Earlier referral if symptoms present.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-3">
            <Checkbox
              label="Persistent dyspnea (unexplained, > 3 months post-PE)"
              checked={screening.persistentDyspnea}
              onChange={(c) => handleChange('persistentDyspnea', c)}
            />
            <Checkbox
              label="Functional limitation (unable to return to pre-PE baseline)"
              checked={screening.functionalLimitation}
              onChange={(c) => handleChange('functionalLimitation', c)}
            />
          </div>

          {screening.referralIndicated ? (
            <Alert variant="warning" title="Referral Indicated">
              {screening.screeningInterval}. Consider echocardiography and V/Q scan to evaluate
              for chronic thromboembolic pulmonary disease.
            </Alert>
          ) : (
            <Alert variant="info">
              <strong>Screening interval:</strong> {screening.screeningInterval}
            </Alert>
          )}

          <div>
            <p className="text-sm font-medium text-gray-900 mb-3">CTEPD Red Flags:</p>
            <div className="space-y-2">
              {CTEPHD_SCREENING_CRITERIA.map((criterion) => (
                <div
                  key={criterion.id}
                  className="rounded-lg border border-gray-100 p-3"
                >
                  <p className="text-sm font-medium text-gray-900">{criterion.symptom}</p>
                  <p className="text-xs text-gray-600">{criterion.description}</p>
                  <p className="text-xs text-amber-700 mt-1">
                    Referral threshold: {criterion.referralThreshold}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-900 mb-3">Specialized Clinic Referrals:</p>
            <div className="space-y-2">
              {SPECIALIZED_CLINIC_REFERRALS.map((referral, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-gray-100 p-3"
                >
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">{referral.indication}</p>
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      referral.urgency === 'urgent'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {referral.urgency}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{referral.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
