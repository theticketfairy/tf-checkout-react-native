import React, { FC } from 'react'
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'

import { getCurrencySymbol } from '../../helpers/StringsHelper'
import R from '../../res'
import { IAddOn } from '../../types/IAddOn'
import Dropdown from '../dropdown/Dropdown'
import { IDropdownItem, IDropdownStyles } from '../dropdown/types'

interface IAddonListItem {
  addOn: IAddOn
  selectedTicketsQuantity: number
  texts?: {}

  styles?: {
    rootContainer: StyleProp<ViewStyle>
    leftContainer: StyleProp<ViewStyle>
    rightContainer: StyleProp<ViewStyle>
    dropDown: IDropdownStyles
    addOnName: StyleProp<TextStyle>
    currency: StyleProp<TextStyle>
    price: StyleProp<TextStyle>
  }
}

const s = StyleSheet.create({
  rootContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    color: R.colors.white,
  },
  currency: {
    color: R.colors.white,
  },
  price: {
    color: R.colors.white,
  },
})

const AddOnListItem: FC<IAddonListItem> = ({
  addOn,
  selectedTicketsQuantity,
  styles,
  texts,
}) => {
  return (
    <View style={[s.rootContainer, styles?.rootContainer]}>
      <View style={styles?.leftContainer}>
        <Text style={[s.name, styles?.addOnName]}>{addOn.attributes.name}</Text>
        <Text>
          <Text style={[s.currency, styles?.currency]}>
            {getCurrencySymbol(addOn.attributes.currency)}
          </Text>
          <Text style={[s.price, styles?.price]}>{addOn.attributes.price}</Text>
        </Text>
      </View>

      <View style={styles?.rightContainer}>
        <Dropdown
          styles={styles?.dropDown}
          items={[]}
          onSelectItem={function (item: IDropdownItem): void {
            throw new Error('Function not implemented.')
          }}
        />
      </View>
    </View>
  )
}

export default AddOnListItem
