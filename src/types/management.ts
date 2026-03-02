import { COR, LOE, SpecialPopulation } from './assessment';
import { PESubcategory } from './classification';

export interface Recommendation {
  text: string;
  cor: COR;
  loe: LOE;
  caveat?: string;
}

export interface CategoryManagement {
  subcategory: PESubcategory;
  anticoagulation: Recommendation;
  systemicLysis: Recommendation;
  cdl: Recommendation;
  mechanicalThrombectomy: Recommendation;
  surgicalEmbolectomy: Recommendation;
  pertRecommended: boolean;
  ecmoConsideration: boolean;
  monitoringLevel: 'outpatient' | 'ward' | 'stepdown' | 'icu';
  notes: string[];
}

export interface AnticoagulationOption {
  id: string;
  name: string;
  class: 'DOAC' | 'LMWH' | 'UFH' | 'VKA' | 'fondaparinux';
  initialDose: string;
  maintenanceDose: string;
  renalAdjustment?: string;
  contraindications: string[];
  specialPopulations: Partial<Record<SpecialPopulation, string>>;
  cor: COR;
  loe: LOE;
}

export interface IVCFilterCriteria {
  absoluteContraindication: boolean;
  activeBleedingPrecluding: boolean;
  recurrentPEOnAnticoag: boolean;
  recommendation: string;
  cor: COR;
  loe: LOE;
}
