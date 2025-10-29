/**
 * Utility functions for formatting numbers and currency
 */

import { MoneyAmount } from '@tokicheck/types';

/**
 * Format money amount (in kuruş) to TRY string
 *
 * @param amount - Amount in kuruş (smallest unit)
 * @param options - Formatting options
 * @returns Formatted string (e.g., "5.000,00 ₺" or "5000 TRY")
 *
 * @example
 * ```typescript
 * formatMoney(500000); // "5.000,00 ₺"
 * formatMoney(500000, { locale: 'en', showDecimals: false }); // "5,000 TRY"
 * ```
 */
export function formatMoney(
  amount: MoneyAmount,
  options: {
    locale?: 'tr' | 'en';
    showDecimals?: boolean;
    showCurrency?: boolean;
  } = {}
): string {
  const { locale = 'tr', showDecimals = true, showCurrency = true } = options;

  // Convert from kuruş to lira
  const lira = amount / 100;

  if (locale === 'tr') {
    const formatted = showDecimals
      ? lira.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : Math.round(lira).toLocaleString('tr-TR');

    return showCurrency ? `${formatted} ₺` : formatted;
  } else {
    const formatted = showDecimals
      ? lira.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : Math.round(lira).toLocaleString('en-US');

    return showCurrency ? `${formatted} TRY` : formatted;
  }
}

/**
 * Format percentage value
 *
 * @param percentage - Percentage value (0-100)
 * @param options - Formatting options
 * @returns Formatted string (e.g., "%15,50" or "15.5%")
 *
 * @example
 * ```typescript
 * formatPercentage(15.5); // "%15,50"
 * formatPercentage(15.5, { locale: 'en' }); // "15.5%"
 * ```
 */
export function formatPercentage(
  percentage: number,
  options: {
    locale?: 'tr' | 'en';
    decimals?: number;
  } = {}
): string {
  const { locale = 'tr', decimals = 2 } = options;

  const formatted = percentage.toLocaleString(locale === 'tr' ? 'tr-TR' : 'en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return locale === 'tr' ? `%${formatted}` : `${formatted}%`;
}

/**
 * Parse money string to amount in kuruş
 *
 * @param moneyString - Money string (e.g., "5.000,00" or "5000")
 * @param locale - Locale to use for parsing
 * @returns Amount in kuruş
 *
 * @example
 * ```typescript
 * parseMoney("5.000,00"); // 500000
 * parseMoney("5000"); // 500000
 * ```
 */
export function parseMoney(moneyString: string, locale: 'tr' | 'en' = 'tr'): MoneyAmount {
  // Remove currency symbols and whitespace
  let cleaned = moneyString.replace(/[₺TRY\s]/g, '');

  if (locale === 'tr') {
    // Turkish format: 5.000,00
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  } else {
    // English format: 5,000.00
    cleaned = cleaned.replace(/,/g, '');
  }

  const lira = parseFloat(cleaned);
  return Math.round(lira * 100);
}
