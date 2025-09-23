import {
  BillingDetails,
  initStripe,
  useConfirmPayment,
} from '@stripe/stripe-react-native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import BackgroundTimer from 'react-native-background-timer'

import { setAccessTokenHandler } from '../../api/ApiClient'
import { Config } from '../../helpers/Config'
import { LocalStorageKeys, storeData } from '../../helpers/LocalStorage'
import CartTimer from '../cartTimer/CartTimer'
import Login from '../login/Login'
import { ILoginSuccessData } from '../login/types'
import { useAddons, useCheckoutFlow, useEventConditions } from './api.hooks'
import { IOrderItem } from './components/OrderReview'
import { CheckoutForm, CheckoutFormValues } from './form'
import {
  ApiResponse,
  ICheckoutBody,
  OrderResult,
  RegisterUserResponse,
} from './types'
import { priceWithCurrency } from './utils'

export interface CheckoutV2Props {
  isSinglePageCheckout?: boolean
  isAgeRequired?: boolean
  minimumAge?: number
  onCartExpired?: () => void
  onLoginSuccess?: (data: any) => void
  onLogoutSuccess?: () => void
  onPaymentSuccess: (orderData: OrderResult) => void
  onCheckoutSuccess?: (data: any) => void
  loginBrandImages?: any
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  contentContainerStyle: {
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
})

