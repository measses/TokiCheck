/**
 * Installment (Taksit) related types
 */

import { MoneyAmount, Percentage, PeriodUnit } from './common';

/**
 * Installment increase method
 */
export type InstallmentIncreaseMethod =
  | 'fixed-percentage' // Fixed percentage increase every period
  | 'civil-servant-salary' // Based on civil servant salary increases
  | 'ppi' // Producer Price Index (ÜFE - Üretici Fiyat Endeksi)
  | 'cpi' // Consumer Price Index (TÜFE - Tüketici Fiyat Endeksi)
  | 'custom'; // Custom increase schedule

/**
 * Configuration for installment increase
 */
export interface InstallmentIncreaseConfig {
  method: InstallmentIncreaseMethod;
  /** Percentage increase per period (for fixed-percentage method) */
  percentagePerPeriod?: Percentage;
  /** Period of increase (e.g., every 6 months) */
  increasePeriod: number;
  /** Unit of increase period */
  increasePeriodUnit: PeriodUnit;
  /** Custom increase schedule (for custom method) */
  customSchedule?: InstallmentIncreaseScheduleItem[];
}

/**
 * Custom increase schedule item
 */
export interface InstallmentIncreaseScheduleItem {
  /** Period number (e.g., month 6) */
  period: number;
  /** Increase percentage for this period */
  increasePercentage: Percentage;
}

/**
 * Base installment configuration
 */
export interface InstallmentConfig {
  /** Initial monthly installment amount */
  initialAmount: MoneyAmount;
  /** Total number of installments (e.g., 240 months = 20 years) */
  totalInstallments: number;
  /** Down payment amount */
  downPayment: MoneyAmount;
  /** Increase configuration */
  increaseConfig: InstallmentIncreaseConfig;
}

/**
 * Calculated installment for a specific period
 */
export interface CalculatedInstallment {
  /** Period number (1-based, e.g., month 1, 2, 3...) */
  period: number;
  /** Installment amount for this period */
  amount: MoneyAmount;
  /** Cumulative total paid up to this period */
  cumulativeTotal: MoneyAmount;
  /** Percentage increase from previous period (if applicable) */
  increasePercentage?: Percentage;
}

/**
 * Complete installment schedule
 */
export interface InstallmentSchedule {
  /** Configuration used to generate this schedule */
  config: InstallmentConfig;
  /** Array of calculated installments for each period */
  installments: CalculatedInstallment[];
  /** Total amount to be paid over the entire period */
  totalAmount: MoneyAmount;
  /** Total amount of increases over the base payment */
  totalIncreases: MoneyAmount;
}
