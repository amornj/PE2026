'use client';

import { useRouter } from 'next/navigation';
import { useAssessmentStore } from '@/store/assessmentStore';
import { ClipboardList, AlertTriangle } from 'lucide-react';

export default function AssessmentPage() {
  const router = useRouter();
  const resetAssessment = useAssessmentStore((s) => s.resetAssessment);

  const handleStart = () => {
    resetAssessment();
    router.push('/assessment/evaluation');
  };

  return (
    <div className="max-w-2xl mx-auto text-center py-8">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
        <ClipboardList className="w-8 h-8 text-blue-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        PE Clinical Assessment
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        This guided assessment follows the 2026 AHA/ACC Acute Pulmonary Embolism
        Guideline to evaluate, classify, and recommend management for your patient.
      </p>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8 text-left">
        <h2 className="font-semibold text-gray-900 mb-3">Assessment Steps</h2>
        <ol className="space-y-3 text-gray-600">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium">1</span>
            <span><strong>Evaluation</strong> &mdash; Clinical suspicion, pre-test probability, D-dimer, imaging</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium">2</span>
            <span><strong>Risk Stratification</strong> &mdash; Hemodynamics, biomarkers, RV function &rarr; Category A&ndash;E assignment</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium">3</span>
            <span><strong>Management</strong> &mdash; Anticoagulation, advanced therapies, PERT activation</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium">4</span>
            <span><strong>Follow-up</strong> &mdash; Monitoring timeline, anticoag duration, CTEPD screening</span>
          </li>
        </ol>
      </div>

      <button
        onClick={handleStart}
        className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-lg"
      >
        Begin Assessment
      </button>

      <div className="mt-8 flex items-start gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-4">
        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <p>
          This tool is for clinical decision support only. It does not store any patient
          data and is not a substitute for clinical judgment. Always verify recommendations
          against the full guideline.
        </p>
      </div>
    </div>
  );
}
