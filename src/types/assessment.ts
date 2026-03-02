import { PECategory, ClassificationInput } from './classification';
import { WellsResult, GenevaResult, PESIResult, SPESIResult, BovaResult, HestiaResult } from './scores';

export type WizardStep = 'evaluation' | 'stratification' | 'management' | 'followup';

export interface ClinicalSuspicion {
  symptoms: string[];
  riskFactors: string[];
  clinicalProbability: 'low' | 'intermediate' | 'high' | null;
}

export interface DDimerResult {
  value?: number;
  unit: 'ng/mL' | 'μg/L';
  ageAdjustedThreshold: number;
  isPositive: boolean;
}

export interface ImagingResult {
  ctpaPerformed: boolean;
  ctpaPositive: boolean;
  vqScanPerformed: boolean;
  vqResult: 'normal' | 'low' | 'intermediate' | 'high' | null;
  echoPerformed: boolean;
  echoRVDysfunction: boolean;
  ctRvLvRatio?: number;
  clusPerformed: boolean; // compression leg ultrasound
  clusPositive: boolean;
}

export interface EvaluationData {
  suspicion: ClinicalSuspicion;
  wellsScore: WellsResult | null;
  genevaScore: GenevaResult | null;
  dDimer: DDimerResult | null;
  yearsAlgorithm: YEARSResult | null;
  imaging: ImagingResult;
  peConfirmed: boolean | null;
}

export interface YEARSResult {
  items: {
    clinicalSignsDVT: boolean;
    hemoptysis: boolean;
    peIsLikelyDiagnosis: boolean;
  };
  dDimerValue?: number;
  yearsItemCount: number;
  dDimerThreshold: number;
  peExcluded: boolean;
}

export interface StratificationData {
  classificationInput: ClassificationInput;
  category: PECategory | null;
  pesiResult: PESIResult | null;
  spesiResult: SPESIResult | null;
  bovaResult: BovaResult | null;
  hestiaResult: HestiaResult | null;
}

export interface ManagementData {
  anticoagulation: AnticoagulationPlan;
  advancedTherapy: AdvancedTherapyPlan;
  pertActivated: boolean;
  ivcFilterConsidered: boolean;
  ivcFilterIndicated: boolean;
}

export interface AnticoagulationPlan {
  initialAgent: string | null;
  maintenanceAgent: string | null;
  specialPopulation: SpecialPopulation[];
  contraindicationNotes: string[];
}

export type SpecialPopulation =
  | 'cancer'
  | 'pregnancy'
  | 'breastfeeding'
  | 'aps'
  | 'renalImpairment'
  | 'liverDisease'
  | 'obesity'
  | 'elderly';

export interface AdvancedTherapyPlan {
  systemicLysis: TherapyRecommendation;
  cdl: TherapyRecommendation;
  mechanicalThrombectomy: TherapyRecommendation;
  surgicalEmbolectomy: TherapyRecommendation;
  ecmo: TherapyRecommendation;
}

export interface TherapyRecommendation {
  recommended: boolean;
  cor: COR;
  loe: LOE;
  notes: string;
}

export type COR = '1' | '2a' | '2b' | '3-no-benefit' | '3-harm';
export type LOE = 'A' | 'B-R' | 'B-NR' | 'C-LD' | 'C-EO';

export interface FollowUpData {
  oneWeekChecklist: string[];
  threeMonthChecklist: string[];
  anticoagDuration: AnticoagDuration;
  ctephdScreening: CTEPDScreening;
}

export interface AnticoagDuration {
  riskCategory: 'major-reversible' | 'minor-reversible' | 'persistent' | 'unprovoked';
  recommendedDuration: string;
  extendedPhase: boolean;
  halfDoseEligible: boolean;
}

export interface CTEPDScreening {
  persistentDyspnea: boolean;
  functionalLimitation: boolean;
  referralIndicated: boolean;
  screeningInterval: string;
}
