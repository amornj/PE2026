'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { Checkbox } from '@/components/ui/Checkbox';
import { Alert } from '@/components/ui/Alert';
import type { DDimerResult, YEARSResult, ImagingResult } from '@/types/assessment';
import type { WellsResult, GenevaResult } from '@/types/scores';

interface ImagingRecommendationProps {
  wellsResult: WellsResult | null;
  genevaResult: GenevaResult | null;
  ddimerResult: DDimerResult | null;
  yearsResult: YEARSResult | null;
  imaging: ImagingResult;
  peConfirmed: boolean | null;
  onImagingChange: (imaging: Partial<ImagingResult>) => void;
  onPEConfirmedChange: (confirmed: boolean | null) => void;
}

export function ImagingRecommendation({
  wellsResult,
  genevaResult,
  ddimerResult,
  yearsResult,
  imaging,
  peConfirmed,
  onImagingChange,
  onPEConfirmedChange,
}: ImagingRecommendationProps) {
  const ptpLevel =
    wellsResult?.threeLevel ?? genevaResult?.probability ?? null;
  const ddimerNegative = ddimerResult != null && !ddimerResult.isPositive;
  const yearsExcluded = yearsResult != null && yearsResult.peExcluded;
  const highPTP = ptpLevel === 'high';

  let recommendation: string;
  let recommendationVariant: 'info' | 'warning' | 'success' = 'info';

  if (yearsExcluded && !highPTP) {
    recommendation =
      'PE excluded by YEARS algorithm. No further imaging required unless clinical suspicion persists.';
    recommendationVariant = 'success';
  } else if (ddimerNegative && !highPTP) {
    recommendation =
      'D-dimer negative with low/intermediate PTP. PE can be safely excluded without imaging.';
    recommendationVariant = 'success';
  } else if (highPTP) {
    recommendation =
      'High pre-test probability. Proceed directly to CTPA without D-dimer. D-dimer should not be used to exclude PE in high-PTP patients.';
    recommendationVariant = 'warning';
  } else if (ddimerResult?.isPositive) {
    recommendation =
      'D-dimer positive. CTPA is recommended. Consider V/Q scan if CTPA contraindicated (e.g., contrast allergy, severe renal insufficiency).';
    recommendationVariant = 'warning';
  } else {
    recommendation =
      'Complete pre-test probability and D-dimer assessment above, or select imaging results if already performed.';
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Imaging & PE Confirmation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Alert variant={recommendationVariant}>
            <strong>Recommendation:</strong> {recommendation}
          </Alert>

          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-900">Imaging Performed:</p>

            <Checkbox
              label="CTPA performed"
              checked={imaging.ctpaPerformed}
              onChange={(c) => onImagingChange({ ctpaPerformed: c })}
            />
            {imaging.ctpaPerformed && (
              <div className="ml-7">
                <Checkbox
                  label="CTPA positive for PE"
                  checked={imaging.ctpaPositive}
                  onChange={(c) => onImagingChange({ ctpaPositive: c })}
                />
              </div>
            )}

            <Checkbox
              label="V/Q scan performed"
              checked={imaging.vqScanPerformed}
              onChange={(c) => onImagingChange({ vqScanPerformed: c })}
            />
            {imaging.vqScanPerformed && (
              <div className="ml-7">
                <RadioGroup
                  name="vqResult"
                  label="V/Q scan result"
                  options={[
                    { value: 'normal', label: 'Normal' },
                    { value: 'low', label: 'Low probability' },
                    { value: 'intermediate', label: 'Intermediate probability' },
                    { value: 'high', label: 'High probability' },
                  ]}
                  value={imaging.vqResult}
                  onChange={(v) =>
                    onImagingChange({
                      vqResult: v as ImagingResult['vqResult'],
                    })
                  }
                />
              </div>
            )}

            <Checkbox
              label="Compression leg ultrasound (CLUS) performed"
              checked={imaging.clusPerformed}
              onChange={(c) => onImagingChange({ clusPerformed: c })}
            />
            {imaging.clusPerformed && (
              <div className="ml-7">
                <Checkbox
                  label="CLUS positive for DVT"
                  checked={imaging.clusPositive}
                  onChange={(c) => onImagingChange({ clusPositive: c })}
                />
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 pt-4">
            <RadioGroup
              name="peConfirmed"
              label="PE Diagnosis"
              options={[
                {
                  value: 'confirmed',
                  label: 'PE Confirmed',
                  description:
                    'Positive CTPA, high-probability V/Q, or proximal DVT in high-PTP patient',
                },
                {
                  value: 'excluded',
                  label: 'PE Excluded',
                  description:
                    'Negative CTPA, normal V/Q, or negative D-dimer with low/intermediate PTP',
                },
                {
                  value: 'uncertain',
                  label: 'Uncertain / Further Workup Needed',
                  description:
                    'Inconclusive imaging or discordant results requiring further evaluation',
                },
              ]}
              value={
                peConfirmed === true
                  ? 'confirmed'
                  : peConfirmed === false
                    ? 'excluded'
                    : peConfirmed === null
                      ? 'uncertain'
                      : null
              }
              onChange={(v) =>
                onPEConfirmedChange(
                  v === 'confirmed' ? true : v === 'excluded' ? false : null,
                )
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
