import { ReactElement } from 'react'

export enum FieldType {
  INPUT = 'input',
  TEXTAREA = 'textarea',
  SELECT = 'select',
  SELECT_MULTI = 'select_multi',
  PHONE = 'phone',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  DATE_PICKER = 'datePicker',
  TITLE = 'title',
  COMPONENT = 'component',
}

export interface BaseFieldConfig<TValues extends {}> {
  name: string
  type: FieldType
  label?: string
  placeholder?: string
  required?: boolean
  options?: { value: string; label: string }[]
  defaultValue?: TValues[keyof TValues]
  onChange?: (value: any) => void
  hide?: boolean
}

// Specialized config when type = component
export interface ComponentFieldConfig<TValues extends {}>
  extends Omit<BaseFieldConfig<TValues>, 'type'> {
  type: FieldType.COMPONENT
  render: (field: BaseFieldConfig<TValues>) => ReactElement
}

// Union type: either a normal field or a component field
export type FieldConfig<TValues extends {}> =
  | BaseFieldConfig<TValues>
  | ComponentFieldConfig<TValues>
