import { StyleProp, TextStyle } from 'react-native'
import { TextInputProps, ViewStyle } from 'react-native'

import { IButtonStyles } from '../button/types'

export interface IPromoCodeStyles {
  rootContainer?: StyleProp<ViewStyle>
  contentWrapper?: StyleProp<ViewStyle>
  content?: StyleProp<ViewStyle>
  input?: TextInputProps['style']
  inputPlaceholderColor?: string
  title?: StyleProp<TextStyle>

  mainButton?: IButtonStyles
  cancelButton?: IButtonStyles
  applyButton?: IButtonStyles
  applyDisabledButton?: IButtonStyles

  messageContainer?: StyleProp<ViewStyle>
  message?: StyleProp<TextStyle>
}

export interface IPromoCodeTexts {
  promoCodeButton?: string
  inputPlaceHolder?: string
  apply?: string
  cancel?: string
  mainButton?: string
  title?: string
}

export interface IPromoCodeProps {
  onPressApply: (promoCode: string) => void
  promoCodeValidationMessage?: string
  isPromoCodeValid?: boolean
  styles?: IPromoCodeStyles
  texts?: IPromoCodeTexts
  isAccessCodeEnabled?: boolean
}
