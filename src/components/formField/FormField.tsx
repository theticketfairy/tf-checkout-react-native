import React from 'react'
import { Text } from 'react-native'

import Checkbox from '../checkbox/Checkbox'
import DatePicker from '../datePicker/DatePicker'
import Dropdown from '../dropdown/Dropdown'
import Input from '../input/Input'
import styles from './styles'
import { IFormFieldProps } from './types'

const FormField = ({
  id,
  fieldType,
  error,
  validation,
  dropdownProps,
  inputProps,
  title,
  checkboxProps,
  datePickerProps,
  headerStyle,
  titleStyle,
  textStyle,
}: IFormFieldProps) => {
  switch (fieldType) {
    case 'input':
      return (
        <Input
          value={inputProps!.value}
          id={id}
          onTextChanged={inputProps!.onTextChanged}
          label={inputProps!.label || 'Label'}
          error={error}
          {...inputProps}
        />
      )

    case 'dropdown':
      return (
        <Dropdown
          items={dropdownProps!.options}
          selectedOption={dropdownProps?.selectedOption}
          onSelectItem={(item) => dropdownProps!.onSelectOption(id!, item)}
          styles={{
            container: [
              styles.dropdownContainer,
              dropdownProps?.style?.container,
            ],
            button: [styles.dropdownButton, dropdownProps?.style?.button],
            label: [styles.dropdownLabel, dropdownProps?.style?.label],
            icon: dropdownProps?.style?.icon,
          }}
        />
      )

    case 'title':
      return <Text style={[styles.title, titleStyle]}>{title}</Text>

    case 'header':
      return <Text style={[styles.header, headerStyle]}>{title}</Text>

    case 'text':
      return <Text style={[styles.text, textStyle]}>{title}</Text>

    case 'checkbox':
      return (
        <Checkbox
          isActive={checkboxProps!.isActive}
          text={checkboxProps!.text}
          onPress={() => {
            checkboxProps!.onPress(id!)
          }}
          styles={checkboxProps?.styles}
          customTextComp={checkboxProps?.customTextComp}
        />
      )

    case 'datePicker':
      return (
        <DatePicker
          onSelectDate={datePickerProps?.onSelectDate}
          text={datePickerProps?.text || 'Select date'}
          onCancel={datePickerProps?.onCancel}
          selectedDate={datePickerProps?.selectedDate}
        />
      )
  }
}

export default FormField
