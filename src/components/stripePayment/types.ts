import { StyleProp, ViewStyle } from 'react-native'

export interface IStripePaymentProps {
  onChangePaymentInfo?: (paymentInfo: { complete: boolean }) => void
  onChangeConfirmPaymentLoading?: (loading: boolean) => void
  onError?: (error: string) => void
  onPaymentSuccess?: (result: any) => void
  onPaymentCancel?: () => void
  style?: StyleProp<ViewStyle>
  stripePublishableKey?: string
  stripeAccountId?: string
  clientSecret?: string
  setupIntentClientSecret?: string
  elementsConfig?: any
  displayPaymentButton?: boolean
  rootContainer?: any
}

export type StripePaymentHandle = {
  processPayment(params: any): Promise<any>
  confirmPayment(stripeClientSecret: string, params: any): Promise<any>
  confirmSetupIntent(clientSecret: string, params: any): Promise<any>
  presentPaymentSheet(): Promise<any>
  isReady: boolean
}
