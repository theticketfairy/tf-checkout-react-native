import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useCallback } from 'react';

import { ApiResponse } from '../../../api/api.types';
import { Client } from '../../../api/ApiClient';
import { logger } from '../../../utils/Logger';
import { ICheckoutBody } from '../../../api/types';
import {
  AddonsResponse,
  AddToCartResponse,
  CartResponse,
  CheckoutResponse,
  EventResponse,
  IAddToCartParams,
  PaymentDataResponse,
  PaymentSuccessResponse,
  TicketsResponse,
  UpdateCheckoutParams,
  UpdateCheckoutResponse,
} from '../types';

/**
 * Hook to fetch event information
 */
export const useEventInfo = (
  eventId?: string | number,
  options?: UseQueryOptions<ApiResponse<EventResponse>, AxiosError>
) => {
  return useQuery<ApiResponse<EventResponse>, AxiosError>({
    queryKey: ['eventInfo', eventId],
    queryFn: () => {
      logger.debug('[api-hooks] Fetching event info', { eventId });
      return Client.get<ApiResponse<EventResponse>>(`v1/event/${eventId}`).then(
        (response) => {
          logger.debug('[api-hooks] Event info fetched successfully', { eventId, eventName: response.data.data?.attributes?.name });
          return response.data;
        }
      ).catch((error) => {
        logger.error('[api-hooks] Failed to fetch event info', { eventId, error: error?.message });
        throw error;
      });
    },
    enabled: !!eventId,
    ...options,
  });
};

/**
 * Hook to fetch available tickets
 */
export const useTickets = (
  eventId?: string | number,
  options?: UseQueryOptions<ApiResponse<TicketsResponse>, AxiosError>
) => {
  return useQuery<ApiResponse<TicketsResponse>, AxiosError>({
    queryKey: ['tickets', eventId],
    queryFn: () => {
      logger.debug('[api-hooks] Fetching tickets', { eventId });
      return Client.get<ApiResponse<TicketsResponse>>(
        `v1/event/${eventId}/tickets/`
      ).then((response) => {
        const ticketCount = Object.keys(response.data.data?.data?.attributes?.tickets || {}).length;
        logger.debug('[api-hooks] Tickets fetched successfully', { eventId, ticketCount });
        return response.data;
      }).catch((error) => {
        logger.error('[api-hooks] Failed to fetch tickets', { eventId, error: error?.message });
        throw error;
      });
    },
    enabled: !!eventId,
    ...options,
  });
};

/**
 * Hook to add items to cart
 */
export const useAddToCart = () => {
  return useMutation<
    ApiResponse<AddToCartResponse>,
    AxiosError,
    { eventId: string | number; ticketData: IAddToCartParams }
  >({
    mutationFn: ({ eventId, ticketData }) => {
      logger.debug('[api-hooks] Adding items to cart', { eventId, quantity: ticketData.attributes.product_cart_quantity });
      return Client.post<ApiResponse<AddToCartResponse>>(
        `v1/event/${eventId}/add-to-cart/`,
        ticketData
      ).then((response) => {
        logger.debug('[api-hooks] Items added to cart successfully', { eventId });
        return response.data;
      }).catch((error) => {
        logger.error('[api-hooks] Failed to add items to cart', { eventId, error: error?.message });
        throw error;
      });
    },
  });
};

/**
 * Hook to process checkout
 */
export const useCheckout = () => {
  return useMutation<ApiResponse<CheckoutResponse>, AxiosError, ICheckoutBody>({
    mutationFn: (checkoutData) => {
      logger.debug('[api-hooks] Processing checkout', { email: checkoutData.attributes.email });
      return Client.post<ApiResponse<CheckoutResponse>>(`v1/on-checkout/`, {
        data: checkoutData,
      }).then((response) => {
        logger.debug('[api-hooks] Checkout processed successfully', { hash: response.data.data?.attributes?.hash });
        return response.data;
      }).catch((error) => {
        logger.error('[api-hooks] Checkout failed', { error: error?.message });
        throw error;
      });
    },
  });
};

/**
 * Hook to update checkout with add-ons
 */
export const useUpdateCheckout = () => {
  return useMutation<
    ApiResponse<UpdateCheckoutResponse>,
    AxiosError,
    UpdateCheckoutParams
  >({
    mutationFn: (params) => {
      logger.debug('[api-hooks] Updating checkout with add-ons', { eventId: params.attributes.event_id });
      return Client.post<ApiResponse<UpdateCheckoutResponse>>(`v1/checkout`, {
        data: params,
      }).then((response) => {
        logger.debug('[api-hooks] Checkout updated successfully');
        return response.data;
      }).catch((error) => {
        logger.error('[api-hooks] Failed to update checkout', { error: error?.message });
        throw error;
      });
    },
  });
};

