import {
  CardFormView,
  initStripe,
  useConfirmPayment,
} from '@stripe/stripe-react-native'
import _every from 'lodash/every'
import _forEach from 'lodash/forEach'
import _map from 'lodash/map'
import _mapKeys from 'lodash/mapKeys'
import React, { useEffect, useState } from 'react'
import { Alert } from 'react-native'

import {
  fetchEventConditions,
  fetchOrderReview,
  postOnFreeRegistration,
  postOnPaymentSuccess,
} from '../../api/ApiClient'
import { IOrderReview } from '../../api/types'
import { IFormFieldProps } from '../../components/formField/types'
import { priceWithCurrency } from '../../helpers/StringsHelper'
import { orderReviewItems } from './CheckoutData'
import CheckoutView from './CheckoutView'
import { ICheckoutProps, IOrderItem } from './types'

const Checkout = ({
  eventId,
  hash,
  onFetchOrderReviewFail,
  onFetchOrderReviewSuccess,
  onFetchEventConditionsFail,
  onFetchEventConditionsSuccess,
  onCheckoutCompletedFail,
  onCheckoutCompletedSuccess,
  onPaymentError,
  onPaymentSuccess,
  onStripeInitializeError,
  texts,
  styles,
  onPressExit,
}: ICheckoutProps) => {
  const { confirmPayment, loading: isStripeLoading } = useConfirmPayment()
  const [isLoading, setIsLoading] = useState(true)
  const [orderReview, setOrderReview] = useState<IOrderReview>()
  const [conditionsTexts, setConditionsTexts] = useState<string[]>([])
  const [conditionsValues, setConditionsValues] = useState<boolean[]>([])
  const [orderInfo, setOrderInfo] = useState<IOrderItem[]>(orderReviewItems)
  const [paymentInfo, setPaymentInfo] = useState<CardFormView.Details>()
  const [isStripeConfigMissing, setIsStripeConfigMissing] = useState(false)
  const [isPaymentRequired, setIsPaymentRequired] = useState(false)
  const [isLoadingFreeRegistration, setIsLoadingFreeRegistration] =
    useState(false)

  //#region Handlers
  const handleOnChangePaymentInfo = (details: CardFormView.Details) => {
    console.log('handleOnChangePaymentInfo', details)
    setPaymentInfo(details)
  }

  const handleOnCheckCondition = (index: number) => {
    const tConditionsValues = [...conditionsValues]
    tConditionsValues[index] = !conditionsValues[index]
    setConditionsValues(tConditionsValues)
  }

  const handleOnPressFreeRegistration = async () => {
    setIsLoadingFreeRegistration(true)
    const { freeRegistrationData, freeRegistrationError } =
      await postOnFreeRegistration(hash)
    setIsLoadingFreeRegistration(false)
    if (freeRegistrationError) {
      if (onPaymentError) onPaymentError(freeRegistrationError)
      return Alert.alert('', freeRegistrationError)
    }

    if (onPaymentSuccess) {
      return onPaymentSuccess(freeRegistrationData)
    }
  }

  const handleOnPressPay = async () => {
    if (!orderReview || !paymentInfo) {
      return
    }

    const { addressData } = orderReview

    const { error: confirmPaymentError, paymentIntent } = await confirmPayment(
      orderReview.paymentData!.stripeClientSecret!,
      {
        type: 'Card',
        billingDetails: {
          addressCity: addressData.city,
          addressLine1: addressData.line1,
          addressState: addressData.state,
          addressPostalCode: addressData.postalCode,
          name: `${orderReview.billingData.firstName} ${orderReview.billingData.lastName}`,
        },
      }
    )

    console.log('Payment intent - Data', paymentIntent)
    console.log('Payment intent - Error', confirmPaymentError)

    if (confirmPaymentError || !paymentInfo) {
      if (onCheckoutCompletedFail) {
        onCheckoutCompletedFail(
          confirmPaymentError?.message || 'Missing Payment Info'
        )
      }
      return Alert.alert('', 'Missing Payment Info')
    }

    if (onCheckoutCompletedSuccess) {
      onCheckoutCompletedSuccess(paymentIntent)
    }

    const { data: onPaymentSuccessData, error: onPaymentSuccessError } =
      await postOnPaymentSuccess(hash)

    if (onPaymentSuccessError) {
      if (onPaymentError) {
        onPaymentError(onPaymentSuccessError)
      }
      return Alert.alert('', onPaymentSuccessError)
    }

    if (onPaymentSuccess) {
      onPaymentSuccess(onPaymentSuccessData)
    }
  }
  //#endregion

  const getConditions = (): IFormFieldProps[] =>
    _map(conditionsTexts, (conditionTxt, index) => {
      return {
        id: `condition${index}`,
        fieldType: 'checkbox',
        checkboxProps: {
          isActive: conditionsValues[index],
          text: conditionTxt,
          onPress: () => handleOnCheckCondition(index),
        },
      }
    })

  //#region useEffects
  useEffect(() => {
    const fetchEventConditionsAsync = async () => {
      const { error: conditionsError, data: conditionsData } =
        await fetchEventConditions(eventId.toString())

      if (conditionsError) {
        Alert.alert('', conditionsError)
        if (onFetchEventConditionsFail) {
          onFetchEventConditionsFail(conditionsError)
        }
        return
      }

      setConditionsValues(_map(conditionsData, () => false))
      setConditionsTexts(conditionsData)
      if (onFetchEventConditionsSuccess) {
        onFetchEventConditionsSuccess(conditionsData)
      }
    }

    const fetchOrderReviewAsync = async () => {
      const { data: orderReviewData, error: orderReviewError } =
        await fetchOrderReview(hash)
      console.log('orderReviewResponse - data', orderReviewData)
      console.log('orderReviewResponse - error', orderReviewError)
      setIsLoading(false)

      if (orderReviewError || !orderReviewData) {
        setIsStripeConfigMissing(true)
        Alert.alert('', orderReviewError)
        if (onFetchOrderReviewFail) {
          onFetchOrderReviewFail(
            orderReviewError || 'Error while getting Order Review'
          )
        }
        return
      }

      const tOrderInfo = [...orderInfo]
      const currency = orderReviewData.reviewData.currency
      _forEach(tOrderInfo, (item) => {
        _mapKeys(orderReviewData.reviewData, (value, key) => {
          if (item.id === key) {
            if (key === 'price' || key === 'total') {
              item.value = priceWithCurrency(value, currency)
            } else {
              item.value = value
            }
          }
        })
      })

      setOrderInfo(tOrderInfo)
      setOrderReview(orderReviewData)

      console.log('Order Review Data', orderReviewData.reviewData)
      console.log('orderReviewData.paymentData', orderReviewData.paymentData)

      if (orderReview?.reviewData.total !== '0.00') {
        return setIsPaymentRequired(true)
      }

      if (!orderReviewData.paymentData?.stripePublishableKey) {
        if (onStripeInitializeError) {
          onStripeInitializeError('Stripe is not configured for this event')
        }
        setIsPaymentRequired(false)

        return Alert.alert(
          'Stripe is not configured for this event',
          'Please contact support.'
        )
      }

      try {
        await initStripe({
          publishableKey: orderReviewData.paymentData.stripePublishableKey,
          stripeAccountId: orderReviewData.paymentData.stripeConnectedAccount,
        })
      } catch (stripeError) {
        console.log('Stripe Error')
        if (onStripeInitializeError) {
          onStripeInitializeError('Error initializing Stripe')
        }
      }
    }

    const fetchInitialData = async () => {
      setIsLoading(true)
      await fetchEventConditionsAsync()
      await fetchOrderReviewAsync()
      setIsLoading(false)
    }

    fetchInitialData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  //#endregion

  const getIsDataValid = () => {
    const paymentValid = paymentInfo?.complete
    return paymentValid && _every(conditionsValues, (item) => item === true)
  }

  console.log(
    '%cCheckout.tsx line:254 loading',
    'color: #007acc;',
    isStripeLoading
  )
  console.log('%cCheckout.tsx line:254 isLoading', 'color: #00FFcc;', isLoading)

  return (
    <CheckoutView
      orderReviewDataItems={orderInfo}
      onPressPay={handleOnPressPay}
      onPressFreeRegistration={handleOnPressFreeRegistration}
      conditions={getConditions()}
      onFormComplete={handleOnChangePaymentInfo}
      isLoading={isLoading || isStripeLoading}
      isDataValid={!getIsDataValid()}
      isStripeConfigMissing={isStripeConfigMissing}
      styles={styles}
      texts={texts}
      onPressExit={onPressExit}
      isPaymentRequired={isPaymentRequired}
      isLoadingFreeRegistration={isLoadingFreeRegistration}
    />
  )
}

export default Checkout
