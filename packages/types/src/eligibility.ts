/**
 * TOKİ Başvuru Uygunluk Kontrolleri
 */

import {
  ApplicantInfo,
  INCOME_LIMITS,
  TOKI_PROJECT_CONSTANTS,
  calculateAge,
  calculateCitizenshipYears,
  CATEGORY_HOUSING_RESTRICTIONS,
  HousingType,
} from './toki-constants';

/**
 * Uygunluk kontrol sonucu
 */
export interface EligibilityResult {
  /** Başvuru uygun mu? */
  isEligible: boolean;
  /** Uygunluk kontrolleri */
  checks: EligibilityCheck[];
  /** Engellenen nedenler (varsa) */
  blockers: string[];
  /** Uyarılar (varsa) */
  warnings: string[];
}

/**
 * Tekil uygunluk kontrolü
 */
export interface EligibilityCheck {
  /** Kontrol adı */
  name: string;
  /** Kontrol geçti mi? */
  passed: boolean;
  /** Açıklama */
  message: string;
  /** Önem derecesi */
  severity: 'error' | 'warning' | 'info';
}

/**
 * TOKİ başvuru uygunluğunu kontrol et
 *
 * @param applicant - Başvurucu bilgileri
 * @returns Uygunluk kontrol sonucu
 *
 * @example
 * ```typescript
 * const applicant: ApplicantInfo = {
 *   citizenshipDate: new Date('2010-01-01'),
 *   birthDate: new Date('1995-06-15'),
 *   residenceDuration: 2,
 *   hasProperty: false,
 *   hasPreviousTokiContract: false,
 *   monthlyHouseholdIncome: 120_000_00,
 *   region: 'anadolu',
 *   category: 'youth'
 * };
 *
 * const result = checkEligibility(applicant);
 * if (result.isEligible) {
 *   console.log('Başvuru yapabilirsiniz!');
 * }
 * ```
 */
