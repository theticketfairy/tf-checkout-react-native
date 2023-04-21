import {
  CardForm,
  initStripe,
  InitStripeParams,
  PaymentIntent,
  useConfirmPayment,
} from '@stripe/stripe-react-native'
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
} from 'react'

import styles from './styles'
import type { IStripePaymentProps, StripePaymentHandle } from './types'

const StripePayment = forwardRef<StripePaymentHandle, IStripePaymentProps>(
  (props, ref) => {
    const { confirmPayment, loading } = useConfirmPayment()

    const handleOnChangeConfirmPaymentLoading = useCallback(
      (isLoading: boolean) => {
        props.onChangeConfirmPaymentLoading?.(isLoading)
      },
      [props]
    )

    useEffect(() => {
      handleOnChangeConfirmPaymentLoading(loading)
    }, [handleOnChangeConfirmPaymentLoading, loading])

    useImperativeHandle(ref, () => ({
      async initStripe(params: InitStripeParams): Promise<any> {
        return await initStripe(params)
      },

      async confirmPayment(
        stripeClientSecret: string,
        params: PaymentIntent.ConfirmParams
      ): Promise<any> {
        return await confirmPayment(stripeClientSecret, params)
      },
    }))

    return (
      <CardForm
        onFormComplete={props.onChangePaymentInfo}
        style={[styles.cardForm, props.style]}
        cardStyle={props.cardStyle}
      />
    )
  }
)

export default StripePayment
