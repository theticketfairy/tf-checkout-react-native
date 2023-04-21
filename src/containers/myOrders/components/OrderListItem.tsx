import React, { FC } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

import R from '../../../res'
import { OrderListItemStyles as s } from './styles'
import type { IOrderListItemProps } from './types'

const OrderListItem: FC<IOrderListItemProps> = ({
  order,
  onSelectOrder,
  styles,
}) => {
  return (
    <View style={[s.rootContainer, styles?.rootContainer]}>
      <TouchableOpacity
        onPress={() => {
          onSelectOrder(order)
        }}
      >
        <View style={[s.contentContainer, styles?.contentContainer]}>
          {/* Left side of the item */}
          <View style={[s.infoRootContainer, styles?.infoRootContainer]}>
            {/* Image content */}
            <View style={[s.imageContainer, styles?.imageContainer]}>
              <Image
                source={{ uri: order.image }}
                style={[s.image, styles?.image]}
              />
            </View>
            {/* Info content */}
            <View style={[s.infoContainer, styles?.infoContainer]}>
              <View style={[s.infoTopContainer, styles?.infoTopContainer]}>
                <Text style={styles?.orderId}>{order.id}</Text>
                <Text style={styles?.orderDate}>{order.date}</Text>
              </View>
              <View
                style={[s.infoBottomContainer, styles?.infoBottomContainer]}
              >
                <Text
                  style={[s.eventName, styles?.eventName]}
                  numberOfLines={2}
                >
                  {order.eventName}
                </Text>
                <View style={[s.priceContainer, styles?.priceContainer]}>
                  <Text style={styles?.currency}>{order.currency} </Text>
                  <Text style={styles?.price}>{order.amount}</Text>
                </View>
              </View>
            </View>
          </View>
          {/* Right side of the item */}
          <View style={[s.iconNextContainer, styles?.iconNextContainer]}>
            <Image
              style={[s.iconNext, styles?.iconNext]}
              source={R.icons.next}
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default OrderListItem
