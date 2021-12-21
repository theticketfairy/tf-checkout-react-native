import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import DateTimePickerModal from 'react-native-modal-datetime-picker'

import s from './styles'
import { IDatePickerProps } from './types'

const DatePicker = ({
  onSelectDate,
  onCancel,
  containerStyle,
  text = 'Select date',
  selectedDate,
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
    <View style={[containerStyle]}>
      <TouchableOpacity onPress={onButtonPress} style={s.button}>
        <Text
          style={{
            fontSize: 16,
          }}
        >
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
    </View>
  )
}

export default DatePicker
