import React, { useCallback } from 'react'
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'

import { DropdownMaterial } from '../../../components'
import { IDropdownMaterialStyles } from '../../../components/dropdownMaterial/types'
import { AddonItem } from '../types'
import { priceWithCurrency } from '../utils'

export interface AddonsContainerStyles {
  container?: StyleProp<ViewStyle>
  title?: StyleProp<TextStyle>
  addonList?: StyleProp<ViewStyle>
  addonItem?: StyleProp<ViewStyle>
  addonInfo?: StyleProp<ViewStyle>
  addonName?: StyleProp<TextStyle>
  addonPrice?: StyleProp<TextStyle>
  addonPriceWithFees?: StyleProp<TextStyle>
  addonDescription?: StyleProp<TextStyle>
  addonSelectContainer?: StyleProp<ViewStyle>
  dropdownMaterial?: IDropdownMaterialStyles
}

interface AddonsContainerProps {
  addons: Record<string, number>
  availableAddons: AddonItem[]
  onAddonChange: (addonId: string, quantity: number) => void
  currency?: string
  styles?: AddonsContainerStyles
  texts?: {
    title?: string
    quantityLabel?: string
    priceWithFeesSuffix?: string
  }
}

const AddonsContainer: React.FC<AddonsContainerProps> = ({
  addons = {},
  availableAddons = [],
  onAddonChange,
  currency,
  styles: customStyles,
  texts,
}) => {
  // Generate quantity options for the dropdown
  const generateAddonQuantityOptions = useCallback(
    (addon: AddonItem['attributes']) => {
      const options = []
      // Check different possible locations for max quantity
      const maxQty = addon.maxQuantity || '1'
      const maxQtyNum = parseInt(maxQty, 10)

      for (let i = 0; i <= maxQtyNum; i++) {
        options.push({
          value: i.toString(),
          label: i.toString(),
        })
      }

      return options
    },
    []
  )

  // Don't render if no addons available
  if (!availableAddons || availableAddons.length === 0) {
    return null
  }
  return (
    <View style={[styles.container, customStyles?.container]}>
      <Text style={[styles.title, customStyles?.title]}>
        {texts?.title || 'Available Add-ons'}
      </Text>

      <View style={[styles.addonList, customStyles?.addonList]}>
        {availableAddons.map((addon) => {
          // Extract addon data from the API structure
          const addonData = addon.attributes
          const addonId = addon.id || addonData.id

          // Get price (could be in different locations based on API structure)
          const priceWithFees = addonData.price || 0
          const addonCurrency = addonData.currency || currency
          const isAddonFree = Number(priceWithFees) === 0

          const basePriceFormatted = isAddonFree
            ? 'FREE'
            : priceWithCurrency((priceWithFees / 100).toString(), addonCurrency)

          return (
            <View
              key={addonId}
              style={[styles.addonItem, customStyles?.addonItem]}
            >
              <View style={[styles.addonInfo, customStyles?.addonInfo]}>
                <Text style={[styles.addonName, customStyles?.addonName]}>
                  {addonData.name || 'Add-on'}
                </Text>
                <Text style={[styles.addonPrice, customStyles?.addonPrice]}>
                  {basePriceFormatted}
                  {!isAddonFree && (
                    <Text
                      style={[
                        styles.addonPriceWithFees,
                        customStyles?.addonPriceWithFees,
                      ]}
                    >
                      {texts?.priceWithFeesSuffix || ' (with fees)'}
                    </Text>
                  )}
                </Text>
                {addonData.description && (
                  <Text
                    style={[
                      styles.addonDescription,
                      customStyles?.addonDescription,
                    ]}
                  >
                    {addonData.description}
                  </Text>
                )}
              </View>
              <View
                style={[
                  styles.addonSelectContainer,
                  customStyles?.addonSelectContainer,
                ]}
              >
                <DropdownMaterial
                  items={generateAddonQuantityOptions(addonData)}
                  onSelectItem={(item) => {
                    onAddonChange(
                      addonId.toString(),
                      parseInt(item.value.toString(), 10)
                    )
                  }}
                  selectedOption={{
                    value: (addons[addonId] || 0).toString(),
                    label: (addons[addonId] || 0).toString(),
                  }}
                  materialInputProps={{
                    label: texts?.quantityLabel || 'Qty',
                  }}
                  styles={customStyles?.dropdownMaterial}
                />
              </View>
            </View>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  addonList: {
    gap: 12,
  },
  addonItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
    paddingBottom: 12,
    marginBottom: 12,
  },
  addonInfo: {
    flex: 1,
  },
  addonName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  addonPrice: {
    fontSize: 14,
    marginBottom: 4,
  },
  addonPriceWithFees: {
    fontSize: 12,
    color: '#666',
  },
  addonDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  addonSelectContainer: {
    width: 80,
  },
})

export default AddonsContainer
