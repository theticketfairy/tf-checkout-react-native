export const priceWithCurrency = (value = '', currency = 'US$'): string =>
  currency +
  ' ' +
  parseFloat(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
