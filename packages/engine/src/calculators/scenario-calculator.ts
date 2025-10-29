/**
 * Scenario Calculator
 * Combines installment, income, and rent calculations to create complete simulations
 */

import {
  ScenarioConfig,
  ScenarioResult,
  ScenarioPeriodData,
  ScenarioSummary,
  SustainabilityStatus,
  DEFAULT_SUSTAINABILITY_THRESHOLDS,
} from '@tokicheck/types';
import { calculateInstallmentSchedule } from './installment-calculator';
import { calculateIncomeProjection } from './income-calculator';

/**
 * Calculate complete scenario result
 *
 * @param config - Scenario configuration
 * @returns Complete scenario result with all calculations
 *
 * @example
 * ```typescript
 * const scenarioConfig: ScenarioConfig = {
 *   name: 'My Scenario',
 *   installmentConfig: { ... },
 *   incomeConfig: { ... },
 *   rentConfig: { ... }
 * };
 *
 * const result = calculateScenario(scenarioConfig);
 * console.log(result.summary.totalPayment);
 * ```
 */
export function calculateScenario(config: ScenarioConfig): ScenarioResult {
  // Use default thresholds if not provided
  const thresholds = config.sustainabilityThresholds ?? DEFAULT_SUSTAINABILITY_THRESHOLDS;

  // Calculate installment schedule
  const installmentSchedule = calculateInstallmentSchedule(config.installmentConfig);

  // Calculate income projection
  const incomeProjection = calculateIncomeProjection(config.incomeConfig);

  // Calculate period-by-period data
  const periodData: ScenarioPeriodData[] = [];
  const { deliveryDelayMonths } = config.rentConfig;
  let currentRent = config.rentConfig.monthlyRent;

  for (let period = 1; period <= config.installmentConfig.totalInstallments; period++) {
    const installment = installmentSchedule.installments[period - 1];
    const income = incomeProjection.incomes[period - 1];

    // Apply annual rent increase
    if (period > 1 && (period - 1) % 12 === 0) {
      currentRent = Math.round(
        currentRent * (1 + config.rentConfig.annualIncreasePercentage / 100)
      );
    }

    // Determine if still renting (during delivery delay)
    const isRentingPeriod = period <= deliveryDelayMonths;
    const rentAmount = isRentingPeriod ? currentRent : 0;
    const totalMonthlyPayment = installment.amount + rentAmount;

    // Calculate payment to income ratio
    const paymentToIncomeRatio =
      income.totalMonthlyNetIncome > 0
        ? (totalMonthlyPayment / income.totalMonthlyNetIncome) * 100
        : 100;

    // Determine sustainability status
    const sustainabilityStatus = getSustainabilityStatus(paymentToIncomeRatio, thresholds);

    periodData.push({
      period,
      installmentAmount: installment.amount,
      rentAmount,
      totalMonthlyPayment,
      householdIncome: income.totalMonthlyNetIncome,
      paymentToIncomeRatio,
      sustainabilityStatus,
      isRentingPeriod,
      cumulativeInstallmentPaid: installment.cumulativeTotal,
      cumulativeRentPaid:
        period > 0
          ? periodData
              .slice(0, period - 1)
              .reduce((sum, p) => sum + p.rentAmount, 0) + rentAmount
          : rentAmount,
    });
  }

  // Calculate summary statistics
  const summary = calculateSummary(config, periodData, installmentSchedule.totalAmount);

  return {
    config,
    installmentSchedule,
    incomeProjection,
    periodData,
    summary,
  };
}

/**
 * Determine sustainability status based on payment to income ratio
 */
function getSustainabilityStatus(
  ratio: number,
  thresholds: typeof DEFAULT_SUSTAINABILITY_THRESHOLDS
): SustainabilityStatus {
  if (ratio <= thresholds.safe) {
    return 'safe';
  } else if (ratio <= thresholds.warning) {
    return 'warning';
  } else {
    return 'critical';
  }
}

/**
 * Calculate scenario summary statistics
 */
function calculateSummary(
  config: ScenarioConfig,
  periodData: ScenarioPeriodData[],
  totalInstallmentPayment: number
): ScenarioSummary {
  const totalRentPayment = periodData.reduce((sum, p) => sum + p.rentAmount, 0);
  const totalPayment = totalInstallmentPayment + totalRentPayment;

  // Calculate average and max payment to income ratio
  const ratios = periodData.map((p) => p.paymentToIncomeRatio);
  const averagePaymentToIncomeRatio =
    ratios.reduce((sum, r) => sum + r, 0) / ratios.length;
  const maxPaymentToIncomeRatio = Math.max(...ratios);
  const maxRatioPeriod =
    periodData.find((p) => p.paymentToIncomeRatio === maxPaymentToIncomeRatio)?.period ?? 1;

  // Calculate sustainability breakdown
  const sustainabilityBreakdown = {
    safe: periodData.filter((p) => p.sustainabilityStatus === 'safe').length,
    warning: periodData.filter((p) => p.sustainabilityStatus === 'warning').length,
    critical: periodData.filter((p) => p.sustainabilityStatus === 'critical').length,
  };

  // Overlap calculations
  const overlapMonths = config.rentConfig.deliveryDelayMonths;
  const overlapCost = periodData
    .slice(0, overlapMonths)
    .reduce((sum, p) => sum + p.rentAmount, 0);

  const downPayment = config.installmentConfig.downPayment;
  const totalOutOfPocket = downPayment + totalPayment;

  return {
    totalInstallmentPayment,
    totalRentPayment,
    totalPayment,
    averagePaymentToIncomeRatio,
    maxPaymentToIncomeRatio,
    maxRatioPeriod,
    sustainabilityBreakdown,
    overlapMonths,
    overlapCost,
    downPayment,
    totalOutOfPocket,
  };
}

/**
 * Get period data for a specific period
 *
 * @param result - Scenario result
 * @param period - Period number (1-based)
 * @returns Period data, or undefined if not found
 */
export function getPeriodData(
  result: ScenarioResult,
  period: number
): ScenarioPeriodData | undefined {
  return result.periodData.find((p) => p.period === period);
}

/**
 * Get all critical periods (where sustainability is critical)
 *
 * @param result - Scenario result
 * @returns Array of period numbers where sustainability is critical
 */
export function getCriticalPeriods(result: ScenarioResult): number[] {
  return result.periodData
    .filter((p) => p.sustainabilityStatus === 'critical')
    .map((p) => p.period);
}
