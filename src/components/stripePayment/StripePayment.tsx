import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'

import { useStripeConfig, useStripePayment } from './hooks'
import styles from './styles'
import { IStripePaymentProps, StripePaymentHandle } from './types'

const StripePayment = forwardRef<StripePaymentHandle, IStripePaymentProps>(
  (props, ref) => {
    const [paymentReady, setPaymentReady] = useState(false)

    const { isStripeInitialized, stripeError } = useStripeConfig({
      stripePublishableKey: props.stripePublishableKey,
      stripeAccountId: props.stripeAccountId,
      elementsConfig: props.elementsConfig,
    })

    const {
      isProcessing,
      paymentSheetReady,
      initializePaymentSheet,
      presentPaymentSheetModal,
      processPayment,
      confirmPaymentIntent,
      confirmSetupIntentMethod,
    } = useStripePayment({
      onError: props.onError,
    })

    const handleOnChangeConfirmPaymentLoading = useCallback(
      (isLoading: boolean) => {
        props.onChangeConfirmPaymentLoading?.(isLoading)
      },
      [props]
    )

    useEffect(() => {
      handleOnChangeConfirmPaymentLoading(isProcessing)
    }, [handleOnChangeConfirmPaymentLoading, isProcessing])

    useEffect(() => {
      if (isStripeInitialized && props.clientSecret && !paymentReady) {
        initializePaymentSheet({
          paymentIntentClientSecret: props.clientSecret,
          setupIntentClientSecret: props.setupIntentClientSecret,
          merchantDisplayName: 'TheTicketFairy',
          primaryButtonLabel: props.setupIntentClientSecret
            ? 'Set up payment method'
            : 'Pay now',
          applePay: true,
          googlePay: true,
          allowsDelayedPaymentMethods: true,
        }).then((success) => {
          if (success) {
            setPaymentReady(true)
            // Notify parent that payment form is ready
            props.onChangePaymentInfo?.({ complete: true })
          }
        })
      }
    }, [
      isStripeInitialized,
      props.clientSecret,
      props.setupIntentClientSecret,
      paymentReady,
      initializePaymentSheet,
      props,
    ])

    const handlePaymentPress = useCallback(async () => {
      if (!paymentSheetReady) return

      try {
        const result = await presentPaymentSheetModal()

        if (result.success) {
          props.onPaymentSuccess?.(result)
        } else if (result.canceled) {
          props.onPaymentCancel?.()
        }
      } catch (error) {
        console.error('Payment error:', error)
        props.onError?.(
          error instanceof Error ? error.message : 'Payment failed'
        )
      }
    }, [paymentSheetReady, presentPaymentSheetModal, props])

    useImperativeHandle(ref, () => ({
      async processPayment(params: any): Promise<any> {
        return await processPayment(params)
      },

      async confirmPayment(
        stripeClientSecret: string,
        params: any
      ): Promise<any> {
        return await confirmPaymentIntent(stripeClientSecret, params)
      },

      async confirmSetupIntent(
        clientSecret: string,
        params: any
      ): Promise<any> {
        return await confirmSetupIntentMethod(clientSecret, params)
      },

      async presentPaymentSheet(): Promise<any> {
        return await presentPaymentSheetModal()
      },

      isReady: paymentReady,
    }))

    if (stripeError) {
      return (
        <View style={[styles.container, props.style]}>
          <Text style={styles.errorText}>{stripeError}</Text>
        </View>
      )
    }

    if (!isStripeInitialized) {
      return (
        <View style={[styles.container, styles.loadingContainer, props.style]}>
          <ActivityIndicator size='small' color='#007AFF' />
          <Text style={styles.loadingText}>Initializing payment...</Text>
        </View>
      )
    }

    if (props.displayPaymentButton && paymentReady) {
      return (
        <View style={[styles.container, props.style]}>
          <TouchableOpacity
            style={[
              styles.paymentButton,
              isProcessing && styles.disabledButton,
            ]}
            onPress={handlePaymentPress}
            disabled={isProcessing || !paymentSheetReady}
          >
            {isProcessing ? (
              <ActivityIndicator size='small' color='#fff' />
            ) : (
              <Text style={styles.paymentButtonText}>
                {props.setupIntentClientSecret
                  ? 'Set up payment method'
                  : 'Pay now'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )
    }

    // For inline payment setup (similar to PaymentElement)
    return (
      <View style={[styles.container, props.style]}>
        {paymentReady ? (
          <View style={styles.paymentReadyContainer}>
            <Text style={styles.paymentReadyText}>Payment method ready</Text>
          </View>
        ) : (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size='small' color='#007AFF' />
            <Text style={styles.loadingText}>Setting up payment...</Text>
          </View>
        )}
      </View>
    )
  }
)

export default StripePayment
