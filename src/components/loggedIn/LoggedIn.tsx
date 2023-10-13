import React, { type FC } from 'react'
import { Alert, View } from 'react-native'

import { Button } from '..'
import s from './styles'
import type { ILoggedInProps } from './types'



const LoggedIn: FC<ILoggedInProps> = ({
  styles,
  texts,
  onPressMyOrders,
  onPressLogout,
}) => {
  const { rootContainer, myOrdersButton, logOutButton } = {
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
        logoutDialog?.title || 'Do you want to log out?',
        logoutDialog?.message ||
          'You will lose your selection and you will need to enter your credentials again.',
        [
          {
            text: logoutDialog?.confirmButton || 'Yes',
            style: 'destructive',
            onPress: onPressLogout,
          },
          {
            text: logoutDialog?.cancelButton || 'No',
          },
        ]
      )
    }
  }

  return (
    <View style={[s.rootContainer, rootContainer]}>
      <Button
        text={myOrderButtonText || 'MY ORDERS'}
        onPress={handleMyOrdersPress}
        styles={myOrdersButton}
      />
      <Button
        text={logOutButtonText || 'LOG OUT'}
        onPress={handleLogOutPress}
        styles={logOutButton}
      />
    </View>
  )
}

export default LoggedIn
