import React from 'react'
import { Text, View } from 'react-native'

import s from '../styles'

const RestorePasswordSuccessDialog = () => {
  return (
    <View
      style={[s.dialog, restorePasswordSuccessViewProps?.styles?.container]}
    >
      <Text
        style={[s.dialogTitle, restorePasswordSuccessViewProps?.styles?.title]}
      >
        {restorePasswordSuccessViewProps?.texts?.title || 'Email Sent!'}
      </Text>

      {!!restorePasswordSuccessMessage && (
        <Text>{restorePasswordSuccessMessage}</Text>
      )}

      <Button
        text={restorePasswordSuccessViewProps?.texts?.button || 'OK'}
        onPress={hideDialog}
      />
    </View>
  )
}

export default RestorePasswordSuccessDialog
