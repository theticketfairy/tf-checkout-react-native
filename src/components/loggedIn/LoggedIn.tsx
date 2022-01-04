import React, { FC } from 'react'
import { View } from 'react-native'

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
  const handleMyOrdersPress = () => {
    if (onPressMyOrders) {
      onPressMyOrders()
    }
  }

  const handleLogOutPress = () => {
    if (onPressLogout) {
      onPressLogout()
    }
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
    </View>
  )
}

export default LoggedIn
