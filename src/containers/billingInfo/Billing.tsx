import _every from 'lodash/every'
import _find from 'lodash/find'
import _forEach from 'lodash/forEach'
import _map from 'lodash/map'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Alert, Linking, Text, View } from 'react-native'
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
  validateEmail,
  validateEmpty,
  validatePasswords,
} from '../../helpers/Validators'
import { IUserProfile } from '../../types'
import s from './styles'
import {
  IBillingProps,
  IOnCheckoutSuccess,
  ITicketHolderField,
  ITicketHolderFieldError,
} from './types'

const Billing = (props: IBillingProps) => {
  const { styles, texts } = props
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
  const [isSubToMarketing, setIsSubToMarketing] = useState(false)
  const [isSubToNewsletter, setIsSubToNewsletter] = useState(false)
  const [phone, setPhone] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [countryId, setCountryId] = useState('')
  const [stateId, setStateId] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [selectedCountry, setSelectedCountry] = useState<
    IDropdownItem | undefined
  >(undefined)
  const [selectedState, setSelectedState] = useState<IDropdownItem | undefined>(
    undefined
  )
  const [ticketHoldersData, setTicketHoldersData] = useState<
    ITicketHolderField[]
  >([])

  const [numberOfTicketHolders, setNumberOfTicketHolders] = useState(1)

  const [countries, setCountries] = useState<IDropdownItem[]>([
    { value: '-1', label: 'Country' },
  ])
  const [states, setStates] = useState<IDropdownItem[]>([
    { value: '-1', label: 'State/County' },
  ])

  const [isLoginDialogVisible, setIsLoginDialogVisible] = useState(false)

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
  // End of errors state

  const storedToken = useRef('')

  const showLoginDialog = () => setIsLoginDialogVisible(true)
  const hideLoginDialog = () => setIsLoginDialogVisible(false)

  const handleIsSubToNewsletterToggle = () => {
    setIsSubToNewsletter(!isSubToNewsletter)
  }

  const handleIsSubToMarketingToggle = () => {
    setIsSubToMarketing(!isSubToMarketing)
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
    setFirstName(userProfile.firstName)
    setLastName(userProfile.lastName)
    setEmail(userProfile.email)
    setEmailConfirmation(userProfile.email)
    setPhone(userProfile.phone)
    setStreet(userProfile.streetAddress)
    setCity(userProfile.city)
    setPostalCode(userProfile.zipCode)
    setCountryId(userProfile.country)
    setStateId(userProfile.stateId)
    setLoggedUserFirstName(userProfile.firstName)
    setIsSubToMarketing(true)

    const thData = [...ticketHoldersData]
    thData.forEach((th) => {
      th.firstName = userProfile.firstName
      th.lastName = userProfile.lastName
      th.email = userProfile.email
      th.phone = userProfile.phone
    })
    setTicketHoldersData(thData)

    if (accessToken) {
      storedToken.current = accessToken
    }
  }

  const handleOnLoginSuccess = (
    userProfile: IUserProfile,
    accessToken: string
  ) => {
    if (props.onLoginSuccess) {
      props.onLoginSuccess({
        accessToken: accessToken,
        userData: userProfile,
      })
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
    setSelectedCountry({ value: '-1', label: 'Country' })
    setStates([{ value: '-1', label: 'State/County' }])
    setIsSubToMarketing(false)
    setIsSubToNewsletter(false)
    storedToken.current = undefined
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

  const checkBasicDataValid = (): boolean => {
    if (
      !firstName ||
      !lastName ||
      !email ||
      !emailConfirmation ||
      !street ||
      !phone ||
      !city ||
      !postalCode
    ) {
      return false
    }

    if (loggedUserFirstName) {
      if (selectedState?.value === '-1') {
        return false
      }
    }

    return true
  }

  const checkExtraDataValid = (): string => {
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
      return Alert.alert('', checkoutError)
    }

    const checkoutResponseData: IOnCheckoutSuccess = {
      id: checkoutData.data.data.attributes.id,
      hash: checkoutData.data.data.attributes.hash,
      total: checkoutData.data.data.attributes.total,
      status: checkoutData.data.data.attributes.status,
    }
    if (props.onCheckoutSuccess) {
      props.onCheckoutSuccess(checkoutResponseData)
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
    bodyFormData.append(
      'client_id',
      Config.CLIENT_ID || 'e9d8f8922797b4621e562255afe90dbf'
    )
    bodyFormData.append(
      'client_secret',
      Config.CLIENT_SECRET || 'b89c191eff22fdcf84ac9bfd88d005355a151ec2c83b26b9'
    )

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

  const onSubmit = async () => {
    const isExtraDataValid = checkExtraDataValid()
    if (isExtraDataValid) {
      return Alert.alert('', isExtraDataValid)
    }

    const parsedTicketHolders: ICheckoutTicketHolder[] = ticketHoldersData.map(
      (th) => {
        return {
          email: th.email,
          first_name: th.firstName,
          last_name: th.lastName,
          phone: th.phone,
        }
      }
    )

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
        ttf_opt_in: isSubToNewsletter,
        brand_opt_in: isSubToMarketing,
      },
    }

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
      handleSetFormDataFromUserProfile(userProfileResponse)
    } else {
      parsedCountries.unshift({ value: '-1', label: 'Country' })
      setSelectedCountry({ value: '-1', label: 'Country' })
    }

    const { data: cartData, error: cartError } = await fetchCart()

    if (cartError) {
      setIsLoading(false)
      Alert.alert('', cartError)
      if (props.onFetchCartError) {
        props.onFetchCartError(cartError)
      }
      return
    }

    let ticketQuantity = parseInt(cartData.quantity, 10)
    setNumberOfTicketHolders(ticketQuantity)

    const tHolders: ITicketHolderField[] = []
    for (let i = 0; i < ticketQuantity; i++) {
      tHolders.push({
        firstName: i === 0 && usrPrfl ? usrPrfl.firstName : '',
        lastName: i === 0 && usrPrfl ? usrPrfl.lastName : '',
        email: i === 0 && usrPrfl ? usrPrfl.email : '',
        phone: i === 0 && usrPrfl ? usrPrfl.phone : '',
      })
    }

    setCountries(parsedCountries)
    setTicketHoldersData(tHolders)
    setIsLoading(false)
  }

  //#region Use effects
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
        return setSelectedState({ value: '-1', label: 'State/County' })
      }
      setSelectedState(selectedStateItem)
    } else {
      setSelectedState({ value: '-1', label: 'State/County' })
    }
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
  }, [])
  //#endregion

  const renderTicketHolders = () => {
    let tHolders = []
    for (let i = 0; i < numberOfTicketHolders; i++) {
      tHolders.push(
        <View key={`ticketHolder.${i}`}>
          <Text style={styles?.titles}>Ticket holder {i + 1}</Text>
          <Input
            label='First name'
            value={ticketHoldersData[i].firstName}
            onChangeText={(text) => {
              const copyTicketHolders = [...ticketHoldersData]
              copyTicketHolders[i].firstName = text
              setTicketHoldersData(copyTicketHolders)
            }}
            styles={styles?.inputStyles}
          />
          <Input
            label='Last name'
            value={ticketHoldersData[i].lastName}
            onChangeText={(text) => {
              const copyTicketHolders = [...ticketHoldersData]
              copyTicketHolders[i].lastName = text
              setTicketHoldersData(copyTicketHolders)
            }}
            styles={styles?.inputStyles}
          />
          <Input
            label='Email Address (optional)'
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
            label='Phone (optional)'
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

  const isDataValid = checkBasicDataValid()

  return (
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
          message={loginMessage}
          styles={styles?.loginStyles}
        />
        <Text style={styles?.titles}>Get Your Tickets</Text>

        <Input
          label='First name'
          value={firstName}
          onChangeText={setFirstName}
          error={firstNameError}
          styles={styles?.inputStyles}
        />
        <Input
          label='Last name'
          value={lastName}
          onChangeText={setLastName}
          error={lastNameError}
          styles={styles?.inputStyles}
        />

        <Text style={styles?.texts}>
          IMPORTANT: Please double check that your email address is correct.
          It's where we send your confirmation and e-tickets to!
        </Text>

        <Input
          label='Email'
          value={email}
          onChangeText={setEmail}
          keyboardType='email-address'
          error={emailError}
          styles={styles?.inputStyles}
          autoCapitalize='none'
        />
        <Input
          label='Confirm Email'
          value={emailConfirmation}
          onChangeText={setEmailConfirmation}
          keyboardType='email-address'
          error={confirmEmailError}
          styles={styles?.inputStyles}
          autoCapitalize='none'
        />
        {!loggedUserFirstName && (
          <>
            <Text style={styles?.passwordTitle}>
              Choose a password for your new TICKETFAIRY account
            </Text>
            <Input
              label='Password'
              isSecure
              onChangeText={setPassword}
              error={passwordError}
              styles={styles?.inputStyles}
              autoCapitalize='none'
              secureTextEntry={true}
            />
            <Input
              label='Confirm Password'
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
          label='Phone'
          value={phone}
          onChangeText={setPhone}
          keyboardType='phone-pad'
          error={phoneError}
          styles={styles?.inputStyles}
        />
        <Input
          label='Billing Street Address'
          value={street}
          onChangeText={setStreet}
          error={streetError}
          styles={styles?.inputStyles}
        />
        <Input
          label='City'
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
          label='Postal Code / Zip Code'
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
          onPress={handleIsSubToNewsletterToggle}
          text={
            'I would like to be updated on House of X news, events and offers.'
          }
          isActive={isSubToNewsletter}
          styles={styles?.checkboxStyles}
        />

        <Checkbox
          onPress={handleIsSubToMarketingToggle}
          isActive={isSubToMarketing}
          customTextComp={
            <Text style={styles?.customCheckbox?.text}>
              I agree that The Ticket Fairy may use the personal data that I
              have provided for marketing purposes, such as recommending events
              that I might be interested in, in accordance with its{' '}
              <Text
                style={props.privacyPolicyLinkStyle}
                onPress={handleOpenPrivacyLink}
              >
                Privacy Policy.
              </Text>
            </Text>
          }
          styles={styles?.checkboxStyles}
        />

        {ticketHoldersData.length > 0 && (
          <>
            <Text style={styles?.headers}> Ticket Holders</Text>
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
}

export default Billing
