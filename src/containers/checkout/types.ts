import { CardFormView } from '@stripe/stripe-react-native'
import { ViewStyle } from 'react-native'

import { IFormFieldProps } from '../../components/formField/types'

export interface ICheckoutProps {
  eventId: number
  hash: string
  total: string

  onFetchOrderReviewFail?: (error: string) => void
  onFetchOrderReviewSuccess?: (data: any) => void

  onFetchEventConditionsFail?: (error: string) => void
  onFetchEventConditionsSuccess?: (data: any) => void

  onCheckoutCompletedSuccess?: (data: any) => void
  onCheckoutCompletedFail?: (error: string) => void

  onPaymentSuccess: (data: any) => void
  onPaymentError?: (error: string) => void

  onStripeInitializeError?: (error: string) => void
}

// Components
export interface IOrderItem {
  id: string
  title: string
  value: string
}

export interface IOrderReviewProps {
  orderItems: IOrderItem[]
}

// View
export interface ICheckoutViewProps {
  texts?: {
    title?: string
    subTitle?: string
  }
  styles?: {
    rootStyle: ViewStyle
  }
  orderReviewDataItems: IOrderItem[]
  onPressPay: () => void
  conditions: IFormFieldProps[]
  onFormComplete: (cardDetails: CardFormView.Details) => void
  isDataValid?: boolean
  isLoading?: boolean

  isStripeReady?: boolean
}
