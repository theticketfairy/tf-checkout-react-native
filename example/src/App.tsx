import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native'

import {
  Tickets,
  IAddToCartSuccess,
  IOnCheckoutSuccess,
  BillingInfo,
  Checkout,
  PurchaseConfirmation,
} from 'tf-checkout-react-native'
import styles from './styles'

const EVENT_ID = 5420 // Replace with assigned ID
enum ComponentEnum {
  Tickets,
  BillingInfo,
  Checkout,
  PurchaseConfirmation,
  MyOrders,
}

const App = () => {
  const [componentToShow, setComponentToShow] = useState<ComponentEnum>(
    ComponentEnum.Tickets
  )
  const [cartProps, setCartProps] = useState<IAddToCartSuccess | undefined>(
    undefined
  )
  const [checkoutProps, setCheckOutProps] = useState<
    IOnCheckoutSuccess | undefined
  >(undefined)

  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false)

  const handleOnAddToCartSuccess = (data: IAddToCartSuccess) => {
    setCartProps(data)
  }

  const handleOnLoginSuccess = (data: any) => {
    console.log('handleOnLoginSuccess')
  }

  const handleOnFetchUserProfileSuccess = () => {}

  const handleOnCheckoutSuccess = (data: IOnCheckoutSuccess) => {
    setCheckOutProps(data)
  }

  const handleOnPaymentSuccess = (data: any) => {
    console.log('handleOnPaymentSuccess')
    setIsPaymentSuccess(true)
  }

  const handleOnComplete = () => {
    console.log('Exit')
  }

  useEffect(() => {
    if (cartProps) {
      setComponentToShow(ComponentEnum.BillingInfo)
    }
  }, [cartProps])

  useEffect(() => {
    if (checkoutProps) {
      setComponentToShow(ComponentEnum.Checkout)
    }
  }, [checkoutProps])

  useEffect(() => {
    if (isPaymentSuccess) {
      setComponentToShow(ComponentEnum.PurchaseConfirmation)
    }
  }, [isPaymentSuccess])

  const RenderComponent = () => {
    switch (componentToShow) {
      case ComponentEnum.BillingInfo:
        return (
          <BillingInfo
            cartProps={cartProps!}
            onLoginSuccess={handleOnLoginSuccess}
            onFetchUserProfileSuccess={handleOnFetchUserProfileSuccess}
            onCheckoutSuccess={handleOnCheckoutSuccess}
          />
        )
      case ComponentEnum.Checkout:
        return (
          <Checkout
            eventId={EVENT_ID}
            hash={checkoutProps!.hash}
            total={checkoutProps!.total}
            onPaymentSuccess={handleOnPaymentSuccess}
          />
        )
      case ComponentEnum.PurchaseConfirmation:
        return (
          <PurchaseConfirmation
            orderHash={checkoutProps!.hash}
            onComplete={handleOnComplete}
          />
        )

      default:
        return (
          <Tickets
            eventId={EVENT_ID}
            onAddToCartSuccess={handleOnAddToCartSuccess}
          />
        )
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>{RenderComponent()}</SafeAreaView>
  )
}

export default App
