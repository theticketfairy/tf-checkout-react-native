import { Formik, FormikProps } from 'formik'
import React, { useCallback, useState } from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import * as Yup from 'yup'

import Checkbox from '../checkbox/Checkbox'
import DatePicker from '../datePicker/DatePicker'
import { ErrorDisplay } from '../errorDisplay'
import Input from '../input/Input'
import PhoneInput from '../phoneInput/PhoneInput'
import { IOnChangePhoneNumberPayload } from '../phoneInput/types'

interface IBillingFormData {
  firstName: string
  lastName: string
  email: string
  confirmEmail: string
  phone: string
  dateOfBirth?: string
  street_address?: string
  city?: string
  state?: string
  zip?: string
  country?: string
  company?: string
  jobTitle?: string
  instagram?: string
  wallet_address?: string
  businessCategory?: string
  brand_opt_in?: boolean
  ttf_opt_in?: boolean
  password?: string
  confirmPassword?: string
}

interface ITicketHolder {
  firstName: string
  lastName: string
  email?: string
  age?: string
  [key: string]: any
}

interface IBillingFormProps {
  initialValues?: Partial<IBillingFormData>
  ticketHolders?: ITicketHolder[]
  countries?: Array<{ label: string; value: string }>
  states?: Array<{ label: string; value: string }>

  // Configuration flags
  isAgeRequired?: boolean
  isNameRequired?: boolean
  isPhoneRequired?: boolean
  isBillingRequired?: boolean
  isTicketFree?: boolean
  isPhoneHidden?: boolean
  minimumAge?: number

  // Custom fields configuration
  collectMandatoryCompany?: boolean
  collectOptionalCompany?: boolean
  collectMandatoryJobTitle?: boolean
  collectOptionalJobTitle?: boolean
  collectMandatoryInstagram?: boolean
  collectOptionalInstagram?: boolean
  collectMandatoryWalletAddress?: boolean
  collectOptionalWalletAddress?: boolean
  collectMandatoryBusinessCategory?: boolean
  collectOptionalBusinessCategory?: boolean

  // Event callbacks
  onSubmit: (values: IBillingFormData, ticketHolders: ITicketHolder[]) => void
  onFieldChange?: (field: string, value: any) => void
  onCountryChange?: (country: string) => void
  onValidationChange?: (isValid: boolean) => void

  // UI props
  isLoading?: boolean
  error?: string | null
  onErrorClose?: () => void
  showSignupFields?: boolean
  isLoggedIn?: boolean
  buttonText?: string
}

const createValidationSchema = (props: IBillingFormProps) => {
  const {
    isAgeRequired,
    isPhoneRequired,
    isBillingRequired,
    minimumAge = 18,
    collectMandatoryCompany,
    collectMandatoryJobTitle,
    collectMandatoryInstagram,
    collectMandatoryWalletAddress,
    collectMandatoryBusinessCategory,
    showSignupFields,
  } = props

  let schema: any = {
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    confirmEmail: Yup.string()
      .oneOf([Yup.ref('email')], 'Emails must match')
      .required('Please confirm your email'),
  }

  if (isPhoneRequired) {
    schema.phone = Yup.string().required('Phone number is required')
  }

  if (isAgeRequired) {
    schema.dateOfBirth = Yup.date()
      .required('Date of birth is required')
      .test(
        'age',
        `You must be at least ${minimumAge} years old`,
        function (value) {
          if (!value) return false
          const today = new Date()
          const birthDate = new Date(value)
          const age = today.getFullYear() - birthDate.getFullYear()
          const monthDiff = today.getMonth() - birthDate.getMonth()

          if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
          ) {
            return age - 1 >= minimumAge
          }
          return age >= minimumAge
        }
      )
  }

  if (isBillingRequired) {
    schema = {
      ...schema,
      street_address: Yup.string().required('Street address is required'),
      city: Yup.string().required('City is required'),
      state: Yup.string().required('State is required'),
      zip: Yup.string().required('Zip code is required'),
      country: Yup.string().required('Country is required'),
    }
  }

  if (collectMandatoryCompany) {
    schema.company = Yup.string().required('Company is required')
  }

  if (collectMandatoryJobTitle) {
    schema.jobTitle = Yup.string().required('Job title is required')
  }

  if (collectMandatoryInstagram) {
    schema.instagram = Yup.string().required('Instagram handle is required')
  }

  if (collectMandatoryWalletAddress) {
    schema.wallet_address = Yup.string().required('Wallet address is required')
  }

  if (collectMandatoryBusinessCategory) {
    schema.businessCategory = Yup.string().required(
      'Business category is required'
    )
  }

  if (showSignupFields) {
    schema = {
      ...schema,
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Please confirm your password'),
    }
  }

  return Yup.object().shape(schema)
}

