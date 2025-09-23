import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useCallback, useEffect, useState } from 'react'

import { ApiResponse } from '../../api/api.types'
import { Client } from '../../api/ApiClient'
import { ICheckoutBody } from '../../api/types'
import { QueryOpts } from '../../common/query.types'
import { getData, LocalStorageKeys } from '../../helpers/LocalStorage'
import {
  AddonsResponse,
  AddToCartResponse,
  CartResponse,
  CheckoutResponse,
  CountriesResponse,
  CustomerProfileResponse,
  EventResponse,
  IAddToCartParams,
  PaymentDataResponse,
  PaymentSuccessResponse,
  StatesResponse,
  TicketsResponse,
  UpdateCheckoutParams,
  UpdateCheckoutResponse,
} from './types'

/**
 * Hook to fetch event information
 */
export const useEventInfo = (
  eventId?: string | number,
  options?: UseQueryOptions<ApiResponse<EventResponse>, AxiosError>
) => {
  return useQuery<ApiResponse<EventResponse>, AxiosError>({
    queryKey: ['eventInfo', eventId],
    queryFn: () =>
      Client.get<ApiResponse<EventResponse>>(`v1/event/${eventId}`).then(
        (response) => response.data
      ),
    enabled: !!eventId,
    ...options,
  })
}

/**
 * Hook to fetch available tickets
 */
export const useTickets = (
  eventId?: string | number,
  options?: UseQueryOptions<ApiResponse<TicketsResponse>, AxiosError>
) => {
  return useQuery<ApiResponse<TicketsResponse>, AxiosError>({
    queryKey: ['tickets', eventId],
    queryFn: () =>
      Client.get<ApiResponse<TicketsResponse>>(
        `v1/event/${eventId}/tickets/`
      ).then((response) => response.data),
    enabled: !!eventId,
    ...options,
  })
}

/**
 * Hook to add items to cart
 */
export const useAddToCart = () => {
  return useMutation<
    ApiResponse<AddToCartResponse>,
    AxiosError,
    { eventId: string | number; ticketData: IAddToCartParams }
  >({
    mutationFn: ({ eventId, ticketData }) =>
      Client.post<ApiResponse<AddToCartResponse>>(
        `v1/event/${eventId}/add-to-cart/`,
        ticketData
      ).then((response) => response.data),
  })
}

/**
 * Hook to fetch user profile
 */
export const useUserProfile = (
  options?: QueryOpts<ApiResponse<CustomerProfileResponse>, AxiosError>
) => {
  const queryClient = useQueryClient()
  const [hasToken, setHasToken] = useState(false)

  useEffect(() => {
    const checkToken = async () => {
      const token = await getData(LocalStorageKeys.ACCESS_TOKEN)
      setHasToken(!!token)
    }
    checkToken()
  }, [])

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['userProfile'] })
  }, [queryClient])

  const query = useQuery<ApiResponse<CustomerProfileResponse>, AxiosError>({
    queryKey: ['userProfile'],
    queryFn: () =>
      Client.get<ApiResponse<CustomerProfileResponse>>(
        `customer/profile/`
      ).then((response) => response.data),
    retry: false,
    enabled: hasToken,
    ...options,
  })

  return { ...query, invalidate }
}

/**
 * Hook to fetch countries list
 */
export const useCountries = () => {
  return useQuery<ApiResponse<CountriesResponse>, AxiosError>({
    queryKey: ['countries'],
    queryFn: () =>
      Client.get<ApiResponse<CountriesResponse>>(`countries/list`).then(
        (response) => response.data
      ),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - countries rarely change
  })
}

/**
 * Hook to fetch states for a country
 */
export const useStates = (countryId?: string) => {
  return useQuery<ApiResponse<StatesResponse>, AxiosError>({
    queryKey: ['states', countryId],
    queryFn: () =>
      Client.get<ApiResponse<Record<string, string>>>(
        `countries/${countryId}/states/`
      ).then((response) => {
        return {
          ...response.data,
          data: Object.entries(response.data.data || {}).map(([id, name]) => ({
            label: String(name),
            value: parseInt(String(id), 10),
          })),
        }
      }),
    enabled: !!countryId && countryId !== '-1',
  })
}

/**
 * Hook to process checkout
 */
export const useCheckout = () => {
  return useMutation<ApiResponse<CheckoutResponse>, AxiosError, ICheckoutBody>({
    mutationFn: (checkoutData) =>
      Client.post<ApiResponse<CheckoutResponse>>(`v1/on-checkout/`, {
        data: checkoutData,
      }).then((response) => response.data),
  })
}

/**
 * Hook to update checkout with add-ons
 */
export const useUpdateCheckout = () => {
  return useMutation<
    ApiResponse<UpdateCheckoutResponse>,
    AxiosError,
    UpdateCheckoutParams
  >({
    mutationFn: (params) =>
      Client.post<ApiResponse<UpdateCheckoutResponse>>(`v1/checkout`, {
        data: params,
      }).then((response) => response.data),
  })
}

/**
 * Hook to get payment data
 */
export const usePaymentData = () => {
  return useMutation<ApiResponse<PaymentDataResponse>, AxiosError, string>({
    mutationFn: (orderHash) =>
      Client.get<ApiResponse<PaymentDataResponse>>(
        `/v1/order/${orderHash}/review`
      ).then((response) => response.data),
  })
}

/**
 * Hook to notify backend after payment success
 */
export const usePaymentSuccess = () => {
  return useMutation<ApiResponse<PaymentSuccessResponse>, AxiosError, string>({
    mutationFn: (orderHash) =>
      Client.post<ApiResponse<PaymentSuccessResponse>>(
        `/v1/order/${orderHash}/success/`
      ).then((response) => response.data),
  })
}

/**
 * Hook to fetch cart data
 */
export const useCart = (
  options?: UseQueryOptions<ApiResponse<CartResponse>, AxiosError>
) => {
  const queryClient = useQueryClient()
  const query = useQuery<ApiResponse<CartResponse>, AxiosError>({
    queryKey: ['cart'],
    queryFn: () =>
      Client.get<ApiResponse<CartResponse>>('v1/cart/').then(
        (response) => response.data
      ),
    ...options,
  })

  const invalidate = useCallback(
    () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
    [queryClient]
  )

  return { ...query, invalidate }
}

/**
 * Hook to get add-ons for an event
 */
export const useAddons = (eventId?: string | number) => {
  return useQuery<ApiResponse<AddonsResponse>, AxiosError>({
    queryKey: ['addons', eventId],
    queryFn: () =>
      Client.get<ApiResponse<AddonsResponse>>(
        `v1/event/${eventId}/add-ons`
      ).then((response) => response.data),
    enabled: !!eventId,
  })
}

/**
 * Hook to get event conditions
 */
export interface EventConditionsResponse {
  attributes: {
    conditions: Array<{
      id: string
      name: string
      content: string
      is_required: boolean
    }>
  }
}

export const useEventConditions = (eventId?: string | number) => {
  return useQuery<ApiResponse<EventConditionsResponse>, AxiosError>({
    queryKey: ['eventConditions', eventId],
    queryFn: () =>
      Client.get<ApiResponse<EventConditionsResponse>>(
        `v1/event/${eventId}/conditions`
      ).then((response) => response.data),
    enabled: !!eventId,
  })
}
