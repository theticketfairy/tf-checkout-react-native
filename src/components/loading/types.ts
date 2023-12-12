import type { ActivityIndicatorProps, TextStyle, ViewStyle } from 'react-native'

export interface ILoadingStyles {
  animation?: {
    color?: ActivityIndicatorProps['color']
    size?: ActivityIndicatorProps['size']
  }
  content?: ViewStyle
  text?: TextStyle
}

export interface ILoadingProps {
  text?: string
  styles?: ILoadingStyles
  customComponent?: any
}
