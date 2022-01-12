import { ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native'
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
  container?: StyleProp<ViewStyle>
  button?: StyleProp<ViewStyle>
  icon?: StyleProp<ImageStyle>
  label?: StyleProp<TextStyle>
}

export interface IDropdownProps {
  items: IDropdownItem[]
  selectedOption?: IDropdownItem
  onSelectItem: (item: IDropdownItem) => void
  styles?: IDropdownStyles
  label?: string
  isMaterial?: boolean
}
