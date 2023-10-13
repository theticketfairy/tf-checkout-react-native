import React, { type FC } from 'react'
import { Text, View } from 'react-native'

import Button from '../../button/Button'
import s from '../styles'
import type { ILoginLoggedComponentProps } from './types'



const LoggedComponent: FC<ILoginLoggedComponentProps> = ({
  styles,
  texts,
  onPressLogout,
  userFirstName,
}) => (
  <View style={styles?.container}>
    <Text style={styles?.placeholder}>
      {texts?.loggedAs || 'Logged in as:'}{' '}
      <Text style={styles?.value}>{userFirstName}</Text>
    </Text>
    <Text style={styles?.message}>{texts?.notYou || 'Not you?'}</Text>
    <Button
      text={texts?.logoutButton || 'LOGOUT'}
      onPress={onPressLogout}
      styles={{ container: s.button, ...styles?.button }}
    />
  </View>
)

export default LoggedComponent
