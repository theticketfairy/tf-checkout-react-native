/* eslint-disable no-unreachable */
import _every from 'lodash/every'
import _find from 'lodash/find'
import _forEach from 'lodash/forEach'
import _map from 'lodash/map'
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Text,
  View,
} from 'react-native'
import DeviceCountry, { TYPE_ANY } from 'react-native-device-country'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import Constants from '../../api/Constants'
import {
  ICheckoutBody,
  ICheckoutTicketHolder,
  IFetchAccessTokenResponse,
  IRegisterNewUserBody,
} from '../../api/types'
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
} from '../../components'
import { IDropdownItem } from '../../components/dropdown/types'
import { ILoginSuccessData } from '../../components/login/types'
import { IOnChangePhoneNumberPayload } from '../../components/phoneInput/types'
import { BillingCore, BillingCoreHandle, SessionHandle } from '../../core'
import { SessionHandleType } from '../../core/Session/SessionCoreTypes'
import { Config } from '../../helpers/Config'
import { getCountryDialCode } from '../../helpers/CountryCodes'
import { useDebounced } from '../../helpers/Debounced'
import { getData, LocalStorageKeys } from '../../helpers/LocalStorage'
import { emptyPhone } from '../../helpers/StringsHelper'
import {
  validateAge,
  validateEmail,
  validateEmpty,
  validatePasswords,
  validatePhoneNumber,
} from '../../helpers/Validators'
import R from '../../res'
import { IError, IUserProfile, IUserProfilePublic } from '../../types'
import s from './styles'
import {
  IBillingProps,
  ITicketHolderField,
  ITicketHolderFieldError,
  SkippingStatusType,
} from './types'

/*
  Fields to hide when ticket is free
  - Billing Street Address
  - City
  - State/County
  - Post Code/Zip
  - Country
*/

