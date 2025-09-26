import { CardForm, CardFormView } from '@stripe/stripe-react-native'
import { FormikProvider, useFormik } from 'formik'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
} from 'react-native'

import { FormField, Loading, PhoneInput } from '../../../components'
import { readableError } from '../../../utils/handlers'
import { Field } from '../../event/types'
import AddonsContainer from '../components/AddonsContainer'
import Conditions from '../components/Conditions'
import OrderReview, { IOrderItem } from '../components/OrderReview'
import TicketHoldersSection from '../components/TicketHoldersSection'
import { createCheckoutFormConfig } from './config'
import styles from './styles'
import {
  CheckoutFormProps,
  PaymentFormProps,
  TicketHolderFormValues,
} from './types'

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  initialValues,
  isSubmitting,
  isLoggedIn,
  isAgeRequired = false,
  minimumAge,
  isTicketFree = false,
  isPhoneRequired = false,
  isPhoneHidden = false,
  countries,
  states,
  onCountryChange,
  orderItems,
  availableAddons = [],
  onAddonChange,
  onSubmit: onSubmitCallback,
  scrollRef,
  isInitialLoading,
  eventCurrency,
  conditions,
  isSinglePageCheckout = true,
  orderCustomFields = [],
}) => {
  // Handle card form state for payment
  const [isCardFormComplete, setIsCardFormComplete] = useState(false)
  const [cardFormError, setCardFormError] = useState<string>()
  useEffect(() => {
    console.log('ORDER CUSTOM FIELDS', orderCustomFields)
  }, [orderCustomFields])
  // Initial values already include default custom field values from the hook
  const modifiedInitialValues = {
    ...initialValues,
    isCardFormComplete: isTicketFree ? true : initialValues.isCardFormComplete,
  }
  const requiredConditions = useMemo(
    () => conditions?.filter((c) => c.is_required) || [],
    [conditions]
  )

  const formik = useFormik({
    initialValues: modifiedInitialValues,
    onSubmit: onSubmitCallback,
    validationSchema: createCheckoutFormConfig({
      minimumAge,
      isAgeRequired,
      requirePassword: !isLoggedIn,
      isTicketFree,
      isSinglePageCheckout,
      requiredConditions,
      isPhoneRequired,
      orderCustomFields,
    }),
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: false,
    // Disable reinitialization to prevent form reset
    enableReinitialize: true,
  })

  // Custom field values are initialized with defaults and any existing user values

  const fieldTopRef = useRef<Record<string, number>>({})

  /**
   * Helper function to render custom fields based on field type
   * Supports text, textarea, select, select_multi, phone, and radio field types
   * Automatically handles the appropriate FormField configuration for each type
   */
  const renderField = (field: Field) => {
    const fieldId = `customFields.${field.id}`
    const fieldValue = formik.values.customFields?.[field.name]

    const commonInputProps = {
      onBlur: () => formik.setFieldTouched(`customFields.${field.name}`, true),
    }

    switch (field.type) {
      case 'text':
        return (
          <FormField
            fieldType='input'
            id={fieldId}
            inputProps={{
              label: field.label,
              value: (fieldValue as string) || '',
              onTextChanged: (_, value) => {
                console.log('TEXT CHANGED', `customFields.${field.name}`, value)
                formik.setFieldValue(`customFields.${field.name}`, value)
              },
              placeholder:
                (field.defaultValue as string) || `Enter ${field.label}`,
              ...commonInputProps,
            }}
          />
        )

      case 'textarea':
        return (
          <FormField
            fieldType='input'
            id={fieldId}
            inputProps={{
              label: field.label,
              value: (fieldValue as string) || '',
              onTextChanged: (_, value) => {
                formik.setFieldValue(`customFields.${field.name}`, value)
              },
              placeholder:
                (field.defaultValue as string) || `Enter ${field.label}`,
              multiline: true,
              numberOfLines: 4,
              ...commonInputProps,
            }}
          />
        )

      case 'select':
        return (
          <FormField
            fieldType='dropdown'
            id={fieldId}
            dropdownProps={{
              options: [
                { value: '', label: `Select ${field.label}` },
                ...(field.options?.map((option) => ({
                  value: option.value,
                  label: option.name,
                })) || []),
              ],
              onSelectOption: (_, item) => {
                formik.setFieldValue(`customFields.${field.name}`, item.value)
              },
              selectedOption: {
                value: (fieldValue as string) || '',
                label:
                  field.options?.find((o) => o.value === fieldValue)?.name ||
                  `Select ${field.label}`,
              },
              style: {
                label: { text: field.label },
              },
            }}
          />
        )

      case 'phone':
        return (
          <PhoneInput
            phoneNumber={(fieldValue as string) || ''}
            onChangePhoneNumber={(payload) => {
              formik.setFieldValue(`customFields.${field.name}`, payload.input)
              requestAnimationFrame(() => {
                if (!payload.isValid) {
                  formik.setFieldError(
                    `customFields.${field.name}`,
                    'Invalid phone number'
                  )
                }
              })
            }}
            error={
              field.required && !fieldValue
                ? `${field.label} is required`
                : undefined
            }
            texts={{
              label: field.label,
            }}
          />
        )

      case 'select_multi': {
        // Extract the selected values as an array of strings
        const selectedValues = Array.isArray(fieldValue)
          ? fieldValue.map((value) => String(value))
          : [String(fieldValue)]

        // Convert field options to IDropdownItem format
        const dropdownOptions =
          field.options?.map((option) => ({
            value: String(option.value),
            label: option.name,
          })) || []

        // Get selected options based on values
        const selectedOptions = dropdownOptions.filter((option) =>
          selectedValues.includes(option.value)
        )

        return (
          <View style={{ marginBottom: 16 }}>
            <FormField
              fieldType='dropdown'
              id={fieldId}
              error={
                field.required && selectedValues.length === 0
                  ? `${field.label} is required`
                  : undefined
              }
              dropdownProps={{
                options: dropdownOptions,
                selectedOptions: selectedOptions,
                isMultiSelect: true,
                onSelectOption: (_, item) => {
                  // Toggle selection
                  let newValues = [...selectedValues]

                  if (selectedValues.includes(String(item.value))) {
                    // Remove if already selected
                    newValues = newValues.filter((val) => val !== item.value)
                  } else {
                    // Add if not selected
                    newValues.push(String(item.value))
                  }

                  formik.setFieldValue(`customFields.${field.name}`, newValues)
                },
                style: {
                  label: { text: field.label },
                  button: {
                    backgroundColor:
                      selectedValues.length > 0 ? '#E6F0FF' : undefined,
                  },
                },
              }}
            />
          </View>
        )
      }

      case 'radio':
        return (
          <FormField
            fieldType='radio'
            id={fieldId}
            radioProps={{
              options:
                field.options?.map((option) => ({
                  value: option.value,
                  label: option.name,
                })) || [],
              selectedValue: fieldValue as string,
              onValueChange: (value) => {
                formik.setFieldValue(`customFields.${field.name}`, value)
              },
              label: field.label,
            }}
            error={
              field.required && !fieldValue
                ? `${field.label} is required`
                : undefined
            }
          />
        )

      // Fallback for unsupported types
      default:
        return (
          <FormField
            fieldType='title'
            title={`Unsupported field type: ${field.type} (${field.label})`}
          />
        )
    }
  }

  // Order of fields as they appear visually. Include only the keys present in your validation schema.
  const fieldOrder = useMemo(
    () => [
      'firstName',
      'lastName',
      'email',
      'emailConfirmation',
      ...(isLoggedIn ? [] : ['password', 'passwordConfirmation']),
      ...(isPhoneRequired || !isPhoneHidden ? ['phone'] : []),
      ...(isAgeRequired ? ['dateOfBirth'] : []),
      'street',
      'city',
      'country',
      'postalCode',
      'state',
      'ticketHolders', // Add ticket holders field for validation
      // Include card validation as the last field to check
      ...(isTicketFree ? [] : ['isCardFormComplete']),
    ],
    [isLoggedIn, isAgeRequired, isTicketFree, isPhoneHidden, isPhoneRequired]
  )

  // 2) helper: scroll to a field by key
  const scrollToField = (key: string) => {
    console.log('SCROLL TO:', key)
    if (key === 'isCardFormComplete') {
      return
    }
    const y = fieldTopRef.current[key]
    if (y != null && scrollRef.current) {
      scrollRef.current.scrollTo({ y: Math.max(0, y - 16), animated: true })
    }
  }

  const onPressSubmit = async () => {
    console.log('ON PRESS SUBMIT')
    const allFields = Object.keys(initialValues)

    // Create touched fields with special handling for nested ticket holders
    const touchedFields = allFields.reduce((acc, field) => {
      // Handle ticketHolders specially as a nested structure
      if (field === 'ticketHolders') {
        // Create a properly structured touched fields object for ticket holders
        acc[field] = formik.values.ticketHolders.map(() => ({
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
        }))
      } else {
        // Mark all other fields as touched
        acc[field] = true
      }
      return acc
    }, {} as Record<string, boolean | Record<string, boolean>[]>)

    const result = await formik.setTouched(touchedFields, true)
    const formErrors = result ?? {}
    const paymentValid =
      isCardFormComplete || isTicketFree || !isSinglePageCheckout
    console.log('PAYMENT VALID', paymentValid)
    if (!paymentValid) {
      setCardFormError('Please fill your payment information')
    }

    if (Object.keys(formErrors).length === 0 && paymentValid) {
      console.log('PRESS SUBMIT')
      formik.handleSubmit()
      return
    }

    console.log('FORM ERRORS', formErrors)

    // find first error by visual order
    const firstErroredKey = fieldOrder.find(
      (k) => formErrors[k as keyof typeof formErrors] != null
    )

    console.log('FIRST ERRORED KEY', firstErroredKey)

    if (firstErroredKey) {
      scrollToField(firstErroredKey)
    } else if (!paymentValid) {
      scrollToField('isCardFormComplete')
    }
  }

  return (
    <FormikProvider value={formik}>
      {isInitialLoading && <Loading />}
      <View style={styles.form}>
        {/* Personal Information */}
        <View
          onLayout={(e) =>
            (fieldTopRef.current.firstName = e.nativeEvent.layout.y)
          }
        >
          <FormField
            fieldType='input'
            id='firstName'
            error={
              formik.touched.firstName ? formik.errors.firstName : undefined
            }
            inputProps={{
              label: 'First Name',
              value: formik.values.firstName,
              onTextChanged: (_, value) =>
                formik.handleChange('firstName')(value),
              onBlur: (e) => formik.handleBlur('firstName')(e),
              placeholder: 'Enter your first name',
            }}
          />
        </View>

        <View
          onLayout={(e) =>
            (fieldTopRef.current.lastName = e.nativeEvent.layout.y)
          }
        >
          <FormField
            fieldType='input'
            id='lastName'
            error={formik.touched.lastName ? formik.errors.lastName : undefined}
            inputProps={{
              label: 'Last Name',
              value: formik.values.lastName,
              onTextChanged: (_, value) =>
                formik.handleChange('lastName')(value),
              onBlur: (e) => formik.handleBlur('lastName')(e),
              placeholder: 'Enter your last name',
            }}
          />
        </View>

        <View
          onLayout={(e) => (fieldTopRef.current.email = e.nativeEvent.layout.y)}
        >
          <FormField
            fieldType='input'
            id='email'
            error={formik.touched.email ? formik.errors.email : undefined}
            inputProps={{
              label: 'Email',
              value: formik.values.email,
              onTextChanged: (_, value) => formik.handleChange('email')(value),
              onBlur: (e) => formik.handleBlur('email')(e),
              placeholder: 'Enter your email',
              keyboardType: 'email-address',
            }}
          />
        </View>

        <View
          onLayout={(e) =>
            (fieldTopRef.current.emailConfirmation = e.nativeEvent.layout.y)
          }
        >
          <FormField
            fieldType='input'
            id='emailConfirmation'
            error={
              formik.touched.emailConfirmation
                ? formik.errors.emailConfirmation
                : undefined
            }
            inputProps={{
              label: 'Confirm Email',
              value: formik.values.emailConfirmation,
              onTextChanged: (_, value) =>
                formik.handleChange('emailConfirmation')(value),
              onBlur: (e) => formik.handleBlur('emailConfirmation')(e),
              placeholder: 'Confirm your email',
              keyboardType: 'email-address',
            }}
          />
        </View>

        {/* Registration fields (only if not logged in) */}
        {!isLoggedIn && (
          <>
            <FormField
              fieldType='title'
              title='Choose a password for your new TICKETFAIRY account'
              titleStyle={styles.sectionTitle}
            />

            <View
              onLayout={(e) =>
                (fieldTopRef.current.password = e.nativeEvent.layout.y)
              }
            >
              <FormField
                fieldType='input'
                id='password'
                error={
                  formik.touched.password ? formik.errors.password : undefined
                }
                inputProps={{
                  label: 'Password',
                  value: formik.values.password,
                  onTextChanged: (_, value) =>
                    formik.handleChange('password')(value),
                  onBlur: (e) => formik.handleBlur('password')(e),
                  placeholder: 'Enter a password',
                  secureTextEntry: true,
                  textContentType: 'oneTimeCode',
                }}
              />
            </View>

            <View
              onLayout={(e) =>
                (fieldTopRef.current.passwordConfirmation =
                  e.nativeEvent.layout.y)
              }
            >
              <FormField
                fieldType='input'
                id='passwordConfirmation'
                error={
                  formik.touched.passwordConfirmation
                    ? formik.errors.passwordConfirmation
                    : undefined
                }
                inputProps={{
                  label: 'Confirm Password',
                  value: formik.values.passwordConfirmation,
                  onTextChanged: (_, value) =>
                    formik.handleChange('passwordConfirmation')(value),
                  onBlur: (e) => formik.handleBlur('passwordConfirmation')(e),
                  placeholder: 'Confirm your password',
                  secureTextEntry: true,
                  textContentType: 'oneTimeCode',
                }}
              />
            </View>
          </>
        )}

        {!isPhoneHidden && (
          <View
            onLayout={(e) =>
              (fieldTopRef.current.phone = e.nativeEvent.layout.y)
            }
          >
            <PhoneInput
              phoneNumber={formik.values.phone}
              onChangePhoneNumber={(payload) => {
                formik.handleChange('phone')(payload.input)
                requestAnimationFrame(() => {
                  formik.setFieldError(
                    'phone',
                    payload.isValid ? undefined : 'Invalid phone number'
                  )
                })
              }}
              error={formik.touched.phone ? formik.errors.phone : undefined}
              texts={{
                label: 'Phone Number',
              }}
            />
          </View>
        )}

        {isAgeRequired && (
          <View
            onLayout={(e) =>
              (fieldTopRef.current.dateOfBirth = e.nativeEvent.layout.y)
            }
          >
            <FormField
              fieldType='datePicker'
              id='dateOfBirth'
              error={
                formik.touched.dateOfBirth
                  ? formik.errors.dateOfBirth
                  : undefined
              }
              datePickerProps={{
                onSelectDate: (date) => {
                  formik.handleChange('dateOfBirth')(date.toISOString())
                },
                text: 'Date of Birth',
                placeholder: 'Date of Birth',
                selectedDate: formik.values.dateOfBirth
                  ? new Date(formik.values.dateOfBirth)
                  : undefined,
              }}
            />
          </View>
        )}

        {/* Address Information */}
        <View
          onLayout={(e) =>
            (fieldTopRef.current.street = e.nativeEvent.layout.y)
          }
        >
          <FormField
            fieldType='input'
            id='street'
            error={formik.touched.street ? formik.errors.street : undefined}
            inputProps={{
              label: 'Street Address',
              value: formik.values.street,
              onTextChanged: (_, value) => formik.handleChange('street')(value),
              onBlur: (e) => formik.handleBlur('street')(e),
              placeholder: 'Enter your street address',
            }}
          />
        </View>

        <View
          onLayout={(e) => (fieldTopRef.current.city = e.nativeEvent.layout.y)}
        >
          <FormField
            fieldType='input'
            id='city'
            error={formik.touched.city ? formik.errors.city : undefined}
            inputProps={{
              label: 'City',
              value: formik.values.city,
              onTextChanged: (_, value) => formik.handleChange('city')(value),
              onBlur: (e) => formik.handleBlur('city')(e),
              placeholder: 'Enter your city',
            }}
          />
        </View>
        {/* Country */}
        {!!countries.length && (
          <View
            onLayout={(e) =>
              (fieldTopRef.current.country = e.nativeEvent.layout.y)
            }
          >
            <FormField
              fieldType='dropdown'
              id='country'
              error={formik.touched.country ? formik.errors.country : undefined}
              dropdownProps={{
                options: [
                  { value: '-1', label: 'Select Country' },
                  ...countries.map((country) => ({
                    value: country.id.toString(),
                    label: country.name,
                  })),
                ],
                onSelectOption: (_, item) => {
                  // Update form value directly
                  formik.setFieldValue('country', String(item.value))
                  // Also reset state when country changes
                  formik.setFieldValue('state', '-1')
                  // Also notify controller for country updates
                  onCountryChange(String(item.value), item)
                },
                selectedOption: {
                  // Use form value for selection
                  value: formik.values.country || '-1',
                  label:
                    countries.find((c) => c.id === formik.values.country)
                      ?.name || 'Select Country',
                },
                style: {
                  label: { text: 'Country' },
                },
              }}
            />
          </View>
        )}

        {/* State */}
        {!!states.length && (
          <View
            onLayout={(e) =>
              (fieldTopRef.current.state = e.nativeEvent.layout.y)
            }
          >
            <FormField
              fieldType='dropdown'
              id='state'
              // inputProps={{
              //   label: 'State/Province',
              // }}
              dropdownProps={{
                options: [
                  { value: '-1', label: 'Select State' },
                  ...states.map((state) => ({
                    value: state.value,
                    label: state.label,
                  })),
                ],
                onSelectOption: (_, item) => {
                  // Update form value directly
                  formik.setFieldValue('state', String(item.value))
                },
                selectedOption: {
                  // Use form value for selection
                  value: formik.values.state || '-1',
                  label:
                    states.find(
                      (s) => s.value.toString() === formik.values.state
                    )?.label || 'Select State',
                },
                style: {
                  label: { text: 'State/Province' },
                },
              }}
              error={
                formik.touched.state && formik.errors.state
                  ? String(formik.errors.state)
                  : undefined
              }
            />
          </View>
        )}

        {/* Postal Code */}
        <View
          onLayout={(e) =>
            (fieldTopRef.current.postalCode = e.nativeEvent.layout.y)
          }
        >
          <FormField
            fieldType='input'
            id='postalCode'
            error={
              formik.touched.postalCode ? formik.errors.postalCode : undefined
            }
            inputProps={{
              label: 'Postal Code',
              value: formik.values.postalCode,
              onTextChanged: (_, value) =>
                formik.handleChange('postalCode')(value),
              onBlur: (e) => formik.handleBlur('postalCode')(e),
              placeholder: 'Enter your postal code',
            }}
          />
        </View>

        {/* Custom Order Fields */}
        {orderCustomFields.length > 0 && (
          <>
            {orderCustomFields.map((field) => (
              <View key={field.name}>{renderField(field)}</View>
            ))}
          </>
        )}

        {/* Marketing Opt-ins */}
        <FormField
          fieldType='checkbox'
          id='isSubToTicketFairy'
          checkboxProps={{
            isActive: formik.values.isSubToTicketFairy || false,
            onPress: () => {
              formik.setFieldValue(
                'isSubToTicketFairy',
                !formik.values.isSubToTicketFairy
              )
            },
            text: 'Subscribe to The Ticket Fairy newsletters',
          }}
        />

        <FormField
          fieldType='checkbox'
          id='isSubToBrand'
          checkboxProps={{
            isActive: formik.values.isSubToBrand || false,
            onPress: () => {
              formik.setFieldValue('isSubToBrand', !formik.values.isSubToBrand)
            },
            text: 'Subscribe to event organizer newsletters',
          }}
        />

        {/* Add-ons section */}
        {availableAddons && availableAddons.length > 0 && (
          <View>
            <AddonsContainer
              addons={formik.values.addons}
              availableAddons={availableAddons}
              onAddonChange={(addonId, quantity) => {
                // Update form values
                const updatedAddons = {
                  ...formik.values.addons,
                  [addonId]: quantity,
                }

                formik.setFieldValue('addons', updatedAddons)

                // Call the checkout update function if provided
                if (onAddonChange) {
                  onAddonChange(addonId, quantity)
                }
              }}
              currency={eventCurrency}
            />
          </View>
        )}

        {/* Ticket Holders section */}
        <View
          onLayout={(e) => {
            fieldTopRef.current.ticketHolders = e.nativeEvent.layout.y
          }}
        >
          <TicketHoldersSection
            ticketHolders={formik.values.ticketHolders}
            onChange={(index, field, value) => {
              const updatedTicketHolders = [...formik.values.ticketHolders]
              updatedTicketHolders[index] = {
                ...updatedTicketHolders[index],
                [field]: value,
              }
              formik.setFieldValue('ticketHolders', updatedTicketHolders)
            }}
            errors={
              formik.errors.ticketHolders as Array<
                Partial<Record<keyof TicketHolderFormValues, string>>
              >
            }
            touched={
              formik.touched.ticketHolders as Array<
                Partial<Record<keyof TicketHolderFormValues, boolean>>
              >
            }
            onFieldBlur={(index, field) => {
              const updatedTouched = [...(formik.touched.ticketHolders || [])]
              if (!updatedTouched[index]) {
                updatedTouched[index] = {}
              }
              updatedTouched[index] = {
                ...updatedTouched[index],
                [field]: true,
              }
              formik.setFieldTouched(
                `ticketHolders[${index}].${field}`,
                true,
                false
              )
            }}
            isPhoneHidden={isPhoneHidden}
          />
        </View>

        {/* Event Conditions */}
        {conditions && conditions.length > 0 && (
          <View style={styles.sectionContainer}>
            <Conditions
              conditions={conditions}
              acceptedConditions={formik.values.acceptedConditions}
              onAcceptCondition={(conditionId, isAccepted) => {
                formik.setFieldValue('acceptedConditions', {
                  ...formik.values.acceptedConditions,
                  [conditionId]: isAccepted,
                })
              }}
            />
          </View>
        )}

        {/* Payment - only show in single-page mode and if ticket is not free */}
        {!isTicketFree && isSinglePageCheckout && (
          <View
            style={styles.sectionContainer}
            onLayout={(e) =>
              (fieldTopRef.current.isCardFormComplete = e.nativeEvent.layout.y)
            }
          >
            <Payment
              orderItems={orderItems}
              onFormComplete={(details) => {
                setIsCardFormComplete(details.complete)
              }}
              error={cardFormError}
            />
          </View>
        )}

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.button, isSubmitting ? styles.buttonDisabled : {}]}
          onPress={onPressSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size='small' color='#ffffff' />
          ) : (
            <Text style={styles.buttonText}>
              {isSinglePageCheckout
                ? 'Complete Checkout'
                : 'Proceed to Payment'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </FormikProvider>
  )
}

