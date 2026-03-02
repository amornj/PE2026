'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Badge } from '@/components/ui/Badge';
import { CATEGORY_DEFINITIONS } from '@/data/categoryDefinitions';
import { MANAGEMENT_MATRIX } from '@/data/managementRecommendations';
import { ANTICOAGULATION_OPTIONS } from '@/data/anticoagulationOptions';
import { ANTICOAG_DURATION_RULES } from '@/data/anticoagDuration';
import { FOLLOWUP_SCHEDULE } from '@/data/followupSchedule';
import { CTEPHD_SCREENING_CRITERIA, SPECIALIZED_CLINIC_REFERRALS } from '@/data/ctephdScreening';
import { WELLS_CRITERIA, WELLS_TWO_TIER, WELLS_THREE_TIER } from '@/data/wellsCriteria';
import { GENEVA_CRITERIA, GENEVA_THREE_TIER } from '@/data/genevaCriteria';
import { PESI_CRITERIA, PESI_CLASSES } from '@/data/pesiCriteria';
import { SPESI_CRITERIA } from '@/data/spesiCriteria';
import { BOVA_CRITERIA, BOVA_STAGES } from '@/data/bovaCriteria';
import { HESTIA_CRITERIA } from '@/data/hestiaCriteria';
import { SEVERITY_COLORS, COR_COLORS } from '@/types/guideline';
import type { PECategoryLetter } from '@/types/classification';
import type { COR } from '@/types/assessment';

const SUBCATEGORY_ORDER = ['A1', 'B1', 'B2', 'C1', 'C2', 'C3', 'D1', 'D2', 'E1', 'E2'] as const;

const SEVERITY_LABEL: Record<string, string> = {
  subclinical: 'Subclinical',
  low: 'Low',
  elevated: 'Elevated',
  'incipient-failure': 'Incipient Failure',
  'cardiopulmonary-failure': 'Cardiopulmonary Failure',
};

const MONITORING_LABEL: Record<string, string> = {
  outpatient: 'Outpatient',
  ward: 'Ward',
  stepdown: 'Stepdown/Telemetry',
  icu: 'ICU',
};

function ScrollTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <div className="inline-block min-w-full align-middle px-4 sm:px-0">
        {children}
      </div>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-lg font-semibold text-gray-900 mb-3">{children}</h3>
  );
}

function CorBadge({ cor }: { cor: COR }) {
  const config = COR_COLORS[cor];
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${config.bg} ${config.text}`}>
      {cor === '1' ? 'I' : cor === '2a' ? 'IIa' : cor === '2b' ? 'IIb' : cor === '3-no-benefit' ? 'III-NB' : 'III-H'}
    </span>
  );
}

function SeverityRow({ letter }: { letter: PECategoryLetter }) {
  const color = SEVERITY_COLORS[letter];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${color.badge}`}>
      Category {letter}
    </span>
  );
}

// ─── Tab 1: PE Categories ─────────────────────────────────────────────────────

