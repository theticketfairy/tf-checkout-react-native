import type { StyleProp, TextStyle, ViewStyle } from 'react-native'

export interface IButtonStyles {
  container?: StyleProp<ViewStyle>
  button?: StyleProp<ViewStyle>
  text?: StyleProp<TextStyle>
}

export interface IButtonProps {
  text: string
  onPress: () => void
  styles?: IButtonStyles
  isUpperCase?: boolean
  isDisabled?: boolean
  isLoading?: boolean
}
