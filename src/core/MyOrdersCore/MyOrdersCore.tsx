import React from 'react'
import { forwardRef, useImperativeHandle } from 'react'

import { fetchMyOrders, fetchOrderDetails } from '../../api/ApiClient'
import {
  IFetchAccessTokenResponse,
  IMyOrderDetailsResponse,
  IMyOrdersRequestParams,
  IMyOrdersResponse,
} from '../../api/types'
import { refreshAccessToken as refreshAccessTokenAsync } from '../../helpers/RefreshAccessToken'
import { ICoreProps } from '../CoreProps'
import { MyOrdersCoreHandle } from './MyOrdersCoreTypes'

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
    }))

    return <>{props.children}</>
  }
)

export default MyOrdersCore
