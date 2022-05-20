import { ReactNode } from 'react'
import { ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native'

export interface IBottomSheetModalStyles {
  rootContainer?: StyleProp<ViewStyle>
  headerContainer?: StyleProp<ViewStyle>
  content?: StyleProp<ViewStyle>
  title?: StyleProp<TextStyle>
  closeButton?: StyleProp<ViewStyle>
  closeButtonIcon?: StyleProp<ImageStyle>
  contentContainer?: StyleProp<ViewStyle>
}

export interface IBottomSheetModalTexts {
  title?: string
}

export interface IBottomSheetModalProps {
  title?: string
  onClose: () => void
  content: ReactNode
  contentHeight?: number

  styles?: IBottomSheetModalStyles
  texts?: IBottomSheetModalTexts
}
