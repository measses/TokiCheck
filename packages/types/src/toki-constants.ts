/**
 * TOKİ 500 Bin Sosyal Konut Projesi - Resmi Sabitler
 * Kaynak: Project-Details.md (10 Kasım - 19 Aralık 2025)
 */

import { MoneyAmount, Percentage } from './common';

/**
 * Konut tipi
 */
export type HousingType = '1+1_55' | '2+1_65' | '2+1_80';

/**
 * Bölge tipi (İstanbul veya Anadolu)
 */
export type RegionType = 'istanbul' | 'anadolu';

/**
 * Başvuru kategorisi
 */
export type ApplicantCategory =
  | 'martyr-families' // Şehit aileleri
  | 'veterans' // Gaziler
  | 'disabled' // %40+ engelli
  | 'large-families' // 3+ çocuklu
  | 'youth' // 18-30 yaş
  | 'retirees' // Emekliler
  | 'general'; // Genel

/**
 * Konut fiyat bilgileri
 */
export interface HousingPrice {
  housingType: HousingType;
  region: RegionType;
  squareMeters: number;
  downPayment: MoneyAmount; // Peşinat (kuruş)
  monthlyInstallment: MoneyAmount; // İlk taksit (kuruş)
  totalPrice: MoneyAmount; // Toplam fiyat (kuruş)
}

/**
 * TOKİ Resmi Konut Fiyatları
 */
export const TOKI_HOUSING_PRICES: Record<string, HousingPrice> = {
  // Anadolu - 1+1 (55 m²)
  'anadolu_1+1_55': {
    housingType: '1+1_55',
    region: 'anadolu',
    squareMeters: 55,
    downPayment: 180_000_00, // 180.000 TL
    monthlyInstallment: 6_750_00, // 6.750 TL
    totalPrice: 1_800_000_00, // 1.800.000 TL (peşinat %10)
  },

  // Anadolu - 2+1 (65 m²)
  'anadolu_2+1_65': {
    housingType: '2+1_65',
    region: 'anadolu',
    squareMeters: 65,
    downPayment: 220_000_00, // 220.000 TL
    monthlyInstallment: 8_250_00, // 8.250 TL
    totalPrice: 2_200_000_00, // 2.200.000 TL
  },

  // Anadolu - 2+1 (80 m²)
  'anadolu_2+1_80': {
    housingType: '2+1_80',
    region: 'anadolu',
    squareMeters: 80,
    downPayment: 265_000_00, // 265.000 TL
    monthlyInstallment: 9_938_00, // 9.938 TL
    totalPrice: 2_650_000_00, // 2.650.000 TL
  },

  // İstanbul - 1+1 (55 m²)
  'istanbul_1+1_55': {
    housingType: '1+1_55',
    region: 'istanbul',
    squareMeters: 55,
    downPayment: 195_000_00, // 195.000 TL
    monthlyInstallment: 7_313_00, // 7.313 TL
    totalPrice: 1_950_000_00, // 1.950.000 TL
  },

  // İstanbul - 2+1 (65 m²)
  'istanbul_2+1_65': {
    housingType: '2+1_65',
    region: 'istanbul',
    squareMeters: 65,
    downPayment: 245_000_00, // 245.000 TL
    monthlyInstallment: 9_188_00, // 9.188 TL
    totalPrice: 2_450_000_00, // 2.450.000 TL
  },

  // İstanbul - 2+1 (80 m²)
  'istanbul_2+1_80': {
    housingType: '2+1_80',
    region: 'istanbul',
    squareMeters: 80,
    downPayment: 295_000_00, // 295.000 TL
    monthlyInstallment: 11_063_00, // 11.063 TL
    totalPrice: 2_950_000_00, // 2.950.000 TL
  },
};

/**
 * Proje sabitleri
 */
export const TOKI_PROJECT_CONSTANTS = {
  /** Toplam konut sayısı */
  TOTAL_UNITS: 500_000,

  /** Başvuru ücreti (kuruş) */
  APPLICATION_FEE: 5_000_00, // 5.000 TL

  /** Peşinat oranı (%) */
  DOWN_PAYMENT_PERCENTAGE: 10,

  /** Toplam taksit sayısı (ay) */
  TOTAL_INSTALLMENTS: 240, // 20 yıl

  /** Taksit artış periyodu (ay) */
  INSTALLMENT_INCREASE_PERIOD: 6, // Her 6 ayda bir

  /** Başvuru tarihleri */
  APPLICATION_DATES: {
    start: '2025-11-10',
    end: '2025-12-19',
  },

  /** Kura tarihleri */
  LOTTERY_DATES: {
    start: '2025-12-29',
    end: '2026-02-27',
  },

  /** Teslimat başlangıç tarihi */
  DELIVERY_START: '2027-03',
} as const;