interface PaymentProps {
  onFormComplete: (details: CardFormView.Details) => void
  error?: string
  orderItems: IOrderItem[]
  paymentViewProps?: ViewProps
}

export const Payment = ({
  onFormComplete,
  error,
  orderItems,
  paymentViewProps,
}: PaymentProps) => {
  return (
    <View>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <OrderReview orderItems={orderItems} />
      </View>

      <View style={styles.sectionContainer} {...paymentViewProps}>
        <Text style={styles.sectionTitle}>Payment Details</Text>
        <View style={styles.paymentContainer}>
          <CardForm
            onFormComplete={onFormComplete}
            style={styles.cardContainer}
            cardStyle={styles.cardStyle}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
      </View>
    </View>
  )
}

export const PaymentForm = ({ orderItems, onSubmit }: PaymentFormProps) => {
  const [error, setError] = useState<string>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCardFormComplete, setIsCardFormComplete] = useState(false)

  const onFormComplete = (details: CardFormView.Details) => {
    setIsCardFormComplete(details.complete)

    if (details.complete) {
      setError(undefined)
    }
  }

  const onPressSubmit = async () => {
    try {
      setIsSubmitting(true)
      if (!isCardFormComplete) {
        throw new Error('Please fill your payment information')
      }

      await onSubmit()
    } catch (e) {
      setError(readableError(e))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <View>
      <Payment
        orderItems={orderItems}
        onFormComplete={onFormComplete}
        error={error}
        paymentViewProps={{}}
      />
      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.button, isSubmitting ? styles.buttonDisabled : {}]}
        onPress={onPressSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator size='small' color='#ffffff' />
        ) : (
          <Text style={styles.buttonText}>Complete Payment</Text>
        )}
      </TouchableOpacity>
    </View>
  )
}
