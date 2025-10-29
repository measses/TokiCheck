/**
 * @tokicheck/engine
 * Pure TypeScript calculation engine for TOKİCheck
 *
 * This package contains all the core business logic for calculating
 * TOKİ installment scenarios, income projections, and sustainability analyses.
 *
 * @example
 * ```typescript
 * import { calculateScenario } from '@tokicheck/engine';
 * import { ScenarioConfig } from '@tokicheck/types';
 *
 * const config: ScenarioConfig = {
 *   name: 'My TOKİ Scenario',
 *   // ... configuration
 * };
 *
 * const result = calculateScenario(config);
 * console.log(result.summary.totalPayment);
 * ```
 *
 * @packageDocumentation
 */

// Export all calculators
export * from './calculators/installment-calculator';
export * from './calculators/income-calculator';
export * from './calculators/scenario-calculator';

// Export utility functions (to be added later)
// export * from './utils';

// Re-export types for convenience
export type {
  ScenarioConfig,
  ScenarioResult,
  InstallmentConfig,
  IncomeProjectionConfig,
  RentConfig,
} from '@tokicheck/types';
