import { ReactNode } from 'react'
import { StyleProp, TextStyle } from 'react-native'

import { ICheckboxStyles } from '../checkbox/types'
import { IDatePickerProps } from '../datePicker/types'
import { IDropdownItem } from '../dropdown/types'
import { IInputProps } from '../input/types'
import { IRadioGroupProps } from '../radioGroup/types'

export type FieldType =
  | 'input'
  | 'dropdown'
  | 'title'
  | 'checkbox'
  | 'text'
  | 'header'
  | 'datePicker'
  | 'radio'

export interface IFormField {
  value: string | number
  error?: string
}

export interface IFormFieldProps {
  id?: string
  fieldType: FieldType
  error?: string
  validation?: () => void
  inputProps?: IInputProps
  dropdownProps?: {
    selectedOption?: IDropdownItem
    selectedOptions?: IDropdownItem[] // For multi-select support
    options: IDropdownItem[]
    onSelectOption: (id: string, item: IDropdownItem) => void
    isMultiSelect?: boolean // Flag to indicate multi-select mode
    style?: {
      label?: {
        text?: string
      }
      container?: any
      button?: any
      icon?: any
    }
  }
  checkboxProps?: {
    isActive: boolean
    text: string
    onPress: (id: string) => void
    styles?: ICheckboxStyles
    customTextComp?: ReactNode
  }
  title?: string
  datePickerProps?: IDatePickerProps
  radioProps?: Omit<IRadioGroupProps, 'error'>

  titleStyle?: StyleProp<TextStyle>
  headerStyle?: StyleProp<TextStyle>
  textStyle?: StyleProp<TextStyle>
}
