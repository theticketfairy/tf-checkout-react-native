import _every from 'lodash/every'
import _find from 'lodash/find'
import _get from 'lodash/get'
import _map from 'lodash/map'
import React, { useCallback, useEffect, useState } from 'react'
import { Linking } from 'react-native'
import { Alert, Text } from 'react-native'

import {
  checkoutOrder,
  fetchCart,
  fetchCountries,
  fetchStates,
  fetchUserProfile,
  registerNewUser,
} from '../../api/ApiClient'
import Constants from '../../api/Constants'
import { ICheckoutBody } from '../../api/types'
import { IDropdownItem } from '../../components/dropdown/types'
import { IFormFieldProps } from '../../components/formField/types'
import { useDebounced } from '../../helpers/Debounced'
import {
  deleteAllData,
  getData,
  LocalStorageKeys,
} from '../../helpers/LocalStorage'
import {
  validateEmail,
  validateEmpty,
  validatePasswords,
} from '../../helpers/Validators'
import { IUserProfile } from '../../types'
import {
  formDataInitialState,
  getCheckoutBody,
  getRegisterFormData,
} from './BillingInfoData'
import BillingInfoView from './BillingInfoView'
import s from './styles'
import {
  IBillingInfoFormData,
  IBillingInfoProps,
  IOnCheckoutSuccess,
} from './types'

