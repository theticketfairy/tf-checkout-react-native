import React from 'react'
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'

import R from '../../res'
import s from './styles'
import { IButtonProps } from './types'

const Button = React.forwardRef(
  (
    {
      text = 'Press me',
      onPress,
      isUpperCase,
      isDisabled,
      isLoading,
      styles,
    }: IButtonProps,
    ref
  ) => {
    const formatText = isUpperCase ? text.toUpperCase() : text

    return (
      <>
        <View style={[s.container, styles?.container]} ref={ref?.containerView}>
          <TouchableOpacity
            ref={ref?.touchableOpacity}
            onPress={onPress}
            activeOpacity={0.8}
            style={[isDisabled ? s.buttonDisabled : s.button, styles?.button]}
            disabled={isDisabled || isLoading}
          >
            {isLoading ? (
              <View ref={ref?.loadingView}>
                <ActivityIndicator
                  color={R.colors.white}
                  size={'small'}
                  ref={ref?.activityIndicator}
                />
              </View>
            ) : (
              <Text style={[s.text, styles?.text]} ref={ref?.loadingText}>
                {formatText}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </>
    )
  }
)

export default Button
