import { FollowUpScheduleItem } from '@/types/followup';

export const FOLLOWUP_SCHEDULE: FollowUpScheduleItem[] = [
  {
    timing: '1 week',
    description: 'Early follow-up to assess treatment response, tolerability, and complications.',
    checklist: [
      'Assess anticoagulation compliance and tolerability',
      'Review for bleeding complications',
      'Check renal function and CBC',
      'Evaluate symptom progression (dyspnea, chest pain)',
      'Confirm outpatient anticoagulation plan',
      'Assess need for dose adjustment',
      'Reinforce activity guidance and return precautions',
    ],
    cor: '1',
    loe: 'C-EO',
  },
  {
    timing: '3 months',
    description: 'Reassess treatment efficacy, screen for CTEPD, and determine anticoagulation duration.',
    checklist: [
      'Evaluate functional status and exercise tolerance',
      'Screen for persistent dyspnea (CTEPD screening)',
      'Echocardiography if RV dysfunction present at diagnosis',
      'Assess for post-PE syndrome',
      'Determine anticoagulation duration (provoked vs unprovoked)',
      'Evaluate for extended anticoagulation candidacy',
      'Review risk-benefit of ongoing therapy',
      'Consider V/Q scan if persistent symptoms',
    ],
    cor: '1',
    loe: 'B-NR',
  },
  {
    timing: 'Ongoing (6-12 months and beyond)',
    description: 'Long-term surveillance for recurrence, CTEPD, and anticoagulation management.',
    checklist: [
      'Annual reassessment of anticoagulation risk-benefit',
      'Monitor for VTE recurrence symptoms',
      'Functional assessment for persistent exercise limitation',
      'CTEPD screening if symptomatic',
      'Cancer screening as age-appropriate',
      'Evaluate modifiable VTE risk factors',
      'Consider referral to PE/VTE specialized clinic',
    ],
    cor: '2a',
    loe: 'C-EO',
  },
];
