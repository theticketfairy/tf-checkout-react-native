import React, { FC } from 'react'
import { Alert, View } from 'react-native'

import { Button } from '..'
import s from './styles'
import { ILoggedInProps } from './types'

const LoggedIn: FC<ILoggedInProps> = ({
  styles,
  texts,
  onPressMyOrders,
  onPressLogout,
}) => {
  const { rootContainerStyle, myOrdersButtonStyles, logOutButtonStyles } = {
    ...styles,
  }
  const { logoutDialog, myOrderButtonText, logOutButtonText } = { ...texts }
  const handleMyOrdersPress = async () => {
    if (onPressMyOrders) {
      onPressMyOrders()
    }
  }

  const handleLogOutPress = () => {
    if (onPressLogout) {
      Alert.alert(
        logoutDialog?.title || 'Do you want to logout?',
        logoutDialog?.message ||
          'You will need to enter your credentials again to purchase tickets',
        [
          {
            text: logoutDialog?.confirmButton || 'Yes, logout',
            style: 'destructive',
            onPress: onPressLogout,
          },
          {
            text: logoutDialog?.cancelButton || 'No',
          },
        ]
      )
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
