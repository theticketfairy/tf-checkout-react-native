import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import Input from '../input/Input';
import s from './styles';
import { IDatePickerProps } from './types';

const DatePicker = ({
  onSelectDate,
  onCancel,
  styles,
  text = 'Select date',
  selectedDate,
  placeholder = 'Select date',
  error,
}: IDatePickerProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const onButtonPress = () => {
    setIsVisible(true);
  };

  const handleOnSelectDate = (date: Date) => {
    if (onSelectDate) {
      onSelectDate(date);
    }
    setIsVisible(false);
  };

  const handleOnCancel = () => {
    if (onCancel) {
      onCancel();
    }
    setIsVisible(false);
  };

  // Format date in a more readable way
  const formatDate = (date: Date) => {
    if (!date) return '';
    // Format as MM/DD/YYYY
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  return (
    <View style={[styles?.container, s.container]}>
      <Input
        label={text}
        value={selectedDate ? formatDate(selectedDate) : ''}
        placeholder={placeholder}
        pointerEvents="none"
        editable={false} // Prevent keyboard from showing
        error={error}
        styles={{
          container: styles?.inputContainer,
          input: styles?.input,
          fieldWrapper: styles?.fieldWrapper,
          baseColor: styles?.baseColor,
          errorColor: styles?.errorColor,
        }}
      />
      <Pressable
        style={StyleSheet.absoluteFill} // covers the whole field
        onPress={onButtonPress}
      />
      <DateTimePickerModal
        isVisible={isVisible}
        mode="date"
        onConfirm={handleOnSelectDate}
        onCancel={handleOnCancel}
        date={selectedDate || new Date()}
        maximumDate={new Date()} // Prevent future dates for birth dates
        pickerComponentStyleIOS={{ height: 200 }}
      />
    </View>
  );
};

export default DatePicker;
