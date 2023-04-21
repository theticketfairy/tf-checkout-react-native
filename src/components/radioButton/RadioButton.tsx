import React, { FC } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import s from './styles'
import type { IRadioButtonProps } from './types'

const RadioButton: FC<IRadioButtonProps> = ({
  styles,
  text = 'Radio button',
  value = true,
  onValueChange,
}) => (
  <TouchableOpacity
    onPress={onValueChange}
    style={[s.rootContainer, styles?.rootContainer]}
  >
    <View style={[s.contentContainer, styles?.contentContainer]}>
      <View style={[s.radio, styles?.radio]}>
        {value && <View style={[s.indicator, styles?.indicator]} />}
      </View>
      <Text style={styles?.text}>{text}</Text>
    </View>
  </TouchableOpacity>
)

export default RadioButton
