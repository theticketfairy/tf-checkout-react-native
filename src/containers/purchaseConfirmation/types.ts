import { ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native'

import { IButtonStyles } from '../../components/button/types'
import { IError } from '../../types'

export interface IPurchaseConfirmationProps {
  orderHash: string
  onComplete: () => void
  styles?: IPurchaseConfirmationStyles
  texts?: IPurchaseConfirmationTexts

  onFetchPurchaseConfirmationError?: (error: IError) => void
  onFetchPurchaseConfirmationSuccess?: () => void

  areActivityIndicatorsEnabled?: boolean
  areAlertsEnabled?: boolean
  onLoadingChange?: (isLoading: boolean) => void
}

export interface IPurchaseConfirmationTexts {
  title?: string
  message?: {
    line1?: string
    line2?: string
  }

  promo?: {
    discount?: string
  }

  invite?: {
    title?: string
    message?: string
  }
  exitButton?: string
}

export interface IPurchaseConfirmationStyles {
  rootContainer?: StyleProp<ViewStyle>
  title?: StyleProp<TextStyle>

  message?: {
    container?: StyleProp<ViewStyle>
    line1?: StyleProp<TextStyle>
    line2?: StyleProp<TextStyle>
  }

  promo?: {
    container?: StyleProp<ViewStyle>
    title?: StyleProp<TextStyle>
    titleKeyword?: StyleProp<TextStyle>
    message?: StyleProp<TextStyle>
    messageKeyword?: StyleProp<TextStyle>
    discount?: StyleProp<TextStyle>
  }

  invite?: {
    container?: StyleProp<ViewStyle>
    title?: StyleProp<TextStyle>
    message?: StyleProp<TextStyle>
    link?: StyleProp<TextStyle>
    linkContainer?: StyleProp<ViewStyle>
    copyIcon?: StyleProp<ImageStyle>
    copyButton?: StyleProp<ViewStyle>
  }
  exitButton?: IButtonStyles
}

export interface IPurchaseConfirmationViewProps {
  texts?: IPurchaseConfirmationTexts
  styles?: IPurchaseConfirmationStyles
  referralLink?: string
  onComplete: () => void
  orderHash: string
  areActivityIndicatorsEnabled?: boolean
  isLoading?: boolean
}
