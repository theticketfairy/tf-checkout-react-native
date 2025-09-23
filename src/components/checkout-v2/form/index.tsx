import { CardForm } from '@stripe/stripe-react-native'
import { Field, FieldProps, Formik } from 'formik'
import React, { useMemo, useRef } from 'react'
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import Checkbox from '../../checkbox/Checkbox'
import DatePicker from '../../datePicker/DatePicker'
import { IDropdownItem } from '../../dropdown/types'
import DropdownMaterial from '../../dropdownMaterial/DropdownMaterial'
import Input from '../../input/Input'
import AddonsContainer from '../components/AddonsContainer'
import Conditions from '../components/Conditions'
import OrderReview, { IOrderItem } from '../components/OrderReview'
import { AddonItem } from '../types'
import { createCheckoutFormConfig } from './config'
import styles from './styles'

export interface CheckoutFormValues {
  // Personal information
  firstName: string
  lastName: string
  email: string
  emailConfirmation: string
  phone: string
  dateOfBirth?: Date

  // Address information
  street: string
  city: string
  postalCode: string
  country: string
  state: string

  // Authentication
  password: string
  passwordConfirmation: string

  // Marketing preferences
  isSubToTicketFairy: boolean
  isSubToBrand: boolean

  // Payment form state (internal to form)
  isCardFormComplete: boolean

  // Add-ons
  addons: Record<string, number>
  acceptedConditions: Record<string, boolean>
}

export interface CheckoutFormProps {
  // Form values & state
  initialValues: CheckoutFormValues
  eventCurrency?: string
  isSubmitting: boolean
  formStatus: 'idle' | 'loading' | 'success' | 'error'
  // User state
  isLoggedIn: boolean

  // Validation props
  isAgeRequired: boolean
  minimumAge: number
  isTicketFree?: boolean
  isPhoneRequired?: boolean
  isPhoneHidden?: boolean

  // Country & State data
  countries: Array<{ id: string; name: string }>
  states: Array<{ label: string; value: number }>
  onCountryChange: (countryId: string, item: IDropdownItem) => void

  // Order data
  orderItems: IOrderItem[]

  // Add-ons data
  availableAddons?: AddonItem[]
  onAddonChange?: (addonId: string, quantity: number) => void

  // Conditions
  conditions?: Array<{
    id: string
    name: string
    content: string
    is_required: boolean
  }>

  // Form handlers
  onSubmit: (values: CheckoutFormValues) => void

  scrollRef: React.RefObject<ScrollView | null>
}

