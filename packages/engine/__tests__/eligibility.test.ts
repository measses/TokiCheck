/**
 * Tests for TOKİ Eligibility Checker
 */

import { describe, it, expect } from 'vitest';
import {
  checkEligibility,
  getEligibleHousingTypes,
  isApplicationPeriodActive,
  getApplicationPeriodInfo,
} from '@tokicheck/types';
import type { ApplicantInfo } from '@tokicheck/types';

describe('Eligibility Checker', () => {
  const validApplicant: ApplicantInfo = {
    citizenshipDate: new Date('2010-01-01'),
    birthDate: new Date('1990-06-15'),
    residenceDuration: 2,
    hasProperty: false,
    hasPreviousTokiContract: false,
    monthlyHouseholdIncome: 100_000_00, // 100,000 TL
    region: 'anadolu',
    category: 'general',
  };

  describe('checkEligibility', () => {
    it('should pass all checks for a valid general applicant', () => {
      const result = checkEligibility(validApplicant);

      expect(result.isEligible).toBe(true);
      expect(result.blockers).toHaveLength(0);
      expect(result.checks.every((check) => check.passed)).toBe(true);
    });

    it('should fail if applicant is under 18', () => {
      const applicant: ApplicantInfo = {
        ...validApplicant,
        birthDate: new Date('2010-01-01'), // 15 years old
      };

      const result = checkEligibility(applicant);

      expect(result.isEligible).toBe(false);
      expect(result.blockers.length).toBeGreaterThan(0);
      expect(result.blockers.some((b) => b.includes('18 yaşını'))).toBe(true);
    });

    it('should fail if citizenship is less than 10 years', () => {
      const applicant: ApplicantInfo = {
        ...validApplicant,
        citizenshipDate: new Date('2020-01-01'), // Only 5 years
      };

      const result = checkEligibility(applicant);

      expect(result.isEligible).toBe(false);
      expect(result.blockers.some((b) => b.includes('10 yıldır'))).toBe(true);
    });

    it('should fail if residence duration is less than 1 year', () => {
      const applicant: ApplicantInfo = {
        ...validApplicant,
        residenceDuration: 0.5, // 6 months
      };

      const result = checkEligibility(applicant);

      expect(result.isEligible).toBe(false);
      expect(result.blockers.some((b) => b.includes('ikamet'))).toBe(true);
    });

    it('should fail if applicant has property', () => {
      const applicant: ApplicantInfo = {
        ...validApplicant,
        hasProperty: true,
      };

      const result = checkEligibility(applicant);

      expect(result.isEligible).toBe(false);
      expect(result.blockers.some((b) => b.includes('konut'))).toBe(true);
    });

    it('should pass if property share value is under 1 million TL', () => {
      const applicant: ApplicantInfo = {
        ...validApplicant,
        hasProperty: true,
        propertyShareValue: 800_000_00, // 800,000 TL
      };

      const result = checkEligibility(applicant);

      expect(result.isEligible).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it('should fail if income exceeds limit for Anadolu', () => {
      const applicant: ApplicantInfo = {
        ...validApplicant,
        region: 'anadolu',
        monthlyHouseholdIncome: 130_000_00, // Over 127,000 TL limit
      };

      const result = checkEligibility(applicant);

      expect(result.isEligible).toBe(false);
      expect(result.blockers.some((b) => b.includes('127.000'))).toBe(true);
    });

    it('should fail if income exceeds limit for Istanbul', () => {
      const applicant: ApplicantInfo = {
        ...validApplicant,
        region: 'istanbul',
        monthlyHouseholdIncome: 150_000_00, // Over 145,000 TL limit
      };

      const result = checkEligibility(applicant);

      expect(result.isEligible).toBe(false);
      expect(result.blockers.some((b) => b.includes('145.000'))).toBe(true);
    });

    it('should fail if applicant has previous TOKİ contract', () => {
      const applicant: ApplicantInfo = {
        ...validApplicant,
        hasPreviousTokiContract: true,
      };

      const result = checkEligibility(applicant);

      expect(result.isEligible).toBe(false);
      expect(result.blockers.some((b) => b.includes('TOKİ'))).toBe(true);
    });
  });

  describe('Category-Specific Requirements', () => {
    it('should fail youth category if over 30 years old', () => {
      const applicant: ApplicantInfo = {
        ...validApplicant,
        birthDate: new Date('1990-01-01'), // 35 years old
        category: 'youth',
      };

      const result = checkEligibility(applicant);

      expect(result.isEligible).toBe(false);
      expect(result.blockers.some((b) => b.includes('18-30 yaş'))).toBe(true);
    });

    it('should pass youth category if between 18-30', () => {
      const applicant: ApplicantInfo = {
        ...validApplicant,
        birthDate: new Date('2000-01-01'), // 25 years old
        category: 'youth',
      };

      const result = checkEligibility(applicant);

      expect(result.isEligible).toBe(true);
    });

    it('should add warning for disabled category', () => {
      const applicant: ApplicantInfo = {
        ...validApplicant,
        category: 'disabled',
      };

      const result = checkEligibility(applicant);

      expect(result.warnings.some((w) => w.includes('%40 engel raporu'))).toBe(true);
    });

    it('should add warning for large families category', () => {
      const applicant: ApplicantInfo = {
        ...validApplicant,
        category: 'large-families',
      };

      const result = checkEligibility(applicant);

      expect(result.warnings.some((w) => w.includes('3 çocuk'))).toBe(true);
    });
  });

  describe('getEligibleHousingTypes', () => {
    it('should return correct housing types for youth category', () => {
      const types = getEligibleHousingTypes('youth');

      expect(types).toContain('1+1_55');
      expect(types).toContain('2+1_65');
      expect(types).not.toContain('2+1_80');
    });

    it('should return correct housing types for large families', () => {
      const types = getEligibleHousingTypes('large-families');

      expect(types).toContain('2+1_65');
      expect(types).toContain('2+1_80');
      expect(types).not.toContain('1+1_55');
    });

    it('should return only 2+1 65m² for martyrs families', () => {
      const types = getEligibleHousingTypes('martyr-families');

      expect(types).toEqual(['2+1_65']);
    });
  });

  describe('Application Period', () => {
    it('should correctly identify if application period is active', () => {
      const duringPeriod = new Date('2025-11-15');
      expect(isApplicationPeriodActive(duringPeriod)).toBe(true);

      const beforePeriod = new Date('2025-11-01');
      expect(isApplicationPeriodActive(beforePeriod)).toBe(false);

      const afterPeriod = new Date('2025-12-25');
      expect(isApplicationPeriodActive(afterPeriod)).toBe(false);
    });

    it('should return correct status before application period', () => {
      const date = new Date('2025-11-01');
      const info = getApplicationPeriodInfo(date);

      expect(info.isActive).toBe(false);
      expect(info.status).toBe('before');
      expect(info.daysRemaining).toBeGreaterThan(0);
    });

    it('should return correct status during application period', () => {
      const date = new Date('2025-11-15');
      const info = getApplicationPeriodInfo(date);

      expect(info.isActive).toBe(true);
      expect(info.status).toBe('active');
      expect(info.daysRemaining).toBeGreaterThan(0);
    });

    it('should return correct status after application period', () => {
      const date = new Date('2025-12-25');
      const info = getApplicationPeriodInfo(date);

      expect(info.isActive).toBe(false);
      expect(info.status).toBe('after');
      expect(info.daysRemaining).toBeUndefined();
    });
  });
});
