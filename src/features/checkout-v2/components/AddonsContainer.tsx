import React, { useCallback } from 'react';
import {
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { IDropdownMaterialStyles } from '../../../components/dropdownMaterial/types';
import { AddonItem } from '../types';
import { getFieldType, priceWithCurrency } from '../utils';
import { CheckoutFormProps, CheckoutFormValues } from '../form/types';
import { FormikField, FormikFieldComponentStyles } from '../../form';
import { DropdownMaterial } from '../../../components';

export interface AddonsContainerStyles {
  container?: StyleProp<ViewStyle>;
  title?: StyleProp<TextStyle>;
  addonRow?: StyleProp<ViewStyle>;
  addonList?: StyleProp<ViewStyle>;
  addonItem?: StyleProp<ViewStyle>;
  addonInfo?: StyleProp<ViewStyle>;
  addonName?: StyleProp<TextStyle>;
  addonPrice?: StyleProp<TextStyle>;
  addonPriceWithFees?: StyleProp<TextStyle>;

  addonDescription?: StyleProp<TextStyle>;
  addonSelectContainer?: StyleProp<ViewStyle>;
  dropdownMaterial?: IDropdownMaterialStyles;
  fieldComponentStyles?: FormikFieldComponentStyles;
}

interface AddonsContainerProps {
  addons: CheckoutFormValues['addons'];
  availableAddons: AddonItem[];
  onAddonChange: (addonId: string, quantity: number) => void;
  currency?: string;
  styles?: AddonsContainerStyles;
  texts?: {
    title?: string;
    quantityLabel?: string;
    priceWithFeesSuffix?: string;
  };
  addonCustomFields?: CheckoutFormProps['addonCustomFields'];
}

const AddonsContainer: React.FC<AddonsContainerProps> = ({
  addons = {},
  availableAddons = [],
  onAddonChange,
  currency,
  styles: customStyles,
  texts,
  addonCustomFields,
}) => {
  // Generate quantity options for the dropdown
  const generateAddonQuantityOptions = useCallback(
    (addon: AddonItem['attributes']) => {
      const options = [];
      // Check different possible locations for max quantity
      const maxQty = addon.maxQuantity || '1';
      const maxQtyNum = parseInt(maxQty, 10);

      for (let i = 0; i <= maxQtyNum; i++) {
        options.push({
          value: i.toString(),
          label: i.toString(),
        });
      }

      return options;
    },
    []
  );

  // Don't render if no addons available
  if (!availableAddons || availableAddons.length === 0) {
    return null;
  }

  return (
    <View style={[customStyles?.container]}>
      <Text style={[customStyles?.title]}>
        {texts?.title || 'Available Add-ons'}
      </Text>

      <View style={[customStyles?.addonList]}>
        {availableAddons.map((addon) => {
          // Extract addon data from the API structure
          const addonData = addon.attributes;
          const addonId = addon.id || addonData.id;

          // Get price (could be in different locations based on API structure)
          const priceWithFees = addonData.price || 0;
          const addonCurrency = addonData.currency || currency;
          const isAddonFree = Number(priceWithFees) === 0;

          const basePriceFormatted = isAddonFree
            ? 'FREE'
            : priceWithCurrency(
                (priceWithFees / 100).toString(),
                addonCurrency
              );

          return (
            <View key={addonId} style={[customStyles?.addonItem]}>
              <View style={[customStyles?.addonRow]}>
                <View style={[customStyles?.addonInfo]}>
                  <Text style={[customStyles?.addonName]}>
                    {addonData.name || 'Add-on'}
                  </Text>
                  <Text style={[customStyles?.addonPrice]}>
                    {basePriceFormatted}
                    {!isAddonFree && (
                      <Text style={[customStyles?.addonPriceWithFees]}>
                        {texts?.priceWithFeesSuffix || ' (with fees)'}
                      </Text>
                    )}
                  </Text>
                  {addonData.description && (
                    <Text style={[customStyles?.addonDescription]}>
                      {addonData.description}
                    </Text>
                  )}
                </View>
                <View style={[customStyles?.addonSelectContainer]}>
                  <DropdownMaterial
                    items={generateAddonQuantityOptions(addonData)}
                    onSelectItem={(item) => {
                      onAddonChange(
                        addonId.toString(),
                        parseInt(item.value.toString(), 10)
                      );
                    }}
                    selectedOption={{
                      value: (addons[addonId]?.quantity || 0).toString(),
                      label: (addons[addonId]?.quantity || 0).toString(),
                    }}
                    materialInputProps={{
                      label: texts?.quantityLabel || 'Qty',
                    }}
                    styles={customStyles?.fieldComponentStyles?.select}
                  />
                </View>
              </View>
              {(addons[addonId]?.quantity ?? 0) > 0 &&
                addonCustomFields.map((field) => (
                  <FormikField
                    key={`${addonId}-${field.name}`}
                    field={{
                      name: `addons.${addonId}.customFields.${field.name}`,
                      type: getFieldType(field.type),
                      label: field.label,
                      required: field.required,
                      placeholder: field.description || `Enter ${field.label}`,
                      options: field.options?.map((o) => ({
                        value: o.value,
                        label: o.name,
                      })),
                    }}
                    styles={customStyles?.fieldComponentStyles}
                  />
                ))}
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default AddonsContainer;
