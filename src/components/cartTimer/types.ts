import type { ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native'

export interface ICartTimerStyles {
  rootContainer?: StyleProp<ViewStyle>
  contentContainer?: StyleProp<ViewStyle>
  textsContainer?: StyleProp<ViewStyle>
  icon?: StyleProp<ImageStyle>
  message?: StyleProp<TextStyle>
  time?: StyleProp<TextStyle>
}

export interface ICartTimerTexts {
  message?: string
}

export interface ICartTimerProps {
  styles?: ICartTimerStyles
  texts?: ICartTimerTexts
  // Determine if the timer should minimize when user taps on it
  shouldNotMinimize?: boolean
  secondsLeft: number
}
