import _map from 'lodash/map'
import React from 'react'
import { Text, View } from 'react-native'

import { IOrderItem, IOrderReviewProps } from '../types'
import { OrderReviewStyles as s } from './styles'

const OrderItem = ({ title, value }: IOrderItem) => (
  <View style={s.orderItemContainer} key={`orderReview.${title}`}>
    <Text style={s.orderItemTitle}>{title}</Text>
    <Text style={s.orderItemValue} allowFontScaling={true}>
      {value}
    </Text>
  </View>
)

const OrderReview = ({ orderItems }: IOrderReviewProps) => (
  <View style={s.rootContainer}>{_map(orderItems, OrderItem)}</View>
)

export default OrderReview