const CheckoutControllerRaw: React.FC<CheckoutV2Props> = ({
  isSinglePageCheckout = false,
  isAgeRequired = false,
  minimumAge = 18,
  onLoginSuccess,
  onLogoutSuccess,
  onPaymentSuccess,
  onCheckoutSuccess,
  onCartExpired,
  loginBrandImages,
}) => {
  // Get checkout API hooks
  const {
    cartQuery,
    eventInfoQuery,
    // ticketsQuery,
    userProfileQuery,
    countriesQuery,
    checkoutMutation,
    updateCheckoutMutation,
    paymentDataMutation,
    paymentSuccessMutation,
    registerUserMutation,
    isInitialLoading,
    useStates,
    // useAddons,
    secondsLeft,
    setSecondsLeft,
    eventId,
  } = useCheckoutFlow()
  const scrollRef = useRef<ScrollView>(null)

  // Add state for order review items
  const [orderItems, setOrderItems] = useState<IOrderItem[]>([])

  // Update order items when cart data changes
  // Initialize cart timer when cart data is available
  useEffect(() => {
    if (cartQuery.data?.data?.attributes?.expiresAt) {
      const expiresAt = cartQuery.data.data.attributes.expiresAt
      setSecondsLeft(expiresAt)

      // Start background timer
      BackgroundTimer.runBackgroundTimer(() => {
        setSecondsLeft((prev: number | undefined) => {
          if (!prev || prev <= 1) {
            BackgroundTimer.stopBackgroundTimer()
            // Call the cart expired callback if provided
            onCartExpired?.()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      // Clean up timer when component unmounts
      return () => BackgroundTimer.stopBackgroundTimer()
    }
  }, [cartQuery.data, onCartExpired, setSecondsLeft])
  // Update order items when cart data changes
  useEffect(() => {
    if (cartQuery.data?.data?.attributes) {
      const cartData = cartQuery.data.data.attributes
      // Use type assertion to access currency property
      const currency = (cartData.cart?.[0] as any)?.currency || 'USD'
      // Get event name safely
      const eventName = eventInfoQuery.data?.data.attributes.name ?? 'Event'

      const items: IOrderItem[] = [
        {
          id: 'event',
          title: 'Event',
          value: eventName,
        },
        {
          id: 'tickets',
          title: 'Number of Tickets',
          value: (cartData.cart?.[0] as any)?.quantity?.toString() || '1',
        },
      ]

      // Add ticket price
      if ((cartData.cart?.[0] as any)?.price) {
        items.push({
          id: 'price',
          title: 'Ticket Price',
          value: priceWithCurrency((cartData.cart[0] as any).price, currency),
        })
      }

      // Add total
      const total = (cartData.cart?.[0] as any)?.price || 0
      items.push({
        id: 'total',
        title: 'Total',
        value: priceWithCurrency(total, currency),
      })

      setOrderItems(items)
    }
  }, [cartQuery.data, eventInfoQuery.data])

  // Add-ons state
  const [addons, setAddons] = useState<Record<string, number>>({})

  // Function to update order items from checkout data
  const updateOrderItemsFromCheckoutData = useCallback(
    (cartPriceBreakdown: any) => {
      if (!cartPriceBreakdown) return

      // Update order items with the latest pricing information
      const updatedOrderItems: IOrderItem[] = []
      const currency = cartPriceBreakdown.currency?.currency || 'USD'

      // Add ticket items
      if (cartPriceBreakdown.tickets_price_breakdown) {
        cartPriceBreakdown.tickets_price_breakdown.forEach((ticket: any) => {
          updatedOrderItems.push({
            id: ticket.ticket_type_id,
            title: ticket.ticket_type_name,
            subtitle: `${ticket.quantity} x ${priceWithCurrency(
              ticket.price_per_ticket,
              currency
            )}`,
            value: priceWithCurrency(ticket.total_price.toString(), currency),
          })
        })
      }

      // Add add-ons
      if (
        cartPriceBreakdown.total_add_ons > 0 &&
        cartPriceBreakdown.add_ons_price_breakdown &&
        Array.isArray(cartPriceBreakdown.add_ons_price_breakdown)
      ) {
        cartPriceBreakdown.add_ons_price_breakdown.forEach((addon: any) => {
          updatedOrderItems.push({
            id: `addon_${addon.add_on_name}`,
            title: `${addon.add_on_name} (Add-on)`,
            subtitle: `${addon.quantity} x ${priceWithCurrency(
              addon.price_per_add_on,
              currency
            )}`,
            value: priceWithCurrency(addon.total_price.toString(), currency),
          })
        })
      }

      // Add tax if available
      if (cartPriceBreakdown.goods_tax > 0) {
        updatedOrderItems.push({
          id: 'tax',
          title: cartPriceBreakdown.goods_tax_name || 'Tax',
          value: priceWithCurrency(
            cartPriceBreakdown.goods_tax.toString(),
            currency
          ),
        })
      }

      // Add total
      updatedOrderItems.push({
        id: 'total',
        title: 'Total',
        value: priceWithCurrency(cartPriceBreakdown.total.toString(), currency),
      })

      // Update the order items state
      setOrderItems(updatedOrderItems)
    },
    [setOrderItems]
  )

  // Function to update checkout with add-ons
  const updateCheckoutWithAddOns = useCallback(
    async (newAddons: { [key: string]: number } = {}) => {
      if (!eventId) {
        console.warn('Cannot update addons - no event ID')
        return
      }

      const mergedAddons = { ...addons, ...newAddons }
      console.log('Updating checkout with addons', {
        eventId,
        newAddons,
        mergedAddons,
      })

      // Remove zero quantities
      Object.entries(mergedAddons).forEach(([key, value]) => {
        if (!Number(value)) {
          delete mergedAddons[key]
        }
      })

      try {
        console.log('Updating checkout with addons', {
          event_id: eventId,
          add_ons: mergedAddons,
          is_from_resale: false,
        })
        // Call the API
        const response = await updateCheckoutMutation.mutateAsync({
          attributes: {
            event_id: eventId,
            add_ons: mergedAddons,
            is_from_resale: false,
          },
        })

        console.log('Update checkout response', JSON.stringify(response))

        if (response.data?.attributes) {
          const cartPriceBreakdown =
            response.data.attributes.cart_price_breakdown || {}

          setAddons(mergedAddons)
          updateOrderItemsFromCheckoutData(cartPriceBreakdown)
        }
      } catch (error) {
        console.error('Failed to update addons', { error, eventId })
      }
    },
    [eventId, addons, updateCheckoutMutation, updateOrderItemsFromCheckoutData]
  )

  // Function to handle addon changes from the form
  const handleAddonChange = useCallback(
    (addonId: string, quantity: number) => {
      console.log('Addon quantity changed', { addonId, quantity })
      const updatedAddons = { [addonId]: quantity }
      updateCheckoutWithAddOns(updatedAddons)
    },
    [updateCheckoutWithAddOns]
  )

  // Fetch addons and conditions for this event
  const addonsQuery = useAddons(eventId)
  const conditionsQuery = useEventConditions(eventId)
  console.log('conditionsQuery.data', conditionsQuery.data)
  // Component state
  const [selectedCountry, setSelectedCountry] = useState<string>('')

  // Get states for selected country
  const statesQuery = useStates(selectedCountry)

  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')
  const [isLoginDialogVisible, setIsLoginDialogVisible] = useState(false)
  const [loggedUserFirstName, setLoggedUserFirstName] = useState('')
  const [loginMessage, setLoginMessage] = useState('')

  const handleLoginSuccess = (data: ILoginSuccessData) => {
    if (data?.userProfile?.firstName) {
      setLoggedUserFirstName(data.userProfile.firstName)
    }
    if (onLoginSuccess) {
      onLoginSuccess(data)
    }
  }

  const handleLoginError = () => {
    // Handle login error if needed
  }

  const handleLogout = () => {
    setLoggedUserFirstName('')
    if (onLogoutSuccess) {
      onLogoutSuccess()
    }
  }

  // Prefill form with user profile data when available
  const getInitialValues = useCallback((): CheckoutFormValues => {
    const initialValues: CheckoutFormValues = {
      firstName: '',
      lastName: '',
      email: '',
      emailConfirmation: '',
      phone: '',
      dateOfBirth: undefined,
      street: '',
      city: '',
      postalCode: '',
      password: '',
      passwordConfirmation: '',
      isSubToTicketFairy: false,
      isSubToBrand: false,
      isCardFormComplete: false,
      country: '',
      state: '',
      addons: {},
      acceptedConditions: {},
    }

    if (userProfileQuery.data?.data) {
      const profile = userProfileQuery.data.data

      initialValues.firstName = profile.firstName || ''
      initialValues.lastName = profile.lastName || ''
      initialValues.email = profile.email || ''
      initialValues.emailConfirmation = profile.email || ''
      initialValues.phone = profile.phone || ''
      initialValues.street = profile.streetAddress || ''
      initialValues.city = profile.city || ''
      initialValues.postalCode = profile.zipCode || ''
      initialValues.country = profile.countryId || '-1'
      initialValues.state = profile.stateId || '-1'
    }

    return initialValues
  }, [userProfileQuery.data?.data])

  // Set country from user profile (separate from form initialization)
  useEffect(() => {
    if (userProfileQuery.data?.data) {
      const profile = userProfileQuery.data.data
      setLoggedUserFirstName(profile.firstName)

      // Set country from profile
      if (profile.countryId) {
        setSelectedCountry(profile.countryId.toString())
      }
    }
  }, [userProfileQuery.data])
  // Stripe payment handling
  const { confirmPayment } = useConfirmPayment()

  // Handle payment processing
  const handlePayment = useCallback(
    async (
      hash: string,
      total: string | number,
      values: CheckoutFormValues
    ) => {
      try {
        setStatus('loading')

        // Get payment data
        const paymentResponse = await paymentDataMutation.mutateAsync(
          String(hash)
        )
        const { order_details, payment_method } =
          paymentResponse.data.attributes
        console.log('Order details', order_details)
        console.log('Payment method', payment_method)
        // Check if this is a free ticket
        const isFreeTicket =
          Number(total) === 0 || Number(order_details.pay_now) === 0

        if (isFreeTicket) {
          // For free tickets, just confirm the order
          await paymentSuccessMutation.mutateAsync(String(hash))

          const result: OrderResult = {
            orderHash: String(hash),
            total: Number(total),
            currency: order_details.currency,
            email: values.email,
          }

          setStatus('success')
          onPaymentSuccess(result)
        } else {
          // For paid tickets, handle Stripe payment
          // Initialize Stripe with payment method details
          const stripeConfig = {
            publishableKey: payment_method.stripe_publishable_key!,
            ...(payment_method.stripe_connected_account &&
            payment_method.stripe_connected_account !== ''
              ? { stripeAccountId: payment_method.stripe_connected_account }
              : {}),
          }

          await initStripe(stripeConfig)

          // Create comprehensive billing details for payment
          const billingDetails: BillingDetails = {
            email: values.email,
            name: `${values.firstName} ${values.lastName}`,
            phone: values.phone || undefined,
            address: {
              city: values.city || undefined,
              country: values.country || undefined,
              line1: values.street || undefined,
              postalCode: values.postalCode || undefined,
              state: values.state || undefined,
            },
          }

          // Confirm payment with Stripe
          const { error: confirmError, paymentIntent } = await confirmPayment(
            payment_method.stripe_client_secret!,
            { paymentMethodType: 'Card', paymentMethodData: { billingDetails } }
          )

          if (confirmError || paymentIntent?.status !== 'Succeeded') {
            throw new Error(confirmError?.message || 'Payment failed')
          }

          // Notify backend of successful payment
          await paymentSuccessMutation.mutateAsync(String(hash))

          // Notify about successful payment
          const result: OrderResult = {
            orderHash: String(hash),
            total: Number(total),
            currency: order_details.currency,
            email: values.email,
            paymentIntentId: paymentIntent.id,
          }

          setStatus('success')
          onPaymentSuccess(result)
        }
      } catch (error) {
        console.error('Payment process failed:', error)
        setStatus('error')
      }
    },
    [
      paymentDataMutation,
      paymentSuccessMutation,
      onPaymentSuccess,
      confirmPayment,
    ]
  )

  // Helper function to create FormData for user registration
  const createRegistrationData = useCallback(
    (values: CheckoutFormValues): FormData => {
      const registerUserData = new FormData()

      // Basic user info
      registerUserData.append('email', values.email)
      registerUserData.append('first_name', values.firstName)
      registerUserData.append('last_name', values.lastName)
      registerUserData.append('password', values.password)
      registerUserData.append(
        'password_confirmation',
        values.passwordConfirmation
      )

      // Required credentials
      registerUserData.append('client_id', Config.CLIENT_ID)
      registerUserData.append('client_secret', Config.CLIENT_SECRET)
      registerUserData.append('check_cart_expiration', 'true')

      // Optional fields
      if (values.phone) registerUserData.append('phone', values.phone)
      if (values.city) registerUserData.append('city', values.city)
      if (values.street)
        registerUserData.append('street_address', values.street)
      if (values.postalCode) registerUserData.append('zip', values.postalCode)

      // Address fields
      if (values.country && values.country !== '-1') {
        registerUserData.append('country', values.country)
      }
      if (values.state && values.state !== '-1') {
        registerUserData.append('state', values.state)
      }

      // Age verification
      if (isAgeRequired && values.dateOfBirth) {
        addDateOfBirthToFormData(registerUserData, values.dateOfBirth)
      }

      return registerUserData
    },
    [isAgeRequired]
  )

  // Helper to add date of birth fields to form data
  const addDateOfBirthToFormData = (
    formData: FormData,
    dateOfBirth: Date
  ): void => {
    const dob = new Date(dateOfBirth)
    formData.append('dob_day', dob.getDate().toString())
    formData.append('dob_month', (dob.getMonth() + 1).toString())
    formData.append('dob_year', dob.getFullYear().toString())
  }

  // Helper function to handle registration error
  const handleRegistrationError = (registerError: any): boolean => {
    console.error(
      'User registration failed:',
      JSON.stringify(registerError?.response)
    )
    console.log('Error details:', {
      status: registerError?.response?.status,
      statusText: registerError?.response?.statusText,
      data: registerError?.response?.data,
    })

    // Check for already registered user (422 status)
    if (registerError?.response?.status === 422) {
      const errorData = registerError.response?.data

      // Check all possible email error structures
      const emailErrors =
        errorData?.errors?.email ||
        errorData?.data?.message?.email ||
        (errorData?.message?.email ? errorData.message.email : null)

      if (emailErrors) {
        // Show login dialog for already registered user
        const emailAlreadyRegisteredText =
          'It appears this email is already attached to an account. Please log in here to complete your registration.'

        let errorMessage: string
        if (Array.isArray(emailErrors)) {
          errorMessage = emailErrors[0]
        } else if (typeof emailErrors === 'string') {
          errorMessage = emailErrors
        } else {
          errorMessage = emailAlreadyRegisteredText
        }

        if (errorMessage === 'The email is already used') {
          errorMessage = emailAlreadyRegisteredText
        }

        // Show login dialog
        setLoginMessage(errorMessage)
        setIsLoginDialogVisible(true)
        setStatus('idle')
        return true // Registration handled, don't continue with checkout
      } else {
        // Other validation errors
        const errorMessages = Object.entries(errorData?.errors || {})
          .map(
            ([field, messages]) =>
              `${field}: ${
                Array.isArray(messages) ? messages.join(', ') : messages
              }`
          )
          .join('\n')
        throw new Error(`Validation errors: ${errorMessages}`)
      }
    }

    // Generic error
    throw new Error(registerError?.message || 'Registration failed')
  }

  // Helper to store authentication tokens
  const storeAuthTokens = async (
    result: ApiResponse<RegisterUserResponse>
  ): Promise<void> => {
    const accessToken = result.data.attributes.access_token
    const refreshToken = result.data.attributes.refresh_token
    const tokenType = result.data.attributes.token_type
    const scope = result.data.attributes.scope

    if (!accessToken) return

    await setAccessTokenHandler(accessToken)
    if (refreshToken)
      await storeData(LocalStorageKeys.REFRESH_TOKEN, refreshToken)
    if (tokenType) await storeData(LocalStorageKeys.TOKEN_TYPE, tokenType)
    if (scope) await storeData(LocalStorageKeys.AUTH_SCOPE, scope)
  }

  // Helper to extract user data from registration response
  const extractUserData = (result: ApiResponse<RegisterUserResponse>) => {
    const accessToken = result.data.attributes.access_token
    const refreshToken = result.data.attributes.refresh_token
    const tokenType = result.data.attributes.token_type
    const scope = result.data.attributes.scope
    const userProfile = result.data.attributes.user_profile

    if (!userProfile || !accessToken) {
      throw new Error('Registration did not return user data')
    }

    return {
      userProfile: {
        firstName: userProfile.first_name,
        lastName: userProfile.last_name,
        email: userProfile.email,
      },
      accessTokenData: {
        accessToken,
        refreshToken,
        tokenType,
        scope,
      },
    }
  }

  // Helper to handle user registration
  const registerUser = useCallback(
    async (values: CheckoutFormValues): Promise<boolean> => {
      if (!loggedUserFirstName && values.password) {
        console.log('Registering new user:', values.email)

        try {
          // Create and submit registration data
          const registerUserData = createRegistrationData(values)
          const result = await registerUserMutation.mutateAsync(
            registerUserData
          )
          console.log('User registration result:', JSON.stringify(result))

          // Store tokens and extract user data
          await storeAuthTokens(result)
          const userData = extractUserData(result)

          // Update UI and notify parent
          setLoggedUserFirstName(
            userData.userProfile.firstName || values.firstName
          )
          if (onLoginSuccess) {
            onLoginSuccess(userData)
          }

          return true // Registration successful
        } catch (registerError: any) {
          return !handleRegistrationError(registerError) // Return false if error was handled and we should stop
        }
      }
      return true // No registration needed
    },
    [
      loggedUserFirstName,
      createRegistrationData,
      registerUserMutation,
      onLoginSuccess,
    ]
  )

  // Helper to create checkout request body
  const createCheckoutBody = useCallback(
    (values: CheckoutFormValues): ICheckoutBody => {
      const ticketQuantity =
        (cartQuery.data?.data?.attributes?.cart?.[0] as any)?.quantity || 1

      // Create ticket holders array
      const ticketHolders = []
      for (let i = 0; i < ticketQuantity; i++) {
        const holder =
          i === 0
            ? {
                email: values.email,
                first_name: values.firstName,
                last_name: values.lastName,
                phone: values.phone || '',
              }
            : { email: '', first_name: '', last_name: '', phone: '' }

        ticketHolders.push(holder)
      }
      const body: ICheckoutBody = {
        attributes: {
          city: values.city,
          confirm_email: values.emailConfirmation,
          country:
            values.country && values.country !== '-1'
              ? parseInt(values.country, 10)
              : undefined,
          email: values.email,
          first_name: values.firstName,
          last_name: values.lastName,
          password: values.password || '',
          phone: values.phone || '',
          state:
            values.state && values.state !== '-1'
              ? parseInt(values.state, 10)
              : undefined,
          street_address: values.street,
          zip: values.postalCode,
          ticket_holders: ticketHolders,
          ttf_opt_in: values.isSubToTicketFairy,
          brand_opt_in: values.isSubToBrand,
          add_ons: values.addons,
        },
      }

      // Add date of birth if required
      if (isAgeRequired && values.dateOfBirth) {
        const dob = new Date(values.dateOfBirth)
        body.attributes.dob_day = dob.getDate()
        body.attributes.dob_month = dob.getMonth() + 1
        body.attributes.dob_year = dob.getFullYear()
      }

      return body
    },
    [cartQuery.data?.data?.attributes?.cart, isAgeRequired]
  )

  // Process checkout form submission
  const handleSubmit = useCallback(
    async (values: CheckoutFormValues) => {
      try {
        setStatus('loading')

        // Step 1: Register user if needed
        const shouldContinue = await registerUser(values)
        if (!shouldContinue) return

        // Step 2: Create and submit checkout
        const checkoutBody = createCheckoutBody(values)
        console.log('checkoutBody', JSON.stringify(checkoutBody))
        const checkoutResponse = await checkoutMutation.mutateAsync(
          checkoutBody
        )
        console.log('checkoutResponse', JSON.stringify(checkoutResponse))

        // Step 3: Extract checkout data
        const hash = checkoutResponse.data.attributes.hash
        const total = checkoutResponse.data.attributes.total

        // Step 4: Handle payment or checkout success based on flow type
        if (isSinglePageCheckout) {
          // Single-page: continue to payment
          await handlePayment(hash, total, values)
        } else {
          // Two-step: notify about checkout success
          setStatus('success')
          if (onCheckoutSuccess) {
            onCheckoutSuccess({
              hash,
              total,
              email: values.email,
            })
          }
        }
      } catch (error) {
        console.error('Checkout process failed:', error)
        setStatus('error')
      }
    },
    [
      registerUser,
      createCheckoutBody,
      checkoutMutation,
      isSinglePageCheckout,
      handlePayment,
      onCheckoutSuccess,
    ]
  )

  // Loading state
  if (isInitialLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size='large' color='#0000ff' />
        <Text>Loading checkout...</Text>
      </View>
    )
  }
  // Check if there's a valid cart
  if (
    !(
      cartQuery.data?.data?.attributes?.cart &&
      (cartQuery.data.data.attributes.cart[0] as any)?.quantity
    )
  ) {
    return (
      <View style={styles.container}>
        <Text>No items in cart. Please add tickets to your cart first.</Text>
      </View>
    )
  }

  // Render checkout form with our new component
  return (
    <>
      <ScrollView
        ref={scrollRef}
        style={styles.container}
        keyboardShouldPersistTaps='handled'
        contentContainerStyle={styles.contentContainerStyle}
      >
        {/* Login Component */}
        <Login
          onLoginSuccessful={handleLoginSuccess}
          onLoginError={handleLoginError}
          onLogoutSuccess={handleLogout}
          isLoginDialogVisible={isLoginDialogVisible}
          showLoginDialog={() => setIsLoginDialogVisible(true)}
          hideLoginDialog={() => {
            setIsLoginDialogVisible(false)
            setLoginMessage('') // Clear message when closing dialog
          }}
          userFirstName={loggedUserFirstName}
          brandImages={loginBrandImages}
          texts={{ dialog: { message: loginMessage } }} // Pass the error message to login dialog
        />

        <Text style={styles.title}>Personal Information</Text>

        {/* Use our new CheckoutForm component */}
        <CheckoutForm
          scrollRef={scrollRef}
          // Form values & state
          initialValues={getInitialValues()}
          isSubmitting={status === 'loading' || checkoutMutation.isPending}
          formStatus={status}
          eventCurrency={eventInfoQuery.data?.data.attributes.currency.currency}
          // User state
          isLoggedIn={!!loggedUserFirstName}
          // Validation props
          isAgeRequired={isAgeRequired}
          minimumAge={minimumAge}
          // Country & State data
          countries={countriesQuery.data?.data || []}
          states={statesQuery?.data?.data || []}
          onCountryChange={(countryId) => {
            setSelectedCountry(countryId)
          }}
          // Order data
          orderItems={orderItems}
          // Add-ons data
          availableAddons={addonsQuery.data?.data?.attributes?.add_ons || []}
          onAddonChange={handleAddonChange}
          // Conditions data
          conditions={conditionsQuery.data?.data?.attributes?.conditions || []}
          // Form handlers
          onSubmit={handleSubmit}
        />
      </ScrollView>

      {/* Cart Timer */}
      {typeof secondsLeft === 'number' && secondsLeft > 0 && (
        <CartTimer secondsLeft={secondsLeft} shouldNotMinimize={false} />
      )}
    </>
  )
}

export const CheckoutControllerWrapper = (props: CheckoutV2Props) => {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <CheckoutControllerRaw {...props} />
    </QueryClientProvider>
  )
}