const Billing = forwardRef<SessionHandleType, IBillingProps>(
  (
    {
      styles,
      texts,
      cartProps: {
        isAgeRequired,
        isNameRequired,
        isPhoneRequired,
        minimumAge,
        isBillingRequired,
        isTicketFree,
        isPhoneHidden,
      },
      loginBrandImages,
      skipBillingConfig,
      areAlertsEnabled = true,
      areLoadingIndicatorsEnabled = true,
      onLoadingChange,
      onLoginError,
      onLoginSuccess,
      onRegisterError,
      onRegisterSuccess,
      onCheckoutSuccess,
      onCheckoutError,
      onFetchUserProfileSuccess,
      onFetchUserProfileError,
      onFetchCartError,
      onFetchCartSuccess,
      onFetchCountriesError,
      onFetchCountriesSuccess,
      onFetchStatesError,
      onFetchStatesSuccess,
      onSkippingStatusChange,
      onLogoutSuccess,
      onLogoutError,
      onCartExpired,
      shouldCartTimerNotMinimizeOnTap,
    },
    ref
  ) => {
    //#region Labels
    const holderLabels = useMemo(() => {
      const optional = isNameRequired
        ? ''
        : texts?.form?.optional || '(optional)'
      return {
        firstName: texts?.form?.holderFirstName
          ? `${texts.form.holderFirstName} ${optional}`
          : `First Name ${optional}`,
        lastName: texts?.form?.holderLastName
          ? `${texts.form.holderLastName} ${optional}`
          : `Last Name ${optional}`,
        email: texts?.form?.holderEmail
          ? `${texts.form.holderEmail} ${texts?.form?.optional || '(optional)'}`
          : `Email ${optional}`,
        phone: texts?.form?.holderPhone
          ? `${texts.form.holderPhone} ${texts?.form?.optional || '(optional)'}`
          : `Phone ${optional}`,
      }
    }, [isNameRequired, texts])

    const brandCheckBoxText =
      texts?.form?.isSubToBrand ||
      'I would like to be updated on news, events and offers.'

    const phoneLabel = useMemo(() => {
      const optionalPhone = isPhoneRequired
        ? ''
        : texts?.form?.optional || ' (optional)'
      return texts?.form?.phone
        ? `${texts?.form?.phone} ${optionalPhone}`
        : `Phone ${optionalPhone}`
    }, [isPhoneRequired, texts])

    const addressLabel = useMemo(() => {
      const optionalAddress = Config.IS_BILLING_STREET_NAME_REQUIRED
        ? ''
        : texts?.form?.optional || ' (optional)'

      return texts?.form?.street
        ? `${texts.form.street} ${optionalAddress}`
        : `Street ${optionalAddress}`
    }, [texts])

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
    const [selectedState, setSelectedState] = useState<
      IDropdownItem | undefined
    >(undefined)

    const [ticketHoldersData, setTicketHoldersData] = useState<
      ITicketHolderField[]
    >([])

    const [numberOfTicketHolders, setNumberOfTicketHolders] = useState<
      number | undefined
    >()

    const [states, setStates] = useState<IDropdownItem[]>([])
    const [countries, setCountries] = useState<IDropdownItem[]>([])

    const [isLoginDialogVisible, setIsLoginDialogVisible] = useState(false)
    const [skippingStatus, setSkippingStatus] =
      useState<SkippingStatusType>(undefined)
    const [isTtfCheckboxHidden, setIsTtfCheckboxHidden] = useState(false)

    // Cart expiration timer
    const [secondsLeft, setSecondsLeft] = React.useState(420)

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
    const [phoneError, setPhoneError] = useState('')
    const streetError = useDebounced(street, validateEmpty)
    const cityError = useDebounced(city, validateEmpty)
    const postalCodeError = useDebounced(postalCode, validateEmpty)
    const [dateOfBirthError, setDateOfBirthError] = useState('')
    const [ttfPrivacyPolicyError, setTtfPrivacyPolicyError] = useState('')
    // End of errors state
    //#endregion

    const getSkippingStatus = (numOfTickets: number): SkippingStatusType => {
      if (isBillingRequired || skippingStatus === 'fail') {
        return 'false'
      }

      if (numOfTickets > 1 || isAgeRequired) {
        return 'false'
      } else {
        return 'skipping'
      }
    }

    //#region Refs
    const storedToken = useRef('')
    const storedProfileData = useRef({} as IUserProfilePublic)
    const phoneErrorCounter = useRef(0)
    const billingCoreRef = useRef<BillingCoreHandle>(null)
    const sessionHandleRef = useRef<SessionHandleType>(null)
    //#endregion

    //#region Imperative Handler
    useImperativeHandle(ref, () => ({
      async refreshAccessToken(
        refreshToken: string
      ): Promise<IFetchAccessTokenResponse> {
        if (!sessionHandleRef.current) {
          return {
            accessTokenError: {
              message: 'Session Handle ref is not initialized',
            },
          }
        }

        const { accessTokenError, accessTokenData } =
          await sessionHandleRef.current!.refreshAccessToken(refreshToken)
        if (!accessTokenError && accessTokenData?.accessToken) {
          await fetchData()
        }
        return {
          accessTokenData,
          accessTokenError,
        }
      },

      async reloadData() {
        await fetchData()
      },
    }))
    //#endregion Imperative Handler

    //#region Handlers
    const handleSetPhoneError = useCallback(
      (error: string) => {
        if (isPhoneRequired && phone.length > 0) {
          setPhoneError(error)
        }
      },
      [isPhoneRequired, phone.length]
    )

    const handleOnChangePhoneNumber = (
      payload: IOnChangePhoneNumberPayload
    ) => {
      setPhone(payload.input)
      if (!payload.isValid && phoneErrorCounter.current > 0) {
        return handleSetPhoneError(
          texts?.form?.phoneInput?.customError || 'Invalid phone number'
        )
      }
      phoneErrorCounter.current = phoneErrorCounter.current + 1
      setPhoneError('')
    }

    const handleOnLoadingChange = useCallback(
      (loading: boolean) => {
        if (onLoadingChange) {
          onLoadingChange(loading)
        }
      },
      [onLoadingChange]
    )

    const handleOnSkippingStatusChange = useCallback(
      (status: SkippingStatusType) => {
        onSkippingStatusChange?.(status)
      },
      [onSkippingStatusChange]
    )

    const showAlert = (text: string) => {
      if (areAlertsEnabled) {
        Alert.alert('', text)
      }
    }

    const showLoginDialog = () => setIsLoginDialogVisible(true)
    const hideLoginDialog = () => setIsLoginDialogVisible(false)

    const handleIsSubToBrandToggle = () => {
      setIsSubToBrand(!isSubToBrand)
    }

    const handleIsSubToTicketFairyToggle = () => {
      setIsSubToTicketFairy(!isSubToTicketFairy)
    }

    const handleOpenPrivacyLink = async () => {
      const canOpenLink = await Linking.canOpenURL(
        Constants.PRIVACY_POLICY_LINK
      )
      if (canOpenLink) {
        await Linking.openURL(Constants.PRIVACY_POLICY_LINK)
      }
    }

    const handleSetFormDataFromUserProfile = (
      userProfile: IUserProfilePublic,
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

    const handleOnLoginSuccess = async ({
      userProfile,
      accessTokenData,
    }: ILoginSuccessData) => {
      let phoneCountry = 'US'
      const accessToken = await getData(LocalStorageKeys.ACCESS_TOKEN)
      const usrProfile = { ...userProfile }
      onLoginSuccess?.({
        userProfile,
        accessTokenData,
      })

      try {
        const deviceCountry = await DeviceCountry.getCountryCode(TYPE_ANY)
        phoneCountry = deviceCountry.code.toUpperCase()
      } catch (err) {
        phoneCountry = 'US'
      }
      if (!usrProfile.phone?.includes('+')) {
        usrProfile.phone = `${getCountryDialCode(phoneCountry)}${
          usrProfile.phone
        }`
      }

      if (!isBillingRequired && skippingStatus === 'fail') {
        setSkippingStatus('skipping')

        const phoneValidError = validatePhoneNumber({
          phoneNumber: userProfile.phone,
          customError: texts?.form?.phoneInput?.customError,
        })

        if (phoneValidError) {
          setIsLoading(false)
          showAlert(
            texts?.invalidPhoneNumberError ||
              'Please enter a valid phone number'
          )
          return handleSetPhoneError(
            texts?.invalidPhoneNumberError ||
              'Please enter a valid phone number'
          )
        }

        await performCheckout(
          getCheckoutBodyWhenSkipping({
            userProfile: usrProfile,
            ticketsQuantity: numberOfTicketHolders || 1,
          })
        )
      }
      handleSetFormDataFromUserProfile(usrProfile, accessToken)
    }

    const handleOnLoginError = (error: IError) => {
      onLoginError?.(error)
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
      setSelectedCountry({
        value: '-1',
        label: texts?.form?.country || 'Country',
      })
      setStates([
        {
          value: '-1',
          label: texts?.form?.state || 'State/County',
        },
      ])
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
      onLogoutSuccess?.()
    }

    const handleOnSelectDate = (newDate: Date) => {
      const ageError = validateAge(newDate, minimumAge)
      setDateOfBirth(newDate)
      setDateOfBirthError(ageError)
    }
    //#endregion

    //#region Form validation
    const checkIsStoredPhoneNumberFormat = (storedPhoneNumber: string) => {
      if (!storedPhoneNumber.includes('+')) {
        handleSetPhoneError(
          texts?.invalidPhoneNumberError || 'Please enter a valid phone number'
        )
        return false
      }
      return true
    }

    const checkBasicDataValid = (): boolean => {
      if (secondsLeft === 0) {
        return false
      }

      if (isTicketFree) {
        if (!firstName || !lastName || !email || !emailConfirmation) {
          return false
        }
      } else {
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

        if (Config.IS_BILLING_STREET_NAME_REQUIRED && !street) {
          setIsLoading(false)
          return false
        }
      }

      if (
        isPhoneRequired &&
        !isPhoneHidden &&
        validatePhoneNumber({
          phoneNumber: phone,
          customError: texts?.form?.phoneInput?.customError,
        })
      ) {
        setIsLoading(false)
        return false
      }

      return true
    }

    const fillAllRequiredFieldsAlert =
      texts?.form?.fillAllRequiredFieldsAlert ||
      'You must fill all Ticket Holder required fields'

    const checkExtraDataValid = (): string => {
      if (!isTtfCheckboxHidden && !isSubToTicketFairy) {
        setTtfPrivacyPolicyError(
          texts?.form?.ttfPrivacyPolicyRequiredError || 'Required'
        )
        return 'Please accept our Privacy Policy'
      }
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
        : fillAllRequiredFieldsAlert
    }
    //#endregion

    //#region Submit form
    const handleOnRegisterFail = (rawError: any) => {
      onRegisterError?.(rawError)
    }

    const performCheckout = async (
      checkoutBodyWhenSkipping?: ICheckoutBody
    ) => {
      if (!billingCoreRef.current) {
        return onCheckoutError?.({ message: 'BillingCore is not ready' })
      }

      const checkoutBody = checkoutBodyWhenSkipping || getCheckoutBody()

      setIsSubmittingData(true)
      const { error: checkoutError, data: checkoutData } =
        await billingCoreRef.current.checkoutOrder(checkoutBody)
      setIsSubmittingData(false)

      if (checkoutError) {
        onCheckoutError?.(checkoutError)
        setSkippingStatus('false')
        return showAlert(checkoutError.message)
      }

      if (!checkoutData) {
        onCheckoutError?.({ message: 'Checkout returned not data' })
        setSkippingStatus('false')
        return showAlert('Checkout returned not data')
      }

      setSkippingStatus('success')
      onCheckoutSuccess(checkoutData)
    }

    const getRegisterFormData = (data: IRegisterNewUserBody): FormData => {
      const bodyFormData = new FormData()
      _forEach(data.attributes, (item: any, key: string) => {
        bodyFormData.append(key, item)
      })
      return bodyFormData
    }

    const performNewUserRegister = async () => {
      if (!billingCoreRef.current) {
        showAlert('BillingCore is not ready')
        return onRegisterError?.({ message: 'BillingCore is not initialized' })
      }

      setIsSubmittingData(true)

      const registerUserBody = getRegisterNewUserBody()
      const registerForm = getRegisterFormData(registerUserBody)

      const { registerNewUserResponseData, registerNewUserResponseError } =
        await billingCoreRef.current.registerNewUser(registerForm)

      if (registerNewUserResponseError) {
        setIsSubmittingData(false)
        if (registerNewUserResponseError.isAlreadyRegistered) {
          setLoginMessage(registerNewUserResponseError.message!)
          showLoginDialog()
          return handleOnRegisterFail(registerNewUserResponseError.raw)
        }
        handleOnRegisterFail(registerNewUserResponseError.raw)
        return showAlert(registerNewUserResponseError.message!)
      }

      if (!registerNewUserResponseData) {
        setIsSubmittingData(false)
        handleOnRegisterFail('Register returned no data')
        return showAlert('Register returned no data')
      }

      storedToken.current =
        registerNewUserResponseData.accessTokenData.accessToken

      onRegisterSuccess?.(registerNewUserResponseData)

      await performCheckout()
    }

    const getRegisterNewUserBody = (): IRegisterNewUserBody => {
      const phoneNumber = isPhoneRequired ? phone : emptyPhone(phone)

      const body: IRegisterNewUserBody = isTicketFree
        ? {
            attributes: {
              email: email,
              first_name: firstName,
              last_name: lastName,
              password: password,
              phone: phoneNumber,
              password_confirmation: passwordConfirmation,
              client_id: Config.CLIENT_ID!,
              client_secret: Config.CLIENT_SECRET!,
              check_cart_expiration: true,
            },
          }
        : {
            attributes: {
              city: city,
              country: parseInt(selectedCountry!.value as string, 10),
              email: email,
              first_name: firstName,
              last_name: lastName,
              password: password,
              phone: phoneNumber,
              state: parseInt(selectedState!.value as string, 10),
              street_address: street,
              zip: postalCode,
              password_confirmation: passwordConfirmation,
              client_id: Config.CLIENT_ID!,
              client_secret: Config.CLIENT_SECRET!,
              check_cart_expiration: true,
            },
          }

      if (body.attributes.phone === undefined) {
        delete body.attributes.phone
      }

      return body
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

      const formattedPhone = isPhoneRequired ? phone : emptyPhone(phone)

      const checkoutBody: ICheckoutBody = isTicketFree
        ? {
            attributes: {
              confirm_email: emailConfirmation,
              email: email,
              first_name: firstName,
              last_name: lastName,
              password: password,
              phone: formattedPhone,
              ticket_holders: parsedTicketHolders,
              ttf_opt_in: isSubToTicketFairy,
              brand_opt_in: isSubToBrand,
            },
          }
        : {
            attributes: {
              city: city,
              confirm_email: emailConfirmation,
              country: parseInt(selectedCountry!.value as string, 10),
              email: email,
              first_name: firstName,
              last_name: lastName,
              password: password,
              phone: formattedPhone,
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

      if (checkoutBody.attributes.phone === undefined) {
        delete checkoutBody.attributes.phone
      }

      return checkoutBody
    }

    const getCheckoutBodyWhenSkipping = ({
      userProfile,
      ticketsQuantity,
    }: {
      userProfile: IUserProfilePublic
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

      const checkoutBody: ICheckoutBody = isTicketFree
        ? {
            attributes: {
              confirm_email: userProfile.email,
              email: userProfile.email,
              first_name: userProfile.firstName,
              last_name: userProfile.lastName,
              phone: userProfile.phone,
              ticket_holders: parsedTicketHolders,
              ttf_opt_in: isSubToTicketFairy,
              brand_opt_in: isSubToBrand,
              password: password,
            },
          }
        : {
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

      if (checkoutBody.attributes.phone === undefined) {
        delete checkoutBody.attributes.phone
      }

      return checkoutBody
    }

    const onSubmit = async () => {
      const isExtraDataValid = checkExtraDataValid()
      if (isExtraDataValid) {
        return showAlert(isExtraDataValid)
      }

      if (loggedUserFirstName && storedToken.current) {
        await performCheckout()
      } else {
        await performNewUserRegister()
      }
    }
    //#endregion

    //#region Fetch Initial Data
    const fetchData = async () => {
      if (!billingCoreRef.current) {
        onFetchCartError?.({ message: 'BillingCoreRef not initialized' })
        return showAlert('BillingCoreRef not initialized')
      }

      setIsLoading(true)

      let phoneCountry = 'US'
      let phoneCountryDialCode = '+1'
      let usrPrfl: IUserProfile | undefined

      try {
        const deviceCountry = await DeviceCountry.getCountryCode(TYPE_ANY)
        phoneCountry = deviceCountry.code.toUpperCase()
        phoneCountryDialCode = getCountryDialCode(phoneCountry)
      } catch (err) {
        phoneCountry = 'US'
      }

      const usrTkn = await getData(LocalStorageKeys.ACCESS_TOKEN)
      let skippingStatusInner: SkippingStatusType

      const { countriesData, countriesError } =
        await billingCoreRef.current.getCountries()

      if (countriesError) {
        setSkippingStatus('fail')
        setIsLoading(false)
        onFetchCountriesError?.(countriesError)
        return showAlert(countriesError.message || 'Error fetching countries')
      }

      onFetchCountriesSuccess?.()

      const parsedCountries: IDropdownItem[] = _map(
        countriesData,
        (item, index) => {
          return { label: item, value: index }
        }
      )

      if (usrTkn) {
        storedToken.current = usrTkn
        const { userProfileError, userProfileData } =
          await billingCoreRef.current.getUserProfile()

        if (userProfileError || !userProfileData) {
          setSkippingStatus('fail')
          setIsLoading(false)
          onFetchUserProfileError?.(userProfileError!)

          return showAlert(
            userProfileError?.message || 'Error fetching user profile'
          )
        }

        onFetchUserProfileSuccess?.({
          firstName: userProfileData.firstName,
          lastName: userProfileData.lastName,
        })

        usrPrfl = userProfileData
      } else {
        skippingStatusInner = 'fail'
        parsedCountries.unshift({
          value: '-1',
          label: texts?.form?.country || 'Country',
        })
        setSelectedCountry({
          value: '-1',
          label: texts?.form?.country || 'Country',
        })
      }

      const { cartData, cartError } = await billingCoreRef.current.getCart()

      if (cartError || !cartData) {
        setSkippingStatus('fail')
        setIsLoading(false)
        onFetchCartError?.(cartError || { message: 'Error fetching cart' })
        return showAlert(cartError?.message || 'Error fetching cart')
      }

      onFetchCartSuccess?.()

      if (skippingStatusInner === 'fail') {
        setSkippingStatus('fail')
      } else {
        setSkippingStatus(getSkippingStatus(cartData.quantity))
      }

      setNumberOfTicketHolders(cartData.quantity)
      setIsSubToBrand(cartData.isMarketingOptedIn)
      setIsSubToTicketFairy(cartData.isTfOptIn || false)
      setIsTtfCheckboxHidden(cartData.isTfOptInHidden || false)

      if (cartData.expiresAt) {
        setSecondsLeft(cartData.expiresAt)
      }

      const tHolders: ITicketHolderField[] = []
      for (let i = 0; i < cartData.quantity; i++) {
        tHolders.push({
          firstName: i === 0 && usrPrfl ? usrPrfl.firstName : '',
          lastName: i === 0 && usrPrfl ? usrPrfl.lastName : '',
          email: i === 0 && usrPrfl ? usrPrfl.email : '',
          phone: i === 0 && usrPrfl ? usrPrfl.phone : '',
        })
      }

      if (usrPrfl) {
        if (!isPhoneHidden && isPhoneRequired) {
          if (!checkIsStoredPhoneNumberFormat(usrPrfl.phone)) {
            showAlert(
              texts?.invalidPhoneNumberError ||
                'Please enter a valid phone number'
            )
            skippingStatusInner = 'fail'
            setSkippingStatus('fail')
            setIsLoading(false)
          } else {
            // We can perfom Checkout process since phone is valid
            if (!isBillingRequired && usrTkn && cartData) {
              const checkoutBody: ICheckoutBody = getCheckoutBodyWhenSkipping({
                userProfile: usrPrfl,
                ticketsQuantity: cartData.quantity,
              })
              return await performCheckout(checkoutBody)
            } else {
              if (skippingStatusInner === 'skipping') {
                setSkippingStatus('fail')
              }
            }
          }
        } else {
          // We can perfom Checkout process since phone is valid
          if (!isBillingRequired && usrTkn && cartData) {
            const checkoutBody: ICheckoutBody = getCheckoutBodyWhenSkipping({
              userProfile: usrPrfl,
              ticketsQuantity: cartData.quantity,
            })
            return await performCheckout(checkoutBody)
          } else {
            if (skippingStatusInner === 'skipping') {
              setSkippingStatus('fail')
            }
          }
        }

        const userPhone = usrPrfl.phone === null ? '' : usrPrfl.phone
        handleSetFormDataFromUserProfile({
          ...usrPrfl,
          phone: `${phoneCountryDialCode}${userPhone}`,
        })
      } else {
        // There is no user profile data
        setPhone(phoneCountryDialCode)
      }

      setCountries(parsedCountries)
      setTicketHoldersData(tHolders)
      setIsLoading(false)
    }
    //#endregion Fetch Initial Data

    //#region Effects
    useEffect(() => {
      handleOnLoadingChange(isLoading)
    }, [isLoading, handleOnLoadingChange])

    useEffect(() => {
      handleOnSkippingStatusChange(skippingStatus)
    }, [handleOnSkippingStatusChange, skippingStatus])

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
        if (!selectedCountry) {
          return
        }

        if (!billingCoreRef.current) {
          onFetchCartError?.({ message: 'BillingCoreRef not initialized' })
          return showAlert('BillingCoreRef not initialized')
        }

        const { statesData, statesError } =
          await billingCoreRef.current.getStates(
            selectedCountry.value.toString()
          )

        if (statesError) {
          onFetchStatesError?.(statesError!)
          return showAlert(statesError?.message || 'Error fetching states')
        }

        const parsedStates: IDropdownItem[] = _map(
          statesData,
          (item, index) => {
            return { label: item, value: index }
          }
        )

        onFetchStatesSuccess?.()
        setStates(parsedStates)
      }

      if (selectedCountry && selectedCountry.value !== '-1') {
        getStates()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCountry])

    useEffect(() => {
      if (states.length > 1 && stateId) {
        const selectedStateItem = _find(
          states,
          (item) => item.value === stateId
        )
        if (!selectedStateItem) {
          return setSelectedState({
            value: '-1',
            label: texts?.form?.state || 'State/County',
          })
        }
        setSelectedState(selectedStateItem)
      } else {
        setSelectedState({
          value: '-1',
          label: texts?.form?.state || 'State/County',
        })
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
      setCountries([
        {
          value: '-1',
          label: texts?.form?.country || 'Country',
        },
      ])
      setStates([
        {
          value: '-1',
          label: texts?.form?.state || 'State/County',
        },
      ])
      fetchData()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    //#endregion

    //#region RENDER
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
      const skippingStyles = skipBillingConfig?.styles
      return (
        <View style={[s.skippingRootContainer, skippingStyles?.rootContainer]}>
          <View
            style={[s.skippingDialogContainer, skippingStyles?.dialogContainer]}
          >
            <Image
              source={skipBillingConfig?.brandImage || R.images.brand}
              style={[s.skippingBrandImage, skippingStyles?.brandImage]}
            />
            <Text style={[s.skippingMessage, skippingStyles?.text]}>
              {texts?.skippingMessage || 'Checking out...'}
            </Text>
            {!!skipBillingConfig?.isActivityIndicatorVisible && (
              <ActivityIndicator
                color={
                  skippingStyles?.activityIndicator?.color || R.colors.black
                }
                size={skippingStyles?.activityIndicator?.size || 'large'}
              />
            )}
          </View>
        </View>
      )
    }

    const renderContent = () => (
      <>
        <KeyboardAwareScrollView extraScrollHeight={32}>
          <View style={styles?.rootContainer}>
            <Login
              onLoginSuccessful={handleOnLoginSuccess}
              onLoginError={handleOnLoginError}
              onLogoutSuccess={handleOnLogoutSuccess}
              onLogoutError={onLogoutError}
              isLoginDialogVisible={isLoginDialogVisible}
              showLoginDialog={showLoginDialog}
              hideLoginDialog={hideLoginDialog}
              userFirstName={loggedUserFirstName}
              texts={{ ...texts?.loginTexts, message: loginMessage }}
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
                  textContentType='oneTimeCode'
                />
                <Input
                  label={texts?.form?.confirmPassword || 'Confirm password'}
                  isSecure
                  onChangeText={setPasswordConfirmation}
                  error={confirmPasswordError}
                  styles={styles?.inputStyles}
                  autoCapitalize='none'
                  secureTextEntry={true}
                  textContentType='oneTimeCode'
                />
              </>
            )}

            {!isPhoneHidden && (
              <PhoneInput
                phoneNumber={phone}
                onChangePhoneNumber={handleOnChangePhoneNumber}
                styles={styles?.phoneInput}
                error={phoneError}
                texts={{
                  label: phoneLabel,
                  ...texts?.form?.phoneInput,
                }}
              />
            )}
            {!isTicketFree && (
              <>
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
                <DropdownMaterial
                  items={countries}
                  onSelectItem={setSelectedCountry}
                  selectedOption={selectedCountry}
                  styles={styles?.dropdownMaterialStyles}
                  materialInputProps={{
                    label: texts?.form?.country || 'Country',
                  }}
                />
                <Input
                  label={texts?.form?.zipCode || 'Postal Code / Zip Code'}
                  value={postalCode}
                  onChangeText={setPostalCode}
                  error={postalCodeError}
                  styles={styles?.inputStyles}
                />
                <DropdownMaterial
                  items={states}
                  onSelectItem={setSelectedState}
                  selectedOption={selectedState}
                  styles={styles?.dropdownMaterialStyles}
                  materialInputProps={{
                    label: texts?.form?.state || 'State',
                  }}
                />
              </>
            )}
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
                    {texts?.form?.isSubToTicketFairy ||
                      `I agree that The Ticket Fairy may use the personal data that have provided for marketing purposes, such as recommending events that I might be interested in, in accordance with its `}
                    <Text
                      style={styles?.privacyPolicyLinkStyle}
                      onPress={handleOpenPrivacyLink}
                    >
                      {texts?.form?.privacyPolicy || 'Privacy Policy'}
                    </Text>
                    .
                  </Text>
                }
                styles={{ error: s.ttfPolicyError, ...styles?.checkboxStyles }}
                error={ttfPrivacyPolicyError}
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
          {areLoadingIndicatorsEnabled && isLoading && <Loading />}
        </KeyboardAwareScrollView>
        <CartTimer
          secondsLeft={secondsLeft}
          styles={styles?.cartTimer}
          texts={texts?.cartTimer}
          shouldNotMinimize={shouldCartTimerNotMinimizeOnTap}
        />
      </>
    )

    const isDataValid = checkBasicDataValid()

    return (
      <BillingCore
        ref={billingCoreRef}
        onSecondsLeftChange={setSecondsLeft}
        onCartExpired={onCartExpired}
      >
        <SessionHandle ref={sessionHandleRef}>
          {skippingStatus === 'skipping' && areLoadingIndicatorsEnabled
            ? renderCheckingOut()
            : renderContent()}
        </SessionHandle>
      </BillingCore>
    )
    //#endregion
  }
)

export default Billing
