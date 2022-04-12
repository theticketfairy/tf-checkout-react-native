import React from 'react'
import { forwardRef, useImperativeHandle } from 'react'

import {
  fetchEventConditions,
  fetchOrderDetails,
  fetchOrderReview,
  postOnFreeRegistration,
  postOnPaymentSuccess,
} from '../../api/ApiClient'
import {
  IFreeRegistrationResponse,
  IMyOrderDetailsResponse,
  IOrderReviewResponse,
} from '../../api/types'
import { ICoreProps } from '../CoreProps'
import { CheckoutCoreHandle } from './CheckoutCoreTypes'

const CheckoutCore = forwardRef<CheckoutCoreHandle, ICoreProps>(
  (props, ref) => {
    useImperativeHandle(ref, () => ({
      async getEventConditions(eventId: string): Promise<any> {
        return await fetchEventConditions(eventId)
      },
      async getPurchaseOrderDetails(
        orderId: string
      ): Promise<IMyOrderDetailsResponse> {
        return await fetchOrderDetails(orderId)
      },
      async getOrderReview(orderHash: string): Promise<IOrderReviewResponse> {
        return await fetchOrderReview(orderHash)
      },
      async freeRegistration(
        orderHash: string
      ): Promise<IFreeRegistrationResponse> {
        return await postOnFreeRegistration(orderHash)
      },
      async paymentSuccess(orderHash: string): Promise<any> {
        return await postOnPaymentSuccess(orderHash)
      },
    }))

    return <>{props.children}</>
  }
)

export default CheckoutCore
