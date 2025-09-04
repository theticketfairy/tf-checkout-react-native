/* eslint-disable @typescript-eslint/no-explicit-any */
import _identity from 'lodash/identity'
import _isEmpty from 'lodash/isEmpty'
import _map from 'lodash/map'
import React, { memo, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { CONFIGS, FEES_STYLES } from '../../constants'
import {
  createFixedFloatNormalizer,
  currencyNormalizerCreator,
} from '../../utils/normalizers'
import { showZero } from '../../utils/showZero'
import { IOrderData } from './types'

interface OrderDetailsProps {
  orderData: any
  paymentFieldsData: any[]
  customMobileText?: string
  handleCountdownFinish?: () => void
}

interface CountdownI {
  expiresAt: number
  handleCountdownFinish: () => void
}

const SimpleCountdown = memo(
  ({ expiresAt, handleCountdownFinish }: CountdownI) => {
    const [timeLeft, setTimeLeft] = useState(expiresAt)

    React.useEffect(() => {
      if (timeLeft <= 0) {
        handleCountdownFinish()
        return
      }

      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleCountdownFinish()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }, [timeLeft, handleCountdownFinish])

    if (timeLeft <= 0) {
      return null
    }

    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60

    return (
      <View style={styles.mobileOrderTimer}>
        <Text style={styles.timerText}>
          {showZero(minutes)}:{showZero(seconds)}
        </Text>
      </View>
    )
  }
)

export const OrderDetails = ({
  orderData = {},
  paymentFieldsData = [],
  customMobileText = 'Your order total',
  handleCountdownFinish = _identity,
}: OrderDetailsProps) => {
  const { currency } = orderData
  // const hasTableTypes = Boolean(Number(guest_count))
  const [isExpanded, setIsExpanded] = useState(false)

  // Find the total field to display in the mobile view
  const totalField = paymentFieldsData.find((field) => field.id === 'total')
  const totalValue =
    totalField && orderData.total
      ? totalField.normalizer
        ? totalField.normalizer(orderData.total, currency, orderData)
        : orderData.total
      : ''

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const defaultItemRenderer = (item: any) => (
    <View key={item.id} style={styles.addonContainer}>
      <Text style={styles.addonText}>
        {item.quantity} x {item.groupName ? item.groupName + ' - ' : ''}
        {item.name} -
        {CONFIGS.FEES_STYLE === FEES_STYLES.TRADITIONAL &&
          currencyNormalizerCreator(
            createFixedFloatNormalizer(2)(parseFloat(item.price)),
            currency
          ) + ' (incl. fees)'}
        {CONFIGS.FEES_STYLE === FEES_STYLES.DISPLAY_BOTH &&
          currencyNormalizerCreator(
            createFixedFloatNormalizer(2)(parseFloat(item.cost)),
            currency
          )}{' '}
        each
      </Text>
      {CONFIGS.FEES_STYLE === FEES_STYLES.DISPLAY_BOTH && (
        <Text style={styles.feesText}>
          (
          {currencyNormalizerCreator(
            createFixedFloatNormalizer(2)(parseFloat(String(item.price))),
            currency
          )}{' '}
          with fees)
        </Text>
      )}
    </View>
  )

  const defaultTableRenderer = (item: any) => (
    <View key={item.id} style={styles.tableContainer}>
      <Text style={styles.tableText}>
        {item.groupName ? item.groupName + ' - ' : ''}
        {item.name} - Guest Count: {item.guestCount}
      </Text>
      <Text style={styles.tablePrice}>
        {CONFIGS.FEES_STYLE === FEES_STYLES.TRADITIONAL &&
          currencyNormalizerCreator(
            createFixedFloatNormalizer(2)(parseFloat(item.price)),
            currency
          ) + ' (incl. fees)'}
        {CONFIGS.FEES_STYLE === FEES_STYLES.DISPLAY_BOTH &&
          currencyNormalizerCreator(
            createFixedFloatNormalizer(2)(parseFloat(item.cost)),
            currency
          )}
      </Text>
      {CONFIGS.FEES_STYLE === FEES_STYLES.DISPLAY_BOTH && (
        <Text style={styles.feesText}>
          (
          {currencyNormalizerCreator(
            createFixedFloatNormalizer(2)(parseFloat(String(item.price))),
            currency
          )}{' '}
          with fees)
        </Text>
      )}
    </View>
  )

  return (
    <View style={styles.container}>
      {/* Mobile view summary */}
      <TouchableOpacity
        style={styles.mobileOrderSummary}
        onPress={toggleExpand}
      >
        <View style={styles.mobileOrderSummaryContent}>
          <View style={styles.mobileOrderInfo}>
            <View
              style={[
                styles.mobileOrderInfoContainer,
                styles.orderInfoContainerLeft,
              ]}
            >
              <Text style={styles.mobileOrderText}>{customMobileText}</Text>
            </View>
            <View
              style={[
                styles.mobileOrderInfoContainer,
                styles.orderInfoContainerRight,
              ]}
            >
              {!isExpanded && (
                <Text style={styles.mobileOrderTotal}>{totalValue}</Text>
              )}
              {orderData?.expires_at && (
                <SimpleCountdown
                  expiresAt={orderData?.expires_at}
                  handleCountdownFinish={handleCountdownFinish}
                />
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* Original content - will be hidden on mobile when collapsed */}
      <View
        style={[
          styles.orderInfoSection,
          isExpanded ? styles.expanded : styles.collapsed,
        ]}
      >
        {_map(paymentFieldsData, (field) => {
          const { id, label, normalizer = _identity } = field
          const value = orderData[id as keyof IOrderData] || ''
          let component = null

          if (field.id === 'add_ons' && _isEmpty(value)) {
            return null
          }

          if (field.id === 'tableTypes') {
            const valueArray = value as Array<any>

            component = (
              <View key={id} style={styles.orderInfoBlock}>
                {_map(valueArray, (tableTypeItem) => (
                  <View key={tableTypeItem.id} style={styles.tableTypeGrid}>
                    <View style={styles.orderInfoBlock}>
                      <Text style={styles.orderInfoTitle}>Table Type</Text>
                      <Text style={styles.orderInfoText}>
                        {tableTypeItem.ticketType}
                      </Text>
                    </View>
                    <View style={styles.orderInfoBlock}>
                      <Text style={styles.orderInfoTitle}>
                        Number of Tables
                      </Text>
                      <Text style={styles.orderInfoText}>
                        {tableTypeItem.count}
                      </Text>
                    </View>
                    <View style={styles.orderInfoBlock}>
                      <Text style={styles.orderInfoTitle}>Guest Count</Text>
                      <Text style={styles.orderInfoText}>
                        {tableTypeItem.quantity}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )
          }

          return (
            component || (
              <View key={id} style={styles.orderInfoBlock}>
                <Text style={styles.orderInfoTitle}>{label}</Text>
                <View style={styles.orderInfoText}>
                  {typeof value === 'string' || typeof value === 'number' ? (
                    <Text>{normalizer(value, currency, orderData)}</Text>
                  ) : (
                    _map(value, (item) =>
                      item.isTable
                        ? defaultTableRenderer(item)
                        : defaultItemRenderer(item)
                    )
                  )}
                </View>
              </View>
            )
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  mobileOrderSummary: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  mobileOrderSummaryContent: {
    padding: 15,
  },
  mobileOrderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  mobileOrderInfoContainer: {
    flex: 1,
  },
  orderInfoContainerLeft: {
    alignItems: 'flex-start',
  },
  orderInfoContainerRight: {
    alignItems: 'flex-end',
  },
  mobileOrderText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  mobileOrderTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  mobileOrderTimer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    borderStyle: 'dashed',
  },
  timerText: {
    fontSize: 13,
    color: '#f44336',
    fontWeight: 'bold',
  },
  orderInfoSection: {
    paddingVertical: 15,
  },
  collapsed: {
    display: 'none',
  },
  expanded: {
    marginTop: 10,
  },
  orderInfoBlock: {
    paddingVertical: 15,
  },
  orderInfoTitle: {
    fontSize: 14,
    fontWeight: '700',
    paddingBottom: 3,
    color: '#333',
  },
  orderInfoText: {
    // fontSize: 16,
    // lineHeight: 20,
    // color: '#333',
  },
  tableTypeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  addonContainer: {
    marginBottom: 8,
  },
  addonText: {
    fontSize: 14,
    color: '#333',
  },
  feesText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  tableContainer: {
    marginBottom: 8,
  },
  tableText: {
    fontSize: 14,
    color: '#333',
  },
  tablePrice: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
})
