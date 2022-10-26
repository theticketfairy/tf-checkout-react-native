import { StyleProp, TextStyle, ViewStyle } from 'react-native'

import { IButtonStyles } from '../../components/button/types'
import { IInputStyles } from '../../components/input/types'

export interface IResetPasswordTexts {
  title?: string
  resetButton?: string
  cancelButton?: string
  inputLabel?: string
}

export interface IResetPasswordStyles {
  rootContainer?: StyleProp<ViewStyle>
  title?: StyleProp<TextStyle>
  resetButton?: IButtonStyles
  cancelButton?: IButtonStyles
  input?: IInputStyles
  apiError?: StyleProp<TextStyle>
}

export interface IResetPasswordProps {
  styles?: IResetPasswordStyles
  texts?: IResetPasswordTexts

  onPressResetButton: () => void
  onPressCancelButton: () => void
}
