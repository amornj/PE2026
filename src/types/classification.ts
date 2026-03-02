export type PECategoryLetter = 'A' | 'B' | 'C' | 'D' | 'E';
export type PESubcategory = 'A1' | 'B1' | 'B2' | 'C1' | 'C2' | 'C3' | 'D1' | 'D2' | 'E1' | 'E2';
export type RModifier = 'R' | null;

export interface PECategory {
  letter: PECategoryLetter;
  subcategory: PESubcategory;
  rModifier: RModifier;
  displayLabel: string;
  description: string;
  severity: 'subclinical' | 'low' | 'elevated' | 'incipient-failure' | 'cardiopulmonary-failure';
  colorClass: string;
}

export interface HemodynamicStatus {
  cardiacArrest: boolean;
  refractoryShock: boolean;
  cardiogenicShock: boolean; // SCAI stage C
  hypotension: boolean; // SBP < 90 for >15 min
  transientHypotension: boolean; // responds to fluids
  endOrganDysfunction: boolean; // altered mental status, cold/mottled, oliguria, elevated lactate
}

export interface RVAssessment {
  rvDysfunction: boolean; // TAPSE <1.6, RV/LV ≥1.0
  rvDilated: boolean;
  mcConnellSign: boolean;
  rvLvRatio?: number;
  tapse?: number;
}

export interface BiomarkerStatus {
  troponinElevated: boolean;
  bnpElevated: boolean;
  lactateElevated: boolean;
}

export interface RespiratoryStatus {
  oxygenLiters?: number;
  nonRebreather: boolean;
  positivePresVent: boolean;
  highFlowNC: boolean;
  intubated: boolean;
}

export interface ClassificationInput {
  hemodynamics: HemodynamicStatus;
  rv: RVAssessment;
  biomarkers: BiomarkerStatus;
  respiratory: RespiratoryStatus;
  isIncidental: boolean;
  isSymptomatic: boolean;
  isSubsegmental: boolean;
  pesiScore?: number;
  spesiScore?: number;
}
