import {
  confirmPayment,
  confirmSetupIntent,
  initPaymentSheet,
  PaymentIntent,
  PaymentSheetError,
  presentPaymentSheet,
  SetupIntent,
} from '@stripe/stripe-react-native'
import { useCallback, useState } from 'react'

export interface UseStripePaymentProps {
  onError?: (error: string) => void
}

export interface PaymentResult {
  success?: boolean
  paymentMethod?: string | null
  paymentIntent?: any | null
  canceled?: boolean
  error?: string
}

export const useStripePayment = ({ onError }: UseStripePaymentProps = {}) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSheetReady, setPaymentSheetReady] = useState(false)

  const initializePaymentSheet = useCallback(
    async (params: {
      paymentIntentClientSecret?: string
      setupIntentClientSecret?: string
      customerId?: string
      customerEphemeralKeySecret?: string
      merchantDisplayName?: string
      appearance?: any
      primaryButtonLabel?: string
      applePay?: boolean
      googlePay?: boolean
      allowsDelayedPaymentMethods?: boolean
    }) => {
      try {
        // Build base parameters that are common to all modes
        const baseParams = {
          merchantDisplayName: params.merchantDisplayName || 'TheTicketFairy',
          customerId: params.customerId,
          customerEphemeralKeySecret: params.customerEphemeralKeySecret,
          appearance: params.appearance,
          primaryButtonLabel: params.primaryButtonLabel,
          applePay:
            params.applePay !== false
              ? {
                  merchantCountryCode: 'US',
                }
              : undefined,
          googlePay:
            params.googlePay !== false
              ? {
                  merchantCountryCode: 'US',
                  testEnv: __DEV__,
                }
              : undefined,
          allowsDelayedPaymentMethods: params.allowsDelayedPaymentMethods,
        }

        // Build intent-specific parameters based on what's provided
        let intentParams
        if (params.paymentIntentClientSecret) {
          // Payment Intent mode - for immediate payments
          intentParams = {
            ...baseParams,
            paymentIntentClientSecret: params.paymentIntentClientSecret,
          }
        } else if (params.setupIntentClientSecret) {
          // Setup Intent mode - for saving payment methods
          intentParams = {
            ...baseParams,
            setupIntentClientSecret: params.setupIntentClientSecret,
          }
        } else {
          throw new Error(
            'Either paymentIntentClientSecret or setupIntentClientSecret must be provided'
          )
        }

        const { error } = await initPaymentSheet(intentParams)

        if (error) {
          console.error('Failed to initialize PaymentSheet:', error)
          onError?.(error.message)
          return false
        }

        setPaymentSheetReady(true)
        return true
      } catch (error) {
        console.error('Error initializing PaymentSheet:', error)
        onError?.(
          error instanceof Error
            ? error.message
            : 'Failed to initialize payment'
        )
        return false
      }
    },
    [onError]
  )

  const presentPaymentSheetModal = useCallback(async () => {
    try {
      setIsProcessing(true)

      const { error } = await presentPaymentSheet()

      if (error) {
        if (error.code === PaymentSheetError.Canceled) {
          return { canceled: true }
        }
        console.error('PaymentSheet error:', error)
        onError?.(error.message)
        return { error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Error presenting PaymentSheet:', error)
      const errorMessage =
        error instanceof Error ? error.message : 'Payment failed'
      onError?.(errorMessage)
      return { error: errorMessage }
    } finally {
      setIsProcessing(false)
    }
  }, [onError])

  const processPayment = useCallback(
    async (params: {
      paymentDataResponse: any
      values: any
      formikHelpers: any
      checkoutResponse: any
      checkoutUpdateResponse?: any
      additionalData?: {
        attributes: any
        isFreeTickets: boolean
        updatedOrderData: any
        eventId: string
      }
    }): Promise<PaymentResult> => {
      const { paymentDataResponse, formikHelpers, additionalData } = params

      try {
        setIsProcessing(true)

        if (additionalData?.isFreeTickets) {
          // Handle free tickets - no payment needed
          return {
            success: true,
            paymentMethod: null,
            paymentIntent: null,
          }
        }

        const { attributes } = paymentDataResponse.data
        const paymentMethod = attributes.payment_method || {}
        const clientSecret = paymentMethod.stripe_client_secret
        const setupIntentSecret =
          paymentMethod.stripe_setup_intent_client_secret

        if (!clientSecret && !setupIntentSecret) {
          throw new Error(
            'No payment intent or setup intent client secret provided'
          )
        }

        // Initialize PaymentSheet with the client secret
        const initialized = await initializePaymentSheet({
          paymentIntentClientSecret: clientSecret,
          setupIntentClientSecret: setupIntentSecret,
          merchantDisplayName: 'TheTicketFairy',
          primaryButtonLabel: setupIntentSecret
            ? 'Set up payment method'
            : 'Pay now',
          applePay: true,
          googlePay: true,
          allowsDelayedPaymentMethods: true,
        })

        if (!initialized) {
          throw new Error('Failed to initialize payment sheet')
        }

        // Present the payment sheet
        const result = await presentPaymentSheetModal()

        if (result.canceled) {
          return { canceled: true }
        }

        if (result.error) {
          throw new Error(result.error)
        }

        // If we get here, payment was successful
        return {
          success: true,
          paymentMethod: 'paymentsheet',
          paymentIntent: clientSecret,
        }
      } catch (error) {
        console.error('Payment processing error:', error)
        setIsProcessing(false)

        const errorMessage =
          error instanceof Error ? error.message : 'Payment failed'

        // Set form errors similar to web implementation
        if (formikHelpers?.setFieldError) {
          formikHelpers.setFieldError('payment', errorMessage)
        }

        onError?.(errorMessage)
        return { error: errorMessage }
      } finally {
        setIsProcessing(false)
      }
    },
    [initializePaymentSheet, presentPaymentSheetModal, onError]
  )

  const confirmPaymentIntent = useCallback(
    async (clientSecret: string, params: PaymentIntent.ConfirmParams) => {
      try {
        setIsProcessing(true)
        const { error, paymentIntent } = await confirmPayment(
          clientSecret,
          params
        )

        if (error) {
          console.error('Payment confirmation error:', error)
          onError?.(error.message)
          return { error: error.message }
        }

        return { success: true, paymentIntent }
      } catch (error) {
        console.error('Error confirming payment:', error)
        const errorMessage =
          error instanceof Error ? error.message : 'Payment confirmation failed'
        onError?.(errorMessage)
        return { error: errorMessage }
      } finally {
        setIsProcessing(false)
      }
    },
    [onError]
  )

  const confirmSetupIntentMethod = useCallback(
    async (clientSecret: string, params: SetupIntent.ConfirmParams) => {
      try {
        setIsProcessing(true)
        const { error, setupIntent } = await confirmSetupIntent(
          clientSecret,
          params
        )

        if (error) {
          console.error('Setup intent confirmation error:', error)
          onError?.(error.message)
          return { error: error.message }
        }

        return { success: true, setupIntent }
      } catch (error) {
        console.error('Error confirming setup intent:', error)
        const errorMessage =
          error instanceof Error ? error.message : 'Setup confirmation failed'
        onError?.(errorMessage)
        return { error: errorMessage }
      } finally {
        setIsProcessing(false)
      }
    },
    [onError]
  )

  return {
    isProcessing,
    paymentSheetReady,
    initializePaymentSheet,
    presentPaymentSheetModal,
    processPayment,
    confirmPaymentIntent,
    confirmSetupIntentMethod,
  }
}
