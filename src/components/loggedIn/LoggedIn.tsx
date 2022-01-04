import React, { FC, useState } from 'react'
import { View } from 'react-native'

import { MyOrders } from '../../containers'
import { Button } from '..'
import s from './styles'
import { ILoggedInProps } from './types'

const LoggedIn: FC<ILoggedInProps> = ({
  myOrdersButtonStyles,
  myOrderButtonText,
  onPressMyOrders,
  onPressLogout,
  logOutButtonStyles,
  logOutButtonText,
  rootContainerStyle,
}) => {
  const [isMyOrdersVisible, setIsMyOrdersVisible] = useState(false)

  console.log('isMyOrdersVisible', isMyOrdersVisible)
  const handleMyOrdersPress = () => {
    if (onPressMyOrders) {
      onPressMyOrders()
    }
    setIsMyOrdersVisible(true)
  }

  const handleLogOutPress = () => {
    if (onPressLogout) {
      onPressLogout()
    }
  }

  const handleOnDismissMyOrders = () => {
    setIsMyOrdersVisible(false)
  }

  return (
    <View style={[s.rootContainer, rootContainerStyle]}>
      <Button
        text={myOrderButtonText || 'MY ORDERS'}
        onPress={handleMyOrdersPress}
        styles={myOrdersButtonStyles}
      />
      <Button
        text={logOutButtonText || 'LOG OUT'}
        onPress={handleLogOutPress}
        styles={logOutButtonStyles}
      />
      {isMyOrdersVisible && (
        <MyOrders onDismissMyOrders={handleOnDismissMyOrders} />
      )}
    </View>
  )
}

export default LoggedIn
