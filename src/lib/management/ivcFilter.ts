import { IVCFilterCriteria } from '@/types/management';

export interface IVCFilterInput {
  absoluteContraindicationToAnticoag: boolean;
  activeBleedingPrecludingAnticoag: boolean;
  recurrentPEOnTherapeuticAnticoag: boolean;
}

/**
 * Assess IVC filter indication.
 * IVC filter is indicated when anticoagulation is absolutely contraindicated
 * or when PE recurs despite therapeutic anticoagulation.
 */
export function assessIVCFilter(input: IVCFilterInput): IVCFilterCriteria {
  const { absoluteContraindicationToAnticoag, activeBleedingPrecludingAnticoag, recurrentPEOnTherapeuticAnticoag } = input;

  const isIndicated = absoluteContraindicationToAnticoag || activeBleedingPrecludingAnticoag || recurrentPEOnTherapeuticAnticoag;

  let recommendation: string;
  if (absoluteContraindicationToAnticoag || activeBleedingPrecludingAnticoag) {
    recommendation = 'IVC filter placement is recommended when anticoagulation is absolutely contraindicated or precluded by active bleeding. Retrievable filter preferred; reassess for anticoagulation initiation and filter retrieval when bleeding resolves.';
  } else if (recurrentPEOnTherapeuticAnticoag) {
    recommendation = 'IVC filter may be considered for recurrent PE despite therapeutic anticoagulation. Continue anticoagulation if possible. Evaluate for mechanical cause or dose adjustment.';
  } else {
    recommendation = 'IVC filter is NOT routinely recommended when anticoagulation can be administered. Anticoagulation alone is preferred.';
  }

  return {
    absoluteContraindication: absoluteContraindicationToAnticoag,
    activeBleedingPrecluding: activeBleedingPrecludingAnticoag,
    recurrentPEOnAnticoag: recurrentPEOnTherapeuticAnticoag,
    recommendation,
    cor: isIndicated ? '2a' : '3-no-benefit',
    loe: isIndicated ? 'C-LD' : 'B-R',
  };
}
