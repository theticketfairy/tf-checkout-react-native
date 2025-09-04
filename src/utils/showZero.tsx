import _isNumber from 'lodash/isNumber'

export const showZero = (value = 0) => {
  const intNumber = Number(value)
  return _isNumber(intNumber)
    ? intNumber >= 0 && intNumber < 10
      ? '0' + intNumber
      : intNumber
    : null
}
