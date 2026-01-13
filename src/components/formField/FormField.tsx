import React from 'react';
import { Text } from 'react-native';

import Checkbox from '../checkbox/Checkbox';
import DatePicker from '../datePicker/DatePicker';
import DropdownMaterial from '../dropdownMaterial/DropdownMaterial';
import Input from '../input/Input';
import RadioGroup from '../radioGroup';
import styles from './styles';
import { IFormFieldProps } from './types';

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
      );

    case 'dropdown':
      // Special handling for multi-select dropdown
      if (dropdownProps?.isMultiSelect && dropdownProps.selectedOptions) {
        // For multi-select, we create a display string from selected options
        const selectedText =
          dropdownProps.selectedOptions.length > 0
            ? dropdownProps.selectedOptions.map((item) => item.label).join(', ')
            : `Select ${dropdownProps?.style?.label?.text || 'items'}`;

        // Use a fake selectedOption for the display
        const displayOption = {
          value: '',
          label: selectedText,
        };

        // Return with special multi-select handling
        return (
          <DropdownMaterial
            items={dropdownProps.options}
            selectedOption={displayOption}
            onSelectItem={(item) => dropdownProps.onSelectOption(id!, item)}
            materialInputProps={{
              label: dropdownProps?.style?.label?.text || 'Select Multiple',
              error: error,
            }}
          />
        );
      } else {
        // Standard single-select dropdown
        return (
          <DropdownMaterial
            items={dropdownProps!.options}
            selectedOption={dropdownProps?.selectedOption}
            onSelectItem={(item) => dropdownProps!.onSelectOption(id!, item)}
            materialInputProps={{
              label: dropdownProps?.style?.label?.text || 'Select',
              error: error,
            }}
          />
        );
      }

    case 'title':
      return <Text style={[styles.title, titleStyle]}>{title}</Text>;

    case 'header':
      return <Text style={[styles.header, headerStyle]}>{title}</Text>;

    case 'text':
      return <Text style={[styles.text, textStyle]}>{title}</Text>;

    case 'checkbox':
      return (
        <Checkbox
          isActive={checkboxProps!.isActive}
          text={checkboxProps!.text}
          onPress={() => {
            checkboxProps!.onPress(id!);
          }}
          styles={checkboxProps?.styles}
          customTextComp={checkboxProps?.customTextComp}
        />
      );

    case 'datePicker':
      return (
        <DatePicker
          error={error}
          onSelectDate={datePickerProps!.onSelectDate}
          text={datePickerProps?.text || 'Select date'}
          onCancel={datePickerProps?.onCancel}
          selectedDate={datePickerProps!.selectedDate}
        />
      );

    case 'radio':
      return (
        <RadioGroup
          options={radioProps!.options}
          selectedValue={radioProps!.selectedValue}
          onValueChange={(value) => {
            // Just call the function directly since we're using non-null assertion
            radioProps!.onValueChange(value);
          }}
          label={radioProps?.label}
          error={error}
          styles={radioProps?.styles}
        />
      );
  }
};

export default FormField;
