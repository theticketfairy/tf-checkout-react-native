import type {
  CardFormView,
  InitStripeParams,
  PaymentIntent,
} from '@stripe/stripe-react-native'
import type { ViewStyle } from 'react-native'
import type { StyleProp } from 'react-native'

export interface IStripePaymentProps {
  onChangePaymentInfo: (paymentInfo: CardFormView.Details) => void
  onChangeConfirmPaymentLoading?: (loading: boolean) => void
  style?: StyleProp<ViewStyle>
  cardStyle?: CardFormView.Styles
  rootContainer?: any
}

export type StripePaymentHandle = {
  initStripe(params: InitStripeParams): Promise<any>
  confirmPayment(
    stripeClientSecret: string,
    params: PaymentIntent.ConfirmParams
  ): Promise<any>
}
