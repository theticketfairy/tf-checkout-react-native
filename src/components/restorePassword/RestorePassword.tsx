import React, { FC, useState } from 'react'
import { Text, View } from 'react-native'

import { useDebounced } from '../../helpers/Debounced'
import { validateEmail } from '../../helpers/Validators'
import Button from '../button/Button'
import Input from '../input/Input'
import { restorePasswordStyles as s } from './styles'
import type { IRestorePasswordProps } from './types'

const RestorePassword: FC<IRestorePasswordProps> = ({
  styles,
  texts,
  isLoading,
  onPressRestorePasswordButton,
  onPressCancelButton,
  apiError,
}) => {
  const [email, setEmail] = useState('')
  const emailError = useDebounced(email, validateEmail)

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
        error={emailError}
        keyboardType='email-address'
        value={email}
        onChangeText={setEmail}
        autoCapitalize='none'
        styles={styles?.input}
      />

      {!!apiError && <Text style={styles?.apiError}>{apiError}</Text>}

      <Button
        text={texts?.restorePasswordButton || 'RESTORE PASSWORD'}
        onPress={handleOnPressRestoreButton}
        isLoading={isLoading}
        isDisabled={isLoading || !!emailError || email.length === 0}
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

export default RestorePassword
