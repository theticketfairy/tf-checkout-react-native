import _every from 'lodash/every'
import _find from 'lodash/find'
import _map from 'lodash/map'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Alert, Linking, Text, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import {
  fetchCart,
  fetchCountries,
  fetchStates,
  fetchUserProfile,
} from '../../api/ApiClient'
import Constants from '../../api/Constants'
import { Button, Checkbox, Dropdown, Input, Login } from '../../components'
import { IDropdownItem } from '../../components/dropdown/types'
import { getData, LocalStorageKeys } from '../../helpers/LocalStorage'
import { validateEmail, validateEmpty } from '../../helpers/Validators'
import { IUserProfile } from '../../types'
import { IBillingProps, ITicketHolderField } from './types'

const Billing = (props: IBillingProps) => {
  const { styles, texts } = props
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [loggedUserFirstName, setLoggedUserFirstName] = useState<string>('')
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

  const storedToken = useRef()

  const [isLoginDialogVisible, setIsLoginDialogVisible] = useState(false)

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

  // const isDataValid = (): boolean => {
  //   if (
  //     validateEmpty(firstName) ||
  //     validateEmpty(lastName) ||
  //     validateEmail(email, emailConfirmation) ||
  //     validateEmail(emailConfirmation, email) ||
  //     validateEmpty(street) ||
  //     validateEmpty(phone) ||
  //     validateEmpty(city) ||
  //     validateEmpty(postalCode) ||
  //     !isSubToMarketing
  //   ) {
  //     return false
  //   }

  //   console.log('isDataValid - userData', userData)
  //   console.log('isDataValid - formDAta', userData)
  //   if (firstName) {
  //     if (selectedState?.value === '-1') {
  //       return false
  //     }
  //   }

  //   if (isAgeRequired && !birthday) {
  //     return false
  //   }

  //   const thValid = _map(
  //     ticketHoldersData,
  //     (th) => validateEmpty(th.firstName) || validateEmpty(th.lastName)
  //   )

  //   return _every(thValid, (itm) => itm === '')
  // }

  const onSubmit = () => {}

  const fetchData = async () => {
    setIsLoading(true)
    let usrPrfl: IUserProfile | undefined
    const usrTkn = await getData(LocalStorageKeys.ACCESS_TOKEN)

    const { data: countriesData, error: countriesError } =
      await fetchCountries()

    if (countriesError) {
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

  useEffect(() => {
    fetchData()
  }, [])
  //#endregion

  const renderTicketHolders = () => {
    let tHolders = []
    for (let i = 0; i < numberOfTicketHolders; i++) {
      tHolders.push(
        <View key={`ticketHolder.${i}`}>
          <Text>Ticket holder {i + 1}</Text>
          <Input
            label='First name'
            value={ticketHoldersData[i].firstName}
            onChangeText={(text) => {
              const copyTicketHolders = [...ticketHoldersData]
              copyTicketHolders[i].firstName = text
              setTicketHoldersData(copyTicketHolders)
            }}
          />
          <Input
            label='Last name'
            value={ticketHoldersData[i].lastName}
            onChangeText={(text) => {
              const copyTicketHolders = [...ticketHoldersData]
              copyTicketHolders[i].lastName = text
              setTicketHoldersData(copyTicketHolders)
            }}
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
          />
        </View>
      )
    }

    return tHolders
  }

  return (
    <KeyboardAwareScrollView extraScrollHeight={32}>
      <View>
        <Text>Get Your Tickets</Text>
        <Login
          onLoginSuccessful={handleOnLoginSuccess}
          onLogoutSuccess={handleOnLogoutSuccess}
          isLoginDialogVisible={isLoginDialogVisible}
          showLoginDialog={showLoginDialog}
          hideLoginDialog={hideLoginDialog}
          userFirstName={loggedUserFirstName}
          onLoginFailure={handleOnLoginFail}
        />
        <Input
          label='First name'
          value={firstName}
          onChangeText={setFirstName}
        />
        <Input label='Last name' value={lastName} onChangeText={setLastName} />

        <Text>
          "IMPORTANT: Please double check that your email address is correct.
          It's where we send your confirmation and e-tickets to!"
        </Text>

        <Input
          label='Email'
          value={email}
          onChangeText={setEmail}
          keyboardType='email-address'
        />
        <Input
          label='Confirm Email'
          value={emailConfirmation}
          onChangeText={setEmailConfirmation}
          keyboardType='email-address'
        />
        {!loggedUserFirstName && (
          <>
            <Text>Choose a password for your new TICKETFAIRY account</Text>
            <Input label='Password' isSecure onChangeText={setPassword} />
            <Input
              label='Confirm Password'
              isSecure
              onChangeText={setPasswordConfirmation}
            />
          </>
        )}
        <Input
          label='Phone'
          value={phone}
          onChangeText={setPhone}
          keyboardType='phone-pad'
        />
        <Input
          label='Billing Street Address'
          value={street}
          onChangeText={setStreet}
        />
        <Input label='City' value={city} onChangeText={setCity} />
        <Dropdown
          items={countries}
          onSelectItem={setSelectedCountry}
          selectedOption={selectedCountry}
          styles={{
            container: {
              width: '100%',
            },
          }}
        />
        <Input
          label='Postal Code / Zip Code'
          value={postalCode}
          onChangeText={setPostalCode}
        />
        <Dropdown
          items={states}
          onSelectItem={setSelectedState}
          selectedOption={selectedState}
          styles={{
            container: {
              width: '100%',
            },
          }}
        />

        <Checkbox
          onPress={handleIsSubToNewsletterToggle}
          text={
            'I would like to be updated on House of X news, events and offers.'
          }
          isActive={isSubToNewsletter}
        />

        <Checkbox
          onPress={handleIsSubToMarketingToggle}
          isActive={isSubToMarketing}
          customTextComp={
            <Text>
              I agree that The Ticket Fairy may use the personal data that I
              have provided for marketing purposes, such as recommending events
              that I might be interested in, in accordance with its{' '}
              <Text onPress={handleOpenPrivacyLink}>Privacy Policy.</Text>
            </Text>
          }
        />

        {ticketHoldersData.length > 0 && (
          <>
            <Text>Ticket Holders</Text>
            {renderTicketHolders()}
          </>
        )}

        <Button
          onPress={onSubmit}
          text={'CHECKOUT'}
          // text={texts?.checkoutButton || 'CHECKOUT'}
          // isDisabled={!isDataValid}
          // isLoading={isSubmitLoading}
          // styles={
          //   !isDataValid
          //     ? styles?.checkoutButtonDisabled
          //     : {
          //         container: [
          //           s.submitButton,
          //           styles?.checkoutButton?.container,
          //         ],
          //         text: styles?.checkoutButton?.text,
          //         button: styles?.checkoutButton?.button,
          //       }
          // }
        />
      </View>
    </KeyboardAwareScrollView>
  )
}

export default Billing
