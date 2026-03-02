import { RModifier, RespiratoryStatus } from '@/types/classification';

/**
 * Assess R modifier based on respiratory status.
 * R modifier is applied when:
 * - O2 requirement > 6 L/min
 * - Non-rebreather mask
 * - Positive pressure ventilation (NIV, BiPAP, CPAP)
 * - High-flow nasal cannula
 * - Intubated / mechanical ventilation
 */
export function assessRModifier(respiratory: RespiratoryStatus): RModifier {
  if (
    respiratory.intubated ||
    respiratory.positivePresVent ||
    respiratory.nonRebreather ||
    respiratory.highFlowNC ||
    (respiratory.oxygenLiters != null && respiratory.oxygenLiters > 6)
  ) {
    return 'R';
  }
  return null;
}
