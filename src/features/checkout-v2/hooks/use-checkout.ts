/*
 * COMPOSITE HOOK FOR CHECKOUT FLOW
 *
 * This hook is used to initialize the checkout flow
 * and provide all the necessary data and functions
 * to the checkout component.
 *
 */

import {
  BillingDetails,
  initStripe,
  useConfirmPayment,
} from '@stripe/stripe-react-native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import BackgroundTimer from 'react-native-background-timer'

import { CustomerProfileResponse } from '../../../features/auth/types'
import { useCountries, useStates } from '../../../features/geo/api-hooks'
import { logError } from '../../../utils/handlers'
// import { useEventCustomFields } from '../../event/api-hooks'
import { CheckoutFormProps, CheckoutFormValues } from '../form/types'
import { IOrderItem, OrderResult } from '../types'
import { createCheckoutBody, priceWithCurrency } from '../utils'
import {
  useAddons,
  useCart,
  useCheckout,
  useEventConditions,
  useEventInfo,
  usePaymentData,
  usePaymentSuccess,
  useTickets,
  useUpdateCheckout,
} from './api-hooks'

export interface UseCheckoutFlowProps {
  onCartExpired?: () => void
  isSinglePageCheckout?: boolean
  isAgeRequired?: boolean
  isPhoneRequired?: boolean
  isPhoneHidden?: boolean
  minimumAge?: number
  customerProfile?: CustomerProfileResponse
  onCheckoutSuccess?: (data: CheckoutData) => void
  onCheckoutError?: (error: any) => void
  onPaymentSuccess?: (data: OrderResult) => void
  onPaymentError?: (error: any) => void
  //   Return true if the form should be submitted
  onBeforeSubmit?: (values: CheckoutFormValues) => boolean | Promise<boolean>
}

export interface UseCheckoutFlowReturn
  extends Omit<CheckoutFormProps, 'scrollRef'> {
  secondsLeft: number | undefined
  eventId: string | undefined
  isInitialLoading: boolean
  isSubmitting: boolean
  isLoggedIn: boolean
  setSecondsLeft: React.Dispatch<React.SetStateAction<number | undefined>>
  setSelectedCountry: React.Dispatch<React.SetStateAction<string>>
  handlePayment: (input: CheckoutData) => Promise<void>
}

export interface CheckoutData {
  hash: string
  total: string | number
  values: CheckoutFormValues
}

