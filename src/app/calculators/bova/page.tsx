import Link from 'next/link';
import { PageContainer } from '@/components/layout/PageContainer';
import { BovaCalculator } from '@/components/calculators/BovaCalculator';
import { Alert } from '@/components/ui/Alert';

export default function BovaPage() {
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
            Bova Score
          </h1>
          <p className="mt-1 text-gray-600">
            Predicts PE-related complications at 30 days in hemodynamically stable patients with
            confirmed PE.
          </p>
        </div>

        <BovaCalculator />

        <Alert variant="info" title="Clinical Context">
          The Bova score is intended for hemodynamically stable patients with confirmed PE. It
          incorporates cardiac biomarkers and imaging to further risk-stratify intermediate-risk
          patients.
        </Alert>
      </div>
    </PageContainer>
  );
}
