import React from 'react'
import { Text, View } from 'react-native'

import { Button, Input } from '../../components'
import s from './styles'

const ResetPasswordView = () => {
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

export default ResetPasswordView
