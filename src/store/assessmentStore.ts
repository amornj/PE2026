'use client';

import { create } from 'zustand';
import type { WizardStep, EvaluationData, StratificationData, ManagementData, FollowUpData } from '@/types/assessment';
import type { ClassificationInput } from '@/types/classification';

interface AssessmentState {
  currentStep: WizardStep;
  evaluation: EvaluationData;
  stratification: StratificationData;
  management: ManagementData;
  followup: FollowUpData;
  setStep: (step: WizardStep) => void;
  updateEvaluation: (data: Partial<EvaluationData>) => void;
  updateStratification: (data: Partial<StratificationData>) => void;
  updateManagement: (data: Partial<ManagementData>) => void;
  updateFollowup: (data: Partial<FollowUpData>) => void;
  resetAssessment: () => void;
}

const initialEvaluation: EvaluationData = {
  suspicion: {
    symptoms: [],
    riskFactors: [],
    clinicalProbability: null,
  },
  wellsScore: null,
  genevaScore: null,
  dDimer: null,
  yearsAlgorithm: null,
  imaging: {
    ctpaPerformed: false,
    ctpaPositive: false,
    vqScanPerformed: false,
    vqResult: null,
    echoPerformed: false,
    echoRVDysfunction: false,
    ctRvLvRatio: undefined,
    clusPerformed: false,
    clusPositive: false,
  },
  peConfirmed: null,
};

const initialClassificationInput: ClassificationInput = {
  hemodynamics: {
    cardiacArrest: false,
    refractoryShock: false,
    cardiogenicShock: false,
    hypotension: false,
    transientHypotension: false,
    endOrganDysfunction: false,
  },
  rv: {
    rvDysfunction: false,
    rvDilated: false,
    mcConnellSign: false,
  },
  biomarkers: {
    troponinElevated: false,
    bnpElevated: false,
    lactateElevated: false,
  },
  respiratory: {
    nonRebreather: false,
    positivePresVent: false,
    highFlowNC: false,
    intubated: false,
  },
  isIncidental: false,
  isSymptomatic: false,
  isSubsegmental: false,
};

const initialStratification: StratificationData = {
  classificationInput: initialClassificationInput,
  category: null,
  pesiResult: null,
  spesiResult: null,
  bovaResult: null,
  hestiaResult: null,
};

const initialManagement: ManagementData = {
  anticoagulation: {
    initialAgent: null,
    maintenanceAgent: null,
    specialPopulation: [],
    contraindicationNotes: [],
  },
  advancedTherapy: {
    systemicLysis: { recommended: false, cor: '3-harm', loe: 'C-LD', notes: '' },
    cdl: { recommended: false, cor: '3-no-benefit', loe: 'C-LD', notes: '' },
    mechanicalThrombectomy: { recommended: false, cor: '3-no-benefit', loe: 'C-LD', notes: '' },
    surgicalEmbolectomy: { recommended: false, cor: '3-no-benefit', loe: 'C-LD', notes: '' },
    ecmo: { recommended: false, cor: '3-no-benefit', loe: 'C-LD', notes: '' },
  },
  pertActivated: false,
  ivcFilterConsidered: false,
  ivcFilterIndicated: false,
};

const initialFollowup: FollowUpData = {
  oneWeekChecklist: [],
  threeMonthChecklist: [],
  anticoagDuration: {
    riskCategory: 'unprovoked',
    recommendedDuration: '',
    extendedPhase: false,
    halfDoseEligible: false,
  },
  ctephdScreening: {
    persistentDyspnea: false,
    functionalLimitation: false,
    referralIndicated: false,
    screeningInterval: 'Every visit for ≥1 year',
  },
};

export const useAssessmentStore = create<AssessmentState>((set) => ({
  currentStep: 'evaluation',
  evaluation: initialEvaluation,
  stratification: initialStratification,
  management: initialManagement,
  followup: initialFollowup,

  setStep: (step) => set({ currentStep: step }),

  updateEvaluation: (data) =>
    set((state) => ({
      evaluation: { ...state.evaluation, ...data },
    })),

  updateStratification: (data) =>
    set((state) => ({
      stratification: { ...state.stratification, ...data },
    })),

  updateManagement: (data) =>
    set((state) => ({
      management: { ...state.management, ...data },
    })),

  updateFollowup: (data) =>
    set((state) => ({
      followup: { ...state.followup, ...data },
    })),

  resetAssessment: () =>
    set({
      currentStep: 'evaluation',
      evaluation: initialEvaluation,
      stratification: initialStratification,
      management: initialManagement,
      followup: initialFollowup,
    }),
}));
