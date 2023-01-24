import { StyleProp, TextStyle, ViewStyle } from 'react-native'

import { IButtonStyles } from '../button/types'
import { IInputStyles } from '../input/types'

export interface IEnterPasswordStyles {
  input?: IInputStyles
  title?: StyleProp<TextStyle>
  error?: StyleProp<TextStyle>
  button?: IButtonStyles
  rootContainer?: StyleProp<ViewStyle>
  contentContainer?: StyleProp<ViewStyle>
}

export interface IEnterPasswordTexts {
  inputLabel?: string
  title?: string
  buttonText?: string
}

export interface IEnterPasswordProps {
  onSubmit?: (text: string) => void
  isLoading?: boolean
  apiError?: string
  texts?: IEnterPasswordTexts
  styles?: IEnterPasswordStyles
}
