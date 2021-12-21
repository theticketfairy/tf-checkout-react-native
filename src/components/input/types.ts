import { LegacyRef } from 'react'
import {
  ColorValue,
  StyleProp,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from 'react-native'
import { TextField } from 'rn-material-ui-textfield'

export interface IInputStyles {
  color?: ColorValue
  container?: StyleProp<ViewStyle>
  input?: StyleProp<TextStyle>
  lineWidth?: number
  activeLineWidth?: number
}

export interface IInputProps extends TextInputProps {
  isSecure?: boolean
  label: string
  reference?: LegacyRef<TextField>
  formatText?: (text: string) => string
  error?: string
  isDisabled?: boolean
  title?: string
  id?: string
  onTextChanged?: (key: string, value: string) => void

  styles?: IInputStyles
}
