import { ColorValue, StyleProp, TextStyle, ViewStyle } from 'react-native'

export interface IDatePickerStyles {
  container?: StyleProp<ViewStyle>
  inputContainer?: StyleProp<ViewStyle>
  fieldWrapper?: StyleProp<ViewStyle>
  input?: StyleProp<TextStyle>
  error?: StyleProp<TextStyle>
  errorColor?: ColorValue
  baseColor?: string
}

export interface IDatePickerProps {
  onSelectDate: (date: Date) => void
  onCancel?: () => void
  text: string
  selectedDate?: Date
  styles?: IDatePickerStyles
  error?: string
}
