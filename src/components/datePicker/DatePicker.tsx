import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import DateTimePickerModal from 'react-native-modal-datetime-picker'

import s from './styles'
import { IDatePickerProps } from './types'

const DatePicker = ({
  onSelectDate,
  onCancel,
  styles,
  text = 'Select date',
  selectedDate,
  error,
}: IDatePickerProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const onButtonPress = () => {
    requestAnimationFrame(() => setIsVisible(true))
  }

  const handleOnSelectDate = (date: Date) => {
    if (onSelectDate) {
      onSelectDate(date)
    }
    setIsVisible(false)
  }

  const handleOnCancel = (_: Date) => {
    if (onCancel) {
      onCancel()
    }
    setIsVisible(false)
  }

  return (
    <View style={[styles?.container]}>
      <TouchableOpacity
        onPress={onButtonPress}
        style={[
          s.button,
          styles?.button,
          !!error && { borderColor: styles?.errorColor },
        ]}
      >
        <Text style={[s.text, styles?.text]}>
          {selectedDate?.toLocaleDateString() || text}
        </Text>
      </TouchableOpacity>
      {isVisible && (
        <DateTimePickerModal
          isVisible={isVisible}
          mode='date'
          onConfirm={handleOnSelectDate}
          onCancel={handleOnCancel}
        />
      )}
      {!!error && <Text style={styles?.error}>{error}</Text>}
    </View>
  )
}

export default DatePicker
