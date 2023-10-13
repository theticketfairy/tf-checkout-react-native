import React, { type FC, useState } from 'react'
import { Modal, Text, View } from 'react-native'

import Button from '../button/Button'
import Input from '../input/Input'
import s from './styles'
import type { IEnterPasswordProps } from './types'



const EnterPassword: FC<IEnterPasswordProps> = ({
  styles,
  texts,
  onSubmit,
  isLoading,
  apiError,
}) => {
  const [password, setPassword] = useState('')

  const handleOnSubmit = () => {
    if (password.length > 0) onSubmit?.(password)
  }

  return (
    <Modal presentationStyle='overFullScreen' transparent={false}>
      <View style={styles?.rootContainer || s.rootContainer}>
        <View style={styles?.contentContainer || s.contentContainer}>
          <Text style={styles?.title || s.title}>
            {texts?.title || 'Password is required for this event'}
          </Text>
          <Input
            label={texts?.inputLabel || `Enter the event's password`}
            value={password}
            onChangeText={setPassword}
            styles={styles?.input}
            autoCapitalize='none'
          />
          {!!apiError && (
            <Text style={s.errorText || styles?.error}>{apiError}</Text>
          )}
          <Button
            text={texts?.buttonText || 'Submit'}
            styles={styles?.button}
            onPress={handleOnSubmit}
            isLoading={isLoading}
            isDisabled={isLoading || password.length === 0}
          />
        </View>
      </View>
    </Modal>
  )
}

export default EnterPassword
