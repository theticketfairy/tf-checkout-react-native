import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

import R from '../../res'
import s from './styles'
import { ICheckboxProps } from './types'

const Checkbox = ({
  onPress,
  text,
  styles,
  isActive,
  customTextComp,
}: ICheckboxProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[s.container, styles?.container]}
    >
      <View style={[s.content, styles?.content]}>
        <View
          style={
            isActive
              ? [s.indicatorOn, styles?.indicator]
              : [s.indicator, styles?.indicatorDisabled]
          }
        >
          {isActive && (
            <Image source={R.icons.check} style={[s.check, styles?.icon]} />
          )}
        </View>
        {customTextComp || (
          <Text style={[s.textContainer, styles?.text]}>{text}</Text>
        )}
      </View>
    </TouchableOpacity>
  )
}

export default Checkbox
