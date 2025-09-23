import _map from 'lodash/map'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

// Define types similar to the checkout-sp implementation
export interface IOrderItem {
  id: string
  title: string
  subtitle?: string
  value: string
  styles?: {
    title?: any
    value?: any
    container?: any
    subtitle?: any
  }
}

export interface IOrderReviewProps {
  orderItems: IOrderItem[]
  styles?: {
    item?: {
      title?: any
      value?: any
      container?: any
    }
    rootContainer?: any
  }
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    flexWrap: 'wrap',
  },
  orderItemContainer: {
    paddingVertical: 4,
    width: '100%',
  },
  orderItemTitle: {
    fontWeight: '800',
    fontSize: 16,
  },
  orderItemValue: {
    lineHeight: 20,
  },
  orderItemSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
})

const OrderItem = ({
  title,
  subtitle,
  value,
  styles: itemStyles,
}: IOrderItem) => (
  <View
    style={[styles.orderItemContainer, itemStyles?.container]}
    key={`orderReview.${title}`}
  >
    <Text style={[styles.orderItemTitle, itemStyles?.title]}>{title}</Text>
    {subtitle && (
      <Text
        style={[styles.orderItemSubtitle, itemStyles?.subtitle]}
        allowFontScaling={true}
      >
        {subtitle}
      </Text>
    )}
    <Text
      style={[styles.orderItemValue, itemStyles?.value]}
      allowFontScaling={true}
    >
      {value}
    </Text>
  </View>
)

const OrderReview = ({
  orderItems,
  styles: customStyles,
}: IOrderReviewProps) => (
  <View style={[styles.rootContainer, customStyles?.rootContainer]}>
    {_map(orderItems, (item) => (
      <OrderItem
        key={`orderReview.${item.id}`}
        id={item.id}
        title={item.title}
        subtitle={item.subtitle}
        value={item.value}
        styles={customStyles?.item}
      />
    ))}
  </View>
)

export default OrderReview
