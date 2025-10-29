/**
 * Income Calculator
 * Projects household income over time with various increase methods
 */

import {
  IncomeProjectionConfig,
  IncomeProjection,
  CalculatedIncome,
  HouseholdMemberIncome,
} from '@tokicheck/types';

/**
 * Calculate income projection based on configuration
 *
 * @param config - Income projection configuration
 * @returns Complete income projection with all periods calculated
 *
 * @example
 * ```typescript
 * const config: IncomeProjectionConfig = {
 *   householdMembers: [
 *     {
 *       id: 'member1',
 *       monthlyGrossIncome: 20000_00,
 *       monthlyNetIncome: 17000_00,
 *       employmentStatus: 'employed',
 *       increaseMethod: 'fixed-percentage',
 *       annualIncreasePercentage: 15
 *     }
 *   ],
 *   defaultIncreaseMethod: 'fixed-percentage',
 *   defaultAnnualIncreasePercentage: 15,
 *   projectionPeriods: 240,
 *   projectionPeriodUnit: 'month'
 * };
 *
 * const projection = calculateIncomeProjection(config);
 * ```
 */
export function calculateIncomeProjection(
  config: IncomeProjectionConfig
): IncomeProjection {
  const incomes: CalculatedIncome[] = [];
  let totalProjectedIncome = 0;

  // Track income for each member across periods
  const memberIncomes = new Map<string, number>();
  config.householdMembers.forEach((member) => {
    memberIncomes.set(member.id, member.monthlyNetIncome);
  });

  for (let period = 1; period <= config.projectionPeriods; period++) {
    const memberBreakdown: { memberId: string; monthlyNetIncome: number }[] = [];
    let totalMonthlyNetIncome = 0;

    // Calculate income for each household member
    for (const member of config.householdMembers) {
      let memberIncome = memberIncomes.get(member.id) ?? member.monthlyNetIncome;

      // Apply annual increase at the beginning of each year
      if (period > 1 && (period - 1) % 12 === 0) {
        const increasePercentage =
          member.annualIncreasePercentage ?? config.defaultAnnualIncreasePercentage;
        memberIncome = Math.round(memberIncome * (1 + increasePercentage / 100));
        memberIncomes.set(member.id, memberIncome);
      }

      memberBreakdown.push({
        memberId: member.id,
        monthlyNetIncome: memberIncome,
      });

      totalMonthlyNetIncome += memberIncome;
    }

    totalProjectedIncome += totalMonthlyNetIncome;

    // Calculate increase percentage from previous period
    let increasePercentage: number | undefined;
    if (period > 1) {
      const previousIncome = incomes[period - 2].totalMonthlyNetIncome;
      if (previousIncome > 0) {
        increasePercentage =
          ((totalMonthlyNetIncome - previousIncome) / previousIncome) * 100;
      }
    }

    incomes.push({
      period,
      totalMonthlyNetIncome,
      memberBreakdown,
      increasePercentage,
    });
  }

  return {
    config,
    incomes,
    totalProjectedIncome,
  };
}

/**
 * Get income for a specific period
 *
 * @param projection - Income projection
 * @param period - Period number (1-based)
 * @returns Calculated income for the period, or undefined if not found
 */
export function getIncomeForPeriod(
  projection: IncomeProjection,
  period: number
): CalculatedIncome | undefined {
  return projection.incomes.find((inc) => inc.period === period);
}

/**
 * Calculate average monthly household income over the entire projection
 *
 * @param projection - Income projection
 * @returns Average monthly household income
 */
export function calculateAverageMonthlyIncome(projection: IncomeProjection): number {
  return Math.round(projection.totalProjectedIncome / projection.config.projectionPeriods);
}

/**
 * Calculate total household income for the first year
 *
 * @param projection - Income projection
 * @returns Total household income for the first 12 months
 */
export function calculateFirstYearIncome(projection: IncomeProjection): number {
  return projection.incomes
    .slice(0, 12)
    .reduce((sum, income) => sum + income.totalMonthlyNetIncome, 0);
}
