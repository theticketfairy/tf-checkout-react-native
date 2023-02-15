import React from 'react'
import { forwardRef, useImperativeHandle } from 'react'

import { fetchMyOrders, fetchOrderDetails } from '../../api/ApiClient'
import {
  IFetchAccessTokenResponse,
  IMyOrderDetailsResponse,
  IMyOrdersResponse,
} from '../../api/types'
import { refreshAccessToken as refreshAccessTokenAsync } from '../../helpers/RefreshAccessToken'
import { ICoreProps } from '../CoreProps'
import { MyOrdersCoreHandle } from './MyOrdersCoreTypes'

const MyOrdersCore = forwardRef<MyOrdersCoreHandle, ICoreProps>(
  (props, ref) => {
    useImperativeHandle(ref, () => ({
      async getMyOrders(
        page: number,
        filter: string
      ): Promise<IMyOrdersResponse> {
        return await fetchMyOrders(page, filter)
      },

      async getOrderDetails(orderId: string): Promise<IMyOrderDetailsResponse> {
        return await fetchOrderDetails(orderId)
      },

      async refreshAccessToken(
        refreshToken?: string
      ): Promise<IFetchAccessTokenResponse> {
        return await refreshAccessTokenAsync(refreshToken)
      },
    }))

    return <>{props.children}</>
  }
)

export default MyOrdersCore
