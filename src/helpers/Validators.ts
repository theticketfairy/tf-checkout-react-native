export const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

//https://www.twilio.com/docs/glossary/what-e164
const phoneRegex = /^\+[1-9]\d{1,14}$/

const emptyRegex = /^\s+$/

export const validateEmpty = (
  value?: string | number,
  message?: string,
): string => {
  let errorMessage = ''

  if (!value) {
    return message || 'Required'
  }

  if (typeof value === 'string') {
    return emptyRegex.test(value) ? message || 'Required' : ''
  }
  return errorMessage
}

export const validateMinLength = (
  value: string,
  minLength: number,
  fieldName: string = 'Field',
) =>
  value.length < minLength
    ? `${fieldName} requires at least ${minLength} characters`
    : ''

export const validateEmail = (email: string, equalTo?: string) => {
  if (!email) {
    return 'Required'
  }

  let validation = ''

  if (equalTo) {
    validation = email === equalTo ? '' : 'Emails must match'
  }
  if (validation) {
    return validation
  }
  return !emailRegex.test(email) ? 'Please enter a valid email address' : ''
}

export const validatePasswords = (password?: string, equalTo?: string) => {
  if (!password) {
    return 'Required'
  }

  let validation = ''
  if (equalTo) {
    validation = password === equalTo ? '' : 'Passwords must match'
  }
  if (validation) {
    return validation
  }
  validation = validateEmpty(password)
  if (validation) {
    return validation
  }

  return validateMinLength(password, 6, 'Password')
}

export const validateAge = (
  dateOfBirth?: Date,
  minimumAge: number = 18,
): string => {
  if (!dateOfBirth) {
    return 'Required'
  }

  const today = new Date()
  const age = today.getFullYear() - dateOfBirth.getFullYear()
  return age < minimumAge ? `You must be at least ${minimumAge} years old` : ''
}

interface IValidatePhoneNumber {
  phoneNumber?: string
  customError?: string
  countryCode?: string
}

export const validatePhoneNumber = ({
  phoneNumber,
  customError,
  countryCode,
}: IValidatePhoneNumber) => {
  if (!phoneNumber) {
    return customError || 'Please enter a phone number'
  }

  if (phoneNumber === countryCode)
    return customError || 'Please enter a valid phone number'

  return !phoneRegex.test(`${phoneNumber}`)
    ? customError || 'Please enter a valid phone number'
    : ''
}

export const validateDropDownEmpty = (
  selectedOptionId?: string | number,
): string => {
  if (!selectedOptionId) return 'Required'

  if (typeof selectedOptionId === 'string') {
    return selectedOptionId === '-1' ? 'Required' : ''
  }

  if (typeof selectedOptionId === 'number') {
    return selectedOptionId === -1 ? 'Required' : ''
  }

  return ''
}
