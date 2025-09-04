import { AxiosError } from 'axios'

import { fetchAddons, updateCheckoutWithAddons } from './ApiClient'
import { getApiError } from './ErrorHandler'

export const cartAdapter = (cartResponse: any) => {
  // Adapt cart response to match expected format
  const cartData = cartResponse?.data?.attributes || {}
  return {
    id: cartData.cart?.[0]?.ticket_id || '',
    quantity: cartData.cart?.[0]?.quantity || 0,
  }
}

export const addonsWithGroupsAdapter = (addonsData: any) => {
  // Adapt addons data to match expected format
  return (
    addonsData?.data?.map((addon: any) => ({
      id: addon.id,
      name: addon.attributes.name,
      description: addon.attributes.description,
      price: addon.attributes.price,
      cost: addon.attributes.cost,
      currency: addon.attributes.currency,
      imageUrl: addon.attributes.image_url,
      feeIncluded: addon.attributes.fee_included,
      variants: addon.attributes.variants,
      sortOrder: addon.attributes.sort_order,
      ticketRestrictions: addon.attributes.ticket_restrictions,
    })) || []
  )
}

// Add other adapters from web components as needed
export const getTicketRelatedAddons = (addons: any[], ticketId: string) => {
  return addons.filter(
    (addon) =>
      !addon.ticketRestrictions || addon.ticketRestrictions.includes(ticketId)
  )
}

export const getSortedAddons = (addons: any[]) => {
  return addons.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
}

// API functions for addons and checkout updates
export const getAddons = async (eventId: string) => {
  try {
    const { addonsData, addonsError } = await fetchAddons(eventId)
    if (addonsError) {
      throw addonsError
    }
    return addonsData
  } catch (error) {
    throw getApiError(error as AxiosError)
  }
}

export const updateCheckout = async (updateData: any) => {
  try {
    const { data, error } = await updateCheckoutWithAddons(updateData)
    if (error) {
      return { success: false, error: getApiError(error as AxiosError) }
    }
    return { success: true, data }
  } catch (error) {
    return { success: false, error: getApiError(error as AxiosError) }
  }
}
