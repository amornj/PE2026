import Link from 'next/link';
import { PageContainer } from '@/components/layout/PageContainer';
import { HestiaCalculator } from '@/components/calculators/HestiaCalculator';
import { Alert } from '@/components/ui/Alert';

export default function HestiaPage() {
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
            Hestia Criteria
          </h1>
          <p className="mt-1 text-gray-600">
            Determines eligibility for outpatient treatment of acute pulmonary embolism using 11
            clinical criteria.
          </p>
        </div>

        <HestiaCalculator />

        <Alert variant="info" title="Clinical Context">
          Hestia criteria assess suitability for outpatient PE treatment. A score of 0 (none of the
          11 criteria present) indicates the patient may be safely managed as an outpatient.
          Any positive criterion warrants inpatient management.
        </Alert>
      </div>
    </PageContainer>
  );
}
