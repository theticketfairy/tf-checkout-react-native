/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios'
import _get from 'lodash/get'

import {
  createPaymentPlan,
  handleFreeSuccess,
  handlePaymentSuccess,
} from '../../api'

interface Options {
  reviewData: any
  isFreeTickets: boolean
  paymentPlanIsAvailable: boolean
  showPaymentPlanSection: boolean
  handlePayment: any
  setPaymentIsLoading: any
  setError: any
  orderData: any
  eventId: any
  isBrowser: boolean
  onPaymentError: any
}

export const handlePaymentMiddleWare = async (
  error: any,
  data: object,
  {
    reviewData,
    isFreeTickets,
    paymentPlanIsAvailable,
    showPaymentPlanSection,
    handlePayment,
    setPaymentIsLoading,
    setError,
    onPaymentError,
  }: Options
) => {
  try {
    if (error) {
      throw error
    }
    const {
      order_details: { order_hash },
    } = reviewData

    let paymentSuccessResponse

    if (isFreeTickets) {
      paymentSuccessResponse = await handleFreeSuccess(order_hash)
    } else if (paymentPlanIsAvailable && showPaymentPlanSection) {
      paymentSuccessResponse = await createPaymentPlan(
        order_hash,
        _get(data, 'paymentMethodId', '')
      )
    } else {
      paymentSuccessResponse = await handlePaymentSuccess(order_hash)
    }

    if (paymentSuccessResponse.status === 200) {
      handlePayment(paymentSuccessResponse)
      setPaymentIsLoading(false)
    }
  } catch (e) {
    setError(_get(e, 'response.data.message', null))
    setPaymentIsLoading(false)
    onPaymentError(
      ((e as Record<string, unknown>).response as AxiosError) || e,
      reviewData.event_details.slug
    )
  }
}
