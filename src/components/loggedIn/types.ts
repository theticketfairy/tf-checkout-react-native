import { StyleProp, ViewStyle } from 'react-native'

import { IButtonStyles } from '../button/types'

export interface ILoggedInTexts {
  logoutDialog?: {
    title?: string
    message?: string
    confirmButton?: string
    cancelButton?: string
  }
  myOrderButtonText?: string
  logOutButtonText?: string
}

export interface ILoggedInStyles {
  rootContainerStyle?: StyleProp<ViewStyle>
  myOrdersButtonStyles?: IButtonStyles
  logOutButtonStyles?: IButtonStyles
}

export interface ILoggedInProps {
  styles?: ILoggedInStyles
  onPressMyOrders?: () => void
  onPressLogout?: () => void
  texts?: ILoggedInTexts
}
