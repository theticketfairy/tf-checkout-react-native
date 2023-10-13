import React from 'react'
import {
  Image,
  type StyleProp,
  Text,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native'

import R from '../../res'
import s from './styles'
import type { ICheckboxProps } from './types'



const Checkbox = ({
  onPress,
  text,
  styles,
  isActive,
  customTextComp,
  error,
}: ICheckboxProps) => {
  let indicatorStyles: StyleProp<ViewStyle> = isActive
    ? [s.indicatorOn, styles?.indicator]
    : [s.indicator, styles?.indicatorDisabled]

  if (error) {
    indicatorStyles = [...indicatorStyles, { borderColor: styles?.errorColor }]
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[s.container, styles?.container]}
    >
      <>
        <View style={[s.content, styles?.content]}>
          <View style={indicatorStyles}>
            {isActive && (
              <Image source={R.icons.check} style={[s.check, styles?.icon]} />
            )}
          </View>
          {customTextComp || (
            <Text
              style={[
                s.textContainer,
                styles?.text,
                !!error && { color: styles?.errorColor },
              ]}
            >
              {text}
            </Text>
          )}
        </View>
        {!!error && <Text style={styles?.error}>{error}</Text>}
      </>
    </TouchableOpacity>
  )
}

export default Checkbox
