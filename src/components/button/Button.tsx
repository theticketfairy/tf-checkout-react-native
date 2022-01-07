import React from 'react'
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'

import R from '../../res'
import s from './styles'
import { IButtonProps } from './types'

const Button = ({
  text = 'Press me',
  onPress,

  isUpperCase,
  isDisabled,
  isLoading,
  styles,
}: IButtonProps) => {
  const formatText = isUpperCase ? text.toUpperCase() : text

  return (
    <>
      {isLoading ? (
        <View style={[s.button, styles?.container]}>
          <ActivityIndicator color={R.colors.white} />
        </View>
      ) : (
        <View style={[s.container, styles?.container]}>
          <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            style={[isDisabled ? s.buttonDisabled : s.button, styles?.button]}
            disabled={isDisabled || isLoading}
          >
            <Text style={[s.text, styles?.text]}>{formatText}</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  )
}

export default Button