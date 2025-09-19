import { CardForm } from '@stripe/stripe-react-native'
import { Formik } from 'formik'
import React, { useCallback, useState } from 'react'
import { Text, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { priceWithCurrency } from '../../helpers/StringsHelper'
import { validateAge } from '../../helpers/Validators'
import { IDropdownItem } from '../dropdown/types'
import {
  Button,
  CartTimer,
  Checkbox,
  DatePicker,
  DropdownMaterial,
  Input,
  Loading,
  Login,
  PhoneInput,
} from '../index'
import OrderReview from './components/OrderReview'
import { CheckoutFormValues } from './config'
import {
  createCheckoutValidationSchema,
  createInitialFormValues,
} from './config'
import defaultStyles from './styles'
import { ICheckoutSPStyles, ICheckoutSPTexts } from './types'

interface CheckoutViewProps {
  // Data
  orderInfo: any[]
  checkoutData: any
  availableAddons: any[]
  countries: IDropdownItem[]
  states: IDropdownItem[]
  addons: any
  secondsLeft?: number
  userProfile?: any

  // State
  disabled: boolean
  loggedUserFirstName: string
  isLoginDialogVisible: boolean
  isInitialLoading: boolean

  // Actions
  onSubmit: (
    values: CheckoutFormValues,
    selectedCountry?: IDropdownItem,
    selectedState?: IDropdownItem
  ) => void
  onAddonChange: (addonId: string, quantity: number) => void
  onCountryChange: (countryValue: string) => void
  onLoginSuccess: (data: any) => Promise<any>
  onLoginError: (error: any) => void
  onLogout: () => void
  setIsLoginDialogVisible: (visible: boolean) => void

  // Config
  isAgeRequired?: boolean
  minimumAge?: number
  loginBrandImages?: any
  areLoadingIndicatorsEnabled?: boolean
  shouldCartTimerNotMinimizeOnTap?: boolean

  // Text and Style customization
  texts?: ICheckoutSPTexts
  styles?: ICheckoutSPStyles
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  // Data
  orderInfo,
  checkoutData,
  availableAddons,
  countries,
  states,
  addons,
  secondsLeft,
  userProfile,

  // State
  disabled,
  loggedUserFirstName,
  isLoginDialogVisible,
  isInitialLoading,

  // Actions
  onSubmit,
  onAddonChange,
  onCountryChange,
  onLoginSuccess,
  onLoginError,
  onLogout,
  setIsLoginDialogVisible,

  // Config
  isAgeRequired,
  minimumAge,
  loginBrandImages,
  areLoadingIndicatorsEnabled = true,
  shouldCartTimerNotMinimizeOnTap,
  texts,
  styles,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<IDropdownItem>()
  const [selectedState, setSelectedState] = useState<IDropdownItem>()
  const [dateOfBirthError, setDateOfBirthError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [isCardFormComplete, setIsCardFormComplete] = useState(false)

  // Comprehensive validation like two-step checkout
  const getIsDataValid = (values: CheckoutFormValues) => {
    // Check cart timer (if available)
    if (checkoutData?.secondsLeft === 0) {
      return false
    }

    // Check payment info complete
    const paymentValid = isCardFormComplete

    // Check required terms acceptance
    const termsValid = values.isSubToTicketFairy // At minimum, this checkbox must be checked

    return paymentValid && termsValid
  }

  // Create initial form values based on user profile
  const formInitialValues = createInitialFormValues(userProfile)

  // Set selected country/state from user profile after data is loaded
  React.useEffect(() => {
    if (!isInitialLoading && userProfile?.countryId && countries.length > 0) {
      const country = countries.find((c) => c.value === userProfile.countryId)
      if (country) {
        setSelectedCountry(country)
      }
    }
  }, [isInitialLoading, userProfile, countries])

  React.useEffect(() => {
    if (!isInitialLoading && userProfile?.stateId && states.length > 0) {
      const state = states.find(
        (s) => String(s.value) === String(userProfile.stateId)
      )
      if (state) {
        setSelectedState(state)
      }
    }
  }, [isInitialLoading, userProfile, states])

  const handlePhoneNumberChange = useCallback(
    (payload: { input: string; isValid: boolean }) => {
      const customError = 'Invalid phone number'
      if (!payload.isValid && payload.input) setPhoneError(customError)
      else setPhoneError('')
    },
    []
  )

  const handleCountrySelect = useCallback(
    (item: IDropdownItem, setFieldValue: any) => {
      setSelectedCountry(item)
      setFieldValue('country', item.value)
      onCountryChange(String(item.value))
    },
    [onCountryChange]
  )

  const handleStateSelect = useCallback(
    (item: IDropdownItem, setFieldValue: any) => {
      setSelectedState(item)
      setFieldValue('state', item.value)
    },
    []
  )

  const handleDateOfBirthChange = useCallback(
    (date: Date | undefined, setFieldValue: any) => {
      setFieldValue('dateOfBirth', date)
      if (isAgeRequired) {
        if (!date) setDateOfBirthError('Required')
        else if (minimumAge) setDateOfBirthError(validateAge(date, minimumAge))
        else setDateOfBirthError('')
      }
    },
    [isAgeRequired, minimumAge]
  )

  // Generate dynamic addon quantity options based on stock and limits
  const generateAddonQuantityOptions = useCallback(
    (addon: any) => {
      const ticketQuantity =
        orderInfo.find((item) => item.id === 'tickets')?.value || '1'
      const userTicketCount =
        parseInt(ticketQuantity.toString().replace(/[^\d]/g, ''), 10) || 1

      const stock = addon.attributes?.stock || 10
      const limitPerTicket = addon.attributes?.limit_per_ticket || 10
      const maxPerOrder = addon.attributes?.max_per_order || 10

      // Calculate maximum available quantity
      const maxFromStock = stock
      const maxFromTickets = userTicketCount * limitPerTicket
      const maxFromOrder = maxPerOrder

      const maxQuantity = Math.min(maxFromStock, maxFromTickets, maxFromOrder)

      // Generate options from 0 to maxQuantity
      const options = []
      for (let i = 0; i <= Math.max(0, maxQuantity); i++) {
        options.push({ value: i.toString(), label: i.toString() })
      }

      return options
    },
    [orderInfo]
  )

  // Success screen - handled by parent component now
  // Removed inline success screen to use consistent PurchaseConfirmation flow

  return (
    <>
      <KeyboardAwareScrollView extraScrollHeight={32}>
        <View style={[defaultStyles.rootContainer, styles?.rootContainer]}>
          {/* Login Component */}
          <Login
            onLoginSuccessful={onLoginSuccess}
            onLoginError={onLoginError}
            onLogoutSuccess={onLogout}
            isLoginDialogVisible={isLoginDialogVisible}
            showLoginDialog={() => setIsLoginDialogVisible(true)}
            hideLoginDialog={() => setIsLoginDialogVisible(false)}
            userFirstName={loggedUserFirstName}
            brandImages={loginBrandImages}
            texts={texts?.loginTexts}
            styles={styles?.loginStyles}
          />

          <Text style={[defaultStyles.screenTitle, styles?.screenTitle]}>
            {texts?.screenTitle || 'Get Your Tickets'}
          </Text>
          <Formik
            initialValues={formInitialValues}
            enableReinitialize={true}
            validationSchema={createCheckoutValidationSchema(isAgeRequired)}
            validateOnMount={false}
            validateOnChange={true}
            validateOnBlur={true}
            onSubmit={(values) => {
              onSubmit(values, selectedCountry, selectedState)
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              setFieldValue,
            }) => (
              <>
                {/* Customer Information */}
                <Input
                  label={texts?.form?.firstName || 'First name'}
                  value={values.firstName}
                  onChangeText={handleChange('firstName')}
                  onBlur={handleBlur('firstName')}
                  error={
                    touched.firstName && errors.firstName
                      ? errors.firstName
                      : ''
                  }
                  styles={styles?.inputStyles}
                />

                <Input
                  label={texts?.form?.lastName || 'Last name'}
                  value={values.lastName}
                  onChangeText={handleChange('lastName')}
                  onBlur={handleBlur('lastName')}
                  error={
                    touched.lastName && errors.lastName ? errors.lastName : ''
                  }
                  styles={styles?.inputStyles}
                />

                <Text style={[defaultStyles.emailAdvice, styles?.texts]}>
                  {texts?.form?.emailsAdvice ||
                    `IMPORTANT: Please double check that your email address is correct.\nIt's where we send your confirmation and e-tickets to!`}
                </Text>

                <Input
                  label={texts?.form?.email || 'Email'}
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  keyboardType='email-address'
                  error={touched.email && errors.email ? errors.email : ''}
                  autoCapitalize='none'
                  styles={styles?.inputStyles}
                />

                <Input
                  label={texts?.form?.confirmEmail || 'Confirm email'}
                  value={values.emailConfirmation}
                  onChangeText={handleChange('emailConfirmation')}
                  onBlur={handleBlur('emailConfirmation')}
                  keyboardType='email-address'
                  error={
                    touched.emailConfirmation && errors.emailConfirmation
                      ? errors.emailConfirmation
                      : ''
                  }
                  autoCapitalize='none'
                  styles={styles?.inputStyles}
                />

                {/* Registration fields (only if not logged in) */}
                {!loggedUserFirstName && (
                  <>
                    <Text
                      style={[
                        defaultStyles.passwordTitle,
                        styles?.passwordTitle,
                      ]}
                    >
                      {texts?.form?.choosePassword ||
                        texts?.passwordTitle ||
                        'Choose a password for your new TICKETFAIRY account'}
                    </Text>
                    <Input
                      label={texts?.form?.password || 'Password'}
                      value={values.password}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      error={
                        touched.password && errors.password
                          ? errors.password
                          : ''
                      }
                      autoCapitalize='none'
                      secureTextEntry={true}
                      textContentType='oneTimeCode'
                      styles={styles?.inputStyles}
                    />
                    <Input
                      label={texts?.form?.confirmPassword || 'Confirm password'}
                      value={values.passwordConfirmation}
                      onChangeText={handleChange('passwordConfirmation')}
                      onBlur={handleBlur('passwordConfirmation')}
                      error={
                        touched.passwordConfirmation &&
                        errors.passwordConfirmation
                          ? errors.passwordConfirmation
                          : ''
                      }
                      autoCapitalize='none'
                      secureTextEntry={true}
                      textContentType='oneTimeCode'
                      styles={styles?.inputStyles}
                    />
                  </>
                )}

                {/* Age requirement */}
                {isAgeRequired && (
                  <DatePicker
                    text={texts?.form?.dateOfBirth || 'Date of Birth'}
                    onSelectDate={(date) =>
                      handleDateOfBirthChange(date, setFieldValue)
                    }
                    selectedDate={values.dateOfBirth || undefined}
                    error={dateOfBirthError}
                    styles={styles?.datePickerStyles}
                  />
                )}

                {/* Phone */}
                <PhoneInput
                  phoneNumber={values.phone}
                  onChangePhoneNumber={(payload) => {
                    handlePhoneNumberChange(payload)
                    setFieldValue('phone', payload.input)
                  }}
                  error={phoneError}
                  texts={{
                    label: texts?.form?.phone || 'Phone',
                    ...texts?.form?.phoneInput,
                  }}
                  styles={styles?.phoneInputStyles}
                />

                {/* Billing Address */}
                <Input
                  label={texts?.form?.street || 'Street'}
                  value={values.street}
                  onChangeText={handleChange('street')}
                  onBlur={handleBlur('street')}
                  error={touched.street && errors.street ? errors.street : ''}
                  styles={styles?.inputStyles}
                />

                <Input
                  label={texts?.form?.city || 'City'}
                  value={values.city}
                  onChangeText={handleChange('city')}
                  onBlur={handleBlur('city')}
                  error={touched.city && errors.city ? errors.city : ''}
                  styles={styles?.inputStyles}
                />

                <DropdownMaterial
                  items={countries}
                  onSelectItem={(item) =>
                    handleCountrySelect(item, setFieldValue)
                  }
                  selectedOption={selectedCountry}
                  materialInputProps={{
                    label: texts?.form?.country || 'Country',
                    error:
                      touched.country && errors.country ? errors.country : '',
                  }}
                  styles={styles?.dropdownMaterialStyles}
                />

                <Input
                  label={texts?.form?.zipCode || 'Postal Code / Zip Code'}
                  value={values.postalCode}
                  onChangeText={handleChange('postalCode')}
                  onBlur={handleBlur('postalCode')}
                  error={
                    touched.postalCode && errors.postalCode
                      ? errors.postalCode
                      : ''
                  }
                  styles={styles?.inputStyles}
                />

                <DropdownMaterial
                  items={states}
                  onSelectItem={(item) =>
                    handleStateSelect(item, setFieldValue)
                  }
                  selectedOption={selectedState}
                  materialInputProps={{
                    label: texts?.form?.state || 'State/County',
                    error: touched.state && errors.state ? errors.state : '',
                  }}
                  styles={styles?.dropdownMaterialStyles}
                />

                {/* Add-ons Section */}
                {availableAddons.length > 0 && (
                  <View
                    style={[defaultStyles.addonSection, styles?.addonSection]}
                  >
                    <Text
                      style={[
                        defaultStyles.addonMainTitle,
                        styles?.addonMainTitle,
                      ]}
                    >
                      {texts?.addonMainTitle || 'UPGRADES & ADD-ONS'}
                    </Text>
                    <Text
                      style={[
                        defaultStyles.addonSubtitle,
                        styles?.addonSubtitle,
                      ]}
                    >
                      {texts?.addonSubTitle ||
                        'PLEASE SELECT FROM THE OPTIONAL ADD-ONS BELOW'}
                    </Text>
                    {availableAddons.map((addon: any) => {
                      const priceWithFees = addon.attributes?.price || 0
                      const currency =
                        addon.attributes?.currency ||
                        checkoutData.currency ||
                        'USD'
                      const isAddonFree = Number(priceWithFees) === 0

                      const basePriceFormatted = isAddonFree
                        ? 'FREE'
                        : priceWithCurrency(
                            (priceWithFees / 100).toString(),
                            currency
                          )

                      return (
                        <View
                          key={addon.id}
                          style={[defaultStyles.addonItem, styles?.addonItem]}
                        >
                          <View
                            style={[defaultStyles.addonInfo, styles?.addonInfo]}
                          >
                            <Text
                              style={[
                                defaultStyles.addonName,
                                styles?.addonName,
                              ]}
                            >
                              {addon.attributes?.name || 'Add-on'}
                            </Text>
                            <Text
                              style={[
                                defaultStyles.addonPrice,
                                styles?.addonPrice,
                              ]}
                            >
                              {basePriceFormatted}
                              {!isAddonFree && (
                                <Text
                                  style={[
                                    defaultStyles.addonPriceWithFees,
                                    styles?.addonPriceWithFees,
                                  ]}
                                >
                                  (with fees)
                                </Text>
                              )}
                            </Text>
                            {addon.attributes?.description && (
                              <Text
                                style={[
                                  defaultStyles.addonDescription,
                                  styles?.addonDescription,
                                ]}
                              >
                                {addon.attributes.description}
                              </Text>
                            )}
                          </View>
                          <View
                            style={[
                              defaultStyles.addonSelectContainer,
                              styles?.addonSelectContainer,
                            ]}
                          >
                            <DropdownMaterial
                              items={generateAddonQuantityOptions(addon)}
                              onSelectItem={(item) => {
                                onAddonChange(
                                  addon.id.toString(),
                                  parseInt(item.value.toString(), 10)
                                )
                              }}
                              selectedOption={{
                                value: (addons[addon.id] || 0).toString(),
                                label: (addons[addon.id] || 0).toString(),
                              }}
                              materialInputProps={{
                                label: 'Qty',
                              }}
                              styles={styles?.dropdownMaterialStyles}
                            />
                          </View>
                        </View>
                      )
                    })}
                  </View>
                )}

                {/* Payment */}
                <View style={styles?.payment?.container}>
                  <Text style={styles?.payment?.title}>
                    {texts?.providePaymentInfo ||
                      'Please provide your payment information'}
                  </Text>
                  <CardForm
                    onFormComplete={(details) => {
                      // Extract completion status from Details object
                      const isComplete = details.complete
                      setIsCardFormComplete(isComplete)
                    }}
                    style={[defaultStyles.card, styles?.payment?.cardContainer]}
                    cardStyle={styles?.payment?.cardStyle}
                  />
                </View>

                {/* Order Review */}
                <View>
                  <Text style={[defaultStyles.title, styles?.title]}>
                    {texts?.title || 'GET YOUR TICKETS'}
                  </Text>
                  <Text style={[styles?.subTitle]}>
                    {texts?.subTitle || 'Order review'}
                  </Text>
                </View>
                <OrderReview
                  orderItems={orderInfo}
                  styles={styles?.orderReview}
                />

                {/* Marketing opt-ins */}
                <Checkbox
                  onPress={() =>
                    setFieldValue('isSubToBrand', !values.isSubToBrand)
                  }
                  text={
                    texts?.form?.isSubToBrand ||
                    'I would like to be updated on news, events and offers.'
                  }
                  isActive={values.isSubToBrand}
                  styles={styles?.checkboxStyles}
                />
                <Checkbox
                  onPress={() =>
                    setFieldValue(
                      'isSubToTicketFairy',
                      !values.isSubToTicketFairy
                    )
                  }
                  text={
                    texts?.form?.isSubToTicketFairy ||
                    'I agree that The Ticket Fairy may use my personal data for marketing in accordance with its Privacy Policy.'
                  }
                  isActive={values.isSubToTicketFairy}
                  styles={styles?.checkboxStyles}
                />

                <Button
                  onPress={() => {
                    const isDataValid = getIsDataValid(values)
                    if (!isDataValid) {
                      return
                    }

                    handleSubmit()
                  }}
                  text={texts?.checkoutButton || 'PAY'}
                  isDisabled={disabled || !getIsDataValid(values)}
                  isLoading={disabled}
                  styles={{
                    container: defaultStyles.submitButton,
                    ...(!disabled
                      ? styles?.checkoutButton
                      : styles?.checkoutButtonDisabled),
                  }}
                />
              </>
            )}
          </Formik>
        </View>
        {areLoadingIndicatorsEnabled && (disabled || isInitialLoading) && (
          <Loading />
        )}
      </KeyboardAwareScrollView>
      {typeof secondsLeft === 'number' && (
        <CartTimer
          secondsLeft={secondsLeft}
          shouldNotMinimize={shouldCartTimerNotMinimizeOnTap}
          styles={styles?.cartTimer}
          texts={texts?.cartTimer}
        />
      )}
    </>
  )
}
