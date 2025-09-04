import React, { useCallback, useEffect, useState } from 'react'
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import { addonsWithGroupsAdapter, getAddons } from '../../api/adapters'
import { Input, Loading } from '../index'

interface SimpleAddonsContainerProps {
  eventId: string
  addOnDataWithCustomFields?: any
  configs?: any
  onAddOnSelect: (id: string, value: string, addon: any) => void
  selectedAddOns?: { [key: string]: number }
  classNamePrefix?: string
  onGetAddonsPageInfoSuccess?: (res: any) => void
  onGetAddonsPageInfoError?: (error: any) => void
  descriptionTrigger?: 'click' | 'hover' | 'always'
}

export const SimpleAddonsContainer: React.FC<SimpleAddonsContainerProps> = ({
  eventId,
  // addOnDataWithCustomFields,
  // configs,
  onAddOnSelect,
  selectedAddOns = {},
  onGetAddonsPageInfoSuccess,
  onGetAddonsPageInfoError,
  descriptionTrigger = 'click',
}) => {
  const [addons, setAddons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [visibleDescription, setVisibleDescription] = useState<string | null>(
    null
  )

  // Adapt the web component's getAddonsPageInfo logic for React Native
  useEffect(() => {
    const getAddonsPageInfo = async () => {
      try {
        if (eventId) {
          setLoading(true)

          // Use the same API calls as web component but adapted for RN
          // This would need to be implemented using your existing API client
          const addonsData = await getAddons(eventId)

          // Apply the same adapters as web component
          const adaptedAddons = addonsWithGroupsAdapter(addonsData)
          setAddons(adaptedAddons)

          onGetAddonsPageInfoSuccess?.(addonsData)
        }
      } catch (e) {
        onGetAddonsPageInfoError?.(e)
      } finally {
        setLoading(false)
      }
    }

    getAddonsPageInfo()
  }, [eventId, onGetAddonsPageInfoError, onGetAddonsPageInfoSuccess])

  const handleQuantityChange = useCallback(
    (addonId: string, quantity: string, addon: any) => {
      onAddOnSelect(addonId, quantity, addon)
    },
    [onAddOnSelect]
  )

  const handleDescriptionToggle = (addonId: string) => {
    setVisibleDescription((current) => (current === addonId ? null : addonId))
  }

  const renderAddon = ({ item: addon }: { item: any }) => {
    const isAddonFree = Number(addon?.price) === 0
    const selectedQuantity = selectedAddOns[addon.id] || 0

    return (
      <View style={styles.addonContainer}>
        {addon.imageUrl && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: addon.imageUrl }} style={styles.addonImage} />
          </View>
        )}

        <View style={styles.addonInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.addonTitle}>{addon.name}</Text>
            {addon.description && (
              <TouchableOpacity
                onPress={() => handleDescriptionToggle(addon.id)}
                style={styles.infoButton}
              >
                <Text style={styles.infoIcon}>ℹ️</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.addonPrice}>
            {isAddonFree ? 'FREE' : `$${addon.price}`}
            {!isAddonFree && addon.feeIncluded && (
              <Text style={styles.feeText}> (incl. Fees)</Text>
            )}
          </Text>

          {(visibleDescription === addon.id ||
            descriptionTrigger === 'always') && (
            <Text style={styles.description}>{addon.description}</Text>
          )}
        </View>

        <View style={styles.quantityContainer}>
          <Text style={styles.quantityLabel}>Qty:</Text>
          <Input
            label='Qty'
            value={String(selectedQuantity)}
            onChangeText={(value) =>
              handleQuantityChange(addon.id, value, addon)
            }
            keyboardType='numeric'
            style={styles.quantityInput}
            placeholder='0'
          />
        </View>
      </View>
    )
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Loading />
      </View>
    )
  }

  if (!addons.length) return null

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>UPGRADES & ADD-ONS</Text>
      <Text style={styles.subtitle}>
        PLEASE SELECT FROM THE OPTIONAL ADD-ONS BELOW
      </Text>

      <FlatList
        data={addons}
        renderItem={renderAddon}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  addonContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  imageContainer: {
    marginRight: 15,
  },
  addonImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  addonInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  addonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  infoButton: {
    padding: 5,
  },
  infoIcon: {
    fontSize: 16,
  },
  addonPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2196F3',
    marginBottom: 5,
  },
  feeText: {
    fontSize: 12,
    color: '#666',
  },
  description: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  quantityContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  quantityLabel: {
    fontSize: 12,
    marginBottom: 5,
  },
  quantityInput: {
    width: 60,
    height: 40,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
  },
})