const BillingInfo = ({
  cartProps: { isAgeRequired, isNameRequired, isBillingRequired },
  onRegisterSuccess,
  onRegisterFail,
  onCheckoutSuccess,
  onCheckoutFail,
  onLoginSuccess,
  onLoginFail,
  onFetchUserProfileFail,
  onFetchUserProfileSuccess,
  onFetchCartError,
  styles,
  texts,
  customCheckboxText,
  privacyPolicyLinkStyle,
}: IBillingInfoProps) => {
  //#region Declare state variables
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitLoading, setIsSubmitLoading] = useState(false)
  const [countries, setCountries] = useState<IDropdownItem[]>([])
  const [states, setStates] = useState<IDropdownItem[]>([])
  const [isLoginDialogVisible, setIsLoginDialogVisible] = useState(false)
  const [loginMessage, setLoginMessage] = useState('')
  const [userData, setUserData] = useState<IUserProfile>()
  const [storedToken, setStoredToken] = useState('')
  const [formData, setFormData] =
    useState<IBillingInfoFormData>(formDataInitialState)
  const {
    firstName,
    lastName,
    email,
    confirmEmail,
    password,
    confirmPassword,
    phone,
    street,
    city,
    country,
    zipCode,
    isSubToNewsletter,
    ticketHoldersFields,
    isSubToMarketing,
    birthday,
  } = formData

  const firstNameError = useDebounced(firstName, validateEmpty)
  const lastNameError = useDebounced(lastName, validateEmpty)
  const emailError = useDebounced(email, () =>
    validateEmail(email, confirmEmail)
  )
  const confirmEmailError = useDebounced(confirmEmail, () =>
    validateEmail(confirmEmail, email)
  )
  const passwordError = useDebounced(password, () =>
    validatePasswords(password, confirmPassword)
  )
  const confirmPasswordError = useDebounced(confirmPassword, () =>
    validatePasswords(confirmPassword, password)
  )
  const phoneError = useDebounced(phone, validateEmpty)
  const streetError = useDebounced(street, validateEmpty)
  const cityError = useDebounced(city, validateEmpty)
  const zipCodeError = useDebounced(zipCode, validateEmpty)
  //#endregion

  //#region State setters
  const showLoginDialog = () => setIsLoginDialogVisible(true)
  const hideLoginDialog = () => setIsLoginDialogVisible(false)

  const setInputData = (id: string, value: string) => {
    console.log(`Setting InputData for ID ${id} with value ${value}`)
    setFormData({ ...formData, [id]: value })
  }

  const setDatePickerData = (date: Date) => {
    console.log(`Setting DATEPICKER DATA  ${date}`)
    setFormData({ ...formData, birthday: date })
  }

  const setTicketHolderData = (index: number, id: string, value: string) => {
    console.log('setTicketHolderData', value)
    const newData = { ...formData }
    const holder = newData.ticketHoldersFields[index]
    holder[`${id}`] = value
    setFormData(newData)
  }

  const setDropdownData = (id: string, value: IDropdownItem) => {
    console.log(`Setting DROPDOWN DATA for ID ${id} with value ${value}`)
    setFormData({ ...formData, [id]: value })
  }

  const setCheckboxData = (id: string) => {
    console.log(`Setting setCheckboxData DATA for ID ${id}`)
    setFormData({ ...formData, [id]: !_get(formData, id) })
  }
  //#endregion

  // Gets all fields from the form
  const getFormFields = (): IFormFieldProps[] => {
    const getBirthdayField = (): IFormFieldProps[] => {
      return isAgeRequired
        ? [
            {
              id: 'age',
              fieldType: 'datePicker',
              datePickerProps: {
                text: 'Ticket Holder Age',
                onSelectDate: setDatePickerData,
                selectedDate: birthday,
              },
            },
          ]
        : []
    }

    const getPasswordsFields = (): IFormFieldProps[] => {
      return userData
        ? []
        : [
            {
              fieldType: 'title',
              title: 'Choose a password for your new TICKETFAIRY account',
              titleStyle: {},
            },
            {
              id: 'password',
              fieldType: 'input',
              inputProps: {
                onTextChanged: setInputData,
                label: 'Password',
                autoCapitalize: 'none',
                secureTextEntry: true,
                value: password,
                error: passwordError,
              },
            },
            {
              id: 'confirmPassword',
              fieldType: 'input',
              inputProps: {
                onTextChanged: setInputData,
                label: 'Confirm Password',
                autoCapitalize: 'none',
                secureTextEntry: true,
                value: confirmPassword,
                error: confirmPasswordError,
              },
            },
          ]
    }

    const getTicketHolderFields = (): IFormFieldProps[] => {
      if (ticketHoldersFields.length === 0) {
        return []
      }

      const ticketHolder: IFormFieldProps[] = [
        {
          fieldType: 'header',
          title: 'Ticket Holders',
        },
      ]
      for (let i = 0; i < ticketHoldersFields.length; i++) {
        ticketHolder.push(
          {
            fieldType: 'title',
            title: `Ticket holder ${i + 1}`,
          },
          {
            id: 'firstName',
            fieldType: 'input',
            inputProps: {
              value: ticketHoldersFields[i].firstName,
              onTextChanged: (key, value) => setTicketHolderData(i, key, value),
              label: 'First Name',
            },
          },
          {
            id: 'lastName',
            fieldType: 'input',
            inputProps: {
              value: ticketHoldersFields[i].lastName,
              onTextChanged: (key, value) => setTicketHolderData(i, key, value),
              label: 'Last Name',
            },
          },
          {
            id: 'email',
            fieldType: 'input',
            inputProps: {
              value: ticketHoldersFields[i].email,
              onTextChanged: (key, value) => setTicketHolderData(i, key, value),
              keyboardType: 'email-address',
              label: 'Email Address (optional)',
            },
          },
          {
            id: 'phone',
            fieldType: 'input',
            inputProps: {
              value: ticketHoldersFields[i].phone,
              onTextChanged: (key, value) => setTicketHolderData(i, key, value),
              keyboardType: 'phone-pad',
              label: 'Phone (optional)',
            },
          }
        )
      }
      return ticketHolder
    }

    return [
      {
        fieldType: 'title',
        title: 'Get Your Tickets',
      },
      {
        fieldType: 'input',
        id: 'firstName',
        inputProps: {
          value: firstName,
          onTextChanged: setInputData,
          label: 'First Name',
          error: firstNameError,
        },
      },
      {
        fieldType: 'input',
        id: 'lastName',
        inputProps: {
          value: lastName,
          onTextChanged: setInputData,
          label: 'Last Name',
          error: lastNameError,
        },
      },
      {
        fieldType: 'text',
        id: 'notice-email',
        title:
          "IMPORTANT: Please double check that your email address is correct. It's where we send your confirmation and e-tickets to!",
      },
      {
        fieldType: 'input',
        id: 'email',
        inputProps: {
          value: email,
          onTextChanged: setInputData,
          label: 'Email',
          keyboardType: 'email-address',
          autoCapitalize: 'none',
          autoCorrect: false,
          error: emailError,
        },
      },
      {
        fieldType: 'input',
        id: 'confirmEmail',
        inputProps: {
          value: confirmEmail,
          onTextChanged: setInputData,
          label: 'Confirm Email',
          keyboardType: 'email-address',
          autoCapitalize: 'none',
          autoCorrect: false,
          error: confirmEmailError,
        },
      },
      ...getPasswordsFields(),
      {
        id: 'phone',
        fieldType: 'input',
        inputProps: {
          onTextChanged: setInputData,
          label: 'Phone',
          value: phone,
          keyboardType: 'phone-pad',
          error: phoneError,
        },
      },
      {
        id: 'street',
        fieldType: 'input',
        inputProps: {
          onTextChanged: setInputData,
          label: 'Billing Street Address',
          value: street,
          error: streetError,
        },
      },
      {
        id: 'city',
        fieldType: 'input',
        inputProps: {
          onTextChanged: setInputData,
          label: 'City/Suburb',
          value: city,
          error: cityError,
        },
      },
      {
        id: 'country',
        fieldType: 'dropdown',
        dropdownProps: {
          options: countries,
          selectedOption: country,
          onSelectOption: setDropdownData,
        },
      },
      {
        id: 'zipCode',
        fieldType: 'input',
        inputProps: {
          value: zipCode,
          onTextChanged: setInputData,
          label: 'Post Code/Zip',
          keyboardType: 'number-pad',
          error: zipCodeError,
        },
      },
      {
        id: 'state',
        fieldType: 'dropdown',
        dropdownProps: {
          options: states,
          selectedOption: formData.state,
          onSelectOption: setDropdownData,
        },
      },
      ...getBirthdayField(),

      {
        id: 'isSubToNewsletter',
        fieldType: 'checkbox',
        checkboxProps: {
          text: 'I would like to be updated on House of X news, events and offers.',
          isActive: isSubToNewsletter,
          onPress: setCheckboxData,
        },
      },
      {
        id: 'isSubToMarketing',
        fieldType: 'checkbox',
        checkboxProps: {
          text: 'I agree that The Ticket Fairy may use the personal data that I have provided for marketing purposes, such as recommending events that I might be interested in, in accordance with its Privacy Policy.',
          isActive: isSubToMarketing,
          onPress: setCheckboxData,
          customTextComp: (
            <Text style={[s.customCheckboxText, customCheckboxText]}>
              I agree that The Ticket Fairy may use the personal data that I
              have provided for marketing purposes, such as recommending events
              that I might be interested in, in accordance with its{' '}
              <Text
                style={[s.privacyPolicyLink, privacyPolicyLinkStyle]}
                onPress={handleOpenPrivacyLink}
              >
                Privacy Policy.
              </Text>
            </Text>
          ),
        },
      },
      ...getTicketHolderFields(),
    ]
  }

  // Sets a Country either from User's Profile Data or from Countries list
  const setSelectedCountry = () => {
    console.log('setSelectedCountry COUNTRIES LENGTH', countries.length)
    if (countries.length === 0) {
      console.log('Not setting country X')
      return
    }

    const countryId = userData?.country ? userData.country : countries[0].value
    const sCountryItem = _find(countries, (item) => item.value === countryId)

    console.log('countryId', countryId)
    console.log('sCountryItem', sCountryItem)

    if (sCountryItem) {
      setFormData({ ...formData, country: sCountryItem! })
    }
  }

  const setSelectedState = useCallback(() => {
    console.log('setSelectedState', states)
    if (states.length === 0) {
      return
    }

    const foundId = userData?.stateId ? userData.stateId : states[0].value
    console.log('foundId state', foundId)

    const sStateItem = _find(states, (item) => item.value === foundId)
    console.log('sStateItem', sStateItem)
    if (sStateItem) {
      setFormData({ ...formData, state: sStateItem! })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [states, userData?.state])

  //#region API calls
  // If there is already an AccessToken stored we can directly request User Data
  const fetchUserDataAsync = async (accessToken?: string) => {
    if (!accessToken) {
      return
    }
    const { userProfile: userProfileData, error: userDataError } =
      await fetchUserProfile(accessToken)
    if (userDataError) {
      await deleteAllData()
      handleOnFetchUserDataFail(userDataError)
      setUserData(undefined)
    }

    if (userProfileData) {
      handleOnFetchUserDataSuccess(userProfileData)
    }
  }

  const fetchCartAsync = async () => {
    const { data: cartData, error: cartError } = await fetchCart()
    if (cartError) {
      Alert.alert('', cartError)
      if (onFetchCartError) {
        onFetchCartError(cartError)
      }
      return
    }
    let ticketQuantity = parseInt(cartData.quantity, 10)

    // Ticket holders initial data
    const newTicketHolderFields = []
    for (let i = 0; i < ticketQuantity; i++) {
      newTicketHolderFields.push({
        firstName: i === 0 && userData ? userData.firstName : '',
        lastName: i === 0 && userData ? userData.lastName : '',
        email: i === 0 && userData ? userData.email : '',
        phone: i === 0 && userData ? userData.phone : '',
      })
    }

    setFormData({
      ...formData,
      ticketHoldersFields: newTicketHolderFields,
    })
  }

  const fetchCountriesAsync = async () => {
    setIsLoading(true)
    const { data: countriesData, error: countriesError } =
      await fetchCountries()
    console.log('fetchCountriesAsync countriesResponse', countriesData)
    setIsLoading(false)
    if (countriesError) {
      return
    }

    const parsedCountries: IDropdownItem[] = _map(
      countriesData,
      (item, index) => {
        return { label: item, value: index }
      }
    )
    setCountries(parsedCountries)
  }

  const fetchStatesAsync = async (selectedCountryId: string) => {
    setIsLoading(true)
    const { data: statesData, error: statesError } = await fetchStates(
      selectedCountryId
    )
    setIsLoading(false)

    if (statesError) {
      Alert.alert('', statesError)
      return
    }

    const parsedStates: IDropdownItem[] = _map(statesData, (item, index) => {
      return { label: item, value: index }
    })
    setStates(parsedStates)
  }
  //#endregion

  //#region UseEffects
  //Initial useEffect, to fetch Cart and Countries list.
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true)
      const tkn = await getData(LocalStorageKeys.ACCESS_TOKEN)
      console.log('tkn', tkn)
      if (tkn) {
        setStoredToken(tkn)
      }
      await fetchCartAsync()
      setIsLoading(false)
    }
    fetchInitialData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Fetch userData
  useEffect(() => {
    const fetchUserData = async () => {
      console.log('.fetchUserData.')
      setIsLoading(true)
      await fetchUserDataAsync(storedToken)
      setIsLoading(false)
    }

    if (ticketHoldersFields.length > 0 && storedToken && !userData) {
      fetchUserData()
    } else if (ticketHoldersFields.length > 0 && !storedToken) {
      fetchCountriesAsync()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketHoldersFields, storedToken, userData])

  // Fetch Countries
  useEffect(() => {
    const getCountries = async () => {
      await fetchCountriesAsync()
    }
    if (countries.length === 0 && userData) {
      getCountries()
    }
  }, [userData, countries])

  //Once Countries is fullfilled, useEffect to set Country item.
  useEffect(() => {
    console.log('USE COUNTRIES', countries)
    setSelectedCountry()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countries])

  // Fetch States list.
  useEffect(() => {
    console.log('COUNTRY WAS SET TO: ', country)
    if (country?.value) {
      console.log('Gona FETCH States')
      fetchStatesAsync(country.value as string)
    }
  }, [country, userData])

  // Set State item.
  useEffect(() => {
    if (countries.length > 0 && states && states.length > 1) {
      console.log('Gonna set STATE', states)

      setSelectedState()
    }
  }, [countries, states, setSelectedState, userData])
  //#endregion

  //#region Handlers
  const handleOpenPrivacyLink = async () => {
    const canOpenLink = await Linking.canOpenURL(Constants.PRIVACY_POLICY_LINK)
    if (canOpenLink) {
      await Linking.openURL(Constants.PRIVACY_POLICY_LINK)
    }
  }
  const handleOnFetchUserDataSuccess = (userProfile: IUserProfile) => {
    console.log('handleOnFetchUserDataSuccess', userProfile)

    if (onFetchUserProfileSuccess) {
      onFetchUserProfileSuccess(userProfile)
    }

    setUserData(userProfile)
    console.log('formData.ticketHoldersFields', ticketHoldersFields)
    const newTicketHolderFields = [...ticketHoldersFields]
    console.log('******* newTicketHolderFields ****', newTicketHolderFields)
    newTicketHolderFields[0] = {
      email: userProfile.email,
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      phone: userProfile.phone,
    }

    setFormData({
      ...formData,
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      email: userProfile.email,
      confirmEmail: userProfile.email,
      phone: userProfile.phone,
      street: userProfile.streetAddress,
      zipCode: userProfile.zipCode,
      city: userProfile.city,
      ticketHoldersFields: newTicketHolderFields,
    })
  }

  const handleOnLogoutSuccess = () => {
    setStoredToken('')
    setUserData(undefined)
    setTimeout(() => {
      setFormData(formDataInitialState)
    }, 200)
  }

  const handleOnLoginSuccess = (
    userProfile: IUserProfile,
    accessToken: string
  ) => {
    console.log(
      '\x1b[34m%s\x1b[0m',
      'BillingInfo.tsx line:609 handleOnLoginSuccessful'
    )
    setStoredToken(accessToken)
    onLoginSuccess({
      accessToken: accessToken,
      userData: userProfile,
    })
    handleOnFetchUserDataSuccess(userProfile)
  }

  const handleOnLoginFail = (error: string) => {
    if (onLoginFail) {
      onLoginFail(error)
    }
  }

  const handleOnFetchUserDataFail = (error: string) => {
    if (onFetchUserProfileFail) {
      onFetchUserProfileFail(error)
    }
  }

  const handleOnSubmit = async () => {
    setIsSubmitLoading(true)
    console.log('UserData', userData)
    const checkoutBody: ICheckoutBody = getCheckoutBody(
      formData,
      userData,
      isAgeRequired
    )

    console.log('CheckoutBody', checkoutBody)
    if (userData && storedToken) {
      await performCheckout(checkoutBody)
    } else {
      await performNewUserRegister(checkoutBody)
    }
    setIsSubmitLoading(false)
  }
  //#endregion

  const isDataValid = (): boolean => {
    if (
      validateEmpty(firstName) ||
      validateEmpty(lastName) ||
      validateEmail(email, confirmEmail) ||
      validateEmail(confirmEmail, email) ||
      validateEmpty(street) ||
      validateEmpty(phone) ||
      validateEmpty(city) ||
      validateEmpty(zipCode)
    ) {
      return false
    }

    if (isAgeRequired && !birthday) {
      return false
    }

    const thValid = _map(
      ticketHoldersFields,
      (th) => validateEmpty(th.firstName) || validateEmpty(th.lastName)
    )

    return _every(thValid, (itm) => itm === '')
  }

  const handleOnRegisterFail = (rawError: any) => {
    if (onRegisterFail) {
      onRegisterFail(rawError)
    }
  }

  const performCheckout = async (
    checkoutBody: ICheckoutBody,
    pToken?: string
  ) => {
    console.log('performCheckout - with storedToken', storedToken)
    console.log('performCheckout - with pToken', pToken)
    const { error: checkoutError, data: checkoutData } = await checkoutOrder(
      checkoutBody,
      pToken || storedToken
    )

    console.log('performCheckout Error', checkoutError)
    console.log('performCheckout Data', checkoutData)

    if (checkoutError) {
      Alert.alert('', checkoutError)
      if (onCheckoutFail) {
        onCheckoutFail(checkoutError)
      }
      return
    }

    const data: IOnCheckoutSuccess = {
      id: checkoutData.data.data.attributes.id,
      hash: checkoutData.data.data.attributes.hash,
      total: checkoutData.data.data.attributes.total,
      status: checkoutData.data.data.attributes.status,
    }
    if (onCheckoutSuccess) {
      onCheckoutSuccess(data)
    }
  }

  const performNewUserRegister = async (checkoutBody: ICheckoutBody) => {
    console.log('performNewUserRegister', checkoutBody)
    const registerForm = getRegisterFormData(checkoutBody)
    console.log('registerForm', registerForm)
    const { data: registerResponseData, error: registerResponseError } =
      await registerNewUser(registerForm)

    if (registerResponseError) {
      if (registerResponseError.isAlreadyRegistered) {
        setLoginMessage(registerResponseError.message!)
        showLoginDialog()
        return handleOnRegisterFail(registerResponseError.raw)
      }
      handleOnRegisterFail(registerResponseError.raw)
      return Alert.alert('', registerResponseError.message)
    }

    if (!registerResponseData) {
      handleOnRegisterFail('Register returned no data')
      return Alert.alert('', 'Register returned no data')
    }

    const tokens = {
      accessToken: registerResponseData.access_token,
      refreshToken: registerResponseData.refresh_token,
    }

    setStoredToken(tokens.accessToken)

    if (onRegisterSuccess) {
      onRegisterSuccess(tokens)
    }

    console.log('Tokens', tokens)

    performCheckout(checkoutBody, tokens.accessToken)
  }

  const formFields = getFormFields()

  return (
    <BillingInfoView
      formFields={formFields}
      isLoading={isLoading}
      onSubmit={handleOnSubmit}
      onLoginSuccessful={handleOnLoginSuccess}
      isDataValid={isDataValid()}
      isLoginDialogVisible={isLoginDialogVisible}
      showLoginDialog={showLoginDialog}
      hideLoginDialog={hideLoginDialog}
      loginMessage={loginMessage}
      onLoginFail={handleOnLoginFail}
      userProfile={userData}
      isSubmitLoading={isSubmitLoading}
      onLogoutSuccess={handleOnLogoutSuccess}
      styles={styles}
      texts={texts}
    />
  )
}

export default BillingInfo
