import Link from 'next/link';
import { PageContainer } from '@/components/layout/PageContainer';
import { PESICalculator } from '@/components/calculators/PESICalculator';
import { Alert } from '@/components/ui/Alert';

export default function PESIPage() {
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
            PESI Score
          </h1>
          <p className="mt-1 text-gray-600">
            Pulmonary Embolism Severity Index. Predicts 30-day outcome in patients with confirmed PE.
          </p>
        </div>

        <PESICalculator />

        <Alert variant="info" title="Clinical Context">
          PESI is validated for prognosis in confirmed PE. The patient&apos;s age in years is the
          baseline score. Class I-II patients may be candidates for outpatient management with
          appropriate follow-up.
        </Alert>
      </div>
    </PageContainer>
  );
}
