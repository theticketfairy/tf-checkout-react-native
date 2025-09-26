import * as Yup from 'yup'

import { Field } from '../../event/types'

export const createCheckoutFormConfig = ({
  minimumAge,
  isAgeRequired,
  requirePassword,
  isTicketFree = false,
  requiredConditions = [],
  isPhoneRequired = false,
  orderCustomFields = [],
}: {
  minimumAge?: number
  isAgeRequired: boolean
  requirePassword: boolean
  isTicketFree?: boolean
  isSinglePageCheckout?: boolean
  requiredConditions?: Array<{ id: string }>
  isPhoneRequired?: boolean
  orderCustomFields?: Field[]
}) =>
  Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    emailConfirmation: Yup.string()
      .oneOf([Yup.ref('email')], 'Emails must match')
      .required('Email confirmation is required'),
    dateOfBirth: isAgeRequired
      ? Yup.date()
          .required('Date of birth is required')
          .test(
            'is-old-enough',
            `You must be at least ${minimumAge} years old`,
            (value) => {
              if (!value) return false

              const today = new Date()
              const birthDate = new Date(value)

              let age = today.getFullYear() - birthDate.getFullYear()
              const monthDiff = today.getMonth() - birthDate.getMonth()

              // Adjust age if birthday hasn't occurred this year yet
              if (
                monthDiff < 0 ||
                (monthDiff === 0 && today.getDate() < birthDate.getDate())
              ) {
                age--
              }

              return age >= (minimumAge || 0)
            }
          )
      : Yup.date().optional(),
    street: isTicketFree
      ? Yup.string()
      : Yup.string().required('Street address is required'),
    city: isTicketFree
      ? Yup.string()
      : Yup.string().required('City is required'),
    postalCode: isTicketFree
      ? Yup.string()
      : Yup.string().required('Postal code is required'),
    password: requirePassword
      ? Yup.string().required('Password is required')
      : Yup.string(),
    passwordConfirmation: requirePassword
      ? Yup.string()
          .oneOf([Yup.ref('password')], 'Passwords must match')
          .required('Password confirmation is required')
      : Yup.string().oneOf([Yup.ref('password')], 'Passwords must match'),
    phone: isPhoneRequired
      ? Yup.string().required('Phone number is required')
      : Yup.string().optional(),
    isSubToTicketFairy: Yup.boolean(),
    isSubToBrand: Yup.boolean(),
    country: isTicketFree
      ? Yup.string()
      : Yup.string().test(
          'is-not-default',
          'Country is required',
          (value) => value !== '-1' && !!value
        ),
    state: Yup.string(),
    acceptedConditions: Yup.object().test(
      'required-conditions-accepted',
      'You must accept all required conditions to proceed',
      (value) => {
        // If no required conditions, skip validation
        if (!requiredConditions || requiredConditions.length === 0) {
          return true
        }

        // Check that all required conditions are accepted
        return requiredConditions.every(
          (condition) =>
            value && value[condition.id as keyof typeof value] === true
        )
      }
    ),

    // Ticket holders validation
    ticketHolders: Yup.array().of(
      Yup.object().shape({
        firstName: Yup.string().required('First name is required'),
        lastName: Yup.string().required('Last name is required'),
        email: Yup.string().email('Invalid email format'), // Email not required
        phone: Yup.string().optional(),
      })
    ),

    // Custom fields validation
    customFields: Yup.object().test(
      'validate-custom-fields',
      'Please fill out all required custom fields',
      (value: Record<string, string | string[]> | undefined) => {
        // If no custom fields, validation passes
        if (!orderCustomFields || orderCustomFields.length === 0) {
          return true
        }

        // Find required fields
        const requiredFields = orderCustomFields.filter(
          (field) => field.required
        )

        // If no required fields, validation passes
        if (requiredFields.length === 0) {
          return true
        }

        // Check that all required fields have values
        return requiredFields.every((field) => {
          const fieldValue = value?.[field.name]

          // For arrays (multi-select), check that there's at least one item
          if (Array.isArray(fieldValue)) {
            return fieldValue.length > 0
          }

          // For strings, check that it's not empty
          return fieldValue !== undefined && fieldValue !== ''
        })
      }
    ),
  })
