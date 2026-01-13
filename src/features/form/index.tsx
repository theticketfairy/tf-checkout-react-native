import { useField } from 'formik';
import React from 'react';
import { Text } from 'react-native';

import {
  Checkbox,
  DatePicker,
  DropdownMaterial,
  Input,
  PhoneInput,
  RadioGroup,
} from '../../components';
import { ICheckboxStyles } from '../../components/checkbox/types';
import { IDatePickerStyles } from '../../components/datePicker/types';
import { IDropdownMaterialStyles } from '../../components/dropdownMaterial/types';
import { IInputStyles } from '../../components/input/types';
import { IPhoneInputStyles } from '../../components/phoneInput/types';
import { IRadioGroupStyles } from '../../components/radioGroup/types';
import { FieldConfig } from './types';

export interface FormikFieldComponentStyles {
  input?: IInputStyles;
  select?: IDropdownMaterialStyles;
  selectMulti?: IDropdownMaterialStyles;
  phone?: IPhoneInputStyles;
  checkbox?: ICheckboxStyles;
  radio?: IRadioGroupStyles;
  datePicker?: IDatePickerStyles;
}

interface FormikFieldProps<TValues extends Record<string, unknown>> {
  field: FieldConfig<TValues>;
  styles?: FormikFieldComponentStyles;
}

export const FormikField = React.memo(
  <TValues extends Record<string, unknown>>({
    field,
    styles: componentStyles,
  }: FormikFieldProps<TValues>) => {
    const [formikField, meta, helpers] = useField(field.name);

    const value = formikField.value;
    const error = meta.touched ? meta.error : undefined;

    if (field.hide) return null;

    const handleChange = (val: string | number | boolean | string[]) => {
      field.onChange?.(val);
      helpers.setValue(val);
    };

    switch (field.type) {
      case 'input':
        return (
          <Input
            id={field.name}
            value={value}
            label={field.label ?? 'Label'}
            placeholder={field.placeholder}
            error={error}
            onTextChanged={(_, val) => handleChange(val)}
            styles={componentStyles?.input}
          />
        );

      case 'textarea':
        return (
          <Input
            id={field.name}
            value={value}
            label={field.label ?? 'Label'}
            placeholder={field.placeholder}
            error={error}
            multiline
            numberOfLines={4}
            onTextChanged={(_, val) => handleChange(val)}
            styles={componentStyles?.input}
          />
        );

      case 'select': {
        const options = field.options ?? [];
        return (
          <DropdownMaterial
            items={options}
            selectedOption={
              options.find((o) => o.value === value) ?? {
                value: '',
                label: field.placeholder ?? `Select ${field.label}`,
              }
            }
            onSelectItem={(item) => handleChange(item.value)}
            materialInputProps={{
              label: field.label ?? 'Select',
              error,
            }}
            styles={componentStyles?.select}
          />
        );
      }

      case 'select_multi': {
        const options = field.options ?? [];
        const selectedValues = (Array.isArray(value) ? value : []) as string[];
        const selectedOptions = options.filter((o) =>
          selectedValues.includes(o.value)
        );
        const displayOption = {
          value: '',
          label:
            selectedOptions.length > 0
              ? selectedOptions.map((o) => o.label).join(', ')
              : `Select ${field.label ?? 'items'}`,
        };
        return (
          <DropdownMaterial
            items={options}
            selectedOption={displayOption}
            onSelectItem={(item) => {
              let newValues = [...selectedValues];
              if (newValues.includes(String(item.value))) {
                newValues = newValues.filter((v) => v !== item.value);
              } else {
                newValues.push(String(item.value));
              }
              handleChange(newValues);
            }}
            materialInputProps={{
              label: field.label ?? 'Select Multiple',
              error,
            }}
            styles={componentStyles?.selectMulti ?? componentStyles?.select}
          />
        );
      }

      case 'phone':
        return (
          <PhoneInput
            phoneNumber={value}
            onChangePhoneNumber={(payload) => handleChange(payload.input)}
            error={error}
            texts={{ label: field.label }}
            styles={componentStyles?.phone}
          />
        );

      case 'checkbox':
        return (
          <Checkbox
            isActive={!!value}
            text={field.label || ''}
            onPress={() => handleChange(!value)}
            styles={componentStyles?.checkbox}
          />
        );

      case 'radio':
        return (
          <RadioGroup
            options={field.options ?? []}
            selectedValue={value}
            onValueChange={(val) => handleChange(val)}
            label={field.label}
            error={error}
            styles={componentStyles?.radio}
          />
        );

      case 'datePicker':
        return (
          <DatePicker
            selectedDate={value ? new Date(value) : undefined}
            onSelectDate={(date) => handleChange(date.toISOString())}
            error={error}
            text={field.label || 'Select date'}
            placeholder={field.placeholder}
            styles={componentStyles?.datePicker}
          />
        );

      default:
        return <Text>{field.type} is not supported</Text>;
    }
  }
);
