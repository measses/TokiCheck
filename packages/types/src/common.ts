/**
 * Common types used throughout the application
 */

/**
 * Supported languages
 */
export type Language = 'tr' | 'en';

/**
 * Currency type (TRY for Turkish Lira)
 */
export type Currency = 'TRY';

/**
 * Time period units
 */
export type PeriodUnit = 'month' | 'year';

/**
 * Percentage value (0-100)
 */
export type Percentage = number;

/**
 * Money amount in the smallest unit (e.g., kuruş for TRY)
 */
export type MoneyAmount = number;

/**
 * Date range
 */
export interface DateRange {
  start: Date;
  end: Date;
}

/**
 * Numeric range
 */
export interface NumericRange {
  min: number;
  max: number;
}
