import Link from 'next/link';
import { PageContainer } from '@/components/layout/PageContainer';
import { WellsCalculator } from '@/components/calculators/WellsCalculator';
import { Alert } from '@/components/ui/Alert';

export default function WellsPage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <Link
            href="/calculators"
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            &larr; Back to Calculators
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
            Wells Score for PE
          </h1>
          <p className="mt-1 text-gray-600">
            Clinical prediction rule to estimate the pre-test probability of pulmonary embolism.
          </p>
        </div>

        <WellsCalculator />

        <Alert variant="info" title="Clinical Context">
          The Wells score should be used in conjunction with clinical judgement. A D-dimer test may be
          appropriate for patients with low or unlikely probability. Patients with high probability
          should proceed directly to imaging (CTPA).
        </Alert>
      </div>
    </PageContainer>
  );
}
