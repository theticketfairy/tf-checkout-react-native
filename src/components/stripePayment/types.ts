import {
  CardFormView,
  InitStripeParams,
  PaymentMethodCreateParams,
} from '@stripe/stripe-react-native'

export interface IStripePaymentProps {
  onChangePaymentInfo: (paymentInfo: CardFormView.Details) => void
  onChangeConfirmPaymentLoading?: (loading: boolean) => void
  style?: any
  cardStyle?: any
  rootContainer?: any
}

export type StripePaymentHandle = {
  initStripe(params: InitStripeParams): Promise<any>
  confirmPayment(
    stripeClientSecret: string,
    params: PaymentMethodCreateParams.Params
  ): Promise<any>
}
