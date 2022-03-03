import _every from 'lodash/every'
import _find from 'lodash/find'
import _forEach from 'lodash/forEach'
import _map from 'lodash/map'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Text,
  View,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import {
  checkoutOrder,
  fetchCart,
  fetchCountries,
  fetchStates,
  fetchUserProfile,
  registerNewUser,
} from '../../api/ApiClient'
import Constants from '../../api/Constants'
import { ICheckoutBody, ICheckoutTicketHolder } from '../../api/types'
import {
  Button,
  Checkbox,
  DatePicker,
  Dropdown,
  Input,
  Loading,
  Login,
} from '../../components'
import { IDropdownItem } from '../../components/dropdown/types'
import { Config } from '../../helpers/Config'
import { useDebounced } from '../../helpers/Debounced'
import { getData, LocalStorageKeys } from '../../helpers/LocalStorage'
import {
  validateAge,
  validateEmail,
  validateEmpty,
  validatePasswords,
} from '../../helpers/Validators'
import R from '../../res'
import { IUserProfile } from '../../types'
import s from './styles'
import {
  IBillingProps,
  IOnCheckoutSuccess,
  ITicketHolderField,
  ITicketHolderFieldError,
} from './types'

const Billing = (props: IBillingProps) => {
  const {
    styles,
    texts,
    cartProps: {
      isAgeRequired,
      isNameRequired,
      isPhoneRequired,
      minimumAge,
      isBillingRequired,
    },
    loginBrandImages,
  } = props

  //#region Labels
  const countryLabel = texts?.form?.country || 'Country'
  const stateLabel = texts?.form?.country || 'State/County'
  const defaultCountry: IDropdownItem = { value: '-1', label: countryLabel }
  const defaultState: IDropdownItem = { value: '-1', label: stateLabel }

  const brandCheckBoxText = useMemo(() => {
    return texts?.form?.checkbox
      ? texts.form?.checkbox
      : 'I would like to be updated on news, events and offers.'
  }, [texts?.form?.checkbox])

  const phoneLabel = useMemo(() => {
    const optionalPhone = isPhoneRequired ? '' : ' (optional)'
    return texts?.form?.phone
      ? `${texts?.form?.phone} ${optionalPhone}`
      : `Phone ${optionalPhone}`
  }, [isPhoneRequired, texts])

  const addressLabel = useMemo(() => {
    const optionalAddress = Config.IS_BILLING_STREET_NAME_REQUIRED
      ? ''
      : ' (optional)'

    return texts?.form?.street
      ? `${texts.form.street} ${optionalAddress}`
      : `Street ${optionalAddress}`
  }, [texts])

  const holderLabels = useMemo(() => {
    const optional = isNameRequired ? '' : ' (optional)'
    return {
      firstName: texts?.form?.holderFirstName
        ? `${texts.form.holderFirstName} ${optional}`
        : `First Name ${optional}`,
      lastName: texts?.form?.holderLastName
        ? `${texts.form.holderLastName} ${optional}`
        : `Last Name ${optional}`,
      email: texts?.form?.holderEmail
        ? `${texts.form.holderEmail} (optional)`
        : 'Email (optional)',
      phone: texts?.form?.holderPhone
        ? `${texts.form.holderPhone} (optional)`
        : 'Phone (optional)',
    }
  }, [isNameRequired, texts])
  //#endregion

  //#region State
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSubmittingData, setIsSubmittingData] = useState<boolean>(false)
  const [loggedUserFirstName, setLoggedUserFirstName] = useState<string>('')
  const [loginMessage, setLoginMessage] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [emailConfirmation, setEmailConfirmation] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [isSubToTicketFairy, setIsSubToTicketFairy] = useState(false)
  const [isSubToBrand, setIsSubToBrand] = useState(false)
  const [phone, setPhone] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [countryId, setCountryId] = useState('')
  const [stateId, setStateId] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState(new Date())
  const [selectedCountry, setSelectedCountry] = useState<
    IDropdownItem | undefined
  >(undefined)
  const [selectedState, setSelectedState] = useState<IDropdownItem | undefined>(
    undefined
  )
  const [ticketHoldersData, setTicketHoldersData] = useState<
    ITicketHolderField[]
  >([])

  const [numberOfTicketHolders, setNumberOfTicketHolders] = useState<
    number | undefined
  >()

  const [countries, setCountries] = useState<IDropdownItem[]>([defaultCountry])
  const [states, setStates] = useState<IDropdownItem[]>([defaultState])

  const [isLoginDialogVisible, setIsLoginDialogVisible] = useState(false)
  const [skipping, setSkippingStatus] = useState<
    'skipping' | 'fail' | 'success' | 'false'
  >(isBillingRequired ? 'false' : 'skipping')

  const [isTtfCheckboxHidden, setIsTtfCheckboxHidden] = useState(false)

  // Errors state
  const firstNameError = useDebounced(firstName, validateEmpty)
  const lastNameError = useDebounced(lastName, validateEmpty)
  const emailError = useDebounced(email, () =>
    validateEmail(email, emailConfirmation)
  )
  const confirmEmailError = useDebounced(emailConfirmation, () =>
    validateEmail(emailConfirmation, email)
  )
  const passwordError = useDebounced(password, () =>
    validatePasswords(password, passwordConfirmation)
  )
  const confirmPasswordError = useDebounced(passwordConfirmation, () =>
    validatePasswords(passwordConfirmation, password)
  )
  const phoneError = useDebounced(phone, validateEmpty)
  const streetError = useDebounced(street, validateEmpty)
  const cityError = useDebounced(city, validateEmpty)
  const postalCodeError = useDebounced(postalCode, validateEmpty)
  const [dateOfBirthError, setDateOfBirthError] = useState('')
  // End of errors state
  //#endregion

  //#region Refs
  const storedToken = useRef('')
  const storedProfileData = useRef({} as IUserProfile)
  //#endregion

  //#region Handlers
  const showLoginDialog = () => setIsLoginDialogVisible(true)
  const hideLoginDialog = () => setIsLoginDialogVisible(false)

  const handleIsSubToBrandToggle = () => {
    setIsSubToBrand(!isSubToBrand)
  }

  const handleIsSubToTicketFairyToggle = () => {
    setIsSubToTicketFairy(!isSubToTicketFairy)
  }

  const handleOpenPrivacyLink = async () => {
    const canOpenLink = await Linking.canOpenURL(Constants.PRIVACY_POLICY_LINK)
    if (canOpenLink) {
      await Linking.openURL(Constants.PRIVACY_POLICY_LINK)
    }
  }

  const handleSetFormDataFromUserProfile = (
    userProfile: IUserProfile,
    accessToken?: string
  ) => {
    storedProfileData.current = userProfile
    setFirstName(userProfile.firstName)
    setLastName(userProfile.lastName)
    setEmail(userProfile.email)
    setEmailConfirmation(userProfile.email)
    setPhone(userProfile.phone)
    setStreet(userProfile.streetAddress)
    setCity(userProfile.city)
    setPostalCode(userProfile.zipCode)
    setCountryId(userProfile.countryId)
    setStateId(userProfile.stateId)
    setLoggedUserFirstName(userProfile.firstName)
    setIsSubToTicketFairy(true)

    const thData = [...ticketHoldersData]
    thData.forEach((th, index) => {
      th.firstName = index === 0 ? userProfile.firstName : ''
      th.lastName = index === 0 ? userProfile.lastName : ''
      th.email = index === 0 ? userProfile.email : ''
      th.phone = index === 0 ? userProfile.phone : ''
    })
    setTicketHoldersData(thData)

    if (accessToken) {
      storedToken.current = accessToken
    }
  }

  const handleOnLoginSuccess = async (
    userProfile: IUserProfile,
    accessToken: string
  ) => {
    if (props.onLoginSuccess) {
      props.onLoginSuccess({
        accessToken: accessToken,
        userData: userProfile,
      })
    }

    if (!isBillingRequired && skipping === 'fail') {
      setSkippingStatus('skipping')

      await performCheckout(
        getCheckoutBodyWhenSkipping({
          userProfile: userProfile,
          ticketsQuantity: numberOfTicketHolders || 1,
        }),
        accessToken
      )
    }
    handleSetFormDataFromUserProfile(userProfile, accessToken)
  }

  const handleOnLoginFail = (error: string) => {
    if (props.onLoginFail) {
      props.onLoginFail(error)
    }
  }

  const handleOnLogoutSuccess = () => {
    setFirstName('')
    setLastName('')
    setEmail('')
    setEmailConfirmation('')
    setPhone('')
    setStreet('')
    setCity('')
    setPostalCode('')
    setPassword('')
    setPasswordConfirmation('')
    setCountryId('')
    setStateId('')
    setSelectedCountry(defaultCountry)
    setStates([defaultState])
    setIsSubToTicketFairy(false)
    setIsSubToBrand(false)
    storedToken.current = ''
    setLoggedUserFirstName('')

    const thData = [...ticketHoldersData]
    thData.forEach((th) => {
      th.firstName = ''
      th.lastName = ''
      th.email = ''
      th.phone = ''
    })
    setTicketHoldersData(thData)
  }

  const handleOnSelectDate = (newDate: Date) => {
    const ageError = validateAge(newDate, minimumAge)
    setDateOfBirth(newDate)
    setDateOfBirthError(ageError)
  }
  //#endregion

  //#region Form validation
  const checkBasicDataValid = (): boolean => {
    if (
      !firstName ||
      !lastName ||
      !email ||
      !emailConfirmation ||
      !city ||
      !postalCode ||
      selectedState?.value === '-1' ||
      selectedCountry?.value === '-1'
    ) {
      return false
    }

    if (isPhoneRequired && !phone) {
      return false
    }

    if (Config.IS_BILLING_STREET_NAME_REQUIRED && !street) {
      return false
    }

    return true
  }

  const checkExtraDataValid = (): string => {
    if (isAgeRequired) {
      const ageValidationMessage = validateAge(dateOfBirth, minimumAge)
      if (ageValidationMessage) {
        setDateOfBirthError(ageValidationMessage)
        return ageValidationMessage
      }
    }

    if (!isNameRequired) {
      return ''
    }

    return _every(
      _map(
        ticketHoldersData,
        (th) => validateEmpty(th.firstName) || validateEmpty(th.lastName)
      ),
      (itm) => itm === ''
    )
      ? ''
      : 'You must fill all Ticket Holder required fields'
  }
  //#endregion

  //#region Submit form
  const handleOnRegisterFail = (rawError: any) => {
    if (props.onRegisterFail) {
      props.onRegisterFail(rawError)
    }
  }

  const performCheckout = async (
    checkoutBody: ICheckoutBody,
    pToken: string
  ) => {
    try {
      setIsSubmittingData(true)
      const { error: checkoutError, data: checkoutData } = await checkoutOrder(
        checkoutBody,
        pToken
      )
      setIsSubmittingData(false)

      if (checkoutError) {
        if (props.onCheckoutFail) {
          props.onCheckoutFail(checkoutError)
        }
        setSkippingStatus('false')
        return Alert.alert('', checkoutError)
      }

      const checkoutResponseData: IOnCheckoutSuccess = {
        id: checkoutData.data.data.attributes.id,
        hash: checkoutData.data.data.attributes.hash,
        total: checkoutData.data.data.attributes.total,
        status: checkoutData.data.data.attributes.status,
      }
      setSkippingStatus('success')
      props.onCheckoutSuccess(checkoutResponseData)
    } catch (err) {
      setIsSubmittingData(false)
      setSkippingStatus('false')

      if (props.onCheckoutFail) {
        props.onCheckoutFail('Error while performing checkout')
      }
    }
  }

  const getRegisterFormData = (checkoutBody: ICheckoutBody): FormData => {
    const bodyFormData = new FormData()
    _forEach(checkoutBody.attributes, (item: any, key: string) => {
      bodyFormData.append(key, item)
    })

    bodyFormData.append(
      'password_confirmation',
      checkoutBody.attributes.password
    )
    bodyFormData.append('client_id', Config.CLIENT_ID)
    bodyFormData.append('client_secret', Config.CLIENT_SECRET)

    return bodyFormData
  }

  const performNewUserRegister = async (checkoutBody: ICheckoutBody) => {
    const registerForm = getRegisterFormData(checkoutBody)
    setIsSubmittingData(true)
    const { data: registerResponseData, error: registerResponseError } =
      await registerNewUser(registerForm)

    if (registerResponseError) {
      setIsSubmittingData(false)
      if (registerResponseError.isAlreadyRegistered) {
        setLoginMessage(registerResponseError.message!)
        showLoginDialog()
        return handleOnRegisterFail(registerResponseError.raw)
      }
      handleOnRegisterFail(registerResponseError.raw)
      return Alert.alert('', registerResponseError.message)
    }

    if (!registerResponseData) {
      setIsSubmittingData(false)
      handleOnRegisterFail('Register returned no data')
      return Alert.alert('', 'Register returned no data')
    }

    const tokens = {
      accessToken: registerResponseData.access_token,
      refreshToken: registerResponseData.refresh_token,
    }

    storedToken.current = tokens.accessToken

    if (props.onRegisterSuccess) {
      props.onRegisterSuccess(tokens)
    }

    await performCheckout(checkoutBody, tokens.accessToken)
  }

  const getCheckoutBody = (): ICheckoutBody => {
    let parsedTicketHolders: ICheckoutTicketHolder[] = []

    for (let i = 0; i <= numberOfTicketHolders! - 1; i++) {
      const individualHolder = {
        first_name: ticketHoldersData[i].firstName || '',
        last_name: ticketHoldersData[i].lastName || '',
        phone: ticketHoldersData[i].phone || '',
        email: ticketHoldersData[i].email || '',
      }
      parsedTicketHolders.push(individualHolder)
    }

    const checkoutBody: ICheckoutBody = {
      attributes: {
        city: city,
        confirm_email: emailConfirmation,
        country: parseInt(selectedCountry!.value as string, 10),
        email: email,
        first_name: firstName,
        last_name: lastName,
        password: password,
        phone: phone,
        state: parseInt(selectedState!.value as string, 10),
        street_address: street,
        zip: postalCode,
        ticket_holders: parsedTicketHolders,
        ttf_opt_in: isSubToTicketFairy,
        brand_opt_in: isSubToBrand,
      },
    }

    if (isAgeRequired) {
      checkoutBody.attributes.dob_day = dateOfBirth.getDate()
      checkoutBody.attributes.dob_month = dateOfBirth.getMonth() + 1
      checkoutBody.attributes.dob_year = dateOfBirth.getFullYear()
    }

    return checkoutBody
  }

  const getCheckoutBodyWhenSkipping = ({
    userProfile,
    ticketsQuantity,
  }: {
    userProfile: IUserProfile
    ticketsQuantity: number
  }): ICheckoutBody => {
    let parsedTicketHolders: ICheckoutTicketHolder[] = []
    const hFirstName = userProfile.firstName
    const hLastName = userProfile.lastName
    const hPhone = userProfile.phone
    const hEmail = userProfile.email

    for (let i = 0; i <= ticketsQuantity - 1; i++) {
      const individualHolder = i
        ? {
            first_name: '',
            last_name: '',
            phone: '',
            email: '',
          }
        : {
            first_name: hFirstName,
            last_name: hLastName,
            phone: hPhone,
            email: hEmail,
          }

      parsedTicketHolders.push(individualHolder)
    }

    const checkoutBody: ICheckoutBody = {
      attributes: {
        city: userProfile.city,
        confirm_email: userProfile.email,
        country: parseInt(userProfile.countryId, 10),
        email: userProfile.email,
        first_name: userProfile.firstName,
        last_name: userProfile.lastName,
        phone: userProfile.phone,
        state: parseInt(userProfile.stateId, 10),
        street_address: userProfile.streetAddress,
        zip: userProfile.zipCode,
        ticket_holders: parsedTicketHolders,
        ttf_opt_in: isSubToTicketFairy,
        brand_opt_in: isSubToBrand,
        password: password,
      },
    }

    return checkoutBody
  }

  const onSubmit = async () => {
    const isExtraDataValid = checkExtraDataValid()
    if (isExtraDataValid) {
      return Alert.alert('', isExtraDataValid)
    }

    const checkoutBody = getCheckoutBody()
    if (loggedUserFirstName && storedToken.current) {
      await performCheckout(checkoutBody, storedToken.current)
    } else {
      await performNewUserRegister(checkoutBody)
    }
  }
  //#endregion

  const fetchData = async () => {
    setIsLoading(true)
    let usrPrfl: IUserProfile | undefined
    const usrTkn = await getData(LocalStorageKeys.ACCESS_TOKEN)

    const { data: countriesData, error: countriesError } =
      await fetchCountries()

    if (countriesError) {
      setIsLoading(false)
      return Alert.alert('', countriesError || 'Error fetching countries')
    }

    const parsedCountries: IDropdownItem[] = _map(
      countriesData,
      (item, index) => {
        return { label: item, value: index }
      }
    )

    if (usrTkn) {
      storedToken.current = usrTkn
      const { error: userProfileError, userProfile: userProfileResponse } =
        await fetchUserProfile(usrTkn)

      if (userProfileError || !userProfileResponse) {
        setIsLoading(false)
        return Alert.alert(
          '',
          userProfileError || 'Error fetching user profile'
        )
      }

      usrPrfl = userProfileResponse
    } else {
      parsedCountries.unshift(defaultCountry)
      setSelectedCountry(defaultCountry)
    }

    const { cartData, cartError } = await fetchCart()

    if (cartError) {
      setIsLoading(false)
      Alert.alert('', cartError)
      if (props.onFetchCartError) {
        props.onFetchCartError(cartError)
      }
      return
    }

    setNumberOfTicketHolders(cartData.quantity)
    setIsSubToBrand(cartData.isMarketingOptedIn)
    setIsSubToTicketFairy(cartData.isTfOptIn)
    setIsTtfCheckboxHidden(cartData.isTfOptInHidden || false)

    const tHolders: ITicketHolderField[] = []
    for (let i = 0; i < cartData.quantity; i++) {
      tHolders.push({
        firstName: i === 0 && usrPrfl ? usrPrfl.firstName : '',
        lastName: i === 0 && usrPrfl ? usrPrfl.lastName : '',
        email: i === 0 && usrPrfl ? usrPrfl.email : '',
        phone: i === 0 && usrPrfl ? usrPrfl.phone : '',
      })
    }

    if (!isBillingRequired && usrTkn && usrPrfl && cartData) {
      const checkoutBody: ICheckoutBody = getCheckoutBodyWhenSkipping({
        userProfile: usrPrfl,
        ticketsQuantity: cartData.quantity,
      })
      await performCheckout(checkoutBody, usrTkn)
    } else {
      if (skipping === 'skipping') {
        setSkippingStatus('fail')
      }
    }

    if (usrPrfl) {
      handleSetFormDataFromUserProfile(usrPrfl)
    }

    setCountries(parsedCountries)
    setTicketHoldersData(tHolders)
    setIsLoading(false)
  }

  //#region Effects
  useEffect(() => {
    if (countries.length > 1 && countryId) {
      const selectedCountryItem = _find(
        countries,
        (item) => item.value === countryId
      )
      setSelectedCountry(selectedCountryItem)
    }
  }, [countries, countryId])

  useEffect(() => {
    const getStates = async () => {
      const { data: statesData, error: statesError } = await fetchStates(
        selectedCountry!.value as string
      )

      if (statesError || !statesData) {
        return Alert.alert('', statesError || 'Error fetching states')
      }

      const parsedStates: IDropdownItem[] = _map(statesData, (item, index) => {
        return { label: item, value: index }
      })
      setStates(parsedStates)
    }

    if (selectedCountry && selectedCountry.value !== '-1') {
      getStates()
    }
  }, [selectedCountry])

  useEffect(() => {
    if (states.length > 1 && stateId) {
      const selectedStateItem = _find(states, (item) => item.value === stateId)
      if (!selectedStateItem) {
        return setSelectedState(defaultState)
      }
      setSelectedState(selectedStateItem)
    } else {
      setSelectedState(defaultState)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateId, states])

  const initTicketHoldersErrors = useCallback(() => {
    if (ticketHoldersData.length > 1) {
      const tHolders: ITicketHolderFieldError[] = []

      for (let i = 0; i < ticketHoldersData.length; i++) {
        tHolders.push({
          firstNameError: '',
          lastNameError: '',
        })
      }
    }
  }, [ticketHoldersData])

  initTicketHoldersErrors()

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  //#endregion

  //#region Render
  const renderTicketHolders = () => {
    if (!numberOfTicketHolders) {
      return null
    }

    let tHolders = []
    for (let i = 0; i < numberOfTicketHolders; i++) {
      const thItemTitle = texts?.form?.ticketHolderItem || 'Ticket Holder'
      tHolders.push(
        <View key={`ticketHolder.${i}`}>
          <Text style={styles?.ticketHolderItemHeader}>
            {thItemTitle} {i + 1}
          </Text>
          <Input
            label={holderLabels.firstName}
            value={ticketHoldersData[i].firstName}
            onChangeText={(text) => {
              const copyTicketHolders = [...ticketHoldersData]
              copyTicketHolders[i].firstName = text
              setTicketHoldersData(copyTicketHolders)
            }}
            styles={styles?.inputStyles}
          />
          <Input
            label={holderLabels.lastName}
            value={ticketHoldersData[i].lastName}
            onChangeText={(text) => {
              const copyTicketHolders = [...ticketHoldersData]
              copyTicketHolders[i].lastName = text
              setTicketHoldersData(copyTicketHolders)
            }}
            styles={styles?.inputStyles}
          />
          <Input
            label={holderLabels.email}
            value={ticketHoldersData[i].email}
            onChangeText={(text) => {
              const copyTicketHolders = [...ticketHoldersData]
              copyTicketHolders[i].email = text
              setTicketHoldersData(copyTicketHolders)
            }}
            keyboardType='email-address'
            styles={styles?.inputStyles}
            autoCapitalize='none'
          />
          <Input
            label={holderLabels.phone}
            value={ticketHoldersData[i].phone}
            onChangeText={(text) => {
              const copyTicketHolders = [...ticketHoldersData]
              copyTicketHolders[i].phone = text
              setTicketHoldersData(copyTicketHolders)
            }}
            keyboardType='phone-pad'
            styles={styles?.inputStyles}
          />
        </View>
      )
    }

    return tHolders
  }

  const renderCheckingOut = () => {
    return (
      <View
        style={[s.skippingRootContainer, styles?.skippingDialog?.rootContainer]}
      >
        <View
          style={[
            s.skippingDialogContainer,
            styles?.skippingDialog?.dialogContainer,
          ]}
        >
          <Image
            source={R.images.brand}
            style={[s.skippingBrandImage, styles?.skippingDialog?.brandImage]}
          />
          <Text style={[s.skippingMessage, styles?.skippingDialog?.message]}>
            {texts?.skippingMessage || 'Checking out...'}
          </Text>
          <ActivityIndicator
            color={styles?.skippingDialog?.spinner?.color || R.colors.black}
            size={styles?.skippingDialog?.spinner?.size || 'large'}
          />
        </View>
      </View>
    )
  }

  const isDataValid = checkBasicDataValid()

  return skipping === 'skipping' ? (
    renderCheckingOut()
  ) : (
    <KeyboardAwareScrollView extraScrollHeight={32}>
      <View style={styles?.rootContainer}>
        <Login
          onLoginSuccessful={handleOnLoginSuccess}
          onLogoutSuccess={handleOnLogoutSuccess}
          isLoginDialogVisible={isLoginDialogVisible}
          showLoginDialog={showLoginDialog}
          hideLoginDialog={hideLoginDialog}
          userFirstName={loggedUserFirstName}
          onLoginFailure={handleOnLoginFail}
          texts={{
            dialog: {
              message: loginMessage,
            },
          }}
          styles={styles?.loginStyles}
          brandImages={loginBrandImages}
        />
        <Text style={styles?.screenTitle}>
          {texts?.form?.getYourTicketsTitle || 'Get Your Tickets'}
        </Text>

        <Input
          label={texts?.form?.firstName || 'First name'}
          value={firstName}
          onChangeText={setFirstName}
          error={firstNameError}
          styles={styles?.inputStyles}
        />
        <Input
          label={texts?.form?.lastName || 'Last name'}
          value={lastName}
          onChangeText={setLastName}
          error={lastNameError}
          styles={styles?.inputStyles}
        />

        <Text style={styles?.texts}>
          {texts?.form?.emailsAdvice ||
            `IMPORTANT: Please double check that your email address is correct.\nIt's where we send your confirmation and e-tickets to!`}
        </Text>

        <Input
          label={texts?.form?.email || 'Email'}
          value={email}
          onChangeText={setEmail}
          keyboardType='email-address'
          error={emailError}
          styles={styles?.inputStyles}
          autoCapitalize='none'
        />
        <Input
          label={texts?.form?.confirmEmail || 'Confirm email'}
          value={emailConfirmation}
          onChangeText={setEmailConfirmation}
          keyboardType='email-address'
          error={confirmEmailError}
          styles={styles?.inputStyles}
          autoCapitalize='none'
        />
        {isAgeRequired && (
          <DatePicker
            text={texts?.form?.dateOfBirth || 'Date of Birth'}
            onSelectDate={handleOnSelectDate}
            selectedDate={dateOfBirth}
            styles={styles?.datePicker}
            error={dateOfBirthError}
          />
        )}
        {!loggedUserFirstName && (
          <>
            <Text style={styles?.passwordTitle}>
              {texts?.form?.choosePassword ||
                'Choose a password for your new TICKETFAIRY account'}
            </Text>
            <Input
              label={texts?.form?.password || 'Password'}
              isSecure
              onChangeText={setPassword}
              error={passwordError}
              styles={styles?.inputStyles}
              autoCapitalize='none'
              secureTextEntry={true}
            />
            <Input
              label={texts?.form?.confirmPassword || 'Confirm password'}
              isSecure
              onChangeText={setPasswordConfirmation}
              error={confirmPasswordError}
              styles={styles?.inputStyles}
              autoCapitalize='none'
              secureTextEntry={true}
            />
          </>
        )}
        <Input
          label={phoneLabel}
          value={phone}
          onChangeText={setPhone}
          keyboardType='phone-pad'
          error={phoneError}
          styles={styles?.inputStyles}
        />
        <Input
          label={addressLabel}
          value={street}
          onChangeText={setStreet}
          error={streetError}
          styles={styles?.inputStyles}
        />
        <Input
          label={texts?.form?.city || 'City'}
          value={city}
          onChangeText={setCity}
          error={cityError}
          styles={styles?.inputStyles}
        />
        <Dropdown
          items={countries}
          onSelectItem={setSelectedCountry}
          selectedOption={selectedCountry}
          styles={styles?.dropdownStyles}
        />
        <Input
          label={texts?.form?.zipCode || 'Postal Code / Zip Code'}
          value={postalCode}
          onChangeText={setPostalCode}
          error={postalCodeError}
          styles={styles?.inputStyles}
        />
        <Dropdown
          items={states}
          onSelectItem={setSelectedState}
          selectedOption={selectedState}
          styles={styles?.dropdownStyles}
        />
        <Checkbox
          onPress={handleIsSubToBrandToggle}
          text={brandCheckBoxText}
          isActive={isSubToBrand}
          styles={styles?.checkboxStyles}
        />

        {!isTtfCheckboxHidden && (
          <Checkbox
            onPress={handleIsSubToTicketFairyToggle}
            isActive={isSubToTicketFairy}
            customTextComp={
              <Text style={styles?.customCheckbox?.text}>
                I agree that The Ticket Fairy may use the personal data that I
                have provided for marketing purposes, such as recommending
                events that I might be interested in, in accordance with its{' '}
                <Text
                  style={props.privacyPolicyLinkStyle}
                  onPress={handleOpenPrivacyLink}
                >
                  Privacy Policy
                </Text>
                .
              </Text>
            }
            styles={styles?.checkboxStyles}
          />
        )}

        {ticketHoldersData.length > 0 && (
          <>
            <Text style={styles?.ticketHoldersTitle}>
              {texts?.form?.ticketHoldersTitle || 'Ticket Holders'}
            </Text>
            {renderTicketHolders()}
          </>
        )}

        <Button
          onPress={onSubmit}
          text={texts?.checkoutButton || 'CHECKOUT'}
          isDisabled={!isDataValid}
          isLoading={isSubmittingData}
          styles={
            !isDataValid
              ? {
                  button: s.submitButtonDisabled,
                  ...styles?.checkoutButtonDisabled,
                }
              : {
                  container: [
                    s.submitButton,
                    styles?.checkoutButton?.container,
                  ],
                  text: styles?.checkoutButton?.text,
                  button: styles?.checkoutButton?.button,
                }
          }
        />
      </View>
      {isLoading && <Loading />}
    </KeyboardAwareScrollView>
  )
  //#endregion
}

export default Billing
