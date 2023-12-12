import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import { DropdownListItemStyles as s } from './styles'
import type { IDropdownListItemProps } from './types'

const DropdownListItem = ({
  item,
  onSelectItem,
  selectedOption,
  styles,
}: IDropdownListItemProps) => {
  const handleOnSelectItem = () => onSelectItem(item)
  const isSelected = !!selectedOption && selectedOption.value === item.value
  const selectedStyles = [s.buttonSelected, styles?.buttonSelected]

  const buttonStyles = [s.button, styles?.button]

  return (
    <View style={[s.rootContainer, styles?.container]}>
      <TouchableOpacity
        onPress={handleOnSelectItem}
        style={isSelected ? selectedStyles : buttonStyles}
      >
        <Text
          style={[s.text, isSelected ? styles?.textSelected : styles?.text]}
          numberOfLines={2}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default DropdownListItem