export const useCheckoutFlow = ({
  onCartExpired,
  onCheckoutSuccess,
  onCheckoutError,
  onPaymentSuccess,
  onPaymentError,
  isAgeRequired,
  isPhoneRequired,
  isPhoneHidden,
  minimumAge,
  onBeforeSubmit = () => true,
  isSinglePageCheckout,
  customerProfile,
}: UseCheckoutFlowProps): UseCheckoutFlowReturn => {
  const cartQuery = useCart()
  const eventId = cartQuery.data?.data?.attributes?.eventId

  const [orderItems, setOrderItems] = useState<IOrderItem[]>([])
  const [secondsLeft, setSecondsLeft] = useState<number | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [selectedCountry, setSelectedCountry] = useState<string>('')
  const [addons, setAddons] = useState<Record<string, number>>({})

  const ticketsQuery = useTickets(eventId)
  const eventInfoQuery = useEventInfo(eventId)

  const countriesQuery = useCountries()

  const checkoutMutation = useCheckout()
  const paymentDataMutation = usePaymentData()
  const updateCheckoutMutation = useUpdateCheckout()
  const paymentSuccessMutation = usePaymentSuccess()
  // const customFieldsQuery = useEventCustomFields(eventId)

  const addonsQuery = useAddons(eventId)
  const statesQuery = useStates(selectedCountry)
  const conditionsQuery = useEventConditions(eventId)

  const { confirmPayment } = useConfirmPayment()

  const isInitialLoading = useMemo(() => {
    if (cartQuery.isPending) return true
    if (eventInfoQuery.isPending) return true
    if (ticketsQuery.isPending) return true
    if (countriesQuery.isPending) return true

    return false
  }, [
    cartQuery.isPending,
    eventInfoQuery.isPending,
    ticketsQuery.isPending,
    countriesQuery.isPending,
  ])

  // Prefill form with user profile data when available
  const initialValues = useMemo(() => {
    // Get ticket quantity from cart
    const ticketQuantity =
      (cartQuery.data?.data?.attributes?.cart?.[0] as any)?.quantity || 1

    // Create empty ticket holders array based on ticket quantity
    const ticketHolders = Array(ticketQuantity)
      .fill(null)
      .map(() => ({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
      }))

    const base: CheckoutFormValues = {
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
      ticketHolders,
    }

    if (customerProfile) {
      const profile = customerProfile

      // Fill main user info
      base.firstName = profile.firstName || ''
      base.lastName = profile.lastName || ''
      base.email = profile.email || ''
      base.emailConfirmation = profile.email || ''
      base.phone = profile.phone || ''
      base.street = profile.streetAddress || ''
      base.city = profile.city || ''
      base.postalCode = profile.zipCode || ''
      base.country = profile.countryId || '-1'
      base.state = profile.stateId || '-1'

      // Fill first ticket holder info from the user's profile data
      if (base.ticketHolders.length > 0) {
        base.ticketHolders[0] = {
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          email: profile.email || '',
          phone: profile.phone || '',
        }
      }
    }

    return base
  }, [cartQuery.data?.data?.attributes?.cart, customerProfile])

  const countries = useMemo(() => {
    return countriesQuery.data?.data || []
  }, [countriesQuery.data?.data])

  const states = useMemo(() => {
    return statesQuery?.data?.data || []
  }, [statesQuery?.data?.data])

  const availableAddons = useMemo(() => {
    return addonsQuery.data?.data?.attributes?.add_ons || []
  }, [addonsQuery.data?.data?.attributes?.add_ons])

  const conditions = useMemo(() => {
    return conditionsQuery.data?.data?.attributes?.conditions || []
  }, [conditionsQuery.data?.data?.attributes?.conditions])

  const eventCurrency = useMemo(() => {
    return eventInfoQuery.data?.data.attributes.currency.currency
  }, [eventInfoQuery.data?.data.attributes.currency.currency])

  const isLoggedIn = useMemo(() => {
    return !!customerProfile
  }, [customerProfile])

  // Handle payment processing
  const handlePayment = useCallback(
    async (input: CheckoutData) => {
      try {
        setIsSubmitting(true)

        // Get payment data
        const paymentResponse = await paymentDataMutation.mutateAsync(
          String(input.hash)
        )
        const { order_details, payment_method } =
          paymentResponse.data.attributes
        // Check if this is a free ticket
        const isFreeTicket =
          Number(input.total) === 0 || Number(order_details.pay_now) === 0

        if (isFreeTicket) {
          // For free tickets, just confirm the order
          await paymentSuccessMutation.mutateAsync(String(input.hash))

          const result: OrderResult = {
            orderHash: String(input.hash),
            total: Number(input.total),
            currency: order_details.currency,
            email: input.values.email,
          }

          onPaymentSuccess?.(result)
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
            email: input.values.email,
            name: `${input.values.firstName} ${input.values.lastName}`,
            phone: input.values.phone || undefined,
            address: {
              city: input.values.city || undefined,
              country: input.values.country || undefined,
              line1: input.values.street || undefined,
              postalCode: input.values.postalCode || undefined,
              state: input.values.state || undefined,
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
          await paymentSuccessMutation.mutateAsync(String(input.hash))

          // Notify about successful payment
          const result: OrderResult = {
            orderHash: String(input.hash),
            total: Number(input.total),
            currency: order_details.currency,
            email: input.values.email,
            paymentIntentId: paymentIntent.id,
          }

          setIsSubmitting(false)
          onPaymentSuccess?.(result)
        }
      } catch (error) {
        logError(error, 'Checkout: handlePayment')
        onPaymentError?.(error)
        throw error
      }
    },
    [
      paymentDataMutation,
      paymentSuccessMutation,
      onPaymentSuccess,
      onPaymentError,
      confirmPayment,
    ]
  )

  const handleCheckout = useCallback(
    async (values: CheckoutFormValues) => {
      try {
        const ticketQuantity =
          (cartQuery.data?.data?.attributes?.cart?.[0] as any)?.quantity || 1

        const checkoutBody = createCheckoutBody(
          values,
          ticketQuantity,
          isAgeRequired
        )
        const checkoutResponse = await checkoutMutation.mutateAsync(
          checkoutBody
        )

        const hash = checkoutResponse.data.attributes.hash
        const total = checkoutResponse.data.attributes.total
        onCheckoutSuccess?.({ hash, total, values })

        return { hash, total }
      } catch (error) {
        logError(error, 'Checkout: handleCheckout')
        onCheckoutError?.(error)
        throw error
      }
    },
    [
      cartQuery.data?.data?.attributes?.cart,
      checkoutMutation,
      isAgeRequired,
      onCheckoutSuccess,
      onCheckoutError,
    ]
  )

  const onSubmit = useCallback(
    async (values: CheckoutFormValues) => {
      try {
        setIsSubmitting(true)
        if (!(await onBeforeSubmit(values))) return

        const { hash, total } = await handleCheckout(values)

        if (isSinglePageCheckout) {
          await handlePayment({
            hash,
            total,
            values,
          })
        }
      } catch (error) {
        logError(error, 'Checkout: onSubmit')
      } finally {
        setIsSubmitting(false)
      }
    },
    [onBeforeSubmit, handleCheckout, isSinglePageCheckout, handlePayment]
  )

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
    [
      eventId,
      addons,
      updateCheckoutMutation,
      setAddons,
      updateOrderItemsFromCheckoutData,
    ]
  )

  // Function to handle addon changes from the form
  const onAddonChange = useCallback(
    (addonId: string, quantity: number) => {
      console.log('Addon quantity changed', { addonId, quantity })
      const updatedAddons = { [addonId]: quantity }
      updateCheckoutWithAddOns(updatedAddons)
    },
    [updateCheckoutWithAddOns]
  )

  const onCountryChange = useCallback(
    (countryId: string) => {
      setSelectedCountry(countryId)
    },
    [setSelectedCountry]
  )

  useEffect(() => {
    if (cartQuery.data?.data?.attributes?.expiresAt) {
      const expiresAt = cartQuery.data.data.attributes.expiresAt
      setSecondsLeft(expiresAt)

      BackgroundTimer.runBackgroundTimer(() => {
        setSecondsLeft((prev: number | undefined) => {
          if (!prev || prev <= 1) {
            BackgroundTimer.stopBackgroundTimer()
            onCartExpired?.()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => BackgroundTimer.stopBackgroundTimer()
    }
  }, [cartQuery.data, setSecondsLeft, onCartExpired])

  useEffect(() => {
    if (cartQuery.data?.data?.attributes) {
      const cartData = cartQuery.data.data.attributes
      const currency = (cartData.cart?.[0] as any)?.currency || 'USD'
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

      if ((cartData.cart?.[0] as any)?.price) {
        items.push({
          id: 'price',
          title: 'Ticket Price',
          value: priceWithCurrency((cartData.cart[0] as any).price, currency),
        })
      }

      const total = (cartData.cart?.[0] as any)?.price || 0
      items.push({
        id: 'total',
        title: 'Total',
        value: priceWithCurrency(total, currency),
      })

      setOrderItems(items)
    }
  }, [cartQuery.data, eventInfoQuery.data])

  return {
    // Handlers
    onAddonChange,
    onCountryChange,
    onSubmit,

    setSecondsLeft,
    setSelectedCountry,

    handlePayment,

    // States
    states,
    eventId,
    countries,
    orderItems,
    conditions,
    secondsLeft,
    availableAddons,
    initialValues,
    eventCurrency,
    isSubmitting,
    isInitialLoading,
    isLoggedIn,
    isPhoneRequired,
    isAgeRequired,
    isPhoneHidden,
    minimumAge,
    isSinglePageCheckout,
  }
}
