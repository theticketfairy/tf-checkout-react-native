import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query'
import { AxiosError } from 'axios'
import React, { useCallback } from 'react'

import { Client } from '../../api/ApiClient'
import { ICheckoutBody } from '../../api/types'
import { getData, LocalStorageKeys } from '../../helpers/LocalStorage'
import {
  AddonsResponse,
  AddToCartResponse,
  ApiResponse,
  CartResponse,
  CheckoutResponse,
  CountriesResponse,
  CustomerProfileResponse,
  EventResponse,
  IAddToCartParams,
  PaymentDataResponse,
  PaymentSuccessResponse,
  RegisterUserResponse,
  StatesResponse,
  TicketsResponse,
  UpdateCheckoutParams,
  UpdateCheckoutResponse,
  UserRegistrationData,
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
  options?: UseQueryOptions<ApiResponse<CustomerProfileResponse>, AxiosError>
) => {
  return useQuery<ApiResponse<CustomerProfileResponse>, AxiosError>({
    queryKey: ['userProfile'],
    queryFn: () =>
      Client.get<ApiResponse<CustomerProfileResponse>>(
        `customer/profile/`
      ).then((response) => response.data),
    retry: false,
    ...options,
  })
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
 * Hook to register new user
 */
export const useRegisterUser = () => {
  return useMutation<
    ApiResponse<RegisterUserResponse>,
    AxiosError,
    UserRegistrationData | FormData
  >({
    mutationFn: (userData) =>
      Client.post<ApiResponse<RegisterUserResponse>>(
        'v1/oauth/register-rn',
        userData
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

// COMPOSITE HOOK FOR CHECKOUT FLOW

/**
 * Main hook that consolidates all checkout functionality
 */
export interface CheckoutFlowResult {
  // Queries
  cartQuery: ReturnType<typeof useCart>
  eventInfoQuery: ReturnType<typeof useEventInfo>
  ticketsQuery: ReturnType<typeof useTickets>
  userProfileQuery: ReturnType<typeof useUserProfile>
  countriesQuery: ReturnType<typeof useCountries>

  // Mutations
  checkoutMutation: ReturnType<typeof useCheckout>
  updateCheckoutMutation: ReturnType<typeof useUpdateCheckout>
  paymentDataMutation: ReturnType<typeof usePaymentData>
  paymentSuccessMutation: ReturnType<typeof usePaymentSuccess>
  registerUserMutation: ReturnType<typeof useRegisterUser>
  addToCartMutation: ReturnType<typeof useAddToCart>

  // Additional hooks
  useStates: typeof useStates
  useAddons: typeof useAddons
  useEventConditions: typeof useEventConditions

  // Helper state
  isInitialLoading: boolean
  eventId: string | undefined
  secondsLeft?: number
  setSecondsLeft: React.Dispatch<React.SetStateAction<number | undefined>>
}

export const useCheckoutFlow = (): CheckoutFlowResult => {
  // Get cart data to initialize the flow
  const cartQuery = useCart()

  // Add cart timer state
  const [secondsLeft, setSecondsLeft] = React.useState<number | undefined>(
    undefined
  )

  // Use the event ID from cart to fetch event info and tickets
  const eventId = cartQuery.data?.data?.attributes?.eventId
  const eventInfoQuery = useEventInfo(eventId)

  const ticketsQuery = useTickets(eventId)

  // Fetch user profile if logged in
  // First check for token existence
  const [hasToken, setHasToken] = React.useState(false)
  React.useEffect(() => {
    const checkToken = async () => {
      const token = await getData(LocalStorageKeys.ACCESS_TOKEN)
      setHasToken(!!token)
    }
    checkToken()
  }, [])

  const userProfileQuery = useUserProfile({
    enabled: hasToken,
  } as UseQueryOptions<ApiResponse<CustomerProfileResponse>, AxiosError>)

  // Load countries for the form
  const countriesQuery = useCountries()

  // Mutations for checkout flow
  const checkoutMutation = useCheckout()
  const updateCheckoutMutation = useUpdateCheckout()
  const paymentDataMutation = usePaymentData()
  const paymentSuccessMutation = usePaymentSuccess()
  const registerUserMutation = useRegisterUser()
  const addToCartMutation = useAddToCart()

  // Initial loading state
  const isInitialLoading =
    cartQuery.isLoading ||
    (!!eventId && (eventInfoQuery.isLoading || ticketsQuery.isLoading)) ||
    countriesQuery.isLoading

  return {
    // Queries
    cartQuery,
    eventInfoQuery,
    ticketsQuery,
    userProfileQuery,
    countriesQuery,

    // Mutations
    checkoutMutation,
    updateCheckoutMutation,
    paymentDataMutation,
    paymentSuccessMutation,
    registerUserMutation,
    addToCartMutation,

    // Additional hooks
    useStates,
    useAddons,
    useEventConditions,

    // Helper state
    isInitialLoading,
    eventId,
    secondsLeft,
    setSecondsLeft,
  }
}
