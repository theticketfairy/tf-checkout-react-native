import type { ReactNode } from 'react'
import type { StyleProp, TextStyle } from 'react-native'

import type { ICheckboxStyles } from '../checkbox/types'
import type { IDatePickerProps } from '../datePicker/types'
import type { IDropdownItem, IDropdownStyles } from '../dropdown/types'
import type { IInputProps } from '../input/types'

export type FieldType =
  | 'input'
  | 'dropdown'
  | 'title'
  | 'checkbox'
  | 'text'
  | 'header'
  | 'datePicker'

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
    options: IDropdownItem[]
    onSelectOption: (id: string, item: IDropdownItem) => void
    style?: IDropdownStyles
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

  titleStyle?: StyleProp<TextStyle>
  headerStyle?: StyleProp<TextStyle>
  textStyle?: StyleProp<TextStyle>
}
