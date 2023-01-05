import {
  CardForm,
  initStripe,
  InitStripeParams,
  PaymentMethod,
  useConfirmPayment,
} from '@stripe/stripe-react-native'
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
} from 'react'

import { IStripePaymentProps, StripePaymentHandle } from './types'

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
        params: PaymentMethod.CreateParams
      ): Promise<any> {
        return await confirmPayment(stripeClientSecret, params)
      },
    }))

    return (
      <CardForm
        onFormComplete={props.onChangePaymentInfo}
        style={[{ height: 300 }, props.style]}
        cardStyle={props.cardStyle}
      />
    )
  }
)

export default StripePayment
