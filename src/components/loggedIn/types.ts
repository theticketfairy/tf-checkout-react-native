import { StyleProp, ViewStyle } from 'react-native'

import { IButtonStyles } from '../button/types'

export interface ILoggedInProps {
  myOrdersButtonStyles?: IButtonStyles
  logOutButtonStyles?: IButtonStyles
  onPressMyOrders?: () => void
  onPressLogout?: () => void
  myOrderButtonText?: string
  logOutButtonText?: string
  rootContainerStyle?: StyleProp<ViewStyle>
}
