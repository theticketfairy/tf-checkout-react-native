import type { ColorValue, StyleProp, TextStyle, ViewStyle } from 'react-native'

export interface IDatePickerStyles {
  container?: StyleProp<ViewStyle>
  button?: StyleProp<ViewStyle>
  text?: StyleProp<TextStyle>
  error?: StyleProp<TextStyle>
  errorColor?: ColorValue
}

export interface IDatePickerProps {
  onSelectDate: (date: Date) => void
  onCancel?: () => void
  text: string
  selectedDate?: Date
  styles?: IDatePickerStyles
  error?: string
}
