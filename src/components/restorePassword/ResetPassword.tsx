import React, { FC, useState } from 'react'
import { Text, View } from 'react-native'

import { useDebounced } from '../../helpers/Debounced'
import { validatePasswords } from '../../helpers/Validators'
import Button from '../button/Button'
import Input from '../input/Input'
import { resetPasswordStyles as s } from './styles'
import { IResetPasswordProps } from './types'

const ResetPassword: FC<IResetPasswordProps> = ({
  styles,
  texts,
  onPressResetButton,
  isLoading,
  apiError,
}) => {
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')

  const newPasswordError = useDebounced(newPassword, () =>
    validatePasswords(newPassword, confirmNewPassword)
  )

  const confirmNewPasswordError = useDebounced(confirmNewPassword, () =>
    validatePasswords(newPassword, confirmNewPassword)
  )

  const handleOnPressResetButton = () => {
    onPressResetButton({
      password: newPassword,
      confirmPassword: confirmNewPassword,
    })
  }

  return (
    <View style={[s.dialog, styles?.rootContainer]}>
      <Text style={[s.dialogTitle, styles?.title]}>
        {texts?.title || 'Enter your new password'}
      </Text>

      <Input
        onChangeText={setNewPassword}
        styles={styles?.input}
        label={texts?.inputLabel || 'New password'}
        error={newPasswordError}
        value={newPassword}
      />

      <Input
        onChangeText={setConfirmNewPassword}
        styles={styles?.input}
        label={texts?.inputLabel || 'New password'}
        error={confirmNewPasswordError}
        value={confirmNewPassword}
      />

      {!!apiError && <Text style={styles?.apiError}>{apiError}</Text>}

      <Button
        text={texts?.button || 'RESET PASSWORD'}
        onPress={handleOnPressResetButton}
        isLoading={isLoading}
      />
    </View>
  )
}

export default ResetPassword
