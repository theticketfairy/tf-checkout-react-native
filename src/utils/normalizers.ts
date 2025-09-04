/**
 * Currency and number normalization utilities for React Native
 * Adapted from tf-checkout-react for consistency
 */

export const createFixedFloatNormalizer =
  (decimalPlaces: number) =>
  (value: number): string => {
    if (isNaN(value)) return '0.00'
    return value.toFixed(decimalPlaces)
  }

export const currencyNormalizerCreator = (
  value: string | number,
  currency: string = 'USD'
): string => {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value

  if (isNaN(numericValue)) return '$0.00'

  const currencySymbols: { [key: string]: string } = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'C$',
    AUD: 'A$',
    JPY: '¥',
  }

  const symbol = currencySymbols[currency.toUpperCase()] || '$'
  const formattedValue = numericValue.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return `${symbol}${formattedValue}`
}

export const showZero = (value: number): string => {
  return value < 10 ? `0${value}` : `${value}`
}

export const formatPrice = (
  price: string | number,
  currency: string = 'USD'
): string => {
  const normalizedPrice = createFixedFloatNormalizer(2)(
    typeof price === 'string' ? parseFloat(price) : price
  )
  return currencyNormalizerCreator(normalizedPrice, currency)
}
