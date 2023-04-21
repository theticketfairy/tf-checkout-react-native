import React, { FC } from 'react'
import { Text, View } from 'react-native'

import Button from '../../button/Button'
import s from '../styles'
import type { ILoginGuestComponentProps } from './types'

const GuestComponent: FC<ILoginGuestComponentProps> = ({
  styles,
  onPressButton,
  texts,
}) => (
  <>
    {texts?.message ? (
      <Text style={styles?.message}>{texts?.message}</Text>
    ) : (
      <View style={styles?.linesContainer}>
        <Text style={styles?.line1}>{texts?.line1}</Text>
        <Text style={styles?.line2}>{texts?.line2}</Text>
      </View>
    )}
    <Button
      styles={{ container: s.button, ...styles?.loginButton }}
      text={texts?.loginButton || 'LOGIN'}
      onPress={onPressButton}
    />
  </>
)

export default GuestComponent
