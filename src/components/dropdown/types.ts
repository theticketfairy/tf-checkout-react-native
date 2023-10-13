import type { ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native'
export interface IDropdownItem {
  label: string
  value: string | number
  [key: string]: string | number
}

export interface IDropdownListItemStyles {
  container?: StyleProp<ViewStyle>
  button?: StyleProp<ViewStyle>
  buttonSelected?: StyleProp<ViewStyle>
  text?: StyleProp<TextStyle>
  textSelected?: StyleProp<TextStyle>
}

export interface IDropdownListItemProps {
  item: IDropdownItem
  onSelectItem: (item: IDropdownItem) => void
  selectedOption?: IDropdownItem
  styles?: IDropdownListItemStyles
}

export interface IDropdownStyles {
  container?: StyleProp<ViewStyle>
  button?: StyleProp<ViewStyle>
  icon?: StyleProp<ImageStyle>
  label?: StyleProp<TextStyle>
  dialog?: StyleProp<ViewStyle>
  flatListContainer?: StyleProp<ViewStyle>
  listItem?: IDropdownListItemStyles
}

export interface IDropdownProps {
  items: IDropdownItem[]
  selectedOption?: IDropdownItem
  onSelectItem: (item: IDropdownItem) => void
  styles?: IDropdownStyles
  isDisabled?: boolean
}