export function checkEligibility(applicant: ApplicantInfo): EligibilityResult {
  const checks: EligibilityCheck[] = [];
  const blockers: string[] = [];
  const warnings: string[] = [];

  // 1. Yaş Kontrolü (18 yaşını doldurmuş olmalı)
  const age = calculateAge(applicant.birthDate);
  const ageCheck: EligibilityCheck = {
    name: 'age',
    passed: age >= 18,
    message:
      age >= 18
        ? `Yaş kontrolü geçti (${age} yaş)`
        : `18 yaşını doldurmamışsınız (${age} yaş)`,
    severity: age >= 18 ? 'info' : 'error',
  };
  checks.push(ageCheck);
  if (!ageCheck.passed) {
    blockers.push(ageCheck.message);
  }

  // 2. Vatandaşlık Süresi Kontrolü (Son 10 yıldır T.C. vatandaşı)
  const citizenshipYears = calculateCitizenshipYears(applicant.citizenshipDate);
  const citizenshipCheck: EligibilityCheck = {
    name: 'citizenship',
    passed: citizenshipYears >= 10,
    message:
      citizenshipYears >= 10
        ? `Vatandaşlık süresi yeterli (${citizenshipYears} yıl)`
        : `Son 10 yıldır T.C. vatandaşı olmalısınız (${citizenshipYears} yıl)`,
    severity: citizenshipYears >= 10 ? 'info' : 'error',
  };
  checks.push(citizenshipCheck);
  if (!citizenshipCheck.passed) {
    blockers.push(citizenshipCheck.message);
  }

  // 3. İkamet Süresi Kontrolü (En az 1 yıl)
  const residenceCheck: EligibilityCheck = {
    name: 'residence',
    passed: applicant.residenceDuration >= 1,
    message:
      applicant.residenceDuration >= 1
        ? `İkamet süresi yeterli (${applicant.residenceDuration} yıl)`
        : `Başvuru yapacağınız yerde en az 1 yıldır ikamet etmelisiniz`,
    severity: applicant.residenceDuration >= 1 ? 'info' : 'error',
  };
  checks.push(residenceCheck);
  if (!residenceCheck.passed) {
    blockers.push(residenceCheck.message);
  }

  // 4. Konut Sahipliği Kontrolü
  const propertyCheck: EligibilityCheck = {
    name: 'property',
    passed: !applicant.hasProperty,
    message: applicant.hasProperty
      ? 'Üzerinizde kayıtlı bağımsız konut bulunmamalı'
      : 'Konut sahipliği kontrolü geçti',
    severity: applicant.hasProperty ? 'error' : 'info',
  };

  // Hisseli tapu istisnası
  if (
    applicant.hasProperty &&
    applicant.propertyShareValue !== undefined &&
    applicant.propertyShareValue <= 1_000_000_00
  ) {
    propertyCheck.passed = true;
    propertyCheck.message = `Hisseli tapu değeri 1 milyon TL'nin altında (${(applicant.propertyShareValue / 100).toLocaleString('tr-TR')} TL)`;
    propertyCheck.severity = 'warning';
    warnings.push(propertyCheck.message);
  } else if (applicant.hasProperty) {
    blockers.push(propertyCheck.message);
  }
  checks.push(propertyCheck);

  // 5. TOKİ Sözleşme Geçmişi Kontrolü
  const tokiContractCheck: EligibilityCheck = {
    name: 'toki-contract',
    passed: !applicant.hasPreviousTokiContract,
    message: applicant.hasPreviousTokiContract
      ? 'TOKİ ile daha önce sözleşme yapılmamış olmalı'
      : 'TOKİ sözleşme kontrolü geçti',
    severity: applicant.hasPreviousTokiContract ? 'error' : 'info',
  };
  checks.push(tokiContractCheck);
  if (!tokiContractCheck.passed) {
    blockers.push(tokiContractCheck.message);
  }

  // 6. Gelir Limiti Kontrolü
  const incomeLimit = INCOME_LIMITS[applicant.region];
  const incomeCheck: EligibilityCheck = {
    name: 'income',
    passed: applicant.monthlyHouseholdIncome <= incomeLimit,
    message:
      applicant.monthlyHouseholdIncome <= incomeLimit
        ? `Gelir limiti uygun (${(applicant.monthlyHouseholdIncome / 100).toLocaleString('tr-TR')} TL / ${(incomeLimit / 100).toLocaleString('tr-TR')} TL)`
        : `Aylık hane geliri ${(incomeLimit / 100).toLocaleString('tr-TR')} TL'yi aşmamalı (Mevcut: ${(applicant.monthlyHouseholdIncome / 100).toLocaleString('tr-TR')} TL)`,
    severity: applicant.monthlyHouseholdIncome <= incomeLimit ? 'info' : 'error',
  };
  checks.push(incomeCheck);
  if (!incomeCheck.passed) {
    blockers.push(incomeCheck.message);
  }

  // 7. Kategori Özel Kontrolleri
  const categoryChecks = checkCategorySpecificRequirements(applicant);
  checks.push(...categoryChecks.checks);
  blockers.push(...categoryChecks.blockers);
  warnings.push(...categoryChecks.warnings);

  // Genel uygunluk sonucu
  const isEligible = blockers.length === 0;

  return {
    isEligible,
    checks,
    blockers,
    warnings,
  };
}

/**
 * Kategoriye özel gereksinimleri kontrol et
 */
