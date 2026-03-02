'use client';

import { useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { FOLLOWUP_SCHEDULE } from '@/data/followupSchedule';
import { getFollowUpPlan, type FollowUpInput } from '@/lib/management/followup';
import type { PESubcategory } from '@/types/classification';
import { cn } from '@/lib/utils';

interface FollowUpTimelineProps {
  subcategory: PESubcategory;
  riskCategory: FollowUpInput['riskCategory'];
  persistentDyspnea: boolean;
  functionalLimitation: boolean;
  oneWeekChecklist: string[];
  threeMonthChecklist: string[];
  onChecklistChange: (week: string[], threeMonth: string[]) => void;
}

export function FollowUpTimeline({
  subcategory,
  riskCategory,
  persistentDyspnea,
  functionalLimitation,
  oneWeekChecklist,
  threeMonthChecklist,
  onChecklistChange,
}: FollowUpTimelineProps) {
  const plan = useMemo(
    () =>
      getFollowUpPlan(subcategory, {
        riskCategory,
        persistentDyspnea,
        functionalLimitation,
      }),
    [subcategory, riskCategory, persistentDyspnea, functionalLimitation],
  );

  // Sync checklists when plan changes
  useEffect(() => {
    onChecklistChange(plan.oneWeekChecklist, plan.threeMonthChecklist);
  }, [plan.oneWeekChecklist, plan.threeMonthChecklist]);

  const timelinePoints = [
    {
      timing: '1 Week',
      description: FOLLOWUP_SCHEDULE[0].description,
      checklist: plan.oneWeekChecklist,
      cor: FOLLOWUP_SCHEDULE[0].cor,
      loe: FOLLOWUP_SCHEDULE[0].loe,
      color: 'blue',
    },
    {
      timing: '3 Months',
      description: FOLLOWUP_SCHEDULE[1].description,
      checklist: plan.threeMonthChecklist,
      cor: FOLLOWUP_SCHEDULE[1].cor,
      loe: FOLLOWUP_SCHEDULE[1].loe,
      color: 'green',
    },
    {
      timing: 'Ongoing',
      description: FOLLOWUP_SCHEDULE[2].description,
      checklist: FOLLOWUP_SCHEDULE[2].checklist,
      cor: FOLLOWUP_SCHEDULE[2].cor,
      loe: FOLLOWUP_SCHEDULE[2].loe,
      color: 'purple',
    },
  ];

  const dotColors: Record<string, string> = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    purple: 'bg-purple-600',
  };

  const bgColors: Record<string, string> = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    purple: 'bg-purple-50 border-purple-200',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Follow-Up Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" aria-hidden="true" />

          <div className="space-y-8">
            {timelinePoints.map((point, i) => (
              <div key={i} className="relative pl-10">
                {/* Timeline dot */}
                <div
                  className={cn(
                    'absolute left-2.5 top-1 h-3 w-3 rounded-full ring-2 ring-white',
                    dotColors[point.color],
                  )}
                  aria-hidden="true"
                />

                <div className={cn('rounded-lg border p-4', bgColors[point.color])}>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="text-sm font-bold text-gray-900">{point.timing}</h3>
                    {point.cor && <Badge variant="cor" cor={point.cor} />}
                    {point.loe && <Badge variant="loe" loe={point.loe} />}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{point.description}</p>
                  <ul className="space-y-1.5">
                    {point.checklist.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
