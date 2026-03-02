'use client';

import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { assessIVCFilter, type IVCFilterInput } from '@/lib/management/ivcFilter';

interface IVCFilterDecisionTreeProps {
  onFilterChange: (considered: boolean, indicated: boolean) => void;
}

export function IVCFilterDecisionTree({ onFilterChange }: IVCFilterDecisionTreeProps) {
  const [input, setInput] = useState<IVCFilterInput>({
    absoluteContraindicationToAnticoag: false,
    activeBleedingPrecludingAnticoag: false,
    recurrentPEOnTherapeuticAnticoag: false,
  });

  const result = useMemo(() => {
    const res = assessIVCFilter(input);
    const isConsidered =
      input.absoluteContraindicationToAnticoag ||
      input.activeBleedingPrecludingAnticoag ||
      input.recurrentPEOnTherapeuticAnticoag;
    onFilterChange(isConsidered, res.cor === '2a');
    return res;
  }, [input]);

  const updateInput = (field: keyof IVCFilterInput, value: boolean) => {
    setInput((prev) => ({ ...prev, [field]: value }));
  };

  const isIndicated = result.cor === '2a';

  return (
    <Card>
      <CardHeader>
        <CardTitle>IVC Filter Decision</CardTitle>
        <CardDescription>
          IVC filter placement is reserved for specific contraindications to anticoagulation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-3">
            <Checkbox
              label="Absolute contraindication to anticoagulation"
              checked={input.absoluteContraindicationToAnticoag}
              onChange={(c) => updateInput('absoluteContraindicationToAnticoag', c)}
            />
            <Checkbox
              label="Active bleeding precluding anticoagulation"
              checked={input.activeBleedingPrecludingAnticoag}
              onChange={(c) => updateInput('activeBleedingPrecludingAnticoag', c)}
            />
            <Checkbox
              label="Recurrent PE despite therapeutic anticoagulation"
              checked={input.recurrentPEOnTherapeuticAnticoag}
              onChange={(c) => updateInput('recurrentPEOnTherapeuticAnticoag', c)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="cor" cor={result.cor} />
            <Badge variant="loe" loe={result.loe} />
          </div>

          <Alert variant={isIndicated ? 'warning' : 'info'}>
            {result.recommendation}
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
}
