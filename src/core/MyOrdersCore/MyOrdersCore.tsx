import React from 'react'
import { forwardRef, useImperativeHandle } from 'react'

import {
  fetchAccountTickets,
  fetchMyOrders,
  fetchOrderDetails,
} from '../../api/ApiClient'
import type {
  IFetchAccessTokenResponse,
  IMyOrderDetailsResponse,
  IMyOrdersRequestParams,
  IMyOrdersResponse,
} from '../../api/types'
import { refreshAccessToken as refreshAccessTokenAsync } from '../../helpers/RefreshAccessToken'
import type { IAccountTicketsResponse } from '../../types'
import type { ICoreProps } from '../CoreProps'
import type { MyOrdersCoreHandle } from './MyOrdersCoreTypes'

const MyOrdersCore = forwardRef<MyOrdersCoreHandle, ICoreProps>(
  (props, ref) => {
    useImperativeHandle(ref, () => ({
      async getMyOrders(
        params: IMyOrdersRequestParams
      ): Promise<IMyOrdersResponse> {
        return await fetchMyOrders(params)
      },

      async getOrderDetails(orderId: string): Promise<IMyOrderDetailsResponse> {
        return await fetchOrderDetails(orderId)
      },

      async refreshAccessToken(
        refreshToken?: string
      ): Promise<IFetchAccessTokenResponse> {
        return await refreshAccessTokenAsync(refreshToken)
      },

      async getAccountTickets(
        params: IMyOrdersRequestParams
      ): Promise<IAccountTicketsResponse> {
        return await fetchAccountTickets(params)
      },
    }))

    return <>{props.children}</>
  }
)

export default MyOrdersCore
