import { StyleProp, TextStyle, ViewStyle } from 'react-native'

export interface IRadioButtonStyles {
  rootContainer?: StyleProp<ViewStyle>
  contentContainer?: StyleProp<ViewStyle>
  radio?: StyleProp<ViewStyle>
  indicator?: StyleProp<ViewStyle>
  text?: StyleProp<TextStyle>
}

export interface IRadioButtonProps {
  index?: number
  styles?: IRadioButtonStyles
  text: string
  value: boolean
  onValueChange: () => void
}
