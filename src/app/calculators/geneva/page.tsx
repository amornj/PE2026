import Link from 'next/link';
import { PageContainer } from '@/components/layout/PageContainer';
import { GenevaCalculator } from '@/components/calculators/GenevaCalculator';
import { Alert } from '@/components/ui/Alert';

export default function GenevaPage() {
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
            Revised Geneva Score
          </h1>
          <p className="mt-1 text-gray-600">
            Clinical prediction rule for estimating clinical probability of pulmonary embolism using
            objective variables.
          </p>
        </div>

        <GenevaCalculator />

        <Alert variant="info" title="Clinical Context">
          The Revised Geneva score uses entirely objective clinical variables. Heart rate categories
          (75-94 bpm and &ge;95 bpm) are mutually exclusive; if both are selected, only the higher
          value is used.
        </Alert>
      </div>
    </PageContainer>
  );
}
