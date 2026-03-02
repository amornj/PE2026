import { cn } from '@/lib/utils';

export interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn('border-t border-gray-200 bg-gray-50 px-4 py-6', className)}>
      <div className="mx-auto max-w-4xl space-y-3 text-center text-xs text-gray-500">
        <p className="font-medium text-gray-600">
          Not a substitute for clinical judgment.
        </p>
        <p>
          This tool is intended as a clinical decision support reference based on the
          2025 AHA/ACC/ACCP/ASH/CHEST/ISTH/NATF/SIR/STS Guideline for Management
          of Pulmonary Embolism. Always correlate with the full clinical picture.
        </p>
        <p className="text-gray-400">PE2026 Guide v0.1.0</p>
      </div>
    </footer>
  );
}
