import { CardFormView } from '@stripe/stripe-react-native'
import { StyleProp, TextStyle, ViewStyle } from 'react-native'

import { IButtonStyles } from '../../components/button/types'
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

  onPressExit?: () => void

  texts?: {
    title?: string
    subTitle?: string
    missingStripeConfigMessage?: string
    exitButton?: string
  }
  styles?: {
    rootStyle?: ViewStyle
    missingStripeConfigContainer?: StyleProp<ViewStyle>
    missingStripeConfigMessage?: StyleProp<TextStyle>
    exitButton?: IButtonStyles
  }
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
    missingStripeConfigMessage?: string
    exitButton?: string
  }
  styles?: {
    rootStyle?: ViewStyle
    missingStripeConfigContainer?: StyleProp<ViewStyle>
    missingStripeConfigMessage?: StyleProp<TextStyle>
    exitButton?: IButtonStyles
  }
  orderReviewDataItems: IOrderItem[]
  onPressPay: () => void
  conditions: IFormFieldProps[]
  onFormComplete: (cardDetails: CardFormView.Details) => void
  isDataValid?: boolean
  isLoading?: boolean

  isStripeReady?: boolean
  isStripeConfigMissing?: boolean
  onPressExit?: () => void
}
