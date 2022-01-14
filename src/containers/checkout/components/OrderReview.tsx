import _map from 'lodash/map'
import React from 'react'
import { Text, View } from 'react-native'

import { IOrderItem, IOrderReviewProps } from '../types'
import { OrderReviewStyles as s } from './styles'

const OrderItem = ({ title, value, styles }: IOrderItem) => (
  <View
    style={[s.orderItemContainer, styles?.container]}
    key={`orderReview.${title}`}
  >
    <Text style={[s.orderItemTitle, styles?.title]}>{title}</Text>
    <Text style={[s.orderItemValue, styles?.value]} allowFontScaling={true}>
      {value}
    </Text>
  </View>
)

const OrderReview = ({ orderItems, styles }: IOrderReviewProps) => (
  <View style={[s.rootContainer, styles?.rootContainer]}>
    {_map(orderItems, (item) => (
      <OrderItem
        id={item.id}
        title={item.title}
        value={item.value}
        styles={styles?.item}
      />
    ))}
  </View>
)

export default OrderReview
