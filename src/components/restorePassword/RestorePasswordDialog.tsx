import React, { FC, useState } from 'react'
import { Text, View } from 'react-native'

import Button from '../button/Button'
import Input from '../input/Input'
import { restorePasswordStyles as s } from './styles'
import { IRestorePasswordDialogProps } from './types'

const RestorePasswordDialog: FC<IRestorePasswordDialogProps> = ({
  styles,
  texts,
  restorePasswordInputError,
  isButtonDisabled,
  isLoading,
  onPressRestorePasswordButton,
  onPressCancelButton,
  restorePasswordApiError,
}) => {
  const [email, setEmail] = useState('')

  const handleOnPressRestoreButton = () => {
    onPressRestorePasswordButton(email)
  }

  return (
    <View style={[s.rootContainer, styles?.rootContainer]}>
      <Text style={[s.title, styles?.title]}>
        {texts?.title || 'Enter your email to restore your password'}
      </Text>

      <Input
        label={texts?.inputLabel || 'Email'}
        error={restorePasswordInputError}
        keyboardType='email-address'
        value={email}
        onChangeText={setEmail}
        autoCapitalize='none'
        styles={styles?.input}
      />

      {!!restorePasswordApiError && (
        <Text style={styles?.apiError}>{restorePasswordApiError}</Text>
      )}

      <Button
        text={texts?.restorePasswordButton || 'RESTORE PASSWORD'}
        onPress={handleOnPressRestoreButton}
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

export default RestorePasswordDialog
