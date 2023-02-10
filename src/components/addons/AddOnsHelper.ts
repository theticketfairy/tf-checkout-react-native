import _isEmpty from 'lodash/isEmpty'
import _isNull from 'lodash/isNull'
import _reverse from 'lodash/reverse'
import _sortBy from 'lodash/sortBy'

import { IAddOnsResponseData } from '../../api/types'
import { IAddOnResponse } from '../../types/IAddOn'

interface ObjectLiteral {
  [key: string]: any
}

export interface IAddOnsData {
  add_on_groups: Array<{ [key: string]: any }>
  add_ons: IAddOnResponse[]
}

// AddOns
export const getAddOnsData = ({ addOnGroups, addOns }: IAddOnsResponseData) => {
  if (!_isEmpty(addOnGroups)) {
    const addOnGroupsWithVariants: any = []
    const addOnsWithoutVariants: any = []

    addOns?.forEach((addon: any) => {
      if (addon.attributes.addOnGroupId) {
        // Collect addons groups inside with their variants
        const currentGroupId = addon.attributes.addOnGroupId
        const existingGroupIndex = addOnGroupsWithVariants.findIndex(
          (item: any) => item.id === currentGroupId
        )

        if (addOnGroupsWithVariants[existingGroupIndex]) {
          const addOnGroup = addOnGroupsWithVariants[existingGroupIndex]
          addOnGroupsWithVariants[existingGroupIndex] = {
            ...addOnGroup,
            variants: [...addOnGroup.variants, ...addon.attributes],
          }
        } else {
          const group =
            addOnGroups.find(
              (_group) => _group.attributes.id === currentGroupId
            ) || {}

          addOnGroupsWithVariants.push({
            ...group.attributes,
            variants: [...addon.attributes],
          })
        }
      } else {
        addOnsWithoutVariants.push(addon.attributes)
      }
    })

    return addOnGroupsWithVariants.concat(addOnsWithoutVariants)
  }

  // Adapt only simple addons data
  const adaptedAddons = (addOns as any[]).map((addon: any) => ({
    ...addon.attributes,
  }))
  return adaptedAddons
}

export const generateSelectOptions = (minCount = 1, maxCount = 10) => {
  const options = []
  for (let i = minCount; i <= maxCount; i++) {
    options.push({ label: i, value: i })
  }
  return options
}

const generateStockBasedOnLimitations = (
  addon: any,
  ticketQuantity: number
) => {
  // Generate addon available stock count based on limitations
  const { flagLimitToTicketQuantity, maxQuantity, limitPerTicket } = addon

  let allowedStockCount

  // Generate stock
  if (flagLimitToTicketQuantity) {
    // Limited to ticket quantity case
    allowedStockCount = ticketQuantity
  } else if (maxQuantity && limitPerTicket) {
    const stockBasedOnLimitPerTicket = limitPerTicket * ticketQuantity
    // Both maximum quantity and limited to per ticket selected case, stock is minimum of them
    allowedStockCount =
      maxQuantity <= stockBasedOnLimitPerTicket
        ? maxQuantity
        : stockBasedOnLimitPerTicket
  } else if (maxQuantity && !limitPerTicket) {
    // Limited to maximum quantity case
    allowedStockCount = maxQuantity
  } else if (!maxQuantity && limitPerTicket) {
    // Limited to per ticket case
    allowedStockCount = limitPerTicket * ticketQuantity
  }

  return Number(allowedStockCount)
}

const filterStockBasedOnAvailability = (
  generatedStock: any,
  availableStock: any
) => {
  //  Check generated stock count admissibility with addon stock availability
  let filteredStockCount = generatedStock

  if (generatedStock) {
    if (generatedStock > availableStock && !_isNull(availableStock)) {
      filteredStockCount = availableStock
    }
  } else {
    // Not set any restriction
    // Here 10 value is business logic
    filteredStockCount = 10

    if (!_isNull(availableStock) && availableStock < filteredStockCount) {
      filteredStockCount = availableStock
    }
  }

  return filteredStockCount
}

