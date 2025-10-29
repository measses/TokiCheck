/**
 * Scenario (Senaryo) related types
 * Combines installment, income, and rent to create complete simulations
 */

import { MoneyAmount, Percentage } from './common';
import { InstallmentConfig, InstallmentSchedule } from './installment';
import { IncomeProjectionConfig, IncomeProjection } from './income';

/**
 * Preset scenario types for quick simulation
 */
export type PresetScenarioType = 'optimistic' | 'moderate' | 'pessimistic';

/**
 * Rent configuration during the overlap period
 */
export interface RentConfig {
  /** Current monthly rent */
  monthlyRent: MoneyAmount;
  /** Expected annual rent increase percentage */
  annualIncreasePercentage: Percentage;
  /** Delivery delay in months (18-36 months typical for TOKİ) */
  deliveryDelayMonths: number;
}

/**
 * Sustainability thresholds for affordability assessment
 */
export interface SustainabilityThresholds {
  /** Safe threshold (installment/income ratio, typically 30%) */
  safe: Percentage;
  /** Warning threshold (typically 35%) */
  warning: Percentage;
  /** Critical threshold (typically 40%) */
  critical: Percentage;
}

/**
 * Sustainability status for a given period
 */
export type SustainabilityStatus = 'safe' | 'warning' | 'critical';

/**
 * Calculated scenario data for a specific period
 */
export interface ScenarioPeriodData {
  /** Period number (1-based, in months) */
  period: number;
  /** Monthly installment amount */
  installmentAmount: MoneyAmount;
  /** Monthly rent amount (if still renting) */
  rentAmount: MoneyAmount;
  /** Total monthly payment (rent + installment during overlap) */
  totalMonthlyPayment: MoneyAmount;
  /** Household monthly net income */
  householdIncome: MoneyAmount;
  /** Payment to income ratio (as percentage) */
  paymentToIncomeRatio: Percentage;
  /** Sustainability status based on thresholds */
  sustainabilityStatus: SustainabilityStatus;
  /** Whether this period includes rent payment */
  isRentingPeriod: boolean;
  /** Cumulative total paid (installments only) */
  cumulativeInstallmentPaid: MoneyAmount;
  /** Cumulative total rent paid */
  cumulativeRentPaid: MoneyAmount;
}

/**
 * Complete scenario configuration
 */
export interface ScenarioConfig {
  /** Unique scenario identifier */
  id?: string;
  /** Scenario name */
  name: string;
  /** Scenario description */
  description?: string;
  /** Installment configuration */
  installmentConfig: InstallmentConfig;
  /** Income projection configuration */
  incomeConfig: IncomeProjectionConfig;
  /** Rent configuration */
  rentConfig: RentConfig;
  /** Sustainability thresholds (optional, uses defaults if not provided) */
  sustainabilityThresholds?: SustainabilityThresholds;
}

/**
 * Complete scenario result with all calculations
 */
export interface ScenarioResult {
  /** Configuration used to generate this result */
  config: ScenarioConfig;
  /** Installment schedule */
  installmentSchedule: InstallmentSchedule;
  /** Income projection */
  incomeProjection: IncomeProjection;
  /** Period-by-period scenario data */
  periodData: ScenarioPeriodData[];
  /** Summary statistics */
  summary: ScenarioSummary;
}

/**
 * Summary statistics for the scenario
 */
export interface ScenarioSummary {
  /** Total installment payment over entire period */
  totalInstallmentPayment: MoneyAmount;
  /** Total rent payment during overlap period */
  totalRentPayment: MoneyAmount;
  /** Total payment (installment + rent) */
  totalPayment: MoneyAmount;
  /** Average payment to income ratio */
  averagePaymentToIncomeRatio: Percentage;
  /** Maximum payment to income ratio reached */
  maxPaymentToIncomeRatio: Percentage;
  /** Period where max ratio occurs */
  maxRatioPeriod: number;
  /** Number of periods in each sustainability status */
  sustainabilityBreakdown: {
    safe: number;
    warning: number;
    critical: number;
  };
  /** Number of months with rent+installment overlap */
  overlapMonths: number;
  /** Total cost of overlap (rent during delivery delay) */
  overlapCost: MoneyAmount;
  /** Initial down payment */
  downPayment: MoneyAmount;
  /** Total out-of-pocket cost (down payment + all payments) */
  totalOutOfPocket: MoneyAmount;
}

/**
 * Preset scenario configurations
 */
export interface PresetScenario {
  type: PresetScenarioType;
  name: string;
  description: string;
  installmentIncreasePercentage: Percentage; // Per period (e.g., 6 months)
  incomeIncreasePercentage: Percentage; // Annual
  rentIncreasePercentage: Percentage; // Annual
  deliveryDelayMonths: number;
}

/**
 * Default preset scenarios
 */
export const DEFAULT_PRESETS: Record<PresetScenarioType, PresetScenario> = {
  optimistic: {
    type: 'optimistic',
    name: 'İyimser Senaryo',
    description: 'Düşük artış oranları, zamanında teslimat',
    installmentIncreasePercentage: 6, // %6 every 6 months ≈ %12 annual
    incomeIncreasePercentage: 15, // %15 annual
    rentIncreasePercentage: 20, // %20 annual
    deliveryDelayMonths: 18,
  },
  moderate: {
    type: 'moderate',
    name: 'Orta Senaryo',
    description: 'Gerçekçi artış oranları',
    installmentIncreasePercentage: 7.5, // %7.5 every 6 months ≈ %15 annual
    incomeIncreasePercentage: 15, // %15 annual
    rentIncreasePercentage: 25, // %25 annual
    deliveryDelayMonths: 24,
  },
  pessimistic: {
    type: 'pessimistic',
    name: 'Kötümser Senaryo',
    description: 'Yüksek artış oranları, gecikmeli teslimat',
    installmentIncreasePercentage: 10, // %10 every 6 months ≈ %21 annual
    incomeIncreasePercentage: 15, // %15 annual
    rentIncreasePercentage: 30, // %30 annual
    deliveryDelayMonths: 36,
  },
};

/**
 * Default sustainability thresholds
 */
export const DEFAULT_SUSTAINABILITY_THRESHOLDS: SustainabilityThresholds = {
  safe: 30,
  warning: 35,
  critical: 40,
};
