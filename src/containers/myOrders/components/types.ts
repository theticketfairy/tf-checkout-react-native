import type { ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native'

import type { IMyOrdersOrder } from '../../../api/types'

export interface IOrderListItemStyles {
  rootContainer?: StyleProp<ViewStyle>
  contentContainer?: StyleProp<ViewStyle>
  infoContainer?: StyleProp<ViewStyle>
  infoTopContainer?: StyleProp<ViewStyle>
  infoBottomContainer?: StyleProp<ViewStyle>
  imageContainer?: StyleProp<ViewStyle>
  image?: StyleProp<ImageStyle>
  infoRootContainer?: StyleProp<ViewStyle>
  iconNextContainer?: StyleProp<ViewStyle>
  iconNext?: StyleProp<ImageStyle>
  orderId?: StyleProp<TextStyle>
  orderDate?: StyleProp<TextStyle>
  eventName?: StyleProp<TextStyle>
  priceContainer?: StyleProp<ViewStyle>
  price?: StyleProp<TextStyle>
  currency?: StyleProp<TextStyle>
}

export interface IOrderListItemProps {
  onSelectOrder: (order: IMyOrdersOrder) => void
  order: IMyOrdersOrder
  styles?: IOrderListItemStyles
}
