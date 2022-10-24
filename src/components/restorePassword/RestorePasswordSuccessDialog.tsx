import React, { FC } from 'react'
import { Text, View } from 'react-native'

import Button from '../button/Button'
import { restorePasswordSuccessStyles as s } from './styles'
import { IRestorePasswordSuccessDialogProps } from './types'
const RestorePasswordSuccessDialog: FC<IRestorePasswordSuccessDialogProps> = ({
  styles,
  texts,
  onPressButton,
}) => (
  <View style={[s.rootContainer, styles?.rootContainer]}>
    <Text style={[s.title, styles?.title]}>
      {texts?.title || 'Email Sent!'}
    </Text>

    {!!texts?.message && <Text>{texts.message}</Text>}

    <Button text={texts?.button || 'OK'} onPress={onPressButton!} />
  </View>
)

export default RestorePasswordSuccessDialog
