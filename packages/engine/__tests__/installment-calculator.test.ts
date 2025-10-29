/**
 * Tests for Installment Calculator
 */

import { describe, it, expect } from 'vitest';
import {
  calculateInstallmentSchedule,
  calculateTotalOutOfPocket,
  getInstallmentForPeriod,
  calculateAverageMonthlyPayment,
} from '../src/calculators/installment-calculator';
import { InstallmentConfig } from '@tokicheck/types';

describe('Installment Calculator', () => {
  const baseConfig: InstallmentConfig = {
    initialAmount: 5000_00, // 5,000 TRY
    totalInstallments: 24, // 2 years for testing
    downPayment: 50000_00, // 50,000 TRY
    increaseConfig: {
      method: 'fixed-percentage',
      percentagePerPeriod: 10, // 10% increase
      increasePeriod: 6, // every 6 months
      increasePeriodUnit: 'month',
    },
  };

  describe('calculateInstallmentSchedule', () => {
    it('should calculate correct number of installments', () => {
      const schedule = calculateInstallmentSchedule(baseConfig);
      expect(schedule.installments).toHaveLength(24);
    });

    it('should apply increases at correct periods', () => {
      const schedule = calculateInstallmentSchedule(baseConfig);

      // First installment should be initial amount
      expect(schedule.installments[0].amount).toBe(5000_00);

      // 7th installment should have 10% increase (at period 7, 6 months passed)
      expect(schedule.installments[6].amount).toBe(5500_00);

      // 13th installment should have another 10% increase
      expect(schedule.installments[12].amount).toBe(6050_00);

      // 19th installment should have third increase
      expect(schedule.installments[18].amount).toBe(6655_00);
    });

    it('should calculate cumulative totals correctly', () => {
      const schedule = calculateInstallmentSchedule(baseConfig);

      // First period cumulative should equal first installment
      expect(schedule.installments[0].cumulativeTotal).toBe(5000_00);

      // Second period should be sum of first two
      expect(schedule.installments[1].cumulativeTotal).toBe(10000_00);

      // Last period should equal total amount
      expect(schedule.installments[23].cumulativeTotal).toBe(schedule.totalAmount);
    });

    it('should calculate total amount correctly', () => {
      const schedule = calculateInstallmentSchedule(baseConfig);

      // Manual calculation:
      // Periods 1-6: 6 * 5,000 = 30,000
      // Periods 7-12: 6 * 5,500 = 33,000
      // Periods 13-18: 6 * 6,050 = 36,300
      // Periods 19-24: 6 * 6,655 = 39,930
      // Total = 139,230
      expect(schedule.totalAmount).toBe(139_230_00);
    });
  });

  describe('calculateTotalOutOfPocket', () => {
    it('should include down payment in total', () => {
      const schedule = calculateInstallmentSchedule(baseConfig);
      const total = calculateTotalOutOfPocket(schedule);

      expect(total).toBe(baseConfig.downPayment + schedule.totalAmount);
    });
  });

  describe('getInstallmentForPeriod', () => {
    it('should return correct installment for valid period', () => {
      const schedule = calculateInstallmentSchedule(baseConfig);
      const installment = getInstallmentForPeriod(schedule, 7);

      expect(installment).toBeDefined();
      expect(installment?.period).toBe(7);
      expect(installment?.amount).toBe(5500_00);
    });

    it('should return undefined for invalid period', () => {
      const schedule = calculateInstallmentSchedule(baseConfig);
      const installment = getInstallmentForPeriod(schedule, 999);

      expect(installment).toBeUndefined();
    });
  });

  describe('calculateAverageMonthlyPayment', () => {
    it('should calculate correct average', () => {
      const schedule = calculateInstallmentSchedule(baseConfig);
      const average = calculateAverageMonthlyPayment(schedule);

      // Total is 139,230, divided by 24 periods
      expect(average).toBe(Math.round(139_230_00 / 24));
    });
  });

  describe('edge cases', () => {
    it('should handle zero increase percentage', () => {
      const config: InstallmentConfig = {
        ...baseConfig,
        increaseConfig: {
          method: 'fixed-percentage',
          percentagePerPeriod: 0,
          increasePeriod: 6,
          increasePeriodUnit: 'month',
        },
      };

      const schedule = calculateInstallmentSchedule(config);

      // All installments should be the same
      schedule.installments.forEach((inst) => {
        expect(inst.amount).toBe(5000_00);
      });
    });

    it('should handle single installment', () => {
      const config: InstallmentConfig = {
        ...baseConfig,
        totalInstallments: 1,
      };

      const schedule = calculateInstallmentSchedule(config);

      expect(schedule.installments).toHaveLength(1);
      expect(schedule.totalAmount).toBe(5000_00);
    });
  });
});
