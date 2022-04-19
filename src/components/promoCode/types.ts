import {
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  TextStyle,
} from 'react-native'
import { TextInputProps, ViewStyle } from 'react-native'

import { IButtonStyles } from '../button/types'

export interface IPromoCodeStyles {
  rootContainer?: StyleProp<ViewStyle>
  contentWrapper?: StyleProp<ViewStyle>
  content?: StyleProp<ViewStyle>
  input?: TextInputProps['style']
  inputPlaceholderColor?: string

  mainButton?: IButtonStyles
  applyButton?: IButtonStyles
  applyDisabledButton?: IButtonStyles

  errorMessage?: StyleProp<TextStyle>
  validMessage?: StyleProp<TextStyle>

  cancelButton?: StyleProp<ViewStyle>
  cancelIcon?: StyleProp<ImageStyle>
}

export interface IPromoCodeTexts {
  promoCodeButton?: string
  inputPlaceHolder?: string
  apply?: string
  cancel?: string
  mainButton?: string

  errorMessage?: string
  validMessage?: string
}

export interface IPromoCodeProps {
  onPressApply: (promoCode: string) => void
  promoCodeValidationMessage?: string
  isPromoCodeValid?: boolean | number
  styles?: IPromoCodeStyles
  texts?: IPromoCodeTexts
  isAccessCodeEnabled?: boolean
  closeButtonIcon?: ImageSourcePropType
}
