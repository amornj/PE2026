# PE2026 Guide

Interactive clinical decision support tool implementing the **2026 AHA/ACC Acute Pulmonary Embolism Guideline**.

**Live:** [pe2026.vercel.app](https://pe2026.vercel.app)

## What It Does

This app guides clinicians through the new PE clinical category system (Categories A-E with subcategories and R modifier) that replaces the old massive/submassive terminology. It covers the full clinical pathway:

1. **Evaluation** - Clinical suspicion, pre-test probability (Wells/Geneva), PERC rule-out, D-dimer interpretation, YEARS algorithm, imaging recommendations
2. **Risk Stratification** - Hemodynamics, biomarkers, RV function assessment, and automatic PE category assignment (A1-E2 + R modifier)
3. **Management** - Anticoagulation recommendations, advanced therapy decisions (systemic lysis, CDL, MT, surgery) with COR/LOE badges per category, PERT activation, IVC filter assessment
4. **Follow-up** - Monitoring timeline, anticoagulation duration calculator, CTEPD screening

### Standalone Calculators

- Wells Score (two-tier and three-tier)
- Revised Geneva Score
- PESI (Pulmonary Embolism Severity Index)
- sPESI (Simplified PESI)
- Bova Score
- Hestia Criteria
- PERC Rule-out Criteria

### Smart Data Sync

Overlapping clinical findings entered in Wells/Geneva automatically populate PERC and YEARS criteria - no duplicate data entry.

## Tech Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- Zustand (state management)
- Deployed on Vercel

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Design Principles

- **No backend, no database** - All client-side, no PHI storage
- **No localStorage** - Deliberate; prevents stale clinical data influencing future patients
- **Mobile-first** - Designed for use at the bedside on phones/tablets
- **Evidence-tagged** - Every recommendation shows Class of Recommendation (COR) and Level of Evidence (LOE)
- **Pure logic separation** - Scoring and classification functions are pure, testable, and decoupled from UI

## Disclaimer

This tool is for clinical decision support only. It does not store any patient health information and is not a substitute for clinical judgment. Always refer to the full 2026 AHA/ACC Acute PE Guideline for complete recommendations.

## Reference

Based on the 2026 AHA/ACC/ACCP/ACEP/CHEST/SCAI/SHM/SIR/SVM/SVN Guideline for Management of Acute Pulmonary Embolism.