function PECategoriesTab() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        The 2026 AHA/ACC guideline introduces a new A-E classification system replacing the traditional massive/submassive/low-risk terminology.
      </p>
      <ScrollTable>
        <table className="min-w-[800px] w-full text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="py-3 px-3 text-left font-semibold text-gray-900">Category</th>
              <th className="py-3 px-3 text-left font-semibold text-gray-900">Label</th>
              <th className="py-3 px-3 text-left font-semibold text-gray-900">Description</th>
              <th className="py-3 px-3 text-left font-semibold text-gray-900">Severity</th>
              <th className="py-3 px-3 text-left font-semibold text-gray-900">Monitoring</th>
            </tr>
          </thead>
          <tbody>
            {SUBCATEGORY_ORDER.map((sub) => {
              const cat = CATEGORY_DEFINITIONS[sub];
              const mgmt = MANAGEMENT_MATRIX.find((m) => m.subcategory === sub);
              const color = SEVERITY_COLORS[cat.letter];
              return (
                <tr key={sub} className={`border-b border-gray-100 ${color.bg}`}>
                  <td className="py-3 px-3 font-mono font-bold">
                    <SeverityRow letter={cat.letter} />
                    <span className="ml-2">{sub}</span>
                  </td>
                  <td className="py-3 px-3 font-medium text-gray-900">{cat.displayLabel.split(' - ')[1]}</td>
                  <td className="py-3 px-3 text-gray-700 max-w-xs">{cat.description}</td>
                  <td className="py-3 px-3">
                    <span className={`text-xs font-medium ${color.text}`}>
                      {SEVERITY_LABEL[cat.severity]}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-gray-700">
                    {mgmt ? MONITORING_LABEL[mgmt.monitoringLevel] : '--'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </ScrollTable>
      <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
        <strong>R modifier:</strong> An &quot;R&quot; suffix (e.g., C2-R) denotes respiratory compromise
        requiring high-flow nasal cannula, non-rebreather, or positive-pressure ventilation,
        signaling potential need for escalated monitoring and therapy regardless of subcategory.
      </div>
    </div>
  );
}

// ─── Tab 2: Scoring Systems ───────────────────────────────────────────────────

function ScoringCard({
  title,
  purpose,
  children,
}: {
  title: string;
  purpose: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 p-4">
        <h4 className="text-base font-semibold text-gray-900">{title}</h4>
        <p className="mt-1 text-sm text-gray-500">{purpose}</p>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function ScoringSystemsTab() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600">
        Summary of the six clinical scoring systems used in PE evaluation and risk stratification.
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Wells Score */}
        <ScoringCard title="Wells Score (PE)" purpose="Pre-test probability of PE. Guides D-dimer vs imaging decision.">
          <ScrollTable>
            <table className="min-w-[400px] w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 px-2 text-left font-medium text-gray-700">Criterion</th>
                  <th className="py-2 px-2 text-right font-medium text-gray-700">Points</th>
                </tr>
              </thead>
              <tbody>
                {WELLS_CRITERIA.map((c) => (
                  <tr key={c.id} className="border-b border-gray-50">
                    <td className="py-2 px-2 text-gray-700">{c.label}</td>
                    <td className="py-2 px-2 text-right font-mono font-semibold">{c.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollTable>
          <div className="mt-3 space-y-1 text-xs text-gray-600">
            <p><strong>Two-tier:</strong> &le;4 = {WELLS_TWO_TIER.unlikely.label} | &ge;4.5 = {WELLS_TWO_TIER.likely.label}</p>
            <p><strong>Three-tier:</strong> 0-1 = {WELLS_THREE_TIER.low.label} | 2-6 = {WELLS_THREE_TIER.moderate.label} | &ge;7 = {WELLS_THREE_TIER.high.label}</p>
          </div>
        </ScoringCard>

        {/* Geneva Score */}
        <ScoringCard title="Revised Geneva Score" purpose="Pre-test probability of PE. Alternative to Wells.">
          <ScrollTable>
            <table className="min-w-[400px] w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 px-2 text-left font-medium text-gray-700">Criterion</th>
                  <th className="py-2 px-2 text-right font-medium text-gray-700">Points</th>
                </tr>
              </thead>
              <tbody>
                {GENEVA_CRITERIA.map((c) => (
                  <tr key={c.id} className="border-b border-gray-50">
                    <td className="py-2 px-2 text-gray-700">{c.label}</td>
                    <td className="py-2 px-2 text-right font-mono font-semibold">{c.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollTable>
          <div className="mt-3 text-xs text-gray-600">
            <p>0-3 = {GENEVA_THREE_TIER.low.label} | 4-10 = {GENEVA_THREE_TIER.intermediate.label} | &ge;11 = {GENEVA_THREE_TIER.high.label}</p>
          </div>
        </ScoringCard>

        {/* PESI */}
        <ScoringCard title="PESI (Pulmonary Embolism Severity Index)" purpose="30-day mortality risk. Add patient age in years to score.">
          <ScrollTable>
            <table className="min-w-[400px] w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 px-2 text-left font-medium text-gray-700">Criterion</th>
                  <th className="py-2 px-2 text-right font-medium text-gray-700">Points</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-50">
                  <td className="py-2 px-2 text-gray-700 italic">Age (in years)</td>
                  <td className="py-2 px-2 text-right font-mono font-semibold">+age</td>
                </tr>
                {PESI_CRITERIA.map((c) => (
                  <tr key={c.id} className="border-b border-gray-50">
                    <td className="py-2 px-2 text-gray-700">{c.label}</td>
                    <td className="py-2 px-2 text-right font-mono font-semibold">+{c.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollTable>
          <div className="mt-3 space-y-1 text-xs text-gray-600">
            {PESI_CLASSES.map((pc) => (
              <p key={pc.class}>
                <strong>{pc.label}:</strong> {pc.min}-{pc.max === Infinity ? '+' : pc.max} pts, 30-day mortality {pc.mortality}
              </p>
            ))}
          </div>
        </ScoringCard>

        {/* sPESI */}
        <ScoringCard title="sPESI (Simplified PESI)" purpose="Simplified 30-day mortality risk. Binary score: 0 vs >=1.">
          <ScrollTable>
            <table className="min-w-[400px] w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 px-2 text-left font-medium text-gray-700">Criterion</th>
                  <th className="py-2 px-2 text-right font-medium text-gray-700">Points</th>
                </tr>
              </thead>
              <tbody>
                {SPESI_CRITERIA.map((c) => (
                  <tr key={c.id} className="border-b border-gray-50">
                    <td className="py-2 px-2 text-gray-700">{c.label}</td>
                    <td className="py-2 px-2 text-right font-mono font-semibold">{c.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollTable>
          <div className="mt-3 text-xs text-gray-600">
            <p><strong>0 points:</strong> Low risk (30-day mortality ~1%)</p>
            <p><strong>&ge;1 point:</strong> High risk (30-day mortality ~10.9%)</p>
          </div>
        </ScoringCard>

        {/* Bova */}
        <ScoringCard title="Bova Score" purpose="Risk of PE-related complications at 30 days in normotensive patients.">
          <ScrollTable>
            <table className="min-w-[400px] w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 px-2 text-left font-medium text-gray-700">Criterion</th>
                  <th className="py-2 px-2 text-right font-medium text-gray-700">Points</th>
                </tr>
              </thead>
              <tbody>
                {BOVA_CRITERIA.map((c) => (
                  <tr key={c.id} className="border-b border-gray-50">
                    <td className="py-2 px-2 text-gray-700">{c.label}</td>
                    <td className="py-2 px-2 text-right font-mono font-semibold">{c.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollTable>
          <div className="mt-3 space-y-1 text-xs text-gray-600">
            {BOVA_STAGES.map((s) => (
              <p key={s.stage}>
                <strong>{s.label}:</strong> {s.min}-{s.max === Infinity ? '+' : s.max} pts -- {s.complicationRisk}
              </p>
            ))}
          </div>
        </ScoringCard>

        {/* Hestia */}
        <ScoringCard title="Hestia Criteria" purpose="Outpatient treatment eligibility. Any positive item = inpatient management.">
          <ScrollTable>
            <table className="min-w-[400px] w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 px-2 text-left font-medium text-gray-700">Criterion</th>
                </tr>
              </thead>
              <tbody>
                {HESTIA_CRITERIA.map((c) => (
                  <tr key={c.id} className="border-b border-gray-50">
                    <td className="py-2 px-2 text-gray-700">
                      {c.label}
                      {c.description && (
                        <span className="block text-xs text-gray-500 mt-0.5">{c.description}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollTable>
          <div className="mt-3 text-xs text-gray-600">
            <p><strong>0 criteria met:</strong> Eligible for outpatient treatment</p>
            <p><strong>&ge;1 criterion met:</strong> Inpatient management recommended</p>
          </div>
        </ScoringCard>
      </div>
    </div>
  );
}

// ─── Tab 3: Management Matrix ─────────────────────────────────────────────────

function ManagementMatrixTab() {
  const therapyColumns = [
    { key: 'anticoagulation' as const, label: 'Anticoag' },
    { key: 'systemicLysis' as const, label: 'Systemic Lysis' },
    { key: 'cdl' as const, label: 'CDL' },
    { key: 'mechanicalThrombectomy' as const, label: 'Mech. Thrombectomy' },
    { key: 'surgicalEmbolectomy' as const, label: 'Surg. Embolectomy' },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Therapy recommendations by PE category with Class of Recommendation (COR) badges.
        Adapted from Table 7 of the 2026 AHA/ACC guideline.
      </p>

      <ScrollTable>
        <table className="min-w-[900px] w-full text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="py-3 px-2 text-left font-semibold text-gray-900">Category</th>
              {therapyColumns.map((col) => (
                <th key={col.key} className="py-3 px-2 text-center font-semibold text-gray-900">
                  {col.label}
                </th>
              ))}
              <th className="py-3 px-2 text-center font-semibold text-gray-900">PERT</th>
              <th className="py-3 px-2 text-center font-semibold text-gray-900">ECMO</th>
              <th className="py-3 px-2 text-center font-semibold text-gray-900">Monitor</th>
            </tr>
          </thead>
          <tbody>
            {MANAGEMENT_MATRIX.map((row) => {
              const cat = CATEGORY_DEFINITIONS[row.subcategory];
              const color = SEVERITY_COLORS[cat.letter];
              return (
                <tr key={row.subcategory} className={`border-b border-gray-100 ${color.bg}`}>
                  <td className="py-3 px-2 font-mono font-bold text-gray-900">
                    {row.subcategory}
                  </td>
                  {therapyColumns.map((col) => {
                    const rec = row[col.key];
                    return (
                      <td key={col.key} className="py-3 px-2 text-center">
                        <CorBadge cor={rec.cor} />
                      </td>
                    );
                  })}
                  <td className="py-3 px-2 text-center">
                    {row.pertRecommended ? (
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800">
                        Yes
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">--</span>
                    )}
                  </td>
                  <td className="py-3 px-2 text-center">
                    {row.ecmoConsideration ? (
                      <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-800">
                        Yes
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">--</span>
                    )}
                  </td>
                  <td className="py-3 px-2 text-center text-xs font-medium text-gray-700">
                    {MONITORING_LABEL[row.monitoringLevel]}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </ScrollTable>

      {/* COR Legend */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Class of Recommendation (COR) Legend</h4>
        <div className="flex flex-wrap gap-3">
          {(Object.entries(COR_COLORS) as [COR, { bg: string; text: string; label: string }][]).map(
            ([cor, config]) => (
              <div key={cor} className="flex items-center gap-2">
                <CorBadge cor={cor} />
                <span className="text-xs text-gray-600">{config.label}</span>
              </div>
            ),
          )}
        </div>
      </div>

      {/* Detailed notes per category */}
      <div className="space-y-3">
        <SectionHeading>Category-Specific Notes</SectionHeading>
        {MANAGEMENT_MATRIX.map((row) => {
          const cat = CATEGORY_DEFINITIONS[row.subcategory];
          const color = SEVERITY_COLORS[cat.letter];
          return (
            <div key={row.subcategory} className={`rounded-md border p-3 ${color.border} ${color.bg}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono font-bold text-sm">{row.subcategory}</span>
                <span className={`text-xs font-medium ${color.text}`}>{cat.displayLabel.split(' - ')[1]}</span>
              </div>
              <ul className="list-disc list-inside text-xs text-gray-700 space-y-0.5">
                {row.notes.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Tab 4: Anticoagulation ───────────────────────────────────────────────────

function AnticoagulationTab() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600">
        Anticoagulation options, dosing, and special population considerations per 2026 AHA/ACC guideline.
      </p>

      {/* Drug table */}
      <SectionHeading>Drug Options and Dosing</SectionHeading>
      <ScrollTable>
        <table className="min-w-[900px] w-full text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="py-3 px-3 text-left font-semibold text-gray-900">Agent</th>
              <th className="py-3 px-3 text-left font-semibold text-gray-900">Class</th>
              <th className="py-3 px-3 text-left font-semibold text-gray-900">Initial Dose</th>
              <th className="py-3 px-3 text-left font-semibold text-gray-900">Maintenance</th>
              <th className="py-3 px-3 text-left font-semibold text-gray-900">Renal Adjustment</th>
              <th className="py-3 px-3 text-center font-semibold text-gray-900">COR/LOE</th>
            </tr>
          </thead>
          <tbody>
            {ANTICOAGULATION_OPTIONS.map((drug) => (
              <tr key={drug.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-3 font-medium text-gray-900">{drug.name}</td>
                <td className="py-3 px-3">
                  <Badge>{drug.class}</Badge>
                </td>
                <td className="py-3 px-3 text-gray-700 max-w-[200px]">{drug.initialDose}</td>
                <td className="py-3 px-3 text-gray-700 max-w-[200px]">{drug.maintenanceDose}</td>
                <td className="py-3 px-3 text-gray-700 text-xs max-w-[220px]">{drug.renalAdjustment}</td>
                <td className="py-3 px-3 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <CorBadge cor={drug.cor} />
                    <Badge variant="loe" loe={drug.loe} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollTable>

      {/* Special populations */}
      <SectionHeading>Special Populations</SectionHeading>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {([
          { key: 'cancer', label: 'Cancer-Associated VTE', color: 'border-purple-200 bg-purple-50' },
          { key: 'pregnancy', label: 'Pregnancy', color: 'border-pink-200 bg-pink-50' },
          { key: 'renalImpairment', label: 'Renal Impairment', color: 'border-yellow-200 bg-yellow-50' },
          { key: 'obesity', label: 'Obesity', color: 'border-orange-200 bg-orange-50' },
          { key: 'aps', label: 'Antiphospholipid Syndrome', color: 'border-red-200 bg-red-50' },
          { key: 'elderly', label: 'Elderly', color: 'border-blue-200 bg-blue-50' },
        ] as const).map((pop) => (
          <div key={pop.key} className={`rounded-lg border p-4 ${pop.color}`}>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">{pop.label}</h4>
            <ul className="space-y-2">
              {ANTICOAGULATION_OPTIONS.filter((d) => d.specialPopulations[pop.key]).map((drug) => (
                <li key={drug.id} className="text-xs text-gray-700">
                  <span className="font-medium">{drug.name}:</span>{' '}
                  {drug.specialPopulations[pop.key]}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Contraindications */}
      <SectionHeading>Key Contraindications</SectionHeading>
      <ScrollTable>
        <table className="min-w-[600px] w-full text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="py-3 px-3 text-left font-semibold text-gray-900">Agent</th>
              <th className="py-3 px-3 text-left font-semibold text-gray-900">Contraindications</th>
            </tr>
          </thead>
          <tbody>
            {ANTICOAGULATION_OPTIONS.map((drug) => (
              <tr key={drug.id} className="border-b border-gray-100">
                <td className="py-3 px-3 font-medium text-gray-900 align-top">{drug.name}</td>
                <td className="py-3 px-3">
                  <ul className="list-disc list-inside text-xs text-gray-700 space-y-0.5">
                    {drug.contraindications.map((ci, i) => (
                      <li key={i}>{ci}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollTable>
    </div>
  );
}

// ─── Tab 5: Follow-up ─────────────────────────────────────────────────────────

function FollowUpTab() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600">
        Post-PE follow-up timeline, anticoagulation duration guidance, and CTEPD screening recommendations.
      </p>

      {/* Follow-up Timeline */}
      <SectionHeading>Follow-up Timeline</SectionHeading>
      <div className="space-y-4">
        {FOLLOWUP_SCHEDULE.map((item, idx) => (
          <div key={idx} className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-base font-semibold text-gray-900">{item.timing}</h4>
              {item.cor && item.loe && (
                <div className="flex items-center gap-2">
                  <CorBadge cor={item.cor} />
                  <Badge variant="loe" loe={item.loe} />
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-3">{item.description}</p>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              {item.checklist.map((check, i) => (
                <li key={i}>{check}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Anticoagulation Duration */}
      <SectionHeading>Anticoagulation Duration</SectionHeading>
      <ScrollTable>
        <table className="min-w-[800px] w-full text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="py-3 px-3 text-left font-semibold text-gray-900">Risk Category</th>
              <th className="py-3 px-3 text-left font-semibold text-gray-900">Examples</th>
              <th className="py-3 px-3 text-left font-semibold text-gray-900">Duration</th>
              <th className="py-3 px-3 text-left font-semibold text-gray-900">Annual Recurrence</th>
              <th className="py-3 px-3 text-center font-semibold text-gray-900">Extended</th>
              <th className="py-3 px-3 text-center font-semibold text-gray-900">Half-Dose</th>
              <th className="py-3 px-3 text-center font-semibold text-gray-900">COR/LOE</th>
            </tr>
          </thead>
          <tbody>
            {ANTICOAG_DURATION_RULES.map((rule) => (
              <tr key={rule.riskCategory} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-3 font-medium text-gray-900 align-top">{rule.label}</td>
                <td className="py-3 px-3 align-top">
                  <ul className="text-xs text-gray-600 space-y-0.5">
                    {rule.examples.slice(0, 3).map((ex, i) => (
                      <li key={i}>{ex}</li>
                    ))}
                    {rule.examples.length > 3 && (
                      <li className="text-gray-400">+{rule.examples.length - 3} more</li>
                    )}
                  </ul>
                </td>
                <td className="py-3 px-3 font-medium text-gray-900 align-top">
                  {rule.recommendedDuration}
                </td>
                <td className="py-3 px-3 text-gray-700 align-top">
                  {rule.annualRecurrenceIfStopped}
                </td>
                <td className="py-3 px-3 text-center align-top">
                  {rule.extendedPhaseOption ? (
                    <span className="inline-block w-5 h-5 rounded-full bg-green-100 text-green-700 text-xs leading-5 font-bold">Y</span>
                  ) : (
                    <span className="inline-block w-5 h-5 rounded-full bg-gray-100 text-gray-400 text-xs leading-5">--</span>
                  )}
                </td>
                <td className="py-3 px-3 text-center align-top">
                  {rule.halfDoseOption ? (
                    <span className="inline-block w-5 h-5 rounded-full bg-green-100 text-green-700 text-xs leading-5 font-bold">Y</span>
                  ) : (
                    <span className="inline-block w-5 h-5 rounded-full bg-gray-100 text-gray-400 text-xs leading-5">--</span>
                  )}
                </td>
                <td className="py-3 px-3 text-center align-top">
                  <div className="flex flex-col items-center gap-1">
                    <CorBadge cor={rule.cor} />
                    <Badge variant="loe" loe={rule.loe} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollTable>

      {/* CTEPD Screening */}
      <SectionHeading>CTEPD Screening Criteria</SectionHeading>
      <p className="text-sm text-gray-600 mb-3">
        Patients with any of the following should be evaluated for chronic thromboembolic pulmonary disease (CTEPD):
      </p>
      <ScrollTable>
        <table className="min-w-[700px] w-full text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="py-3 px-3 text-left font-semibold text-gray-900">Finding</th>
              <th className="py-3 px-3 text-left font-semibold text-gray-900">Description</th>
              <th className="py-3 px-3 text-left font-semibold text-gray-900">Referral Threshold</th>
            </tr>
          </thead>
          <tbody>
            {CTEPHD_SCREENING_CRITERIA.map((c) => (
              <tr key={c.id} className="border-b border-gray-100">
                <td className="py-3 px-3 font-medium text-gray-900">{c.symptom}</td>
                <td className="py-3 px-3 text-gray-700 text-xs max-w-[300px]">{c.description}</td>
                <td className="py-3 px-3 text-gray-700 text-xs max-w-[250px]">{c.referralThreshold}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollTable>

      {/* Specialized Referrals */}
      <SectionHeading>Specialized Clinic Referrals</SectionHeading>
      <div className="grid gap-3 sm:grid-cols-2">
        {SPECIALIZED_CLINIC_REFERRALS.map((ref, i) => (
          <div
            key={i}
            className={`rounded-lg border p-4 ${
              ref.urgency === 'urgent'
                ? 'border-red-200 bg-red-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-semibold text-gray-900">{ref.indication}</h4>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  ref.urgency === 'urgent'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {ref.urgency === 'urgent' ? 'Urgent' : 'Routine'}
              </span>
            </div>
            <p className="text-xs text-gray-700">{ref.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ReferencePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Quick Reference</h1>
        <p className="mt-2 text-sm text-gray-600">
          2026 AHA/ACC Pulmonary Embolism Guideline -- key tables, scoring systems, and management recommendations.
        </p>
      </div>

      <Tabs defaultValue="categories">
        <TabsList>
          <TabsTrigger value="categories">PE Categories</TabsTrigger>
          <TabsTrigger value="scoring">Scoring Systems</TabsTrigger>
          <TabsTrigger value="management">Management Matrix</TabsTrigger>
          <TabsTrigger value="anticoagulation">Anticoagulation</TabsTrigger>
          <TabsTrigger value="followup">Follow-up</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <PECategoriesTab />
        </TabsContent>

        <TabsContent value="scoring">
          <ScoringSystemsTab />
        </TabsContent>

        <TabsContent value="management">
          <ManagementMatrixTab />
        </TabsContent>

        <TabsContent value="anticoagulation">
          <AnticoagulationTab />
        </TabsContent>

        <TabsContent value="followup">
          <FollowUpTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
