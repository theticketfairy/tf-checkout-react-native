export const priceWithCurrency = (value = '', currency = 'US$'): string =>
  currency +
  ' ' +
  parseFloat(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

export const getCurrencySymbol = (currency = '') => {
  switch (currency) {
    case 'GBP':
      return '£'
    case 'EUR':
      return '€'
    case 'INR':
      return '₹'
    case 'JMD':
      return 'J$'
    case 'NZD':
      return 'NZ$'
    case 'MYR':
      return 'RM'
    case 'MXN':
      return 'Mex$'
    case 'SGD':
      return 'S$'
    case 'AUD':
      return 'A$'
    case 'ZAR':
      return 'R'
    case 'ke':
      return 'Ksh'
    case 'TRY':
      return '₺'
    case 'CAD':
      return 'CA$'
    case 'THB':
      return '฿'
    case 'ISK':
      return 'Kr'
    case 'SEK':
      return 'kr'
    default:
      return 'US$'
  }
}
