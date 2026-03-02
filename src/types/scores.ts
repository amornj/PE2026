export interface ScoreCriterion {
  id: string;
  label: string;
  points: number;
  description?: string;
}

export interface ScoreResult {
  total: number;
  interpretation: string;
  riskLevel: 'low' | 'moderate' | 'high';
  details?: string;
}

export interface WellsResult extends ScoreResult {
  probability: 'unlikely' | 'likely'; // two-tier
  threeLevel: 'low' | 'moderate' | 'high'; // three-tier
}

export interface GenevaResult extends ScoreResult {
  probability: 'low' | 'intermediate' | 'high';
}

export interface PESIResult extends ScoreResult {
  class: 1 | 2 | 3 | 4 | 5;
  mortality30Day: string;
}

export interface SPESIResult extends ScoreResult {
  simplified: 0 | 1;
}

export interface BovaResult extends ScoreResult {
  stage: 1 | 2 | 3;
  complicationRisk: string;
}

export interface HestiaResult extends ScoreResult {
  eligible: boolean;
}
