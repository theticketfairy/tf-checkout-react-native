import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import { DropdownListItemStyles as styles } from './styles'
import { IDropdownListItemProps } from './types'

const DropdownListItem = ({
  item,
  onSelectItem,
  selectedOption,
}: IDropdownListItemProps) => {
  const handleOnSelectItem = () => onSelectItem(item)
  const isSelected = !!selectedOption && selectedOption.value === item.value

  return (
    <View style={styles.rootContainer}>
      <TouchableOpacity
        onPress={handleOnSelectItem}
        style={isSelected ? styles.buttonSelected : styles.button}
      >
        <Text style={styles.text} numberOfLines={2}>
          {item.label}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default DropdownListItem
