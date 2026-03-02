# PE2026 — 2026 AHA/ACC Acute Pulmonary Embolism Guideline Web App

## Project Overview

Interactive clinical decision support tool implementing the 2026 AHA/ACC Acute PE Guideline. Mobile-first Next.js app with step-by-step wizard guiding clinicians through PE evaluation, risk stratification (Categories A–E), management, and follow-up.

**No backend, no database, no PHI storage.** All client-side, ephemeral assessments. No localStorage (deliberate — prevents stale clinical data influencing future patients).

## Tech Stack

- **Next.js 16** (App Router) with TypeScript
- **Tailwind CSS v4** (`@theme inline` syntax in globals.css, NOT tailwind.config.js)
- **Zustand** for state management (assessment state across wizard steps)
- **lucide-react** for icons
- **clsx + tailwind-merge** via `cn()` utility in `src/lib/utils.ts`

## Architecture

```
src/
  types/          # TypeScript types (assessment, classification, scores, management, followup, guideline)
  data/           # Static guideline data as typed constants (scoring criteria, category definitions, etc.)
  lib/
    scoring/      # Pure scoring functions (wells, geneva, pesi, spesi, bova, hestia, perc)
    classification/ # PE category assignment algorithm (A1–E2 + R modifier)
    management/   # Anticoagulation, advanced therapy, IVC filter, follow-up logic
    ddimer.ts     # Age-adjusted D-dimer, YEARS algorithm
    utils.ts      # cn() utility
  store/          # Zustand stores (assessmentStore.ts, chatStore.ts) — no persistence
  components/
    ui/           # Reusable primitives (Button, Card, Badge, RadioGroup, Checkbox, NumberInput, Alert, ProgressBar, Accordion, Tabs)
    layout/       # Header, Footer, MobileNav, WizardStepper, PageContainer
    assessment/   # Wizard sub-components (19 components for evaluation→follow-up)
    calculators/  # Standalone calculator components + ScoreResultDisplay
  app/
    page.tsx              # Landing page
    assessment/           # 4-step wizard (evaluation, stratification, management, followup)
    calculators/          # 6 standalone calculators (wells, geneva, pesi, spesi, bova, hestia)
    chat/                 # AI chat — NotebookLM-powered Q&A with read-aloud
    reference/            # Quick reference tables
    api/chat/             # Server-side proxy to NotebookLM
```

## Key Design Patterns

### Separation of concerns
- **Data** (`src/data/`): Static guideline constants, typed arrays/objects
- **Logic** (`src/lib/`): Pure functions, no UI dependencies, testable in isolation
- **Components**: UI-only, receive data via props or Zustand store

### Cross-component data sync (Evaluation step)
Wells/Geneva checkbox selections automatically sync to overlapping criteria in:
- **PERC** — hemoptysis, prior DVT/PE, leg swelling, surgery/trauma, HR, age
- **YEARS** — clinical signs of DVT, hemoptysis, PE likely diagnosis
- **D-dimer** — shared value between D-dimer Interpreter and YEARS Algorithm

This is done via lifted state in the evaluation page, passed down as `syncedFromPTP` / `syncedFromWells` props. Synced items show "(from Wells)" labels.

### Category assignment algorithm
The core classification logic in `src/lib/classification/category.ts` follows this priority:
1. Cardiac arrest / refractory shock → E2
2. Cardiogenic shock (SCAI C) → E1
3. Hypotension + end-organ dysfunction → D2
4. Transient hypotension → D1
5. Incidental/asymptomatic → A1
6. Symptomatic + PESI≤85, sPESI=0 → B1 (subseg) or B2 (segmental+)
7. Symptomatic + elevated → RV AND troponin → C3, RV OR troponin → C2, neither → C1
8. R modifier applied based on respiratory status

### Evaluation diagnostic algorithm flow
Follows the guideline's Figure 3 flowchart:
- **Low PTP (<15%)**: PERC first → if negative, PE excluded; if positive → D-dimer + YEARS
- **Intermediate PTP (15–50%)**: D-dimer + YEARS directly
- **High PTP (>50%)**: Straight to imaging, no D-dimer

### Chat persistence, read-aloud, and response modes
Chat messages are stored in a Zustand store (`chatStore.ts`) so they survive client-side navigation but are cleared on page refresh (no localStorage). Assistant responses can be read aloud using the browser's Web Speech API — the speak button appears on each assistant message bubble. Users can toggle between **Explanatory** (default, full detailed answers) and **Brief** (2-3 sentence concise answers) modes. The mode is sent to the API route which prepends an instruction prefix to the question before forwarding to NotebookLM.

### COR/LOE badges
Every recommendation displays Class of Recommendation and Level of Evidence badges. Colors defined in `src/types/guideline.ts`.

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # ESLint
```

## Conventions

- All interactive pages/components use `'use client'` directive
- Use `cn()` from `@/lib/utils` for conditional classnames
- Mobile-first design (375px base width)
- Import paths use `@/*` alias mapping to `./src/*`
- No dark mode (medical apps need consistent high-contrast display)
- Medical disclaimer shown on landing page and wizard
