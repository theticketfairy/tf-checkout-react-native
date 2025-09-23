/**
 * Utility functions for checkout flow
 */

/**
 * Format a price with its currency symbol
 *
 * @param value Price value as string
 * @param currency Currency code
 * @returns Formatted price with currency symbol
 */
export const priceWithCurrency = (value = '', currency = 'US$'): string =>
  currency +
  ' ' +
  parseFloat(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