/**
 * Gelir limitleri (aylık hane geliri, kuruş cinsinden)
 */
export const INCOME_LIMITS: Record<RegionType, MoneyAmount> = {
  istanbul: 145_000_00, // 145.000 TL
  anadolu: 127_000_00, // 127.000 TL
};

/**
 * Kategori kontenjanları (%)
 */
export const CATEGORY_QUOTAS: Record<ApplicantCategory, Percentage> = {
  'martyr-families': 5, // %5
  'veterans': 5, // %5 (şehit aileleri ile birlikte)
  'disabled': 5, // %5
  'large-families': 10, // %10
  'youth': 20, // %20
  'retirees': 20, // %20
  'general': 40, // %40
};

/**
 * Kategoriye göre konut tipi kısıtlamaları
 */
export const CATEGORY_HOUSING_RESTRICTIONS: Record<
  ApplicantCategory,
  HousingType[]
> = {
  'martyr-families': ['2+1_65'], // Sadece 2+1 65m²
  'veterans': ['2+1_65'], // Sadece 2+1 65m²
  'disabled': ['2+1_65'], // Sadece 2+1 65m²
  'large-families': ['2+1_65', '2+1_80'], // 2+1 65m² veya 80m²
  'youth': ['1+1_55', '2+1_65'], // 1+1 veya 2+1 65m²
  'retirees': ['1+1_55', '2+1_65'], // 1+1 veya 2+1 65m²
  'general': ['2+1_65', '2+1_80'], // 2+1 65m² veya 80m²
};

/**
 * Deprem bölgesi illeri (11 il)
 */
export const EARTHQUAKE_ZONE_CITIES = [
  'Adana',
  'Adıyaman',
  'Diyarbakır',
  'Elazığ',
  'Gaziantep',
  'Hatay',
  'Kahramanmaraş',
  'Kilis',
  'Malatya',
  'Osmaniye',
  'Şanlıurfa',
] as const;

/**
 * Başvuru şartları kontrol fonksiyonu için yardımcı tip
 */
export interface ApplicantInfo {
  /** T.C. vatandaşlığı kazanma tarihi */
  citizenshipDate: Date;
  /** Doğum tarihi */
  birthDate: Date;
  /** İkamet süresi (yıl) */
  residenceDuration: number;
  /** Mevcut konut sahipliği */
  hasProperty: boolean;
  /** Hisseli tapu değeri (varsa, kuruş) */
  propertyShareValue?: MoneyAmount;
  /** TOKİ ile önceden sözleşme var mı? */
  hasPreviousTokiContract: boolean;
  /** Aylık hane geliri (kuruş) */
  monthlyHouseholdIncome: MoneyAmount;
  /** Başvuru yapılan bölge */
  region: RegionType;
  /** Başvuru kategorisi */
  category: ApplicantCategory;
}

/**
 * Yaş hesaplama yardımcı fonksiyonu
 */
export function calculateAge(birthDate: Date, referenceDate: Date = new Date()): number {
  const age = referenceDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = referenceDate.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getDate() < birthDate.getDate())) {
    return age - 1;
  }

  return age;
}

/**
 * Vatandaşlık süresini yıl olarak hesapla
 */
export function calculateCitizenshipYears(
  citizenshipDate: Date,
  referenceDate: Date = new Date()
): number {
  const years = referenceDate.getFullYear() - citizenshipDate.getFullYear();
  const monthDiff = referenceDate.getMonth() - citizenshipDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getDate() < citizenshipDate.getDate())) {
    return years - 1;
  }

  return years;
}

/**
 * Konut fiyatı getir
 */
export function getHousingPrice(
  region: RegionType,
  housingType: HousingType
): HousingPrice | undefined {
  return TOKI_HOUSING_PRICES[`${region}_${housingType}`];
}

/**
 * Başvuru ücreti hesapla (şehit yakınları ve gaziler için ücretsiz)
 */
export function calculateApplicationFee(category: ApplicantCategory): MoneyAmount {
  if (category === 'martyr-families' || category === 'veterans') {
    return 0;
  }
  return TOKI_PROJECT_CONSTANTS.APPLICATION_FEE;
}
