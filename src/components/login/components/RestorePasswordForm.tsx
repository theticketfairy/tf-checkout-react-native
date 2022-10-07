import React, { FC } from 'react'
import { Text, View } from 'react-native'

import Button from '../../button/Button'
import Input from '../../input/Input'
import s from '../styles'
import { IRestorePasswordFormProps } from './types'

const RestorePasswordForm: FC<IRestorePasswordFormProps> = ({
  viewProps,
  restorePasswordInputError,
  email,
  onEmailChanged,
  isButtonDisabled,
  isLoading,
  onPressRestorePasswordButton,
  onPressCancelButton,
  restorePasswordApiError,
}) => {
  const { styles, texts } = viewProps || {}

  return (
    <View style={[s.dialog, styles?.container]}>
      <Text style={[s.dialogTitle, styles?.title]}>
        {texts?.title || 'Enter your email to restore your password'}
      </Text>

      <Input
        label={texts?.inputLabel || 'Email'}
        error={restorePasswordInputError}
        keyboardType='email-address'
        value={email}
        onChangeText={onEmailChanged}
        autoCapitalize='none'
        styles={styles?.input}
      />

      {!!restorePasswordApiError && <Text>{restorePasswordApiError}</Text>}

      <Button
        text={texts?.restorePasswordButton || 'RESTORE PASSWORD'}
        onPress={onPressRestorePasswordButton}
        isLoading={isLoading}
        isDisabled={isButtonDisabled}
        styles={styles?.restorePasswordButton}
      />

      {!isLoading && (
        <Button
          text={texts?.cancelButton || 'CANCEL'}
          onPress={onPressCancelButton}
          styles={styles?.cancelRestorePasswordButton}
        />
      )}
    </View>
  )
}

export default RestorePasswordForm
