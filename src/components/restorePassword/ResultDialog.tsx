import React, { FC } from 'react'
import { Text, View } from 'react-native'

import Button from '../button/Button'
import { restorePasswordSuccessStyles as s } from './styles'
import { IResultDialogProps } from './types'

const ResultDialog: FC<IResultDialogProps> = ({
  styles,
  texts,
  message,
  onPressButton,
}) => (
  <View style={[s.rootContainer, styles?.rootContainer]}>
    <Text style={[s.title, styles?.title]}>
      {texts?.title || 'Email Sent!'}
    </Text>

    {!!texts?.message && <Text>{texts.message}</Text>}
    {!!message && <Text>{message}</Text>}

    <Button text={texts?.button || 'OK'} onPress={onPressButton!} />
  </View>
)

export default ResultDialog
