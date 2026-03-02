'use client';

import { cn } from '@/lib/utils';

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  label?: string;
  options: RadioOption[];
  value: string | null;
  onChange: (value: string) => void;
  className?: string;
}

export function RadioGroup({ name, label, options, value, onChange, className }: RadioGroupProps) {
  return (
    <fieldset className={cn('space-y-2', className)} role="radiogroup" aria-label={label}>
      {label && (
        <legend className="text-sm font-medium text-gray-900">{label}</legend>
      )}
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              'flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors',
              value === option.value
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:bg-gray-50',
              option.disabled && 'cursor-not-allowed opacity-50',
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              disabled={option.disabled}
              className="mt-0.5 h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-900">{option.label}</span>
              {option.description && (
                <p className="mt-0.5 text-xs text-gray-500">{option.description}</p>
              )}
            </div>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
