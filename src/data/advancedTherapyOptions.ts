export interface AdvancedTherapyOption {
  id: string;
  name: string;
  description: string;
  mechanism: string;
  indications: string[];
  contraindications: string[];
  complications: string[];
}

export const ADVANCED_THERAPY_OPTIONS: AdvancedTherapyOption[] = [
  {
    id: 'systemic-lysis',
    name: 'Systemic Thrombolysis',
    description: 'IV administration of thrombolytic agent (typically alteplase 100 mg over 2 hours or tenecteplase weight-based).',
    mechanism: 'Converts plasminogen to plasmin, dissolving fibrin clot systemically.',
    indications: [
      'Massive PE with hemodynamic instability (Category D2-E2)',
      'Cardiac arrest suspected due to PE',
      'Cardiogenic shock (SCAI C)',
    ],
    contraindications: [
      'Active internal bleeding',
      'Recent (< 3 months) hemorrhagic stroke',
      'Intracranial neoplasm, AVM, or aneurysm',
      'Recent (< 3 weeks) major surgery or trauma',
      'Known bleeding diathesis',
    ],
    complications: [
      'Major hemorrhage (9-20%)',
      'Intracranial hemorrhage (1-3%)',
      'Minor bleeding',
    ],
  },
  {
    id: 'cdl',
    name: 'Catheter-Directed Therapy (CDL)',
    description: 'Catheter-based delivery of low-dose thrombolytic directly to pulmonary arteries, with or without ultrasound assistance.',
    mechanism: 'Local thrombolytic delivery at reduced systemic dose. Ultrasound-assisted devices may enhance fibrin penetration.',
    indications: [
      'Submassive PE with clinical deterioration (Category C2-C3)',
      'Massive PE when systemic lysis contraindicated or failed',
      'RV dysfunction with hemodynamic compromise',
    ],
    contraindications: [
      'Active internal bleeding (relative)',
      'Inability to access pulmonary vasculature',
      'No interventional expertise available',
    ],
    complications: [
      'Access-site hemorrhage',
      'Pulmonary artery perforation (rare)',
      'Arrhythmia',
      'Major hemorrhage (< 5% with low-dose protocols)',
    ],
  },
  {
    id: 'mechanical-thrombectomy',
    name: 'Mechanical Thrombectomy',
    description: 'Catheter-based mechanical removal or fragmentation of pulmonary emboli without thrombolytic drug.',
    mechanism: 'Physical clot extraction or fragmentation using aspiration or rheolytic catheters.',
    indications: [
      'Massive or submassive PE with lysis contraindication',
      'Failed systemic thrombolysis',
      'High bleeding risk precluding thrombolytic use',
    ],
    contraindications: [
      'No interventional expertise available',
      'Inability to access pulmonary vasculature',
    ],
    complications: [
      'Pulmonary artery injury',
      'Bradycardia/heart block',
      'Hemolysis (rheolytic devices)',
      'Access-site complications',
    ],
  },
  {
    id: 'surgical-embolectomy',
    name: 'Surgical Pulmonary Embolectomy',
    description: 'Open surgical removal of pulmonary emboli via sternotomy with cardiopulmonary bypass.',
    mechanism: 'Direct surgical extraction of thrombus from pulmonary arteries under direct visualization.',
    indications: [
      'Massive PE with failed or contraindicated thrombolysis',
      'Massive PE with right heart thrombus-in-transit',
      'Massive PE when catheter-based options unavailable',
    ],
    contraindications: [
      'No cardiac surgical expertise available',
      'Patient too unstable for OR transport',
      'Multiorgan failure with poor prognosis',
    ],
    complications: [
      'Surgical mortality (varies by institution)',
      'Cardiopulmonary bypass complications',
      'Bleeding',
      'Wound infection',
    ],
  },
  {
    id: 'ecmo',
    name: 'Extracorporeal Membrane Oxygenation (ECMO)',
    description: 'Veno-arterial ECMO provides circulatory and respiratory support as a bridge to definitive PE treatment.',
    mechanism: 'External circuit provides gas exchange and hemodynamic support, unloading the failing right ventricle.',
    indications: [
      'Cardiac arrest or refractory shock from massive PE (Category E2)',
      'Bridge to surgical embolectomy or catheter-based intervention',
      'Post-cardiac arrest hemodynamic support',
    ],
    contraindications: [
      'No ECMO expertise/equipment available',
      'Irreversible multiorgan failure',
      'Advanced directives precluding mechanical support',
    ],
    complications: [
      'Limb ischemia',
      'Hemorrhage',
      'Thrombosis/embolism',
      'Infection',
      'Hemolysis',
    ],
  },
];
