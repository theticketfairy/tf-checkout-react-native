export const priceWithCurrency = (value = '', currency = 'US$'): string =>
  currency +
  ' ' +
  parseFloat(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

export const emptyPhone = (phone: string): string | undefined =>
  phone.length < 4 ? undefined : phone