export const getAddonSelectOptions = (addons: any, choseTicketCount: any) => {
  const addonsWithOptions: ObjectLiteral = {}
  const groupsWithSelectedVariantsInfo: ObjectLiteral = {}
  const groupsWithVariants: ObjectLiteral = {}

  addons.forEach((addon: any) => {
    // Here addon can act either as simple Addon or Addon Group
    const {
      id,
      stock: simpleAddonStock,
      variants,
      active,
      flagLimitToTicketQuantity,
      maxQuantity,
      limitPerTicket,
    } = addon

    if (variants) {
      // Addon Group with inside addon variants case
      variants.forEach((variant: any) => {
        const { id: variantId, stock: variantStock } = variant

        // null checking is for unlimited stock value
        if (active && (variantStock > 0 || _isNull(variantStock))) {
          // Generate Addon Group allowed stock count based on limitations
          const stockBasedOnLimitation = generateStockBasedOnLimitations(
            addon,
            choseTicketCount
          )

          // Detect if group has limitation or not
          if (flagLimitToTicketQuantity || maxQuantity || limitPerTicket) {
            // Generate Group with inside variants info
            if (groupsWithSelectedVariantsInfo[id]) {
              // Set group limit
              if (
                groupsWithSelectedVariantsInfo[id].limit <
                stockBasedOnLimitation
              ) {
                groupsWithSelectedVariantsInfo[id].limit =
                  stockBasedOnLimitation
              }

              // Set chose variants info
              groupsWithSelectedVariantsInfo[id] = {
                ...groupsWithSelectedVariantsInfo[id],
                choseVariants: {
                  ...groupsWithSelectedVariantsInfo[id].choseVariants,
                  [variantId]: 0,
                },
              }
            } else {
              groupsWithSelectedVariantsInfo[id] = {
                limit: stockBasedOnLimitation,
                selectedCount: 0,
                choseVariants: { [variantId]: 0 },
              }
            }
          }

          // Check stock admissibility with addon stock availability
          const allowedVariantStockCount = filterStockBasedOnAvailability(
            stockBasedOnLimitation,
            variantStock
          )

          // Generate options for variant
          const variantOptions = generateSelectOptions(
            0,
            allowedVariantStockCount
          )

          addonsWithOptions[variantId] = [...variantOptions]

          // Generate Group with its variants list
          groupsWithVariants[id] = {
            ...groupsWithVariants[id],
            [variantId]: allowedVariantStockCount,
          }
        }
      })
    } else {
      // Simple addon case, null checking is for unlimited stock value
      if (active && (simpleAddonStock > 0 || _isNull(simpleAddonStock))) {
        // Generate Addon Group allowed stock count based on limitations
        const stockBasedOnLimitation = generateStockBasedOnLimitations(
          addon,
          choseTicketCount
        )

        // Check stock admissibility with addon stock availability
        const allowedVariantStockCount = filterStockBasedOnAvailability(
          stockBasedOnLimitation,
          simpleAddonStock
        )

        const addonOptions = generateSelectOptions(0, allowedVariantStockCount)
        addonsWithOptions[id] = [...addonOptions]
      }
    }
  })

  return {
    addonsWithOptions,
    groupsWithSelectedVariantsInfo,
    groupsWithVariants,
  }
}

export const getTicketRelatedAddons = (addons: any, ticketId: any) => {
  // Filter addons based on choosed ticket
  const filteredAddons: any = addons.filter(
    (addon: any) =>
      _isNull(addon.prerequisiteTicketTypeIds) ||
      addon.prerequisiteTicketTypeIds.includes(ticketId)
  )

  return filteredAddons
}

export const getSortedAddons = (addons: any, sortDirection = 'asc') => {
  const addonsCopy = [...addons]

  addonsCopy.forEach((addon) => {
    if (addon.variants) {
      const unsortedVariants: any = []
      addon.variants.forEach((variant: any) => {
        unsortedVariants.push({
          ...variant,
          sortOrder: Number(variant.sortOrder),
        })
      })
      addon.sortOrder = Number(addon.variants[0].sortOrder)
      const sortedVariants = _sortBy(
        unsortedVariants,
        (variant) => variant.sortOrder
      )
      addon.variants = sortedVariants
    } else {
      addon.sortOrder = Number(addon.sortOrder)
    }
  })

  const sortedAddons = _sortBy(addonsCopy, (addon) => addon.sortOrder)
  if (sortDirection === 'desc') {
    return _reverse(sortedAddons)
  }

  return sortedAddons
}

export const isAtLeastOneAddonSelected = (value: any) => {
  const selectedAddons = Object.fromEntries(
    Object.entries(value).filter(([_, count]) => Number(count) !== 0)
  )

  return !_isEmpty(selectedAddons)
}
