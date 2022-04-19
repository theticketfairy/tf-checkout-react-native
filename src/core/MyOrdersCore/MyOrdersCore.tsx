import React from 'react'
import { forwardRef, useImperativeHandle } from 'react'

import { fetchMyOrders, fetchOrderDetails } from '../../api/ApiClient'
import { IMyOrderDetailsResponse, IMyOrdersResponse } from '../../api/types'

const MyOrdersCore = forwardRef<any, any>((props, ref) => {
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
  }))

  return <>{props.children}</>
})

export default MyOrdersCore
