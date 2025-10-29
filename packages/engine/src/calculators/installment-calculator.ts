/**
 * Installment Calculator
 * Calculates TOKİ installment schedules with various increase methods
 */

import {
  InstallmentConfig,
  InstallmentSchedule,
  CalculatedInstallment,
  InstallmentIncreaseMethod,
} from '@tokicheck/types';

/**
 * Calculate the complete installment schedule based on configuration
 *
 * @param config - Installment configuration
 * @returns Complete installment schedule with all periods calculated
 *
 * @example
 * ```typescript
 * const config: InstallmentConfig = {
 *   initialAmount: 5000_00, // 5,000 TRY (in kuruş)
 *   totalInstallments: 240, // 20 years
 *   downPayment: 50000_00, // 50,000 TRY
 *   increaseConfig: {
 *     method: 'fixed-percentage',
 *     percentagePerPeriod: 7.5,
 *     increasePeriod: 6,
 *     increasePeriodUnit: 'month'
 *   }
 * };
 *
 * const schedule = calculateInstallmentSchedule(config);
 * console.log(schedule.totalAmount); // Total to be paid
 * ```
 */
export function calculateInstallmentSchedule(config: InstallmentConfig): InstallmentSchedule {
  const installments: CalculatedInstallment[] = [];
  let currentAmount = config.initialAmount;
  let cumulativeTotal = 0;

  for (let period = 1; period <= config.totalInstallments; period++) {
    // Check if we need to apply an increase at this period
    const increasePercentage = getIncreasePercentageForPeriod(period, config);

    if (increasePercentage > 0) {
      currentAmount = Math.round(currentAmount * (1 + increasePercentage / 100));
    }

    cumulativeTotal += currentAmount;

    installments.push({
      period,
      amount: currentAmount,
      cumulativeTotal,
      increasePercentage: increasePercentage > 0 ? increasePercentage : undefined,
    });
  }

  const totalAmount = cumulativeTotal;
  const totalIncreases = totalAmount - config.initialAmount * config.totalInstallments;

  return {
    config,
    installments,
    totalAmount,
    totalIncreases,
  };
}

/**
 * Get the increase percentage for a specific period
 *
 * @param period - Current period number (1-based)
 * @param config - Installment configuration
 * @returns Percentage increase for this period (0 if no increase)
 */
function getIncreasePercentageForPeriod(
  period: number,
  config: InstallmentConfig
): number {
  const { increaseConfig } = config;

  // Check if this is an increase period
  if (period === 1 || period % increaseConfig.increasePeriod !== 1) {
    return 0; // No increase for this period
  }

  switch (increaseConfig.method) {
    case 'fixed-percentage':
      return increaseConfig.percentagePerPeriod ?? 0;

    case 'custom':
      if (increaseConfig.customSchedule) {
        const scheduleItem = increaseConfig.customSchedule.find(
          (item) => item.period === period
        );
        return scheduleItem?.increasePercentage ?? 0;
      }
      return 0;

    case 'civil-servant-salary':
    case 'ppi':
    case 'cpi':
      // TODO: These methods will require external data sources
      // For now, return a placeholder value
      // In the future, this should fetch real-time data from APIs
      console.warn(
        `Method '${increaseConfig.method}' not yet implemented. Using fallback.`
      );
      return increaseConfig.percentagePerPeriod ?? 0;

    default:
      return 0;
  }
}

/**
 * Calculate total payment including down payment
 *
 * @param schedule - Installment schedule
 * @returns Total out-of-pocket cost (down payment + all installments)
 */
export function calculateTotalOutOfPocket(schedule: InstallmentSchedule): number {
  return schedule.config.downPayment + schedule.totalAmount;
}

/**
 * Get installment for a specific period
 *
 * @param schedule - Installment schedule
 * @param period - Period number (1-based)
 * @returns Calculated installment for the period, or undefined if not found
 */
export function getInstallmentForPeriod(
  schedule: InstallmentSchedule,
  period: number
): CalculatedInstallment | undefined {
  return schedule.installments.find((inst) => inst.period === period);
}

/**
 * Calculate average monthly payment over the entire period
 *
 * @param schedule - Installment schedule
 * @returns Average monthly payment amount
 */
export function calculateAverageMonthlyPayment(schedule: InstallmentSchedule): number {
  return Math.round(schedule.totalAmount / schedule.config.totalInstallments);
}
