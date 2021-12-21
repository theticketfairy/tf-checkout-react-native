import { ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native'

export interface IPurchaseConfirmationProps {
  orderHash: string
  onComplete: () => void
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
}

export interface IPurchaseConfirmationProps {
  texts?: IPurchaseConfirmationTexts
  styles?: IPurchaseConfirmationStyles
  referralLink?: string
}
