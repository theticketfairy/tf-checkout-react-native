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
  rootContainer?: StyleProp<ViewStyle>
  myOrdersButton?: IButtonStyles
  logOutButton?: IButtonStyles
}

export interface ILoggedInProps {
  styles?: ILoggedInStyles
  onPressMyOrders?: () => void
  onPressLogout?: () => void
  texts?: ILoggedInTexts
}
