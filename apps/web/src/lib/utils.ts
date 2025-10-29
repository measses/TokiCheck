import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format number with Turkish locale
 */
export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat('tr-TR', options).format(value);
}

/**
 * Format currency (TRY)
 */
export function formatCurrency(amount: number, locale: 'tr' | 'en' = 'tr'): string {
  const lira = amount / 100; // Convert from kuruş to lira

  if (locale === 'tr') {
    return `${formatNumber(lira, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} ₺`;
  } else {
    return `${new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(lira)} TRY`;
  }
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `%${formatNumber(value, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
}
