import { COR, LOE } from './assessment';

export interface FollowUpScheduleItem {
  timing: string;
  description: string;
  checklist: string[];
  cor?: COR;
  loe?: LOE;
}

export interface AnticoagDurationRule {
  riskCategory: 'major-reversible' | 'minor-reversible' | 'persistent' | 'unprovoked';
  label: string;
  examples: string[];
  recommendedDuration: string;
  annualRecurrenceIfStopped: string;
  extendedPhaseOption: boolean;
  halfDoseOption: boolean;
  cor: COR;
  loe: LOE;
}

export interface CTEPDScreeningCriteria {
  id: string;
  symptom: string;
  description: string;
  referralThreshold: string;
}

export interface SpecializedClinicReferral {
  indication: string;
  description: string;
  urgency: 'routine' | 'urgent';
}
