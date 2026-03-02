'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Alert } from '@/components/ui/Alert';
import { WELLS_CRITERIA } from '@/data/wellsCriteria';
import { GENEVA_CRITERIA } from '@/data/genevaCriteria';
import { calculateWells } from '@/lib/scoring/wells';
import { calculateGeneva } from '@/lib/scoring/geneva';
import type { WellsResult, GenevaResult } from '@/types/scores';

export interface PTPCriteriaState {
  wellsCriteria: Record<string, boolean>;
  genevaCriteria: Record<string, boolean>;
}

interface PreTestProbabilityPanelProps {
  wellsResult: WellsResult | null;
  genevaResult: GenevaResult | null;
  onWellsChange: (result: WellsResult) => void;
  onGenevaChange: (result: GenevaResult) => void;
  onProbabilityChange: (probability: 'low' | 'intermediate' | 'high') => void;
  onCriteriaChange?: (criteria: PTPCriteriaState) => void;
}

export function PreTestProbabilityPanel({
  wellsResult,
  genevaResult,
  onWellsChange,
  onGenevaChange,
  onProbabilityChange,
  onCriteriaChange,
}: PreTestProbabilityPanelProps) {
  const [wellsCriteria, setWellsCriteria] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    WELLS_CRITERIA.forEach((c) => { init[c.id] = false; });
    return init;
  });

  const [genevaCriteria, setGenevaCriteria] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    GENEVA_CRITERIA.forEach((c) => { init[c.id] = false; });
    return init;
  });

  const computedWells = useMemo(() => calculateWells(wellsCriteria), [wellsCriteria]);
  const computedGeneva = useMemo(() => calculateGeneva(genevaCriteria), [genevaCriteria]);

  // Fire initial probability on mount so downstream sections (PERC, D-dimer) appear
  const didInit = useRef(false);
  useEffect(() => {
    if (!didInit.current) {
      didInit.current = true;
      onWellsChange(computedWells);
      const mapped = computedWells.threeLevel === 'moderate' ? 'intermediate' as const : computedWells.threeLevel;
      onProbabilityChange(mapped);
    }
  }, [computedWells, onWellsChange, onProbabilityChange]);

  const handleWellsToggle = (id: string, checked: boolean) => {
    const next = { ...wellsCriteria, [id]: checked };
    setWellsCriteria(next);
    const result = calculateWells(next);
    onWellsChange(result);
    const mapped = result.threeLevel === 'moderate' ? 'intermediate' as const : result.threeLevel;
    onProbabilityChange(mapped);
    onCriteriaChange?.({ wellsCriteria: next, genevaCriteria });
  };

  const handleGenevaToggle = (id: string, checked: boolean) => {
    const next = { ...genevaCriteria, [id]: checked };
    if (id === 'heartRate95plus' && checked) {
      next.heartRate75to94 = false;
    } else if (id === 'heartRate75to94' && checked) {
      next.heartRate95plus = false;
    }
    setGenevaCriteria(next);
    const result = calculateGeneva(next);
    onGenevaChange(result);
    onProbabilityChange(result.probability);
    onCriteriaChange?.({ wellsCriteria, genevaCriteria: next });
  };

  const riskColorClass = (level: string) => {
    if (level === 'low') return 'bg-green-100 text-green-800';
    if (level === 'moderate' || level === 'intermediate') return 'bg-amber-100 text-amber-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pre-Test Probability</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="wells">
          <TabsList>
            <TabsTrigger value="wells">Wells Score</TabsTrigger>
            <TabsTrigger value="geneva">Revised Geneva</TabsTrigger>
          </TabsList>

          <TabsContent value="wells">
            <div className="space-y-3">
              {WELLS_CRITERIA.map((criterion) => (
                <div key={criterion.id} className="flex items-start justify-between gap-2">
                  <Checkbox
                    label={criterion.label}
                    checked={wellsCriteria[criterion.id]}
                    onChange={(checked) => handleWellsToggle(criterion.id, checked)}
                  />
                  <span className="shrink-0 text-xs font-medium text-gray-500">
                    +{criterion.points}
                  </span>
                </div>
              ))}
              <div className="mt-4 flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <span className="text-sm font-semibold text-gray-900">
                  Total: {computedWells.total}
                </span>
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${riskColorClass(computedWells.threeLevel)}`}>
                  {computedWells.probability === 'unlikely' ? 'PE Unlikely' : 'PE Likely'} ({computedWells.threeLevel})
                </span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="geneva">
            <div className="space-y-3">
              {GENEVA_CRITERIA.map((criterion) => (
                <div key={criterion.id} className="flex items-start justify-between gap-2">
                  <Checkbox
                    label={criterion.label}
                    checked={genevaCriteria[criterion.id]}
                    onChange={(checked) => handleGenevaToggle(criterion.id, checked)}
                  />
                  <span className="shrink-0 text-xs font-medium text-gray-500">
                    +{criterion.points}
                  </span>
                </div>
              ))}
              <div className="mt-4 flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <span className="text-sm font-semibold text-gray-900">
                  Total: {computedGeneva.total}
                </span>
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${riskColorClass(computedGeneva.probability)}`}>
                  {computedGeneva.probability} probability
                </span>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {(wellsResult || genevaResult) && (
          <Alert variant="info" className="mt-4">
            {wellsResult && <p className="text-sm">{wellsResult.interpretation}</p>}
            {genevaResult && <p className="text-sm">{genevaResult.interpretation}</p>}
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