/**
 * Hook to get payment data
 */
export const usePaymentData = () => {
  return useMutation<ApiResponse<PaymentDataResponse>, AxiosError, string>({
    mutationFn: (orderHash) => {
      logger.debug('[api-hooks] Fetching payment data', { orderHash });
      return Client.get<ApiResponse<PaymentDataResponse>>(
        `/v1/order/${orderHash}/review`
      ).then((response) => {
        logger.debug('[api-hooks] Payment data fetched successfully', { orderHash });
        return response.data;
      }).catch((error) => {
        logger.error('[api-hooks] Failed to fetch payment data', { orderHash, error: error?.message });
        throw error;
      });
    },
  });
};

/**
 * Hook to notify backend after payment success
 */
export const usePaymentSuccess = () => {
  return useMutation<ApiResponse<PaymentSuccessResponse>, AxiosError, string>({
    mutationFn: (orderHash) => {
      logger.debug('[api-hooks] Confirming payment success', { orderHash });
      return Client.post<ApiResponse<PaymentSuccessResponse>>(
        `/v1/order/${orderHash}/success/`
      ).then((response) => {
        logger.debug('[api-hooks] Payment success confirmed', { orderHash });
        return response.data;
      }).catch((error) => {
        logger.error('[api-hooks] Failed to confirm payment success', { orderHash, error: error?.message });
        throw error;
      });
    },
  });
};

/**
 * Hook to fetch cart data
 */
export const useCart = (
  options?: UseQueryOptions<ApiResponse<CartResponse>, AxiosError>
) => {
  const queryClient = useQueryClient();
  const query = useQuery<ApiResponse<CartResponse>, AxiosError>({
    queryKey: ['cart'],
    queryFn: () => {
      logger.debug('[api-hooks] Fetching cart data');
      return Client.get<ApiResponse<CartResponse>>('v1/cart/').then(
        (response) => {
          const cartItems = response.data.data?.attributes?.cart?.length || 0;
          logger.debug('[api-hooks] Cart data fetched successfully', { cartItems });
          return response.data;
        }
      ).catch((error) => {
        logger.error('[api-hooks] Failed to fetch cart', { error: error?.message });
        throw error;
      });
    },
    ...options,
  });

  const invalidate = useCallback(
    () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
    [queryClient]
  );

  return { ...query, invalidate };
};

/**
 * Hook to get add-ons for an event
 */
export const useAddons = (eventId?: string | number) => {
  return useQuery<ApiResponse<AddonsResponse>, AxiosError>({
    queryKey: ['addons', eventId],
    queryFn: () => {
      logger.debug('[api-hooks] Fetching add-ons', { eventId });
      return Client.get<ApiResponse<AddonsResponse>>(
        `v1/event/${eventId}/add-ons`
      ).then((response) => {
        const addonCount = response.data.data?.attributes?.add_ons?.length || 0;
        logger.debug('[api-hooks] Add-ons fetched successfully', { eventId, addonCount });
        return response.data;
      }).catch((error) => {
        logger.error('[api-hooks] Failed to fetch add-ons', { eventId, error: error?.message });
        throw error;
      });
    },
    enabled: !!eventId,
  });
};

/**
 * Hook to get event conditions
 */
export interface EventConditionsResponse {
  attributes: {
    conditions: Array<{
      id: string;
      name: string;
      content: string;
      is_required: boolean;
    }>;
  };
}

export const useEventConditions = (eventId?: string | number) => {
  return useQuery<ApiResponse<EventConditionsResponse>, AxiosError>({
    queryKey: ['eventConditions', eventId],
    queryFn: () => {
      logger.debug('[api-hooks] Fetching event conditions', { eventId });
      return Client.get<ApiResponse<EventConditionsResponse>>(
        `v1/event/${eventId}/conditions`
      ).then((response) => {
        const conditionCount = response.data.data?.attributes?.conditions?.length || 0;
        logger.debug('[api-hooks] Event conditions fetched successfully', { eventId, conditionCount });
        return response.data;
      }).catch((error) => {
        logger.error('[api-hooks] Failed to fetch event conditions', { eventId, error: error?.message });
        throw error;
      });
    },
    enabled: !!eventId,
  });
};
