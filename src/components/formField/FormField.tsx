import React from 'react'
import { Text } from 'react-native'

import Checkbox from '../checkbox/Checkbox'
import DatePicker from '../datePicker/DatePicker'
import DropdownMaterial from '../dropdownMaterial/DropdownMaterial'
import Input from '../input/Input'
import RadioGroup from '../radioGroup'
import styles from './styles'
import { IFormFieldProps } from './types'

const FormField = ({
  id,
  fieldType,
  error,
  dropdownProps,
  inputProps,
  title,
  checkboxProps,
  datePickerProps,
  radioProps,
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

    case 'dropdown': {
      // Unified dropdown handling for both single and multi-select
      // Determine the selected option to display
      let displayOption = dropdownProps?.selectedOption

      // For multi-select mode, create a combined display option
      if (dropdownProps?.isMultiSelect && dropdownProps?.selectedOptions) {
        const selectedText =
          dropdownProps.selectedOptions.length > 0
            ? dropdownProps.selectedOptions.map((item) => item.label).join(', ')
            : `Select ${dropdownProps?.style?.label?.text || 'items'}`

        displayOption = {
          value: '',
          label: selectedText,
        }
      }

      // Single component path for both single and multi-select
      return (
        <DropdownMaterial
          items={dropdownProps!.options}
          selectedOption={displayOption}
          onSelectItem={(item) => dropdownProps!.onSelectOption(id!, item)}
          materialInputProps={{
            label: dropdownProps?.style?.label?.text || 'Select',
            error: error,
          }}
        />
      )
    }

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
          onSelectDate={datePickerProps!.onSelectDate}
          text={datePickerProps?.text || 'Select date'}
          onCancel={datePickerProps?.onCancel}
          selectedDate={datePickerProps!.selectedDate}
        />
      )

    case 'radio':
      return (
        <RadioGroup
          options={radioProps!.options}
          selectedValue={radioProps!.selectedValue}
          onValueChange={(value) => {
            // Just call the function directly since we're using non-null assertion
            radioProps!.onValueChange(value)
          }}
          label={radioProps?.label}
          error={error}
          styles={radioProps?.styles}
        />
      )
  }
}

export default FormField