export const CheckoutForm: React.FC<CheckoutFormProps> = (props) => {
  const {
    initialValues,
    isSubmitting,
    formStatus,
    isLoggedIn,
    isAgeRequired,
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
    onSubmit,
    scrollRef,
    eventCurrency,
    conditions,
  } = props
  const fieldTopRef = useRef<Record<string, number>>({})

  // Order of fields as they appear visually. Include only the keys present in your validation schema.
  const fieldOrder = useMemo(
    () => [
      'firstName',
      'lastName',
      'email',
      'emailConfirmation',
      ...(isLoggedIn ? [] : ['password', 'passwordConfirmation']),
      'phone',
      ...(isAgeRequired ? ['dateOfBirth'] : []),
      'street',
      'city',
      'postalCode',
      'country',
      'state',
      // Include card validation as the last field to check
      ...(isTicketFree ? [] : ['isCardFormComplete']),
    ],
    [isLoggedIn, isAgeRequired, isTicketFree]
  )

  const modifiedInitialValues = {
    ...initialValues,
    isCardFormComplete: isTicketFree ? true : initialValues.isCardFormComplete,
  }

  // 2) helper: scroll to a field by key
  const scrollToField = (key: string) => {
    const y = fieldTopRef.current[key]
    if (y != null && scrollRef.current) {
      // small offset so the label is visible
      scrollRef.current.scrollTo({ y: Math.max(0, y - 16), animated: true })
    }
  }

  const requiredConditions = useMemo(
    () => props.conditions?.filter((c) => c.is_required) || [],
    [props.conditions]
  )

  const validationSchema = useMemo(
    () =>
      createCheckoutFormConfig({
        minimumAge,
        isAgeRequired,
        requirePassword: !isLoggedIn,
        isTicketFree,
        isPhoneRequired,
        requiredConditions,
      }),
    [
      minimumAge,
      isAgeRequired,
      isLoggedIn,
      isTicketFree,
      isPhoneRequired,
      requiredConditions,
    ]
  )

  return (
    <Formik
      initialValues={modifiedInitialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      validateOnChange={true}
      validateOnBlur={true}
      validateOnMount={false}
      // Disable reinitialization to prevent form reset
      enableReinitialize={false}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        setFieldValue,
        validateForm,
        setTouched,
      }) => {
        // Let parent component manage country/state values
        // Form will update via enableReinitialize when props change
        // 3) submit handler that scrolls to first error
        const onPressSubmit = async () => {
          // Always check the card form first if not free ticket
          if (!isTicketFree && !values.isCardFormComplete) {
            console.log('Card form is incomplete - showing error')
          }

          // mark all as touched so errors appear
          const allFields = Object.keys(initialValues)
          const touchedFields = allFields.reduce((acc, field) => {
            acc[field] = true as const
            return acc
          }, {} as Record<string, true>)
          setTouched(touchedFields)

          const formErrors = await validateForm()

          if (Object.keys(formErrors).length === 0) {
            handleSubmit()
            return
          }

          // find first error by visual order
          const firstErroredKey = fieldOrder.find(
            (k) => formErrors[k as keyof typeof formErrors] != null
          )
          if (firstErroredKey) {
            console.log('firstErroredKey', firstErroredKey)
            scrollToField(firstErroredKey)
          }
        }

        return (
          // 4) Wrap content in ScrollView to enable scrolling to fields
          <View style={styles.form}>
            {/* Personal Information */}
            <View
              onLayout={(e) =>
                (fieldTopRef.current.firstName = e.nativeEvent.layout.y)
              }
            >
              <Input
                label='First Name'
                value={values.firstName}
                onChangeText={handleChange('firstName')}
                onBlur={handleBlur('firstName')}
                error={touched.firstName ? errors.firstName : undefined}
                placeholder='Enter your first name'
              />
            </View>

            <View
              onLayout={(e) =>
                (fieldTopRef.current.lastName = e.nativeEvent.layout.y)
              }
            >
              <Input
                label='Last Name'
                value={values.lastName}
                onChangeText={handleChange('lastName')}
                onBlur={handleBlur('lastName')}
                error={touched.lastName ? errors.lastName : undefined}
                placeholder='Enter your last name'
              />
            </View>

            <View
              onLayout={(e) =>
                (fieldTopRef.current.email = e.nativeEvent.layout.y)
              }
            >
              <Input
                label='Email'
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                error={touched.email ? errors.email : undefined}
                placeholder='Enter your email'
                keyboardType='email-address'
              />
            </View>

            <View
              onLayout={(e) =>
                (fieldTopRef.current.emailConfirmation = e.nativeEvent.layout.y)
              }
            >
              <Input
                label='Confirm Email'
                value={values.emailConfirmation}
                onChangeText={handleChange('emailConfirmation')}
                onBlur={handleBlur('emailConfirmation')}
                error={
                  touched.emailConfirmation
                    ? errors.emailConfirmation
                    : undefined
                }
                placeholder='Confirm your email'
                keyboardType='email-address'
              />
            </View>

            {/* Registration fields (only if not logged in) */}
            {!isLoggedIn && (
              <>
                <Text style={styles.sectionTitle}>
                  Choose a password for your new TICKETFAIRY account
                </Text>

                <View
                  onLayout={(e) =>
                    (fieldTopRef.current.password = e.nativeEvent.layout.y)
                  }
                >
                  <Input
                    label='Password'
                    value={values.password}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    error={touched.password ? errors.password : undefined}
                    placeholder='Enter a password'
                    secureTextEntry
                    textContentType='oneTimeCode'
                  />
                </View>

                <View
                  onLayout={(e) =>
                    (fieldTopRef.current.passwordConfirmation =
                      e.nativeEvent.layout.y)
                  }
                >
                  <Input
                    label='Confirm Password'
                    value={values.passwordConfirmation}
                    onChangeText={handleChange('passwordConfirmation')}
                    onBlur={handleBlur('passwordConfirmation')}
                    error={
                      touched.passwordConfirmation
                        ? errors.passwordConfirmation
                        : undefined
                    }
                    placeholder='Confirm your password'
                    secureTextEntry
                    textContentType='oneTimeCode'
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
                <Input
                  label='Phone Number'
                  value={values.phone}
                  onChangeText={handleChange('phone')}
                  onBlur={handleBlur('phone')}
                  error={touched.phone ? errors.phone : undefined}
                  placeholder='Enter your phone number'
                  keyboardType='phone-pad'
                />
              </View>
            )}

            {isAgeRequired && (
              <View
                onLayout={(e) =>
                  (fieldTopRef.current.dateOfBirth = e.nativeEvent.layout.y)
                }
              >
                <DatePicker
                  text='Date of Birth'
                  onSelectDate={(date) =>
                    handleChange('dateOfBirth')(date.toISOString())
                  }
                  selectedDate={values.dateOfBirth}
                  error={touched.dateOfBirth ? errors.dateOfBirth : undefined}
                />
              </View>
            )}

            {/* Address Information */}
            <Text style={styles.sectionTitle}>Address Information</Text>

            <View
              onLayout={(e) =>
                (fieldTopRef.current.street = e.nativeEvent.layout.y)
              }
            >
              <Input
                label='Street Address'
                value={values.street}
                onChangeText={handleChange('street')}
                onBlur={handleBlur('street')}
                error={touched.street ? errors.street : undefined}
                placeholder='Enter your street address'
              />
            </View>

            <View
              onLayout={(e) =>
                (fieldTopRef.current.city = e.nativeEvent.layout.y)
              }
            >
              <Input
                label='City'
                value={values.city}
                onChangeText={handleChange('city')}
                onBlur={handleBlur('city')}
                error={touched.city ? errors.city : undefined}
                placeholder='Enter your city'
              />
            </View>

            <View
              onLayout={(e) =>
                (fieldTopRef.current.postalCode = e.nativeEvent.layout.y)
              }
            >
              <Input
                label='Postal Code'
                value={values.postalCode}
                onChangeText={handleChange('postalCode')}
                onBlur={handleBlur('postalCode')}
                error={touched.postalCode ? errors.postalCode : undefined}
                placeholder='Enter your postal code'
              />
            </View>

            {/* Country */}
            {!!countries.length && (
              <View
                onLayout={(e) =>
                  (fieldTopRef.current.country = e.nativeEvent.layout.y)
                }
              >
                <DropdownMaterial
                  items={[
                    { value: '-1', label: 'Select Country' },
                    ...countries.map((country) => ({
                      value: country.id.toString(),
                      label: country.name,
                    })),
                  ]}
                  onSelectItem={(item) => {
                    // Update form value directly
                    setFieldValue('country', String(item.value))
                    // Also reset state when country changes
                    setFieldValue('state', '-1')
                    // Also notify controller for country updates
                    onCountryChange(String(item.value), item)
                  }}
                  selectedOption={{
                    // Use form value for selection
                    value: values.country || '-1',
                    label:
                      countries.find((c) => c.id === values.country)?.name ||
                      'Select Country',
                  }}
                  materialInputProps={{
                    label: 'Country',
                    error:
                      touched.country && errors.country
                        ? errors.country
                        : undefined,
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
                <DropdownMaterial
                  items={[
                    { value: '-1', label: 'Select State' },
                    ...states.map((state) => ({
                      value: state.value,
                      label: state.label,
                    })),
                  ]}
                  onSelectItem={(item) => {
                    // Update form value directly
                    setFieldValue('state', String(item.value))
                  }}
                  selectedOption={{
                    // Use form value for selection
                    value: values.state || '-1',
                    label:
                      states.find((s) => s.value.toString() === values.state)
                        ?.label || 'Select State',
                  }}
                  materialInputProps={{
                    label: 'State/Province',
                    error:
                      touched.state && errors.state ? errors.state : undefined,
                  }}
                />
              </View>
            )}

            {/* Marketing Opt-ins */}
            <View>
              <Text style={styles.sectionTitle}>Marketing Preferences</Text>
              <Field name='isSubToTicketFairy'>
                {({
                  field,
                  form,
                }: FieldProps<
                  CheckoutFormValues['isSubToTicketFairy'],
                  CheckoutFormValues
                >) => (
                  <Checkbox
                    isActive={field.value || false}
                    onPress={() =>
                      form.setFieldValue('isSubToTicketFairy', !field.value)
                    }
                    text='Subscribe to The Ticket Fairy newsletters'
                  />
                )}
              </Field>

              <Field name='isSubToBrand'>
                {({
                  field,
                  form,
                }: FieldProps<
                  CheckoutFormValues['isSubToBrand'],
                  CheckoutFormValues
                >) => (
                  <Checkbox
                    isActive={field.value || false}
                    onPress={() =>
                      form.setFieldValue('isSubToBrand', !field.value)
                    }
                    text='Subscribe to event organizer newsletters'
                  />
                )}
              </Field>
            </View>

            {/* Add-ons section */}
            {availableAddons && availableAddons.length > 0 && (
              <View>
                <Field name='addons'>
                  {({
                    field,
                    form,
                  }: FieldProps<
                    CheckoutFormValues['addons'],
                    CheckoutFormValues
                  >) => (
                    <AddonsContainer
                      addons={field.value}
                      availableAddons={availableAddons}
                      onAddonChange={(addonId, quantity) => {
                        // Update form values
                        const updatedAddons = {
                          ...field.value,
                          [addonId]: quantity,
                        }

                        form.setFieldValue('addons', updatedAddons)

                        // Call the checkout update function if provided
                        if (onAddonChange) {
                          onAddonChange(addonId, quantity)
                        }
                      }}
                      currency={eventCurrency}
                    />
                  )}
                </Field>
              </View>
            )}

            {/* Event Conditions */}
            {conditions && conditions.length > 0 && (
              <View style={styles.sectionContainer}>
                <Field name='acceptedConditions'>
                  {({
                    field,
                    form,
                  }: FieldProps<
                    CheckoutFormValues['acceptedConditions'],
                    CheckoutFormValues
                  >) => (
                    <Conditions
                      conditions={conditions}
                      acceptedConditions={field.value}
                      onAcceptCondition={(conditionId, isAccepted) => {
                        form.setFieldValue('acceptedConditions', {
                          ...field.value,
                          [conditionId]: isAccepted,
                        })
                      }}
                    />
                  )}
                </Field>
              </View>
            )}

            {/* Order Review */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Order Summary</Text>
              <OrderReview orderItems={orderItems} />
            </View>

            {/* Payment */}
            {!isTicketFree && (
              <View
                style={styles.sectionContainer}
                onLayout={(e) =>
                  (fieldTopRef.current.isCardFormComplete =
                    e.nativeEvent.layout.y)
                }
              >
                <Text style={styles.sectionTitle}>Payment Information</Text>
                <CardForm
                  onFormComplete={(details) =>
                    setFieldValue('isCardFormComplete', details.complete)
                  }
                  style={styles.cardContainer}
                  autofocus={false}
                />
                {touched.isCardFormComplete && errors.isCardFormComplete && (
                  <Text style={styles.errorText}>
                    {errors.isCardFormComplete}
                  </Text>
                )}
              </View>
            )}

            {formStatus === 'error' && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                  There was an error processing your payment. Please try again.
                </Text>
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.button,
                isSubmitting || formStatus === 'loading'
                  ? styles.buttonDisabled
                  : {},
              ]}
              onPress={onPressSubmit}
              disabled={isSubmitting || formStatus === 'loading'}
            >
              {formStatus === 'loading' || isSubmitting ? (
                <ActivityIndicator size='small' color='#ffffff' />
              ) : (
                <Text style={styles.buttonText}>Complete Checkout</Text>
              )}
            </TouchableOpacity>
          </View>
        )
      }}
    </Formik>
  )
}
export default CheckoutForm
