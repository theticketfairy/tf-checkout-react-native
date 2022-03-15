import { CardFormView } from '@stripe/stripe-react-native'
import { StyleProp, TextStyle, ViewStyle } from 'react-native'

import { IButtonStyles } from '../../components/button/types'
import { IFormFieldProps } from '../../components/formField/types'
import { IError } from '../../types'
import { IOnCheckoutSuccess } from '../billingInfo/types'

export interface ICheckoutStyles {
  rootStyle?: ViewStyle
  title?: StyleProp<TextStyle>
  subTitle?: StyleProp<TextStyle>
  missingStripeConfig?: {
    container?: StyleProp<ViewStyle>
    message?: StyleProp<TextStyle>
    exitButton?: IButtonStyles
  }
  freeRegistrationButton?: IButtonStyles
  orderReview?: IOrderReviewStyles
  payment?: {
    container?: StyleProp<ViewStyle>
    title?: StyleProp<TextStyle>
    cardBackgroundColor?: string
    cardContainer?: StyleProp<ViewStyle>
    button?: IButtonStyles
    buttonDisabled?: IButtonStyles
  }
}

export interface IOrderDetailsTicketHolder {
  hash: string
  ticketType: string
  holderName?: string
  holderEmail?: string
  holderPhone?: string
  qrData?: string
  pdfLink?: string
}

export interface IOrderDetails {
  eventId: number
  ticketName?: string
  ticketCost?: string
  numberOfTickets: number
  eventUserTickets: IOrderDetailsTicketHolder[]
}

export interface ICheckoutProps {
  eventId: number

  checkoutData: IOnCheckoutSuccess

  onFetchOrderReviewError?: (error: IError) => void
  onFetchOrderReviewSuccess?: (data: any) => void

  onFetchEventConditionsError?: (error: IError) => void
  onFetchEventConditionsSuccess?: (data: any) => void

  onCheckoutCompletedSuccess?: (data: IOnCheckoutSuccess) => void
  onCheckoutCompletedError?: (error: IError) => void

  onPaymentSuccess: (data: any) => void
  onPaymentError?: (error: IError) => void

  onFetchOrderDetailsSuccess: (orderData: IOrderDetails) => void
  onFetchOrderDetailsError?: (error: IError) => void

  onStripeInitializeError?: (error: string) => void

  onPressExit: () => void
  texts?: {
    title?: string
    subTitle?: string
    missingStripeConfigMessage?: string
    exitButton?: string
    payButton?: string
    freeRegistrationButton?: string
    providePaymentInfo?: string
    orderReviewItems?: {
      event?: string
      ticketType?: string
      numberOfTickets?: string
      price?: string
      total?: string
    }
  }

  styles?: ICheckoutStyles

  onLoadingChange?: (isLoading: boolean) => void
  areAlertsEnabled?: boolean
  areLoadingIndicatorsEnabled?: boolean
}

// Components
export interface IOrderItem {
  id: string
  title: string
  value: string
  styles?: IOrderItemStyles
}

export interface IOrderItemStyles {
  title?: StyleProp<TextStyle>
  value?: StyleProp<TextStyle>
  container?: StyleProp<ViewStyle>
}

interface IOrderReviewStyles {
  item?: IOrderItemStyles
  rootContainer?: StyleProp<ViewStyle>
}

export interface IOrderReviewProps {
  orderItems: IOrderItem[]
  styles?: IOrderReviewStyles
}

// View
export interface ICheckoutViewProps {
  texts?: {
    title?: string
    subTitle?: string
    missingStripeConfigMessage?: string
    exitButton?: string
  }
  styles?: ICheckoutStyles
  orderReviewDataItems: IOrderItem[]
  onPressPay: () => void
  onPressFreeRegistration: () => void
  conditions: IFormFieldProps[]
  onFormComplete: (cardDetails: CardFormView.Details) => void
  isDataValid?: boolean
  isLoading?: boolean

  isStripeConfigMissing?: boolean
  onPressExit?: () => void
  isPaymentRequired?: boolean
  isLoadingFreeRegistration?: boolean
}
