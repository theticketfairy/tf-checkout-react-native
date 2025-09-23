import type { BillingDetails } from '@stripe/stripe-react-native'
import { initStripe, useConfirmPayment } from '@stripe/stripe-react-native'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Alert } from 'react-native'
import BackgroundTimer from 'react-native-background-timer'

import {
  checkoutOrder,
  fetchCart,
  fetchCountries,
  fetchStates,
  fetchUserProfile,
  getAddons,
  getPaymentData,
  postOnPaymentSuccess,
  registerNewUser,
  updateCheckout,
} from '../../api/ApiClient'
import { ICheckoutBody } from '../../api/types'
import { orderReviewItems } from '../../containers/checkout/CheckoutData'
import { IOrderItem } from '../../containers/checkout/types'
import {
  getData,
  LocalStorageKeys,
  storeData,
} from '../../helpers/LocalStorage'
import { priceWithCurrency } from '../../helpers/StringsHelper'
import { Logger, LogLevel } from '../../utils/Logger'
import { IDropdownItem } from '../dropdown/types'
import { CheckoutFormValues } from './config'

type Status =
  | 'idle'
  | 'validating'
  | 'creating'
  | 'fetching'
  | 'confirming'
  | 'success'
  | 'failed'

interface UseCheckoutProps {
  onPaymentSuccess: (orderData?: {
    orderHash: string
    total: number
    currency?: string
    email?: string
  }) => void
  onLoginSuccess?: (data: any) => void
  onLogoutSuccess?: () => void
  onCartExpired?: () => void
  areAlertsEnabled?: boolean
  texts?: any
  userFirstName?: string
  logLevel?: LogLevel
}

