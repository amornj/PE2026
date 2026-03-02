import { COR, LOE } from './assessment';

export interface GuidelineRecommendation {
  id: string;
  section: string;
  text: string;
  cor: COR;
  loe: LOE;
  category?: string;
}

export interface ReferenceTable {
  id: string;
  title: string;
  headers: string[];
  rows: string[][];
  footnotes?: string[];
}

export type SeverityColor = {
  bg: string;
  text: string;
  border: string;
  badge: string;
};

export const SEVERITY_COLORS: Record<string, SeverityColor> = {
  A: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-300', badge: 'bg-gray-100 text-gray-800' },
  B: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-300', badge: 'bg-green-100 text-green-800' },
  C: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-300', badge: 'bg-amber-100 text-amber-800' },
  D: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-300', badge: 'bg-orange-100 text-orange-800' },
  E: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-300', badge: 'bg-red-100 text-red-800' },
};

export const COR_COLORS: Record<COR, { bg: string; text: string; label: string }> = {
  '1': { bg: 'bg-green-600', text: 'text-white', label: 'Class I (Strong)' },
  '2a': { bg: 'bg-green-500', text: 'text-white', label: 'Class IIa (Moderate)' },
  '2b': { bg: 'bg-yellow-500', text: 'text-white', label: 'Class IIb (Weak)' },
  '3-no-benefit': { bg: 'bg-red-500', text: 'text-white', label: 'Class III (No Benefit)' },
  '3-harm': { bg: 'bg-red-700', text: 'text-white', label: 'Class III (Harm)' },
};

export const LOE_LABELS: Record<LOE, string> = {
  'A': 'Level A (High)',
  'B-R': 'Level B-R (Moderate, Randomized)',
  'B-NR': 'Level B-NR (Moderate, Non-randomized)',
  'C-LD': 'Level C-LD (Limited Data)',
  'C-EO': 'Level C-EO (Expert Opinion)',
};
