/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
import { AxiosError } from 'axios'
import _get from 'lodash/get'
import _identity from 'lodash/identity'
import _map from 'lodash/map'
import React, { useEffect, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import { fetchOrderReview } from '../../api/ApiClient'
import { IOrderReview } from '../../api/types'
// import { FEES_STYLES } from '../../constants'
import {
  createFixedFloatNormalizer,
  currencyNormalizerCreator,
} from '../../utils/normalizers'
import { useStripeConfig, useStripePayment } from '../stripePayment/hooks'
import StripePayment from '../stripePayment/StripePayment'
import { IStripePaymentProps } from '../stripePayment/types'
// import TimerWidget from '../timerWidget'
import { handlePaymentMiddleWare } from './handlePayment'
import { OrderDetails } from './OrderDetails'
import {
  IAddOn,
  IOrderData,
  IPaymentField,
  IPaymentPlanConfig,
  IPaymentPlanConfigCard,
} from './types'

export interface IPaymentPage {
  paymentFields: IPaymentField[]
  handlePayment: any
  checkoutData: any
  formTitle?: string
  errorText?: string
  onErrorClose?: () => void
  onGetPaymentDataSuccess: (value: any) => void
  onGetPaymentDataError: (value: AxiosError) => void
  onPaymentError: (value: AxiosError, slug?: string) => void
  elementsOptions?: any
  onCountdownFinish?: () => void
  paymentInfoLabel?: string
  orderInfoLabel?: string
  displayPaymentButton?: boolean
  hidePaymentForm?: boolean
  hideFieldsBlock?: boolean
  isSinglePageCheckout?: boolean
  stripePaymentProps?: Partial<IStripePaymentProps>
  stripePublishableKey?: string
  stripeAccountId?: string
}

const initialPaymentPlanConfiguration: IPaymentPlanConfig = {
  requires_deposit: false,
  deposit: 0,
  interval: 0,
  non_refundable_amount: 0,
  non_refundable_type: null,
  has_admin_fee: false,
  admin_fee: 0,
  total_installments: 0,
  price_per_installment: 0,
  stripe_setup_intent_secret: '',
  total: 0,
  saved_card: {
    last_4_digits: null,
    stripe_payment_method_id: null,
  } as IPaymentPlanConfigCard,
}

const initialOrderValues: IOrderData = {
  id: '',
  product_name: '',
  ticketType: '',
  quantity: '',
  price: '',
  total: '',
  currency: 'USD',
  guest_count: '',
  pay_now: '',
  add_ons: [] as IAddOn[],
  cost: '',
}

export const PaymentContainer = ({
  paymentFields = [],
  handlePayment,
  formTitle = 'Get Your Tickets',
  errorText,
  onErrorClose = _identity,
  onGetPaymentDataSuccess = _identity,
  onGetPaymentDataError = _identity,
  onPaymentError = _identity,
  elementsOptions,
  onCountdownFinish = _identity,
  orderInfoLabel = 'Order Review',
  paymentInfoLabel = 'Order Confirmation',
  displayPaymentButton = true,
  hidePaymentForm = false,
  hideFieldsBlock = true,
  isSinglePageCheckout = false,
  stripePaymentProps = {},
  stripePublishableKey,
}: // stripeAccountId,
IPaymentPage) => {
  const [reviewData, setReviewData] = useState({} as IOrderReview)
  const [orderData, setOrderData] = useState(initialOrderValues)
  const [error, setError] = useState<string | null>(null)
  const showPaymentPlanSection = false
  const [paymentIsLoading, setPaymentIsLoading] = useState(false)
  const [, setPaymentDataIsLoading] = useState(true)
  const [paymentPlanConfig] = useState(initialPaymentPlanConfiguration)
  const paymentPlanUseSavedCard = false

  const showFormTitle = Boolean(formTitle)
  const showErrorText = Boolean(errorText)

  const eventId = _get(reviewData, 'cart[0].product_id') || ''
  const hash = _get(reviewData, 'hash') || ''
  const total = _get(reviewData, 'total') || ''
  const isFreeTickets = useMemo(
    () =>
      (!Number(total) && !Number(orderData.total)) ||
      !Number(orderData.pay_now),
    [total, orderData]
  )

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        const paymentDataResponse = await fetchOrderReview(hash)
        if (paymentDataResponse.orderReviewData) {
          const attributes = paymentDataResponse?.orderReviewData
          setReviewData(attributes)
          const { cart, orderDetails } = attributes
          const {
            tickets: [ticket],
          } = orderDetails

          const orderDataArray = _map(orderDetails.tickets, (item) => ({
            product_name: cart[0]?.product_name,
            ticketType: item?.name,
            quantity: item?.guest_count,
            price: item?.price,
            cost: item?.cost,
            id: item.id,
            count: item?.quantity,
          }))

          const orderDataObj = {
            id: orderDetails?.id,
            product_name: cart[0]?.product_name,
            ticketType: ticket?.name,
            quantity: ticket?.quantity,
            price: ticket?.price,
            total: orderDetails?.total,
            currency: orderDetails?.currency,
            add_ons: orderDetails?.add_ons || [],
            pay_now: orderDetails?.pay_now || '',
            guest_count: orderDetails?.guest_count || '',
            debt: orderDetails?.debt || null,
            tableTypes: orderDataArray,
            cost: ticket?.cost,
            subtotal: orderDetails?.subtotal,
            fees: orderDetails?.fees,
          }
          setOrderData(orderDataObj)
          // setCurrency(orderDetails?.currency)
          onGetPaymentDataSuccess(paymentDataResponse.orderReviewData)
        }
      } catch (e) {
        setError(_get(e, 'response.data.message', null))
        onGetPaymentDataError(
          (e as Record<string, unknown>).response as AxiosError
        )
      }
    }

    if (isSinglePageCheckout) {
      if (!orderData?.total) {
        console.log('🚀 ~ PaymentContainer ~ orderData:', orderData)
        setOrderData((current: any) => ({ ...current, pay_now: 1, total: 1 }))
        setPaymentDataIsLoading(false)
      }
    } else {
      fetchPaymentData()
    }
    console.log('🚀 ~ PaymentContainer ~ orderData:', orderData)
  }, [])

  const showPaymentForm = () => {
    if (hidePaymentForm) {
      return false
    }

    let showPaymentFormVar = !isFreeTickets

    if (
      showPaymentPlanSection &&
      !!paymentPlanConfig.saved_card?.stripe_payment_method_id
    ) {
      showPaymentFormVar = !paymentPlanUseSavedCard
    }

    return showPaymentFormVar
  }

  const getPublishableKey = () =>
    stripePublishableKey ||
    _get(reviewData, 'payment_method.stripe_publishable_key')

  const getStripeAccountId = () =>
    _get(reviewData, 'payment_method.stripe_connected_account')

  const getClientSecret = () =>
    _get(reviewData, 'payment_method.stripe_client_secret')

  const getSetupIntentSecret = () =>
    _get(reviewData, 'payment_method.stripe_setup_intent_client_secret')

  // Initialize Stripe hooks
  useStripeConfig({
    stripePublishableKey: getPublishableKey(),
    stripeAccountId: getStripeAccountId(),
    elementsConfig: elementsOptions,
  })

  useStripePayment({
    onError: (error: string) => {
      setError(error)
      onPaymentError(new Error(error) as any)
    },
  })

  const hasTableTypes = Boolean(Number(orderData.guest_count))
  const paymentFieldsData = hasTableTypes
    ? [
        {
          label: 'Event',
          id: 'product_name',
        },
        {
          label: '',
          id: 'tableTypes',
        },
        {
          label: 'Add-ons',
          id: 'add_ons',
        },
        {
          label: 'Total (incl. fees, card processing and taxes)',
          id: 'total',
          normalizer: (value: string, currency: string) =>
            currencyNormalizerCreator(
              createFixedFloatNormalizer(2)(parseFloat(value)),
              currency
            ),
        },
        {
          label: 'Pay Now',
          id: 'pay_now',
          normalizer: (value: string, currency: string) =>
            currencyNormalizerCreator(
              createFixedFloatNormalizer(2)(parseFloat(value)),
              currency
            ),
        },
        {
          label: 'Pay On Check-in',
          id: 'debt',
          normalizer: (value: string, currency: string) =>
            currencyNormalizerCreator(
              createFixedFloatNormalizer(2)(parseFloat(value)),
              currency
            ),
        },
      ]
    : paymentFields
  const isTable = orderData?.guest_count

  return (
    <ScrollView style={styles.container}>
      {isSinglePageCheckout
        ? null
        : error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                onPress={onErrorClose}
                style={styles.errorClose}
              >
                <Text style={styles.errorCloseText}>×</Text>
              </TouchableOpacity>
            </View>
          )}

      <View style={styles.content}>
        {showFormTitle && (
          <Text style={styles.title}>
            {isTable ? 'Get Your Tables' : formTitle}
          </Text>
        )}

        <Text style={styles.sectionLabel}>{orderInfoLabel}</Text>

        {!hideFieldsBlock && (
          <OrderDetails
            orderData={orderData}
            paymentFieldsData={paymentFieldsData}
            handleCountdownFinish={onCountdownFinish}
          />
        )}

        {showPaymentForm() && !!getPublishableKey() ? (
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentInfoLabel}>{paymentInfoLabel}</Text>
            {showErrorText && (
              <Text style={styles.paymentError}>{errorText}</Text>
            )}
            <StripePayment
              stripePublishableKey={getPublishableKey()}
              stripeAccountId={getStripeAccountId()}
              clientSecret={getClientSecret()}
              setupIntentClientSecret={getSetupIntentSecret()}
              elementsConfig={elementsOptions}
              displayPaymentButton={
                displayPaymentButton && !isSinglePageCheckout
              }
              onChangePaymentInfo={(paymentInfo) => {
                if (paymentInfo.complete && isSinglePageCheckout) {
                  // For single page checkout, we handle payment differently
                  return
                }
                // Legacy handling for non-single page checkout
                handlePaymentMiddleWare(error, paymentInfo || {}, {
                  reviewData,
                  isFreeTickets,
                  paymentPlanIsAvailable: false,
                  showPaymentPlanSection,
                  handlePayment,
                  setPaymentIsLoading,
                  setError,
                  orderData,
                  eventId,
                  isBrowser: false,
                  onPaymentError,
                })
              }}
              onChangeConfirmPaymentLoading={(loading) => {
                setPaymentIsLoading(loading)
              }}
              onError={(error) => {
                setError(error)
                onPaymentError(new Error(error) as any)
              }}
              onPaymentSuccess={(result) => {
                // Handle successful payment
                console.log('Payment successful:', result)
              }}
              onPaymentCancel={() => {
                console.log('Payment cancelled')
              }}
              {...stripePaymentProps}
            />
          </View>
        ) : displayPaymentButton ? (
          <View
            style={[
              styles.paymentButton,
              paymentIsLoading && styles.disabledButton,
            ]}
          >
            <TouchableOpacity
              disabled={paymentIsLoading}
              onPress={() => {
                setPaymentIsLoading(true)
                let data

                if (showPaymentPlanSection && paymentPlanUseSavedCard) {
                  data = {
                    paymentMethodId:
                      paymentPlanConfig.saved_card?.stripe_payment_method_id,
                  }
                }

                handlePaymentMiddleWare(null, data || {}, {
                  reviewData,
                  isFreeTickets,
                  paymentPlanIsAvailable: false,
                  showPaymentPlanSection,
                  handlePayment,
                  setPaymentIsLoading,
                  setError,
                  orderData,
                  eventId,
                  isBrowser: false,
                  onPaymentError,
                })
              }}
              style={styles.button}
            >
              {paymentIsLoading ? (
                <ActivityIndicator size='small' color='#fff' />
              ) : (
                <Text style={styles.buttonText}>
                  {isFreeTickets
                    ? 'Complete Registration'
                    : 'Confirm Payment Plan'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  errorContainer: {
    backgroundColor: '#f44336',
    padding: 12,
    margin: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    color: '#fff',
    flex: 1,
  },
  errorClose: {
    padding: 4,
  },
  errorCloseText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  paymentToggle: {
    marginVertical: 16,
  },
  paymentInfo: {
    marginTop: 20,
  },
  paymentInfoLabel: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  paymentError: {
    color: '#f44336',
    textAlign: 'center',
    marginBottom: 15,
  },
  paymentButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  button: {
    backgroundColor: '#1976d2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})
