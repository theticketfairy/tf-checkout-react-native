import { ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native'

import { IDropdownItem, IDropdownListItemStyles } from '../dropdown/types'
import { IInputProps, IInputStyles } from '../input/types'

export interface IDropdownMaterialStyles {
  container?: StyleProp<ViewStyle>
  button?: StyleProp<ViewStyle>
  icon?: StyleProp<ImageStyle>
  label?: StyleProp<TextStyle>
  dialog?: StyleProp<ViewStyle>
  flatListContainer?: StyleProp<ViewStyle>
  listItem?: IDropdownListItemStyles
  input?: IInputStyles
}

export interface IDropdownMaterialProps {
  items: IDropdownItem[]
  selectedOption?: IDropdownItem
  onSelectItem: (item: IDropdownItem) => void
  styles?: IDropdownMaterialStyles
  isMaterial?: boolean
  materialInputProps?: IInputProps
}
