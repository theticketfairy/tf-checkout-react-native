import * as Yup from 'yup'

export const createCheckoutValidationSchema = (isAgeRequired?: boolean) => {
  return Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    emailConfirmation: Yup.string()
      .oneOf([Yup.ref('email')], 'Emails must match')
      .required('Email confirmation is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters'),
    passwordConfirmation: Yup.string().oneOf(
      [Yup.ref('password')],
      'Passwords must match'
    ),
    phone: Yup.string(),
    street: Yup.string().required('Street address is required'),
    city: Yup.string().required('City is required'),
    postalCode: Yup.string().required('Postal code is required'),
    country: Yup.string().required('Country is required'),
    state: Yup.string().required('State is required'),
    dateOfBirth: isAgeRequired
      ? Yup.date().required('Date of birth is required')
      : Yup.date().nullable(),
    isSubToBrand: Yup.boolean(),
    isSubToTicketFairy: Yup.boolean(),
  })
}

export const initialFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  emailConfirmation: '',
  password: '',
  passwordConfirmation: '',
  phone: '',
  street: '',
  city: '',
  postalCode: '',
  country: '',
  state: '',
  dateOfBirth: null as Date | null,
  isSubToBrand: false,
  isSubToTicketFairy: false,
}

export type CheckoutFormValues = typeof initialFormValues

// Helper function to create initial values from user profile
export const createInitialFormValues = (
  userProfile?: any
): CheckoutFormValues => {
  if (!userProfile) {
    return initialFormValues
  }

  return {
    firstName: userProfile.firstName || '',
    lastName: userProfile.lastName || '',
    email: userProfile.email || '',
    emailConfirmation: userProfile.email || '',
    password: '',
    passwordConfirmation: '',
    phone: userProfile.phone || '',
    street: userProfile.streetAddress || '',
    city: userProfile.city || '',
    postalCode: userProfile.zipCode || '',
    country: userProfile.countryId ? String(userProfile.countryId) : '',
    state: userProfile.stateId ? String(userProfile.stateId) : '',
    dateOfBirth: userProfile.dateOfBirth
      ? (() => {
          // Parse date string format like "1990-12-25" same as BillingInfo
          const dobSplitted = userProfile.dateOfBirth.split('-')
          return new Date(
            parseInt(dobSplitted[0]!, 10), // year
            parseInt(dobSplitted[1]!, 10) - 1, // month (0-indexed)
            parseInt(dobSplitted[2]!, 10) // day
          )
        })()
      : null,
    isSubToBrand: userProfile.brandOptIn || false,
    isSubToTicketFairy: userProfile.ttfOptIn || false,
  }
}
