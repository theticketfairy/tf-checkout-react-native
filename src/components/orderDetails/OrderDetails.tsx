import React, { useState } from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import {
  // createFixedFloatNormalizer,
  // currencyNormalizerCreator,
  formatPrice,
} from '../../utils/normalizers'

interface IOrderData {
  id: string
  product_name: string
  ticketType: string
  quantity: string | number
  price: string | number
  total: string | number
  currency: string
  guest_count: string | number
  pay_now: string | number
  add_ons: IAddOn[]
  cost: string | number
  tableTypes?: any[]
  subtotal?: string | number
  fees?: string | number
  debt?: string | number
}

interface IAddOn {
  id: string
  name: string
  groupName?: string
  quantity: number
  price: string | number
  cost: string | number
}

interface IPaymentField {
  id: string
  label: string
  className?: string
  normalizer?: (value: any, currency: string, orderData?: IOrderData) => string
}

interface OrderDetailsProps {
  orderData: IOrderData
  paymentFieldsData: IPaymentField[]
  customMobileText?: string
  isCollapsible?: boolean
  showMobileSummary?: boolean
}

export const OrderDetails: React.FC<OrderDetailsProps> = ({
  orderData,
  paymentFieldsData,
  customMobileText = 'Your order total',
  isCollapsible = true,
  showMobileSummary = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { currency, guest_count } = orderData
  const hasTableTypes = Boolean(Number(guest_count))

  // Find the total field to display in the mobile view
  const totalField = paymentFieldsData.find((field) => field.id === 'total')
  const totalValue =
    totalField && orderData.total
      ? totalField.normalizer
        ? totalField.normalizer(orderData.total, currency, orderData)
        : formatPrice(orderData.total, currency)
      : ''

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const renderAddOnItem = (item: IAddOn) => (
    <View key={item.id} style={styles.addOnContainer}>
      <View style={styles.addOnRow}>
        <Text style={styles.addOnQuantity}>{item.quantity}</Text>
        <Text style={styles.addOnX}> x </Text>
        <Text style={styles.addOnName}>
          {item.groupName ? `${item.groupName} - ` : ''}
          {item.name}
        </Text>
        <Text style={styles.addOnPrice}>
          {formatPrice(item.cost || item.price, currency)}
        </Text>
        <Text style={styles.addOnEach}> each</Text>
      </View>
    </View>
  )

  const renderTableTypeItem = (item: any) => (
    <View key={item.id} style={styles.tableTypeContainer}>
      <View style={styles.tableTypeGrid}>
        <View style={styles.tableTypeColumn}>
          <Text style={styles.orderInfoTitle}>Table Type</Text>
          <Text style={styles.orderInfoText}>{item.ticketType}</Text>
        </View>
        <View style={styles.tableTypeColumn}>
          <Text style={styles.orderInfoTitle}>Number of Tables</Text>
          <Text style={styles.orderInfoText}>{item.count}</Text>
        </View>
        <View style={styles.tableTypeColumn}>
          <Text style={styles.orderInfoTitle}>Guest Count</Text>
          <Text style={styles.orderInfoText}>{item.quantity}</Text>
        </View>
      </View>
    </View>
  )

  const renderOrderField = (field: IPaymentField) => {
    const { id, label, normalizer = (value: any) => String(value) } = field
    const value = orderData[id as keyof IOrderData] || ''

    if (
      field.id === 'add_ons' &&
      (!value || (Array.isArray(value) && value.length === 0))
    ) {
      return null
    }

    if (field.id === 'tableTypes') {
      const valueArray = value as Array<any>
      return (
        <View key={id} style={styles.orderInfoBlock}>
          <Text style={styles.orderInfoTitle}>{label}</Text>
          {valueArray?.map(renderTableTypeItem)}
        </View>
      )
    }

    return (
      <View key={id} style={styles.orderInfoBlock}>
        <Text style={styles.orderInfoTitle}>{label}</Text>
        <View style={styles.orderInfoContent}>
          {typeof value === 'string' || typeof value === 'number' ? (
            <Text style={styles.orderInfoText}>
              {normalizer(value, currency, orderData)}
            </Text>
          ) : (
            Array.isArray(value) && value.map((item) => renderAddOnItem(item))
          )}
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Mobile Summary */}
      {showMobileSummary && isCollapsible && (
        <TouchableOpacity style={styles.mobileSummary} onPress={toggleExpand}>
          <View style={styles.mobileSummaryContent}>
            <View style={styles.mobileSummaryLeft}>
              <Text style={styles.mobileSummaryText}>{customMobileText}</Text>
            </View>
            <View style={styles.mobileSummaryRight}>
              {!isExpanded && (
                <Text style={styles.mobileSummaryTotal}>{totalValue}</Text>
              )}
              <Text style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}

      {/* Order Details */}
      <View
        style={[
          styles.orderDetailsSection,
          isCollapsible && !isExpanded && styles.collapsed,
          hasTableTypes && styles.blockLayout,
        ]}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {paymentFieldsData.map(renderOrderField)}
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  mobileSummary: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
    marginBottom: 8,
  },
  mobileSummaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mobileSummaryLeft: {
    flex: 1,
  },
  mobileSummaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  mobileSummaryRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mobileSummaryTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
    marginRight: 8,
  },
  expandIcon: {
    fontSize: 12,
    color: '#6c757d',
  },
  orderDetailsSection: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
    overflow: 'hidden',
  },
  collapsed: {
    display: 'none',
  },
  blockLayout: {
    // Special styling for table types
  },
  orderInfoBlock: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  orderInfoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  orderInfoContent: {
    // Container for order info content
  },
  orderInfoText: {
    fontSize: 16,
    color: '#212529',
    fontWeight: '500',
  },
  addOnContainer: {
    marginBottom: 8,
  },
  addOnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  addOnQuantity: {
    fontSize: 14,
    color: '#212529',
    fontWeight: '600',
  },
  addOnX: {
    fontSize: 14,
    color: '#6c757d',
  },
  addOnName: {
    fontSize: 14,
    color: '#212529',
    flex: 1,
  },
  addOnPrice: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: '600',
  },
  addOnEach: {
    fontSize: 12,
    color: '#6c757d',
    fontStyle: 'italic',
  },
  tableTypeContainer: {
    marginBottom: 12,
  },
  tableTypeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tableTypeColumn: {
    flex: 1,
    marginHorizontal: 4,
  },
})
