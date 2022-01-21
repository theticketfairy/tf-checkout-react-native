import { CardForm, CardFormView } from '@stripe/stripe-react-native'
import React from 'react'
import { Text, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { Button, Loading } from '../../components'
import Conditions from './components/Conditions'
import OrderReview from './components/OrderReview'
import s from './styles'
import { ICheckoutViewProps } from './types'

const CheckoutView = ({
  texts,
  styles,
  orderReviewDataItems,
  onPressPay,
  conditions,
  onFormComplete,
  isDataValid,
  isLoading,
  isStripeConfigMissing,
  onPressExit,
  isPaymentRequired,
  onPressFreeRegistration,
  isLoadingFreeRegistration,
}: ICheckoutViewProps) => {
  const title = texts?.title ? texts.title : 'GET YOUR TICKETS'
  const subTitle = texts?.subTitle ? texts.subTitle : 'Order review'

  const handleOnPressPay = () => {
    onPressPay()
  }

  const handleOnFormComplete = (cardDetails: CardFormView.Details) => {
    onFormComplete(cardDetails)
  }

  const handleOnPressExit = () => {
    if (onPressExit) {
      onPressExit()
    }
  }

  console.log('isStripeConfigMissing', isStripeConfigMissing)
  console.log('Is payment req', isPaymentRequired)

  const payButtonStyle = isDataValid
    ? styles?.payment?.buttonDisabled
    : styles?.payment?.button

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
    <KeyboardAwareScrollView extraScrollHeight={32}>
      <View style={styles?.rootStyle}>
        <View>
          <Text style={[s.title, styles?.title]}>{title}</Text>
          <Text style={[styles?.subTitle]}>{subTitle}</Text>
        </View>
        <OrderReview
          orderItems={orderReviewDataItems}
          styles={styles?.orderReview}
        />
        {isPaymentRequired && !isStripeConfigMissing && (
          <View style={styles?.payment?.container}>
            <Text style={styles?.payment?.title}>
              Please provide your payment information
            </Text>
            <CardForm
              onFormComplete={handleOnFormComplete}
              style={[s.card, styles?.payment?.cardContainer]}
              cardStyle={{
                backgroundColor: styles?.payment?.cardBackgroundColor,
              }}
            />
          </View>
        )}
        <Conditions {...conditions} />
        {isPaymentRequired && !isStripeConfigMissing && (
          <Button
            text='PAY'
            onPress={handleOnPressPay}
            isDisabled={isDataValid}
            styles={{
              container: s.payButton,
              ...payButtonStyle,
            }}
          />
        )}
        {!isPaymentRequired && (
          <Button
            text='COMPLETE REGISTRATION'
            onPress={onPressFreeRegistration}
            isLoading={isLoadingFreeRegistration}
            styles={styles?.freeRegistrationButton}
          />
        )}
      </View>
      {isLoading && <Loading />}
    </KeyboardAwareScrollView>
  )
}

export default CheckoutView
