import { ViewStyle } from 'react-native'

export interface IDatePickerProps {
  onSelectDate?: (date: Date) => void
  onCancel?: () => void
  containerStyle?: ViewStyle
  text: string
  selectedDate?: Date
}