export const BillingForm: React.FC<IBillingFormProps> = ({
  initialValues = {},
  ticketHolders = [],
  countries = [],
  // states = [],
  isAgeRequired = false,
  isNameRequired = false,
  isPhoneRequired = false,
  isBillingRequired = false,
  isTicketFree = false,
  isPhoneHidden = false,
  minimumAge = 18,
  collectMandatoryCompany = false,
  collectOptionalCompany = false,
  collectMandatoryJobTitle = false,
  collectOptionalJobTitle = false,
  collectMandatoryInstagram = false,
  collectOptionalInstagram = false,
  collectMandatoryWalletAddress = false,
  collectOptionalWalletAddress = false,
  collectMandatoryBusinessCategory = false,
  collectOptionalBusinessCategory = false,
  onSubmit,
  onFieldChange,
  onCountryChange,
  onValidationChange,
  isLoading = false,
  error,
  onErrorClose,
  showSignupFields = false,
  isLoggedIn = false,
  buttonText = 'Continue to Payment',
}) => {
  const [localTicketHolders, setLocalTicketHolders] =
    useState<ITicketHolder[]>(ticketHolders)

  const validationSchema = createValidationSchema({
    isAgeRequired,
    isPhoneRequired,
    isBillingRequired,
    minimumAge,
    collectMandatoryCompany,
    collectMandatoryJobTitle,
    collectMandatoryInstagram,
    collectMandatoryWalletAddress,
    collectMandatoryBusinessCategory,
    showSignupFields,
  } as IBillingFormProps)

  const defaultValues: IBillingFormData = {
    firstName: '',
    lastName: '',
    email: '',
    confirmEmail: '',
    phone: '',
    dateOfBirth: '',
    street_address: '',
    city: '',
    state: '',
    zip: '',
    country: countries[0]?.value || '',
    company: '',
    jobTitle: '',
    instagram: '',
    wallet_address: '',
    businessCategory: '',
    brand_opt_in: false,
    ttf_opt_in: false,
    password: '',
    confirmPassword: '',
    ...initialValues,
  }

  const handleSubmit = useCallback(
    (values: IBillingFormData) => {
      onSubmit(values, localTicketHolders)
    },
    [onSubmit, localTicketHolders]
  )

  const handleFieldChange = useCallback(
    (field: string, value: any, setFieldValue: any) => {
      setFieldValue(field, value)
      onFieldChange?.(field, value)

      if (field === 'country') {
        onCountryChange?.(value)
      }
    },
    [onFieldChange, onCountryChange]
  )

  const renderTicketHolderFields = (
    formikProps: FormikProps<IBillingFormData>
  ) => {
    console.log(formikProps)
    if (!isNameRequired || localTicketHolders.length === 0) return null

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ticket Holder Information</Text>
        {localTicketHolders.map((holder, index) => (
          <View key={index} style={styles.ticketHolderSection}>
            <Text style={styles.ticketHolderTitle}>
              Ticket Holder {index + 1}
            </Text>

            <Input
              label='First Name'
              value={holder.firstName}
              onChangeText={(value) => {
                const updatedHolders = [...localTicketHolders]
                updatedHolders[index].firstName = value
                setLocalTicketHolders(updatedHolders)
              }}
              style={styles.input}
            />

            <Input
              label='Last Name'
              value={holder.lastName}
              onChangeText={(value) => {
                const updatedHolders = [...localTicketHolders]
                updatedHolders[index].lastName = value
                setLocalTicketHolders(updatedHolders)
              }}
              style={styles.input}
            />

            {isAgeRequired && (
              <Input
                label='Age'
                value={holder.age || ''}
                onChangeText={(value) => {
                  const updatedHolders = [...localTicketHolders]
                  updatedHolders[index].age = value
                  setLocalTicketHolders(updatedHolders)
                }}
                keyboardType='numeric'
                style={styles.input}
              />
            )}
          </View>
        ))}
      </View>
    )
  }

  const renderCustomFields = (formikProps: FormikProps<IBillingFormData>) => {
    const { values, setFieldValue, errors, touched } = formikProps
    const showCompany = collectMandatoryCompany || collectOptionalCompany
    const showJobTitle = collectMandatoryJobTitle || collectOptionalJobTitle
    const showInstagram = collectMandatoryInstagram || collectOptionalInstagram
    const showWalletAddress =
      collectMandatoryWalletAddress || collectOptionalWalletAddress
    const showBusinessCategory =
      collectMandatoryBusinessCategory || collectOptionalBusinessCategory

    if (
      !showCompany &&
      !showJobTitle &&
      !showInstagram &&
      !showWalletAddress &&
      !showBusinessCategory
    ) {
      return null
    }

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Additional Information</Text>

        {showCompany && (
          <Input
            label='Company'
            value={values.company || ''}
            onChangeText={(value) =>
              handleFieldChange('company', value, setFieldValue)
            }
            required={collectMandatoryCompany}
            error={touched.company ? errors.company : undefined}
            style={styles.input}
          />
        )}

        {showJobTitle && (
          <Input
            label='Job Title'
            value={values.jobTitle || ''}
            onChangeText={(value) =>
              handleFieldChange('jobTitle', value, setFieldValue)
            }
            required={collectMandatoryJobTitle}
            error={touched.jobTitle ? errors.jobTitle : undefined}
            style={styles.input}
          />
        )}

        {showInstagram && (
          <Input
            label='Instagram Handle'
            value={values.instagram || ''}
            onChangeText={(value) =>
              handleFieldChange('instagram', value, setFieldValue)
            }
            required={collectMandatoryInstagram}
            error={touched.instagram ? errors.instagram : undefined}
            style={styles.input}
            placeholder='@username'
          />
        )}

        {showWalletAddress && (
          <Input
            label='Wallet Address'
            value={values.wallet_address || ''}
            onChangeText={(value) =>
              handleFieldChange('wallet_address', value, setFieldValue)
            }
            required={collectMandatoryWalletAddress}
            error={touched.wallet_address ? errors.wallet_address : undefined}
            style={styles.input}
          />
        )}

        {showBusinessCategory && (
          <Input
            label='Business Category'
            value={values.businessCategory || ''}
            onChangeText={(value) =>
              handleFieldChange('businessCategory', value, setFieldValue)
            }
            required={collectMandatoryBusinessCategory}
            error={
              touched.businessCategory ? errors.businessCategory : undefined
            }
            style={styles.input}
          />
        )}
      </View>
    )
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ErrorDisplay
        error={error || ''}
        onClose={onErrorClose}
        severity='error'
      />

      <Formik
        initialValues={defaultValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
        validate={(values) => {
          try {
            validationSchema.validateSync(values, { abortEarly: false })
            onValidationChange?.(true)
          } catch (err) {
            onValidationChange?.(false)
          }
        }}
      >
        {(formikProps) => {
          const {
            values,
            errors,
            touched,
            setFieldValue,
            handleSubmit,
            isValid,
          } = formikProps

          return (
            <View>
              {/* Personal Information */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Personal Information</Text>

                <Input
                  label='First Name'
                  value={values.firstName}
                  onChangeText={(value) =>
                    handleFieldChange('firstName', value, setFieldValue)
                  }
                  error={touched.firstName ? errors.firstName : undefined}
                  styles={{ container: styles.input }}
                />

                <Input
                  label='Last Name'
                  value={values.lastName}
                  onChangeText={(value) =>
                    handleFieldChange('lastName', value, setFieldValue)
                  }
                  error={touched.lastName ? errors.lastName : undefined}
                  styles={{ container: styles.input }}
                />

                <Input
                  label='Email'
                  value={values.email}
                  onChangeText={(value) =>
                    handleFieldChange('email', value, setFieldValue)
                  }
                  keyboardType='email-address'
                  autoCapitalize='none'
                  required
                  error={touched.email ? errors.email : undefined}
                  style={styles.input}
                />

                <Input
                  label='Confirm Email'
                  value={values.confirmEmail}
                  onChangeText={(value) =>
                    handleFieldChange('confirmEmail', value, setFieldValue)
                  }
                  keyboardType='email-address'
                  autoCapitalize='none'
                  required
                  error={touched.confirmEmail ? errors.confirmEmail : undefined}
                  style={styles.input}
                />

                {!isPhoneHidden && (
                  <PhoneInput
                    // label='Phone Number'
                    phoneNumber={values.phone}
                    onChangePhoneNumber={(value: IOnChangePhoneNumberPayload) =>
                      handleFieldChange('phone', value, setFieldValue)
                    }
                    error={touched.phone ? errors.phone : undefined}
                    // style={styles.input}
                  />
                )}

                {isAgeRequired && (
                  <DatePicker
                    // label='Date of Birth'
                    selectedDate={new Date(values.dateOfBirth || '')}
                    onSelectDate={(value) =>
                      handleFieldChange('dateOfBirth', value, setFieldValue)
                    }
                    error={touched.dateOfBirth ? errors.dateOfBirth : undefined}
                    text='Date of Birth'
                    // style={styles.input}
                  />
                )}
              </View>

              {/* Billing Information */}
              {isBillingRequired && !isTicketFree && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Billing Information</Text>

                  <Input
                    label='Street Address'
                    value={values.street_address || ''}
                    onChangeText={(value) =>
                      handleFieldChange('street_address', value, setFieldValue)
                    }
                    required
                    error={
                      touched.street_address ? errors.street_address : undefined
                    }
                    style={styles.input}
                  />

                  <Input
                    label='City'
                    value={values.city || ''}
                    onChangeText={(value) =>
                      handleFieldChange('city', value, setFieldValue)
                    }
                    required
                    error={touched.city ? errors.city : undefined}
                    style={styles.input}
                  />

                  {/* <DropdownMaterial
                    // label='Country'
                    selectedOption={values.country || ''}
                    onValueChange={(value) =>
                      handleFieldChange('country', value, setFieldValue)
                    }
                    items={countries}
                    required
                    error={touched.country ? errors.country : undefined}
                    style={styles.input}
                  />

                  <DropdownMaterial
                    // label='State/Province'
                    selectedOption={values.state || ''}
                    onValueChange={(value) =>
                      handleFieldChange('state', value, setFieldValue)
                    }
                    items={states}
                    required
                    error={touched.state ? errors.state : undefined}
                    style={styles.input}
                  /> */}

                  <Input
                    label='Zip/Postal Code'
                    value={values.zip || ''}
                    onChangeText={(value) =>
                      handleFieldChange('zip', value, setFieldValue)
                    }
                    required
                    error={touched.zip ? errors.zip : undefined}
                    style={styles.input}
                  />
                </View>
              )}

              {/* Custom Fields */}
              {renderCustomFields(formikProps)}

              {/* Ticket Holders */}
              {renderTicketHolderFields(formikProps)}

              {/* Signup Fields */}
              {showSignupFields && !isLoggedIn && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Create Account</Text>

                  <Input
                    label='Password'
                    value={values.password || ''}
                    onChangeText={(value) =>
                      handleFieldChange('password', value, setFieldValue)
                    }
                    secureTextEntry
                    required
                    error={touched.password ? errors.password : undefined}
                    style={styles.input}
                  />

                  <Input
                    label='Confirm Password'
                    value={values.confirmPassword || ''}
                    onChangeText={(value) =>
                      handleFieldChange('confirmPassword', value, setFieldValue)
                    }
                    secureTextEntry
                    required
                    error={
                      touched.confirmPassword
                        ? errors.confirmPassword
                        : undefined
                    }
                    style={styles.input}
                  />
                </View>
              )}

              {/* Opt-in Checkboxes */}
              <View style={styles.section}>
                <Checkbox
                  // label='I would like to receive marketing communications'
                  text='I would like to receive marketing communications'
                  isActive={values.brand_opt_in || false}
                  onPress={() =>
                    handleFieldChange(
                      'brand_opt_in',
                      !values.brand_opt_in,
                      setFieldValue
                    )
                  }
                />

                <Checkbox
                  // label='I agree to receive communications from The Ticket Fairy'
                  text='I agree to receive communications from The Ticket Fairy'
                  isActive={values.ttf_opt_in || false}
                  onPress={() =>
                    handleFieldChange(
                      'ttf_opt_in',
                      !values.ttf_opt_in,
                      setFieldValue
                    )
                  }
                />
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  (!isValid || isLoading) && styles.submitButtonDisabled,
                ]}
                onPress={() => handleSubmit()}
                disabled={!isValid || isLoading}
              >
                <Text style={styles.submitButtonText}>
                  {isLoading ? 'Processing...' : buttonText}
                </Text>
              </TouchableOpacity>
            </View>
          )
        }}
      </Formik>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  ticketHolderSection: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  ticketHolderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 12,
  },
  checkbox: {
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: '#007bff',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#6c757d',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
})
