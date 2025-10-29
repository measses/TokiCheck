/**
 * Income (Gelir) related types
 */

import { MoneyAmount, Percentage, PeriodUnit } from './common';

/**
 * Income increase method
 */
export type IncomeIncreaseMethod =
  | 'fixed-percentage' // Fixed percentage increase annually
  | 'civil-servant-salary' // Based on civil servant salary increases
  | 'minimum-wage' // Based on minimum wage increases
  | 'custom'; // Custom increase schedule

/**
 * Employment status
 */
export type EmploymentStatus = 'employed' | 'self-employed' | 'unemployed' | 'retired';

/**
 * Household member income
 */
export interface HouseholdMemberIncome {
  /** Member identifier */
  id: string;
  /** Monthly gross income */
  monthlyGrossIncome: MoneyAmount;
  /** Monthly net income (after taxes) */
  monthlyNetIncome: MoneyAmount;
  /** Employment status */
  employmentStatus: EmploymentStatus;
  /** Income increase method for this member */
  increaseMethod: IncomeIncreaseMethod;
  /** Annual increase percentage (if applicable) */
  annualIncreasePercentage?: Percentage;
}

/**
 * Configuration for income projection
 */
export interface IncomeProjectionConfig {
  /** Array of household member incomes */
  householdMembers: HouseholdMemberIncome[];
  /** Default increase method if not specified per member */
  defaultIncreaseMethod: IncomeIncreaseMethod;
  /** Default annual increase percentage */
  defaultAnnualIncreasePercentage: Percentage;
  /** Number of periods to project */
  projectionPeriods: number;
  /** Unit of projection period */
  projectionPeriodUnit: PeriodUnit;
}

/**
 * Calculated income for a specific period
 */
export interface CalculatedIncome {
  /** Period number (1-based) */
  period: number;
  /** Total household monthly net income for this period */
  totalMonthlyNetIncome: MoneyAmount;
  /** Breakdown by household member */
  memberBreakdown: {
    memberId: string;
    monthlyNetIncome: MoneyAmount;
  }[];
  /** Increase percentage from previous period */
  increasePercentage?: Percentage;
}

/**
 * Complete income projection
 */
export interface IncomeProjection {
  /** Configuration used to generate this projection */
  config: IncomeProjectionConfig;
  /** Array of calculated incomes for each period */
  incomes: CalculatedIncome[];
  /** Total projected income over all periods */
  totalProjectedIncome: MoneyAmount;
}
