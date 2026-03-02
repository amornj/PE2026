import Link from 'next/link';
import { PageContainer } from '@/components/layout/PageContainer';
import { SPESICalculator } from '@/components/calculators/SPESICalculator';
import { Alert } from '@/components/ui/Alert';

export default function SPESIPage() {
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
            Simplified PESI (sPESI)
          </h1>
          <p className="mt-1 text-gray-600">
            Simplified Pulmonary Embolism Severity Index. A binary risk stratification tool for
            confirmed PE.
          </p>
        </div>

        <SPESICalculator />

        <Alert variant="info" title="Clinical Context">
          sPESI simplifies the original PESI into 6 binary criteria. A score of 0 identifies
          low-risk patients with approximately 1% 30-day mortality who may be suitable for
          outpatient management.
        </Alert>
      </div>
    </PageContainer>
  );
}
