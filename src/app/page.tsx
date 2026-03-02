import Link from 'next/link';
import { ClipboardList, Calculator, BookOpen, Stethoscope, ArrowRight, Shield } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
          <div className="flex items-center gap-2 text-blue-200 text-sm font-medium mb-4">
            <Stethoscope className="w-4 h-4" />
            <span>2026 AHA/ACC Guideline</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            Acute Pulmonary Embolism<br />Clinical Decision Support
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl">
            Interactive tool implementing the new PE clinical category system
            (Categories A&ndash;E) for evaluation, risk stratification, management,
            and follow-up.
          </p>
          <Link
            href="/assessment"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors text-lg"
          >
            Start Assessment
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Action Cards */}
      <section className="max-w-4xl mx-auto px-4 -mt-8">
        <div className="grid sm:grid-cols-3 gap-4">
          <Link href="/assessment" className="block bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <ClipboardList className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="font-bold text-gray-900 text-lg mb-2">Assessment Wizard</h2>
            <p className="text-gray-600 text-sm">
              Step-by-step guided evaluation from clinical suspicion through
              category assignment and management recommendations.
            </p>
          </Link>

          <Link href="/calculators" className="block bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Calculator className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="font-bold text-gray-900 text-lg mb-2">Clinical Calculators</h2>
            <p className="text-gray-600 text-sm">
              Wells, Geneva, PESI, sPESI, Bova, and Hestia scoring tools
              for standalone use.
            </p>
          </Link>

          <Link href="/reference" className="block bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="font-bold text-gray-900 text-lg mb-2">Quick Reference</h2>
            <p className="text-gray-600 text-sm">
              PE categories, management matrix, anticoagulation options,
              and follow-up protocols at a glance.
            </p>
          </Link>
        </div>
      </section>

      {/* Key Features */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
          What&apos;s New in 2026
        </h2>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="font-bold text-gray-600">A&ndash;E</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">New PE Categories</h3>
              <p className="text-gray-600 text-sm">
                Replaces the old massive/submassive terminology with a granular
                A&ndash;E system (10 subcategories + R modifier).
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Evidence-Based Recommendations</h3>
              <p className="text-gray-600 text-sm">
                Every recommendation tagged with Class of Recommendation (COR)
                and Level of Evidence (LOE).
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-gray-600">Rx</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Category-Based Treatment</h3>
              <p className="text-gray-600 text-sm">
                Clear management matrix defining which advanced therapies are
                appropriate for each PE category.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-gray-600">F/U</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Long-term Surveillance</h3>
              <p className="text-gray-600 text-sm">
                Structured follow-up protocol with CTEPD screening
                and extended anticoagulation guidance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <p className="text-sm text-gray-500">
            This tool is for clinical decision support only and does not store any
            patient health information. It is not a substitute for clinical judgment.
            Always refer to the full 2026 AHA/ACC Acute PE Guideline for complete
            recommendations.
          </p>
        </div>
      </section>
    </div>
  );
}
