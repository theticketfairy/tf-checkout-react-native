import _map from 'lodash/map';
import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

export interface IOrderItem {
  id: string;
  title: string;
  subtitle?: string;
  value: string;
  styles?: OrderReviewItemStyles;
}

export interface OrderReviewItemStyles {
  container?: StyleProp<ViewStyle>;
  title?: StyleProp<TextStyle>;
  subtitle?: StyleProp<TextStyle>;
  value?: StyleProp<TextStyle>;
}

export interface OrderReviewStyles {
  item?: OrderReviewItemStyles;
  rootContainer?: StyleProp<ViewStyle>;
}

export interface IOrderReviewProps {
  orderItems: IOrderItem[];
  styles?: OrderReviewStyles;
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
});

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
);

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
        styles={{
          container: customStyles?.item?.container ?? item.styles?.container,
          title: customStyles?.item?.title ?? item.styles?.title,
          subtitle: customStyles?.item?.subtitle ?? item.styles?.subtitle,
          value: customStyles?.item?.value ?? item.styles?.value,
        }}
      />
    ))}
  </View>
);

export default OrderReview;
