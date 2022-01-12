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
  isStripeReady,
  isStripeConfigMissing,
  onPressExit,
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

  console.log('Is stripe Ready', isStripeReady)

  return isStripeConfigMissing ? (
    <View
      style={[s.missingStripeContainer, styles?.missingStripeConfigContainer]}
    >
      <Text
        style={[s.missingStripeMessage, styles?.missingStripeConfigMessage]}
      >
        {texts?.missingStripeConfigMessage ||
          'Payment handler is missing, please contact support'}
      </Text>

      <Button
        styles={styles?.exitButton}
        text={texts?.exitButton || 'Exit'}
        onPress={handleOnPressExit}
      />
    </View>
  ) : (
    <KeyboardAwareScrollView extraScrollHeight={32}>
      <View>
        <View>
          <Text style={[s.title]}>{title}</Text>
          <Text>{subTitle}</Text>
        </View>
        <OrderReview orderItems={orderReviewDataItems} />
        <Text>Please provide your payment information</Text>
        {isStripeReady && (
          <CardForm onFormComplete={handleOnFormComplete} style={s.card} />
        )}
        <Conditions {...conditions} />
        <Button
          text='PAY'
          onPress={handleOnPressPay}
          isDisabled={isDataValid}
          styles={{
            container: s.payButton,
          }}
        />
      </View>
      {isLoading && <Loading />}
    </KeyboardAwareScrollView>
  )
}

export default CheckoutView