export const useCheckout = ({
  onPaymentSuccess,
  onLoginSuccess,
  onLogoutSuccess,
  onCartExpired,
  areAlertsEnabled = true,
  texts,
  userFirstName = '',
  logLevel,
}: UseCheckoutProps) => {
  const logger = useMemo(
    () =>
      new Logger({
        level: logLevel ?? 'error',
        showTimestamp: true,
      }),
    [logLevel]
  )

  const { confirmPayment, loading: isConfirming } = useConfirmPayment()

  // Auth state
  const storedToken = useRef<string>('')
  const loggedUserFirstName = userFirstName
  const hasNotifiedLoginRef = useRef(false)

  // UI state
  const [status, setStatus] = useState<Status>('idle')
  const [result, setResult] = useState<any>(undefined)
  const [secondsLeft, setSecondsLeft] = useState<number | undefined>(undefined)
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  // Data state
  const [orderInfo, setOrderInfo] = useState<IOrderItem[]>(orderReviewItems)
  const [checkoutData, setCheckoutData] = useState<any>({})
  const [eventId, setEventId] = useState<number | null>(null)
  const [addons, setAddons] = useState<any>({})
  const [availableAddons, setAvailableAddons] = useState<any[]>([])
  const [countries, setCountries] = useState<IDropdownItem[]>([])
  const [states, setStates] = useState<IDropdownItem[]>([])
  const [userProfile, setUserProfile] = useState<any>(null)

  // Login dialog state
  const [isLoginDialogVisible, setIsLoginDialogVisible] = useState(false)
  const [loginMessage, setLoginMessage] = useState('')

  // Load states when country changes
  const loadStatesForCountry = useCallback(
    async (countryValue: string) => {
      if (!countryValue || countryValue === '-1') {
        logger.debug('Skipping states load - no country selected')
        return
      }

      logger.debug('Loading states for country', { countryValue })
      const { statesData, statesError } = await fetchStates(countryValue)
      if (statesError) {
        logger.error('Failed to fetch states', {
          countryValue,
          error: statesError.message,
        })
        return
      }
      const parsed: IDropdownItem[] = Array.isArray(statesData)
        ? statesData.map((name: string, idx: number) => ({
            label: name,
            value: idx,
          }))
        : Object.entries(statesData || {}).map(([id, name]: any) => ({
            label: String(name),
            value: parseInt(String(id), 10),
          }))
      setStates([
        { value: '-1', label: texts?.form?.state || 'State/County' },
        ...parsed,
      ])
      logger.debug('States loaded successfully', {
        countryValue,
        statesCount: parsed.length,
      })
    },
    [logger, texts?.form?.state]
  )

  // Update order info helper
  const updateOrderInfo = useCallback(
    (cartPriceBreakdown: any, cartData?: any) => {
      const currency = cartPriceBreakdown.currency?.code || 'USD'
      const tOrderInfo: IOrderItem[] = [
        {
          id: 'event',
          title: texts?.form?.orderReviewItems?.event || 'Event',
          value: cartPriceBreakdown.event_name || 'Event',
        },
        {
          id: 'numberOfTickets',
          title:
            texts?.form?.orderReviewItems?.numberOfTickets ||
            'Number of Tickets',
          value: cartData?.quantity?.toString() || '1',
        },
        {
          id: 'price',
          title: texts?.form?.orderReviewItems?.price || 'Ticket Price',
          value: priceWithCurrency(
            cartPriceBreakdown.tickets_price_breakdown?.[0]?.price || 0,
            currency
          ),
        },
      ]

      // Add add-ons price if available
      if (cartPriceBreakdown.total_add_ons > 0) {
        tOrderInfo.push({
          id: 'addOns',
          title: 'Add-ons',
          value: priceWithCurrency(
            cartPriceBreakdown.total_add_ons.toString(),
            currency
          ),
        })
      }

      // Add tax if available
      if (cartPriceBreakdown.goods_tax > 0) {
        tOrderInfo.push({
          id: 'tax',
          title: cartPriceBreakdown.goods_tax_name || 'Tax',
          value: priceWithCurrency(
            cartPriceBreakdown.goods_tax.toString(),
            currency
          ),
        })
      }

      // Add total
      tOrderInfo.push({
        id: 'total',
        title: texts?.form?.orderReviewItems?.total || 'Total',
        value: priceWithCurrency(cartPriceBreakdown.total.toString(), currency),
      })

      setOrderInfo(tOrderInfo)
      logger.debug('Order info updated', {
        itemCount: tOrderInfo.length,
        total: cartPriceBreakdown.total,
        currency: cartPriceBreakdown.currency?.code,
      })
    },
    [texts, logger]
  )

  // Add-ons handling
  const updateCheckoutWithAddOns = useCallback(
    async (newAddons: { [key: string]: number } = {}) => {
      if (!eventId) {
        logger.warn('Cannot update addons - no event ID')
        return
      }

      const mergedAddons = { ...addons, ...newAddons }
      logger.debug('Updating checkout with addons', {
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
        const { success, data: updateResponse } = await updateCheckout({
          attributes: {
            event_id: eventId,
            add_ons: mergedAddons,
          },
        })

        if (success && updateResponse?.data?.attributes) {
          const checkoutAttributes = updateResponse.data.attributes
          const cartPriceBreakdown =
            checkoutAttributes.cart_price_breakdown || {}

          setCheckoutData(cartPriceBreakdown)
          setAddons(mergedAddons)

          logger.info('Addons updated successfully', {
            total: cartPriceBreakdown.total,
            addonsTotal: cartPriceBreakdown.total_add_ons,
          })

          // Update order review
          updateOrderInfo(cartPriceBreakdown)

          // Store updated checkout data
          await storeData(
            'checkoutData',
            JSON.stringify({
              hash: '',
              total: cartPriceBreakdown.total || 0,
            })
          )
        }
      } catch (error) {
        logger.error('Failed to update addons', { error, eventId })
      }
    },
    [eventId, addons, updateOrderInfo, logger]
  )

  const handleAddonChange = useCallback(
    (addonId: string, quantity: number) => {
      logger.debug('Addon quantity changed', { addonId, quantity })
      const updatedAddons = { [addonId]: quantity }
      updateCheckoutWithAddOns(updatedAddons)
    },
    [updateCheckoutWithAddOns, logger]
  )

  // Build checkout payload
  const buildCheckoutBody = useCallback(
    (
      values: CheckoutFormValues,
      selectedCountry?: IDropdownItem,
      selectedState?: IDropdownItem
    ): ICheckoutBody => {
      const holder = {
        first_name: values.firstName,
        last_name: values.lastName,
        phone: values.phone || '',
        email: values.email,
      }
      const attrs: any = {
        email: values.email,
        confirm_email: values.emailConfirmation || values.email,
        first_name: values.firstName,
        last_name: values.lastName,
        phone: values.phone || undefined,
        street_address: values.street,
        city: values.city,
        zip: values.postalCode,
        country:
          selectedCountry?.value && selectedCountry.value !== '-1'
            ? parseInt(String(selectedCountry.value), 10)
            : undefined,
        state:
          selectedState?.value && selectedState.value !== '-1'
            ? parseInt(String(selectedState.value), 10)
            : undefined,
        ticket_holders: [holder],
        ttf_opt_in: values.isSubToTicketFairy,
        brand_opt_in: values.isSubToBrand,
      }
      if (values.dateOfBirth) {
        attrs.dob_day = values.dateOfBirth.getDate()
        attrs.dob_month = values.dateOfBirth.getMonth() + 1
        attrs.dob_year = values.dateOfBirth.getFullYear()
      }
      Object.keys(attrs).forEach(
        (k) => attrs[k] === undefined && delete attrs[k]
      )
      return { attributes: attrs }
    },
    []
  )

  // Login handlers
  const handleOnLoginSuccess = async ({
    userProfile,
    accessTokenData,
  }: any) => {
    storedToken.current = accessTokenData?.accessToken || ''
    hasNotifiedLoginRef.current = true
    setUserProfile(userProfile) // Store user profile for form autofill

    logger.info('User login successful', {
      userId: userProfile?.id,
      email: userProfile?.email,
      hasToken: !!accessTokenData?.accessToken,
    })

    onLoginSuccess?.({ userProfile, accessTokenData })
    return userProfile // Return for form prefilling
  }

  const handleOnLoginError = (e: any) => {
    logger.error('User login failed', { error: e?.message })
    setLoginMessage(e?.message || 'Login failed')
    setIsLoginDialogVisible(true)
  }

  const handleLogout = () => {
    logger.info('User logout initiated')
    storedToken.current = ''
    hasNotifiedLoginRef.current = false
    setUserProfile(null) // Clear user profile on logout
    onLogoutSuccess?.()
  }

  // Helper functions
  const showAlert = useCallback(
    (msg: string) => areAlertsEnabled && Alert.alert('', msg),
    [areAlertsEnabled]
  )

  // Load initial data with proper sequence
  useEffect(() => {
    let mounted = true

    const loadInitialData = async () => {
      try {
        logger.info('Starting initial data load')
        setIsInitialLoading(true)

        // Step 1: Check for existing access token and load user profile
        const usrTkn = await getData(LocalStorageKeys.ACCESS_TOKEN)
        let userProfileData = null

        if (usrTkn && mounted) {
          storedToken.current = usrTkn
          logger.debug('Found stored access token, fetching user profile')

          // Fetch user profile
          const { userProfileData: profileData, userProfileError } =
            await fetchUserProfile()
          if (profileData && !userProfileError && mounted) {
            userProfileData = profileData
            setUserProfile(profileData)

            logger.info('User profile loaded from stored token', {
              userId: profileData?.id,
              email: profileData?.email,
            })

            // Notify parent component of existing login (only once)
            if (!hasNotifiedLoginRef.current) {
              hasNotifiedLoginRef.current = true
              onLoginSuccess?.({
                userProfile: profileData,
                accessTokenData: { accessToken: usrTkn, refreshToken: '' },
              })
            }
          } else if (userProfileError) {
            logger.warn('Failed to load user profile with stored token', {
              error: userProfileError.message,
            })
          }
        }

        // Step 2: Load countries
        logger.debug('Loading countries data')
        const { countriesData, countriesError } = await fetchCountries()
        if (!mounted) return
        if (countriesError) {
          logger.error('Failed to load countries', {
            error: countriesError.message,
          })
          setIsInitialLoading(false)
          return
        }

        const parsedCountries: IDropdownItem[] = (countriesData || []).map(
          (c: any) => ({
            label: c.name,
            value: c.id,
            code: c.code,
          })
        )
        setCountries([
          { value: '-1', label: texts?.form?.country || 'Country' },
          ...parsedCountries,
        ])
        logger.debug('Countries loaded successfully', {
          count: parsedCountries.length,
        })

        // Step 3: If user has a country, load states for that country
        if (userProfileData?.countryId && mounted) {
          await loadStatesForCountry(String(userProfileData.countryId))
        }

        // Step 4: Load cart data for timer and get event ID
        logger.debug('Loading cart data')
        const { cartData, eventId: cartEventId } = await fetchCart()

        if (cartData?.expiresAt && mounted) {
          setSecondsLeft(cartData.expiresAt)
          logger.info('Cart timer started', {
            expiresInSeconds: cartData.expiresAt,
            eventId: cartEventId,
          })
          // Start countdown timer
          BackgroundTimer.runBackgroundTimer(() => {
            setSecondsLeft((prev) => {
              if (!prev || prev <= 1) {
                BackgroundTimer.stopBackgroundTimer()
                logger.warn('Cart expired - timer reached zero')
                onCartExpired?.()
                return 0
              }
              return prev - 1
            })
          }, 1000)
        }

        // Step 5: Store and use event ID from cart response
        if (cartEventId && mounted) {
          await storeData('eventId', cartEventId.toString())
          setEventId(parseInt(cartEventId, 10))
          logger.debug('Event ID set', { eventId: cartEventId })

          // Fetch add-ons for this event
          try {
            logger.debug('Loading addons for event', { eventId: cartEventId })
            const { data: addonsData, success } = await getAddons(cartEventId)
            if (mounted && success) {
              const addonsArray = addonsData?.add_ons || []
              setAvailableAddons(addonsArray)
              logger.debug('Addons loaded successfully', {
                count: addonsArray.length,
              })
            }
          } catch (error) {
            logger.error('Failed to fetch addons', {
              error,
              eventId: cartEventId,
            })
          }

          // Initialize checkout with event_id and get pricing data
          try {
            logger.debug('Initializing checkout with event ID')
            const { success, data: updateCheckoutData } = await updateCheckout({
              attributes: {
                event_id: parseInt(cartEventId, 10),
                add_ons: {},
              },
            })

            if (success && updateCheckoutData?.data?.attributes && mounted) {
              const checkoutAttributes = updateCheckoutData.data.attributes
              const cartPriceBreakdown =
                checkoutAttributes.cart_price_breakdown || {}

              setCheckoutData(cartPriceBreakdown)
              logger.info('Checkout initialized successfully', {
                total: cartPriceBreakdown.total,
                currency: cartPriceBreakdown.currency?.code,
              })

              // Store checkout data
              await storeData(
                'checkoutData',
                JSON.stringify({
                  hash: '',
                  total: cartPriceBreakdown.total || 0,
                })
              )

              // Update order review with rich cart price breakdown data
              updateOrderInfo(cartPriceBreakdown, cartData)
            }
          } catch (error) {
            logger.error('Failed to initialize checkout', {
              error,
              eventId: cartEventId,
            })
          }
        }

        // Step 6: Mark loading as complete
        if (mounted) {
          setIsInitialLoading(false)
          logger.info('Initial data load completed successfully')
        }
      } catch (error) {
        logger.error('Failed to load initial data', { error })
        if (mounted) {
          setIsInitialLoading(false)
        }
      }
    }

    loadInitialData()

    return () => {
      mounted = false
    }
  }, [
    onCartExpired,
    onLoginSuccess,
    texts,
    updateOrderInfo,
    loadStatesForCountry,
    logger,
  ])

  // Main submit handler
  const handleSubmit = useCallback(
    async (
      values: CheckoutFormValues,
      selectedCountry?: IDropdownItem,
      selectedState?: IDropdownItem
    ) => {
      logger.info('Checkout submission started', {
        email: values.email,
        hasCountry: !!selectedCountry?.value,
        hasState: !!selectedState?.value,
        isLoggedIn: !!loggedUserFirstName || !!storedToken.current,
      })

      setStatus('validating')

      try {
        // If not logged in, register user
        if (!loggedUserFirstName && !storedToken.current) {
          logger.info('Registering new user', { email: values.email })
          const registerUserBody = {
            email: values.email,
            first_name: values.firstName,
            last_name: values.lastName,
            password: values.password,
            password_confirmation: values.passwordConfirmation,
            phone: values.phone,
            city: values.city,
            street_address: values.street,
            zip: values.postalCode,
            country:
              selectedCountry?.value && selectedCountry.value !== '-1'
                ? parseInt(String(selectedCountry.value), 10)
                : undefined,
            state:
              selectedState?.value && selectedState.value !== '-1'
                ? parseInt(String(selectedState.value), 10)
                : undefined,
          }

          const registerForm = new FormData()
          Object.entries(registerUserBody).forEach(([key, value]) => {
            if (value !== undefined) {
              registerForm.append(key, String(value))
            }
          })

          const { registerNewUserResponseData, registerNewUserResponseError } =
            (await registerNewUser?.(registerForm)) || {}

          if (registerNewUserResponseError) {
            logger.error('User registration failed', {
              error: registerNewUserResponseError.message,
              email: values.email,
            })
            throw new Error(
              registerNewUserResponseError.message || 'Registration failed'
            )
          }

          if (!registerNewUserResponseData?.accessTokenData?.accessToken) {
            logger.error('Registration succeeded but no access token returned')
            throw new Error('Registration did not return access token')
          }

          storedToken.current =
            registerNewUserResponseData.accessTokenData.accessToken
          logger.info('User registration successful', { email: values.email })
        }

        // Create order
        setStatus('creating')
        logger.info('Creating order', {
          email: values.email,
          addonsCount: Object.keys(addons).length,
        })
        const checkoutBody = buildCheckoutBody(
          values,
          selectedCountry,
          selectedState
        )
        ;(checkoutBody.attributes as any).add_ons = addons

        const { error: createErr, data: created } = await checkoutOrder(
          checkoutBody
        )

        if (createErr || !created) {
          logger.error('Order creation failed', {
            error: createErr?.message,
            email: values.email,
          })
          throw new Error(createErr?.message || 'Checkout failed')
        }

        logger.info('Order created successfully', {
          orderHash: created.hash,
          total: created.total,
        })

        const hash = created.hash
        const total = created.total

        await storeData('checkoutData', JSON.stringify({ hash, total }))

        // Update checkout with add-ons
        const { success: updateSuccess, data: updateCheckoutResponse } =
          await updateCheckout({
            attributes: {
              event_id: eventId,
              add_ons: addons,
            },
          })

        if (updateSuccess && updateCheckoutResponse?.data?.attributes) {
          setCheckoutData(updateCheckoutResponse.data.attributes)
        }

        // Get payment data
        setStatus('fetching')
        logger.info('Fetching payment data', { orderHash: hash })
        const { success: paymentSuccess, data: paymentDataResponse } =
          await getPaymentData(String(hash))
        console.log('paymentDataResponse', paymentDataResponse)
        if (!paymentSuccess || !paymentDataResponse) {
          logger.error('Failed to fetch payment data', { orderHash: hash })
          throw new Error('Unable to fetch payment data')
        }

        logger.debug('Payment data retrieved successfully', { orderHash: hash })

        const { attributes } = paymentDataResponse.data
        const { order_details, cart } = attributes
        logger.debug('Order details processed', {
          orderId: order_details?.id,
          total: order_details?.total,
          payNow: order_details?.pay_now,
        })
        const {
          tickets: [ticket],
        } = order_details

        // Update order data
        const updatedOrderData = {
          add_ons: order_details.add_ons || [],
          total: order_details.total,
          subtotal: order_details.subtotal,
          fees: order_details.fees,
          pay_now: order_details.pay_now || '',
          id: order_details?.id,
          product_name: cart[0]?.product_name,
          ticketType: ticket?.name,
          quantity: ticket?.quantity,
          price: ticket?.price,
          currency: order_details?.currency,
          guest_count: order_details?.guest_count || '',
          debt: order_details?.debt || null,
          cost: ticket?.cost,
        }

        const isFreeTickets =
          (!Number(total) && !Number(updatedOrderData.total)) ||
          !Number(updatedOrderData?.pay_now || 0)

        if (isFreeTickets) {
          // Free registration path
          logger.info('Processing free ticket registration', {
            orderHash: hash,
            total: updatedOrderData.total,
          })
          await postOnPaymentSuccess(hash)
          setResult({
            orderHash: hash,
            total: updatedOrderData.total,
            currency: updatedOrderData.currency,
            email: values.email,
          })
          setStatus('success')
          // Call onPaymentSuccess with order data for consistent flow
          onPaymentSuccess({
            orderHash: hash,
            total: updatedOrderData.total,
            currency: updatedOrderData.currency,
            email: values.email,
          })
          return
        }

        logger.info('Processing paid ticket order', {
          orderHash: hash,
          total: updatedOrderData.total,
          payNow: updatedOrderData.pay_now,
        })
        const paymentMethod = attributes.payment_method || {}
        logger.debug('Payment method configuration', {
          hasClientSecret: !!paymentMethod.stripe_client_secret,
          hasPublishableKey: !!paymentMethod.stripe_publishable_key,
          hasConnectedAccount: !!paymentMethod.stripe_connected_account,
          connectedAccount: paymentMethod.stripe_connected_account,
        })

        if (!paymentMethod.stripe_client_secret) {
          logger.error('Stripe configuration missing', {
            orderHash: hash,
            hasPublishableKey: !!paymentMethod.stripe_publishable_key,
          })
          throw new Error('Stripe is not configured')
        }

        // Initialize Stripe - handle empty connected account
        const stripeConfig = {
          publishableKey: paymentMethod.stripe_publishable_key,
          ...(paymentMethod.stripe_connected_account &&
          paymentMethod.stripe_connected_account !== ''
            ? { stripeAccountId: paymentMethod.stripe_connected_account }
            : {}),
        }
        logger.debug('Initializing Stripe', {
          hasPublishableKey: !!stripeConfig.publishableKey,
          hasStripeAccountId: !!stripeConfig.stripeAccountId,
        })
        await initStripe(stripeConfig)

        // Stripe confirmPayment
        setStatus('confirming')
        logger.info('Starting payment confirmation', {
          orderHash: hash,
          email: values.email,
        })
        const billingDetails: BillingDetails = {
          email: values.email,
          phone: values.phone,
          name: `${values.firstName} ${values.lastName}`,
          address: {
            city: values.city,
            country: (selectedCountry as any)?.code,
            line1: values.street,
            postalCode: values.postalCode,
            state: selectedState?.label,
          },
        }

        logger.debug('Payment confirmation details', {
          hasClientSecret: !!paymentMethod.stripe_client_secret,
          billingEmail: billingDetails.email,
          billingCountry: billingDetails.address?.country,
        })

        const { error: confirmErr, paymentIntent } = await confirmPayment(
          paymentMethod.stripe_client_secret!,
          { paymentMethodType: 'Card', paymentMethodData: { billingDetails } }
        )

        if (confirmErr || paymentIntent?.status !== 'Succeeded') {
          logger.error('Payment confirmation failed', {
            error: confirmErr?.message,
            paymentIntentStatus: paymentIntent?.status,
            orderHash: hash,
          })
          throw new Error(confirmErr?.message || 'Payment failed')
        }

        logger.info('Payment confirmed successfully', {
          paymentIntentId: paymentIntent?.id,
          orderHash: hash,
        })

        // Notify backend & success
        logger.debug('Notifying backend of payment success')
        await postOnPaymentSuccess(hash)

        setResult({
          orderHash: hash,
          total: updatedOrderData.total,
          currency: updatedOrderData.currency,
          email: values.email,
        })
        setStatus('success')
        // Call onPaymentSuccess with order data - parent will handle navigation to PurchaseConfirmation
        logger.info('Payment process completed successfully', {
          orderHash: hash,
          total: updatedOrderData.total,
          currency: updatedOrderData.currency,
          email: values.email,
        })
        onPaymentSuccess({
          orderHash: hash,
          total: updatedOrderData.total,
          currency: updatedOrderData.currency,
          email: values.email,
        })
      } catch (e: any) {
        logger.error('Checkout process failed', {
          error: e?.message,
          status,
          email: values.email,
        })
        setStatus('failed')
        showAlert(e?.message || 'Checkout failed')
      }
    },
    [
      logger,
      loggedUserFirstName,
      addons,
      buildCheckoutBody,
      eventId,
      confirmPayment,
      onPaymentSuccess,
      status,
      showAlert,
    ]
  )

  const disabled =
    status === 'validating' ||
    status === 'creating' ||
    status === 'fetching' ||
    status === 'confirming' ||
    isConfirming

  return {
    // State
    status,
    result,
    secondsLeft,
    orderInfo,
    checkoutData,
    availableAddons,
    countries,
    states,
    addons,
    disabled,
    loggedUserFirstName,
    isLoginDialogVisible,
    loginMessage,
    userProfile,
    isInitialLoading,

    // Actions
    handleSubmit,
    handleAddonChange,
    loadStatesForCountry,
    handleOnLoginSuccess,
    handleOnLoginError,
    handleLogout,
    setIsLoginDialogVisible,
    setLoginMessage,
  }
}
