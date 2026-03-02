import { cn } from '@/lib/utils';
import type { COR, LOE } from '@/types/assessment';
import type { PECategoryLetter } from '@/types/classification';
import { COR_COLORS, LOE_LABELS, SEVERITY_COLORS } from '@/types/guideline';

export interface BadgeProps {
  variant?: 'cor' | 'loe' | 'severity' | 'default';
  cor?: COR;
  loe?: LOE;
  severity?: PECategoryLetter;
  className?: string;
  children?: React.ReactNode;
}

export function Badge({ variant = 'default', cor, loe, severity, className, children }: BadgeProps) {
  if (variant === 'cor' && cor) {
    const color = COR_COLORS[cor];
    return (
      <span
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
          color.bg,
          color.text,
          className,
        )}
        role="status"
      >
        {children ?? color.label}
      </span>
    );
  }

  if (variant === 'loe' && loe) {
    return (
      <span
        className={cn(
          'inline-flex items-center rounded-full border border-gray-400 px-2.5 py-0.5 text-xs font-medium text-gray-700',
          className,
        )}
        role="status"
      >
        {children ?? LOE_LABELS[loe]}
      </span>
    );
  }

  if (variant === 'severity' && severity) {
    const color = SEVERITY_COLORS[severity];
    return (
      <span
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
          color?.badge,
          className,
        )}
        role="status"
      >
        {children ?? `Category ${severity}`}
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700',
        className,
      )}
    >
      {children}
    </span>
  );
}
