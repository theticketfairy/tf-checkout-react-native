import {
  CardForm,
  CardFormView,
  initStripe,
  useConfirmPayment,
} from '@stripe/stripe-react-native'
import _every from 'lodash/every'
import _forEach from 'lodash/forEach'
import _map from 'lodash/map'
import _mapKeys from 'lodash/mapKeys'
import React, { useCallback, useEffect, useState } from 'react'
import { Alert, Text, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import {
  fetchEventConditions,
  fetchOrderReview,
  postOnFreeRegistration,
  postOnPaymentSuccess,
} from '../../api/ApiClient'
import { IOrderReview } from '../../api/types'
import { Loading } from '../../components'
import Button from '../../components/button/Button'
import { IFormFieldProps } from '../../components/formField/types'
import { priceWithCurrency } from '../../helpers/StringsHelper'
import { orderReviewItems } from './CheckoutData'
import Conditions from './components/Conditions'
import OrderReview from './components/OrderReview'
import s from './styles'
import { ICheckoutProps, IOrderItem } from './types'

const Checkout = ({
  eventId,
  hash,
  onFetchOrderReviewError,
  onFetchOrderReviewSuccess,
  onFetchEventConditionsError,
  onFetchEventConditionsSuccess,
  onCheckoutCompletedError,
  onCheckoutCompletedSuccess,
  onPaymentError,
  onPaymentSuccess,
  onStripeInitializeError,
  texts,
  styles,
  onPressExit,
  areAlertsEnabled = true,
  areLoadingIndicatorsEnabled = true,
  onLoadingChange,
}: ICheckoutProps) => {
  const { confirmPayment, loading: isLoadingPayment } = useConfirmPayment()
  const [isLoading, setIsLoading] = useState(true)
  const [orderReview, setOrderReview] = useState<IOrderReview>()
  const [conditionsTexts, setConditionsTexts] = useState<string[]>([])
  const [conditionsValues, setConditionsValues] = useState<boolean[]>([])
  const [orderInfo, setOrderInfo] = useState<IOrderItem[]>(orderReviewItems)
  const [paymentInfo, setPaymentInfo] = useState<CardFormView.Details>()
  const [isStripeConfigMissing, setIsStripeConfigMissing] = useState(false)
  const [isPaymentRequired, setIsPaymentRequired] = useState(false)

  const showLoading = () => setIsLoading(true)
  const hideLoading = () => setIsLoading(false)

  const showAlert = (message: string) => {
    if (areAlertsEnabled) {
      Alert.alert('', message)
    }
  }

  //#region Handlers
  const handleOnPressExit = () => {
    onPressExit()
  }

  const handleOnChangePaymentInfo = (details: CardFormView.Details) => {
    setPaymentInfo(details)
  }

  const handleOnCheckCondition = (index: number) => {
    const tConditionsValues = [...conditionsValues]
    tConditionsValues[index] = !conditionsValues[index]
    setConditionsValues(tConditionsValues)
  }

  const handleOnPressFreeRegistration = async () => {
    showLoading()
    const { freeRegistrationData, freeRegistrationError } =
      await postOnFreeRegistration(hash)
    hideLoading()

    if (freeRegistrationError) {
      if (onPaymentError) {
        onPaymentError(freeRegistrationError)
      }
      return showAlert(
        freeRegistrationError.message || 'Error while registering'
      )
    }

    if (onPaymentSuccess) {
      return onPaymentSuccess(freeRegistrationData)
    }
  }

  const handleOnPressPay = async () => {
    if (!orderReview) {
      if (onPaymentError) {
        onPaymentError({
          message: `Order data is missing ${JSON.stringify(orderReview)}`,
        })
      }

      return showAlert('No order data found')
    }

    const { addressData } = orderReview

    showLoading()
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

    if (confirmPaymentError) {
      hideLoading()
      if (onCheckoutCompletedError) {
        onCheckoutCompletedError({
          message: confirmPaymentError.message,
          extraData: confirmPaymentError.code,
        })
      }
      showAlert(confirmPaymentError?.message || 'Error confirming payment')
      return
    }

    if (onCheckoutCompletedSuccess) {
      onCheckoutCompletedSuccess(paymentIntent)
    }

    const { data: onPaymentSuccessData, error: onPaymentSuccessError } =
      await postOnPaymentSuccess(hash)

    if (onPaymentSuccessError) {
      hideLoading()
      if (onPaymentError) {
        onPaymentError(onPaymentSuccessError)
      }
      return showAlert(
        onPaymentSuccessError.message || 'Error while performing payment'
      )
    }

    hideLoading()
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

  const onLoadingChangeCallback = useCallback(
    (loading: boolean) => {
      if (onLoadingChange) {
        onLoadingChange(loading)
      }
    },
    [onLoadingChange]
  )

  //#region useEffects
  useEffect(() => {
    onLoadingChangeCallback(isLoading)
  }, [isLoading, onLoadingChangeCallback])

  useEffect(() => {
    const fetchEventConditionsAsync = async () => {
      const { error: conditionsError, data: conditionsData } =
        await fetchEventConditions(eventId.toString())

      if (conditionsError) {
        hideLoading()
        if (onFetchEventConditionsError) {
          onFetchEventConditionsError(conditionsError)
        }
        return showAlert(
          conditionsError.message || 'Error while fetching conditions'
        )
      }

      setConditionsValues(_map(conditionsData, () => false))
      setConditionsTexts(conditionsData)
      hideLoading()
      if (onFetchEventConditionsSuccess) {
        onFetchEventConditionsSuccess(conditionsData)
      }
    }

    const fetchOrderReviewAsync = async () => {
      const { data: orderReviewData, error: orderReviewError } =
        await fetchOrderReview(hash)
      hideLoading()

      if (orderReviewError) {
        hideLoading()
        setIsStripeConfigMissing(true)
        if (onFetchOrderReviewError) {
          onFetchOrderReviewError(orderReviewError)
        }
        return showAlert(
          orderReviewError?.message || 'Error while getting Order Review'
        )
      }

      if (!orderReviewData) {
        if (onFetchOrderReviewError) {
          onFetchOrderReviewError({
            message: 'No order review data found. Please try again later',
          })
        }
        return showAlert('No order review data found. Please try again later')
      }

      hideLoading()
      if (onFetchOrderReviewSuccess) {
        onFetchOrderReviewSuccess(orderReviewData)
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

      if (orderReview?.reviewData.total !== '0.00') {
        if (!orderReviewData.paymentData?.stripePublishableKey) {
          if (onStripeInitializeError) {
            onStripeInitializeError('Stripe is not configured for this event')
          }

          showAlert(
            'Stripe is not configured for this event.Please contact support.'
          )
          return
        }

        setIsPaymentRequired(true)

        try {
          await initStripe({
            publishableKey: orderReviewData.paymentData.stripePublishableKey,
            stripeAccountId: orderReviewData.paymentData.stripeConnectedAccount,
          })
        } catch (stripeError) {
          if (onStripeInitializeError) {
            onStripeInitializeError('Error initializing Stripe')
          }
        }
      } else {
        setIsPaymentRequired(false)
      }
    }

    const fetchInitialData = async () => {
      showLoading()
      await fetchEventConditionsAsync()
      await fetchOrderReviewAsync()
      hideLoading()
    }

    fetchInitialData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  //#endregion

  const getIsDataValid = () => {
    const paymentValid = paymentInfo?.complete
    return paymentValid && _every(conditionsValues, (item) => item === true)
  }

  const isDataValid = getIsDataValid()

  const payButtonStyle = isDataValid
    ? styles?.payment?.button
    : styles?.payment?.buttonDisabled

  return isStripeConfigMissing ? (
    <View
      style={[s.missingStripeContainer, styles?.missingStripeConfig?.container]}
    >
      <Text
        style={[s.missingStripeMessage, styles?.missingStripeConfig?.message]}
      >
        {texts?.missingStripeConfigMessage ||
          'Payment handler is missing, please contact support'}
      </Text>

      <Button
        styles={styles?.missingStripeConfig?.exitButton}
        text={texts?.exitButton || 'Exit'}
        onPress={handleOnPressExit}
      />
    </View>
  ) : (
    <KeyboardAwareScrollView
      extraScrollHeight={32}
      keyboardDismissMode='on-drag'
    >
      <View style={styles?.rootStyle}>
        <View>
          <Text style={[s.title, styles?.title]}>
            {texts?.title || 'GET YOUR TICKETS'}
          </Text>
          <Text style={[styles?.subTitle]}>
            {texts?.subTitle || 'Order review'}
          </Text>
        </View>
        <OrderReview orderItems={orderInfo} styles={styles?.orderReview} />
        {isPaymentRequired && !isStripeConfigMissing && (
          <View style={styles?.payment?.container}>
            <Text style={styles?.payment?.title}>
              Please provide your payment information
            </Text>
            <CardForm
              onFormComplete={handleOnChangePaymentInfo}
              style={[s.card, styles?.payment?.cardContainer]}
            />
          </View>
        )}
        <Conditions {...getConditions()} />
        {isPaymentRequired && !isStripeConfigMissing && (
          <Button
            text={texts?.payButton || 'PAY'}
            onPress={handleOnPressPay}
            isDisabled={!isDataValid}
            styles={{
              container: s.payButton,
              ...payButtonStyle,
            }}
          />
        )}
        {!isPaymentRequired && (
          <Button
            text={texts?.freeRegistrationButton || 'COMPLETE REGISTRATION'}
            onPress={handleOnPressFreeRegistration}
            isLoading={isLoading || isLoadingPayment}
            styles={styles?.freeRegistrationButton}
          />
        )}
      </View>
      {isLoading && areLoadingIndicatorsEnabled && <Loading />}
    </KeyboardAwareScrollView>
  )
}

export default Checkout