function checkCategorySpecificRequirements(applicant: ApplicantInfo): {
  checks: EligibilityCheck[];
  blockers: string[];
  warnings: string[];
} {
  const checks: EligibilityCheck[] = [];
  const blockers: string[] = [];
  const warnings: string[] = [];

  switch (applicant.category) {
    case 'youth': {
      // Genç kategorisi: 18-30 yaş arası (10 Kasım 1995 sonrası doğanlar)
      const age = calculateAge(applicant.birthDate);
      const youthCheck: EligibilityCheck = {
        name: 'youth-age',
        passed: age >= 18 && age <= 30,
        message:
          age >= 18 && age <= 30
            ? `Genç kategorisi yaş kontrolü geçti (${age} yaş)`
            : `Genç kategorisi için 18-30 yaş arası olmalısınız (Mevcut: ${age} yaş)`,
        severity: age >= 18 && age <= 30 ? 'info' : 'error',
      };
      checks.push(youthCheck);
      if (!youthCheck.passed) {
        blockers.push(youthCheck.message);
      }
      break;
    }

    case 'disabled': {
      // Engelli kategorisi: En az %40 rapor (bu bilgi applicant'ta yok, uyarı ver)
      const disabledCheck: EligibilityCheck = {
        name: 'disabled-report',
        passed: true,
        message: 'Engelli kategorisi için en az %40 engel raporu gereklidir',
        severity: 'warning',
      };
      checks.push(disabledCheck);
      warnings.push(disabledCheck.message);
      break;
    }

    case 'large-families': {
      // 3+ çocuklu aileler: 19 Aralık 2007 sonrası doğmuş en az 3 çocuk (bu bilgi applicant'ta yok)
      const familyCheck: EligibilityCheck = {
        name: 'large-family',
        passed: true,
        message: '19 Aralık 2007 sonrası doğmuş en az 3 çocuğunuz olmalı',
        severity: 'warning',
      };
      checks.push(familyCheck);
      warnings.push(familyCheck.message);
      break;
    }

    case 'veterans': {
      const veteranCheck: EligibilityCheck = {
        name: 'veteran',
        passed: true,
        message: '1005 sayılı kanuna tabi Kıbrıs veya Kore gazisi olmalısınız',
        severity: 'warning',
      };
      checks.push(veteranCheck);
      warnings.push(veteranCheck.message);
      break;
    }

    case 'martyr-families': {
      const martyrCheck: EligibilityCheck = {
        name: 'martyr-family',
        passed: true,
        message: 'Şehit yakınları için konut sahibi olma şartı aranmaz',
        severity: 'info',
      };
      checks.push(martyrCheck);
      break;
    }
  }

  return { checks, blockers, warnings };
}

/**
 * Kategoriye göre seçilebilecek konut tiplerini getir
 */
export function getEligibleHousingTypes(category: string): HousingType[] {
  return CATEGORY_HOUSING_RESTRICTIONS[category as keyof typeof CATEGORY_HOUSING_RESTRICTIONS] || [];
}

/**
 * Başvuru tarihlerinin geçerli olup olmadığını kontrol et
 */
export function isApplicationPeriodActive(currentDate: Date = new Date()): boolean {
  const startDate = new Date(TOKI_PROJECT_CONSTANTS.APPLICATION_DATES.start);
  const endDate = new Date(TOKI_PROJECT_CONSTANTS.APPLICATION_DATES.end);

  return currentDate >= startDate && currentDate <= endDate;
}

/**
 * Başvuru dönemi bilgisini getir
 */
export function getApplicationPeriodInfo(currentDate: Date = new Date()): {
  isActive: boolean;
  status: 'before' | 'active' | 'after';
  message: string;
  daysRemaining?: number;
} {
  const startDate = new Date(TOKI_PROJECT_CONSTANTS.APPLICATION_DATES.start);
  const endDate = new Date(TOKI_PROJECT_CONSTANTS.APPLICATION_DATES.end);

  if (currentDate < startDate) {
    const daysUntilStart = Math.ceil(
      (startDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return {
      isActive: false,
      status: 'before',
      message: `Başvurular ${startDate.toLocaleDateString('tr-TR')} tarihinde başlayacak`,
      daysRemaining: daysUntilStart,
    };
  }

  if (currentDate > endDate) {
    return {
      isActive: false,
      status: 'after',
      message: `Başvurular ${endDate.toLocaleDateString('tr-TR')} tarihinde sona erdi`,
    };
  }

  const daysRemaining = Math.ceil(
    (endDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    isActive: true,
    status: 'active',
    message: `Başvurular devam ediyor. Son gün: ${endDate.toLocaleDateString('tr-TR')}`,
    daysRemaining,
  };
}
