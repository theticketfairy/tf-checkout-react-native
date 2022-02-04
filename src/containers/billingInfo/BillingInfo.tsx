//@ts-nocheck

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
  cartProps: { isAgeRequired, isNameRequired },
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
  privacyPolicyLinkStyle,
  onFetchAccessTokenFailure,
  onFetchUserProfileFailure,
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
    setFormData({ ...formData, [id]: value })
  }

  const setDatePickerData = (date: Date) => {
    setFormData({ ...formData, birthday: date })
  }

  const setTicketHolderData = (index: number, id: string, value: string) => {
    const newData = { ...formData }
    const holder = newData.ticketHoldersFields[index]
    holder[`${id}`] = value
    setFormData(newData)
  }

  const setDropdownData = (id: string, value: IDropdownItem) => {
    setFormData({ ...formData, [id]: value })
  }

  const setCheckboxData = (id: string) => {
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
              title:
                texts?.passwordTitle ||
                'Choose a password for your new TICKETFAIRY account',
              titleStyle: styles?.passwordTitle,
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
                styles: styles?.inputStyles,
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
                styles: styles?.inputStyles,
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
          headerStyle: styles?.headers,
        },
      ]
      for (let i = 0; i < ticketHoldersFields.length; i++) {
        ticketHolder.push(
          {
            fieldType: 'title',
            title: `Ticket holder ${i + 1}`,
            titleStyle: styles?.titles,
          },
          {
            id: 'firstName',
            fieldType: 'input',
            inputProps: {
              value: ticketHoldersFields[i].firstName,
              onTextChanged: (key, value) => setTicketHolderData(i, key, value),
              label: 'First Name',
              styles: styles?.inputStyles,
            },
          },
          {
            id: 'lastName',
            fieldType: 'input',
            inputProps: {
              value: ticketHoldersFields[i].lastName,
              onTextChanged: (key, value) => setTicketHolderData(i, key, value),
              label: 'Last Name',
              styles: styles?.inputStyles,
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
              styles: styles?.inputStyles,
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
              styles: styles?.inputStyles,
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
        titleStyle: styles?.titles,
      },
      {
        fieldType: 'input',
        id: 'firstName',
        inputProps: {
          value: firstName,
          onTextChanged: setInputData,
          label: 'First Name',
          error: firstNameError,
          styles: styles?.inputStyles,
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
          styles: styles?.inputStyles,
        },
      },
      {
        fieldType: 'text',
        id: 'notice-email',
        title:
          "IMPORTANT: Please double check that your email address is correct. It's where we send your confirmation and e-tickets to!",
        textStyle: styles.texts,
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
          styles: styles?.inputStyles,
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
          styles: styles?.inputStyles,
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
          styles: styles?.inputStyles,
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
          styles: styles?.inputStyles,
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
          styles: styles?.inputStyles,
        },
      },
      {
        id: 'country',
        fieldType: 'dropdown',
        dropdownProps: {
          options: countries,
          selectedOption: country,
          onSelectOption: setDropdownData,
          style: styles?.dropdownStyles,
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
          styles: styles?.inputStyles,
        },
      },
      {
        id: 'state',
        fieldType: 'dropdown',
        dropdownProps: {
          options: states,
          selectedOption: formData.state,
          onSelectOption: setDropdownData,
          style: styles?.dropdownStyles,
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
          styles: styles?.checkboxStyles,
        },
      },
      {
        id: 'isSubToMarketing',
        fieldType: 'checkbox',
        checkboxProps: {
          text: 'I agree that The Ticket Fairy may use the personal data that I have provided for marketing purposes, such as recommending events that I might be interested in, in accordance with its Privacy Policy.',
          isActive: isSubToMarketing,
          onPress: setCheckboxData,
          styles: styles?.checkboxStyles,
          customTextComp: (
            <Text style={[s.customCheckboxText, styles?.customCheckbox?.text]}>
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
    if (countries.length === 0) {
      return
    }

    const countryId = userData?.country ? userData.country : countries[0].value
    const sCountryItem = _find(countries, (item) => item.value === countryId)

    if (sCountryItem) {
      setFormData({ ...formData, country: sCountryItem! })
    }
  }

  const setSelectedState = useCallback(() => {
    if (states.length === 0) {
      return
    }

    const foundId = userData?.stateId ? userData.stateId : states[0].value

    const sStateItem = _find(states, (item) => item.value === foundId)

    if (sStateItem) {
      setFormData({ ...formData, state: sStateItem! })
    } else {
      setFormData({ ...formData, state: states[0] })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [states, userData?.state])

  //#region API calls
  // If there is already an AccessToken stored we can directly request User Data
  const fetchUserDataAsync = async (accessToken?: string) => {
    if (!accessToken) {
      return
    }
    setIsLoading(true)
    const { userProfile: userProfileData, error: userDataError } =
      await fetchUserProfile(accessToken)
    setIsLoading(false)

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
    setIsLoading(true)
    const { data: cartData, error: cartError } = await fetchCart()
    setIsLoading(false)

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

    parsedStates.unshift({ label: 'State / County', value: '-1' })

    setStates(parsedStates)
  }
  //#endregion

  //#region UseEffects
  //Initial useEffect, to fetch Cart and Countries list.
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true)
      const tkn = await getData(LocalStorageKeys.ACCESS_TOKEN)
      setIsLoading(false)

      if (tkn) {
        setStoredToken(tkn)
      }
      await fetchCartAsync()
    }
    fetchInitialData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Fetch userData
  useEffect(() => {
    const fetchUserData = async () => {
      await fetchUserDataAsync(storedToken)
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

  //Once Countries is fulfilled, useEffect to set Country item.
  useEffect(() => {
    setSelectedCountry()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countries])

  // Fetch States list.
  useEffect(() => {
    if (country?.value) {
      fetchStatesAsync(country.value as string)
    }
  }, [country, userData])

  // Set State item.
  useEffect(() => {
    if (countries.length > 0 && states && states.length > 1) {
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
    if (onFetchUserProfileSuccess) {
      onFetchUserProfileSuccess(userProfile)
    }

    setUserData(userProfile)
    const newTicketHolderFields = [...ticketHoldersFields]
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
      isSubToMarketing: true,
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
    return Alert.alert('', error || 'Login failed')
  }

  const handleOnFetchAccessTokenFailure = (error: string) => {
    if (onFetchAccessTokenFailure) {
      onFetchAccessTokenFailure(error)
    }
    return Alert.alert('', error || 'Error fetching access token')
  }

  const handleOnFetchUserDataFail = (error: string) => {
    if (onFetchUserProfileFail) {
      onFetchUserProfileFail(error)
    }
    return Alert.alert('', error || 'Error fetching user data')
  }

  const handleOnSubmit = async () => {
    setIsSubmitLoading(true)
    const checkoutBody: ICheckoutBody = getCheckoutBody(
      formData,
      userData,
      isAgeRequired
    )

    if (userData && storedToken) {
      await performCheckout(checkoutBody)
    } else {
      await performNewUserRegister(checkoutBody)
    }
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
      validateEmpty(zipCode) ||
      !isSubToMarketing
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
    const { error: checkoutError, data: checkoutData } = await checkoutOrder(
      checkoutBody,
      pToken || storedToken
    )
    setIsSubmitLoading(false)

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
    const registerForm = getRegisterFormData(checkoutBody)
    const { data: registerResponseData, error: registerResponseError } =
      await registerNewUser(registerForm)
    setIsSubmitLoading(false)

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
      onFetchAccessTokenFailure={handleOnFetchAccessTokenFailure}
      onFetchUserProfileFailure={handleOnFetchUserDataFail}
    />
  )
}

export default BillingInfo
