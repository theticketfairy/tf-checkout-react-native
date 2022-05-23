import React, { FC, useEffect, useState } from 'react'
import { Image, Pressable, Text, View } from 'react-native'

import R from '../../res'
import s from './styles'
import { ICartTimerProps } from './types'

const CartTimer: FC<ICartTimerProps> = ({
  shouldNotMinimize,
  texts,
  styles,
  secondsLeft,
}) => {
  const [isOnlyTimeVisible, setIsOnlyTimeVisible] = useState(false)
  const hideOtherData = () => {
    if (!shouldNotMinimize) {
      setIsOnlyTimeVisible(!isOnlyTimeVisible)
    }
  }
  const [timeRemaining, setTimeRemaining] = useState('')

  const message = texts?.message
    ? texts.message
    : 'Please complete your purchase before the timer reaches zero:'

  useEffect(() => {
    const clockify = () => {
      //let hours = Math.floor(secondsLeft / 60 / 60)
      let mins = Math.floor((secondsLeft / 60) % 60)
      let seconds = Math.floor(secondsLeft % 60)
      //let displayHours = hours < 10 ? `0${hours}` : hours
      let displayMins = mins < 10 ? `0${mins}` : mins
      let displaySecs = seconds < 10 ? `0${seconds}` : seconds

      setTimeRemaining(`${displayMins}:${displaySecs}`)
    }

    clockify()
  }, [secondsLeft])

  return (
    <View
      style={[
        s.rootContainer,
        isOnlyTimeVisible && s.rootContainerSmall,
        styles?.rootContainer,
      ]}
    >
      <Pressable onPressOut={hideOtherData}>
        <View style={[s.contentContainer, styles?.contentContainer]}>
          {!isOnlyTimeVisible && (
            <Image source={R.icons.clock} style={[s.icon, styles?.icon]} />
          )}
          <View style={[s.textsContainer, styles?.textsContainer]}>
            {!isOnlyTimeVisible && (
              <Text style={[s.message, styles?.message]}>{message}</Text>
            )}
            <Text
              style={[
                s.time,
                isOnlyTimeVisible && s.timeOnlyVisible,
                styles?.time,
              ]}
            >
              {timeRemaining}
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  )
}

export default CartTimer
