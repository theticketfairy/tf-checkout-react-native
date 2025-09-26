/**
 * Utility functions for checkout flow
 */

import { Config } from '../../helpers/Config'
import { CheckoutFormValues } from './form/types'
import { ICheckoutBody } from './types'

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

export const createRegistrationData = (
  values: CheckoutFormValues,
  isAgeRequired?: boolean
): FormData => {
  const registerUserData = new FormData()

  // Basic user info
  registerUserData.append('email', values.email)
  registerUserData.append('first_name', values.firstName)
  registerUserData.append('last_name', values.lastName)
  registerUserData.append('password', values.password)
  registerUserData.append('password_confirmation', values.passwordConfirmation)

  // Required credentials
  registerUserData.append('client_id', Config.CLIENT_ID)
  registerUserData.append('client_secret', Config.CLIENT_SECRET)
  registerUserData.append('check_cart_expiration', 'true')

  // Optional fields
  if (values.phone) registerUserData.append('phone', values.phone)
  if (values.city) registerUserData.append('city', values.city)
  if (values.street) registerUserData.append('street_address', values.street)
  if (values.postalCode) registerUserData.append('zip', values.postalCode)

  // Address fields
  if (values.country && values.country !== '-1') {
    registerUserData.append('country', values.country)
  }
  if (values.state && values.state !== '-1') {
    registerUserData.append('state', values.state)
  }

  // Age verification
  if (isAgeRequired && values.dateOfBirth) {
    addDateOfBirthToFormData(registerUserData, values.dateOfBirth)
  }

  return registerUserData
}

// Helper to add date of birth fields to form data
const addDateOfBirthToFormData = (
  formData: FormData,
  dateOfBirth: string
): void => {
  const dob = new Date(dateOfBirth)
  formData.append('dob_day', dob.getDate().toString())
  formData.append('dob_month', (dob.getMonth() + 1).toString())
  formData.append('dob_year', dob.getFullYear().toString())
}

// Helper to create checkout request body
export const createCheckoutBody = (
  values: CheckoutFormValues,
  isAgeRequired?: boolean
): ICheckoutBody => {
  // Use the ticket holders from the form values - no fallbacks
  const ticketHolders = values.ticketHolders.map((holder) => ({
    email: holder.email,
    first_name: holder.firstName,
    last_name: holder.lastName,
    phone: holder.phone,
  }))
  const body: ICheckoutBody = {
    attributes: {
      city: values.city,
      confirm_email: values.emailConfirmation,
      country:
        values.country && values.country !== '-1'
          ? parseInt(values.country, 10)
          : undefined,
      email: values.email,
      first_name: values.firstName,
      last_name: values.lastName,
      password: values.password || '',
      phone: values.phone || '',
      state:
        values.state && values.state !== '-1'
          ? parseInt(values.state, 10)
          : undefined,
      street_address: values.street,
      zip: values.postalCode,
      ticket_holders: ticketHolders,
      ttf_opt_in: values.isSubToTicketFairy,
      brand_opt_in: values.isSubToBrand,
      add_ons: values.addons,
    },
  }

  // Add date of birth if required
  if (isAgeRequired && values.dateOfBirth) {
    const dob = new Date(values.dateOfBirth)
    body.attributes.dob_day = dob.getDate()
    body.attributes.dob_month = dob.getMonth() + 1
    body.attributes.dob_year = dob.getFullYear()
  }

  console.log('VALUES CUSTOM FIELDS:', values.customFields)

  // Add custom fields if present
  if (values.customFields && Object.keys(values.customFields).length > 0) {
    body.attributes.data_capture = {}
    console.log('values.customFields', values.customFields)
    // Format custom fields for API
    Object.entries(values.customFields).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        body.attributes.data_capture![key] = value
      }
    })
  }

  return body
}
