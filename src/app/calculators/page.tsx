import Link from 'next/link';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

const CALCULATORS = [
  {
    slug: 'wells',
    title: 'Wells Score',
    description: 'Estimates pre-test probability of pulmonary embolism using 7 clinical criteria. Available as two-tier (PE likely/unlikely) or three-tier (low/moderate/high) models.',
  },
  {
    slug: 'geneva',
    title: 'Revised Geneva Score',
    description: 'Clinical prediction rule for PE using 9 criteria. Provides three-tier risk stratification (low, intermediate, high clinical probability).',
  },
  {
    slug: 'pesi',
    title: 'PESI Score',
    description: 'Pulmonary Embolism Severity Index. Predicts 30-day mortality in confirmed PE using age and 10 clinical variables. Classifies into 5 risk classes.',
  },
  {
    slug: 'spesi',
    title: 'Simplified PESI (sPESI)',
    description: 'Simplified version of PESI with 6 binary criteria. Score of 0 = low risk (~1% 30-day mortality), score of 1+ = high risk (~10.9%).',
  },
  {
    slug: 'bova',
    title: 'Bova Score',
    description: 'Assesses risk of PE-related complications in hemodynamically stable patients. Stratifies into 3 stages based on cardiac biomarkers and vital signs.',
  },
  {
    slug: 'hestia',
    title: 'Hestia Criteria',
    description: 'Determines eligibility for outpatient treatment of PE. Score of 0 = eligible for home treatment; any positive criterion = inpatient management recommended.',
  },
];

export default function CalculatorsPage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            PE Risk Calculators
          </h1>
          <p className="mt-2 text-gray-600">
            Standalone scoring tools for pulmonary embolism assessment. Select a calculator below.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {CALCULATORS.map((calc) => (
            <Link key={calc.slug} href={`/calculators/${calc.slug}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle>{calc.title}</CardTitle>
                  <CardDescription>{calc.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-sm font-medium text-blue-600">
                    Open calculator &rarr;
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
