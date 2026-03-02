import { CTEPDScreeningCriteria, SpecializedClinicReferral } from '@/types/followup';

export const CTEPHD_SCREENING_CRITERIA: CTEPDScreeningCriteria[] = [
  {
    id: 'persistentDyspnea',
    symptom: 'Persistent dyspnea',
    description: 'Unexplained dyspnea persisting > 3 months after PE diagnosis despite adequate anticoagulation.',
    referralThreshold: 'NYHA class II or higher at 3-month follow-up',
  },
  {
    id: 'exerciseLimitation',
    symptom: 'Exercise intolerance',
    description: 'Inability to return to pre-PE functional baseline.',
    referralThreshold: 'Inability to perform activities tolerated prior to PE',
  },
  {
    id: 'elevatedRVSP',
    symptom: 'Elevated RVSP on echocardiography',
    description: 'Estimated RVSP > 40 mmHg on follow-up echocardiogram.',
    referralThreshold: 'RVSP > 40 mmHg or signs of RV dysfunction',
  },
  {
    id: 'abnormalVQ',
    symptom: 'Abnormal V/Q scan',
    description: 'Persistent perfusion defects on V/Q lung scan at 3+ months.',
    referralThreshold: 'Any mismatched perfusion defect',
  },
  {
    id: 'recurrentPE',
    symptom: 'Recurrent PE despite anticoagulation',
    description: 'New PE events while on therapeutic anticoagulation raises concern for chronic thromboembolic disease.',
    referralThreshold: 'Any recurrent PE on adequate anticoagulation',
  },
];

export const SPECIALIZED_CLINIC_REFERRALS: SpecializedClinicReferral[] = [
  {
    indication: 'Suspected CTEPD/CTEPH',
    description: 'Referral to CTEPH center for RHC and consideration of pulmonary endarterectomy (PEA), balloon pulmonary angioplasty (BPA), or medical therapy.',
    urgency: 'urgent',
  },
  {
    indication: 'Post-PE syndrome',
    description: 'Persistent functional limitation without evidence of CTEPH. May benefit from structured exercise rehabilitation and longitudinal follow-up.',
    urgency: 'routine',
  },
  {
    indication: 'Anticoagulation management complexity',
    description: 'Patients with recurrent VTE, bleeding on therapy, or special populations (pregnancy, cancer, APS) benefit from hematology/VTE clinic follow-up.',
    urgency: 'routine',
  },
  {
    indication: 'Thrombophilia evaluation',
    description: 'Consider testing for unprovoked VTE in young patients (< 50), family history of VTE, or unusual site thrombosis.',
    urgency: 'routine',
  },
];
