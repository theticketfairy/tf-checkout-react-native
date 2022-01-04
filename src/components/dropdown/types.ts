import { ImageStyle, TextStyle, ViewStyle } from 'react-native'
export interface IDropdownItem {
  label: string
  value: string | number
}

export interface IDropdownListItemProps {
  item: IDropdownItem
  onSelectItem: (item: IDropdownItem) => void
  selectedOption?: IDropdownItem
}

export interface IDropdownStyles {
  container?: ViewStyle
  button?: ViewStyle
  icon?: ImageStyle
  label?: TextStyle
}

export interface IDropdownProps {
  items: IDropdownItem[]
  selectedOption?: IDropdownItem
  onSelectItem: (item: IDropdownItem) => void
  styles?: IDropdownStyles
  label?: string
  isMaterial?: boolean
}
