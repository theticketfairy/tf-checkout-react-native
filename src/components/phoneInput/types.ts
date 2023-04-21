import type { ColorValue, StyleProp, ViewStyle } from 'react-native'

import type { IInputStyles } from '../input/types'

export interface IOnChangePhoneNumberPayload {
  countryCode: string
  dialCode: string
  e164: string
  input: string
  isValid: boolean
}

export interface IPhoneInputProps {
  phoneNumber: string
  onChangePhoneNumber: (payload: IOnChangePhoneNumberPayload) => void
  styles?: IPhoneInputStyles
  error?: string
  texts?: IPhoneInputTexts
  country?: string
}

export interface IPhoneInputTexts {
  label?: string
  customError?: string
}

export interface IPhoneInputStyles {
  rootContainer?: StyleProp<ViewStyle>
  errorColor?: ColorValue
  country?: {
    container?: StyleProp<ViewStyle>
    button?: StyleProp<ViewStyle>
  }
  input?: IInputStyles
}
