import { ReactNode } from 'react'
import { ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native'

export interface ICheckboxStyles {
  container?: StyleProp<ViewStyle>
  content?: StyleProp<ViewStyle>
  indicator?: StyleProp<ViewStyle>
  indicatorDisabled?: StyleProp<ViewStyle>
  text?: StyleProp<TextStyle>
  box?: StyleProp<ViewStyle>
  icon?: StyleProp<ImageStyle>
  error?: StyleProp<TextStyle>
}

export interface ICheckboxProps {
  onPress: () => void
  text?: string
  isActive: boolean
  styles?: ICheckboxStyles
  customTextComp?: ReactNode
  error?: string
}
