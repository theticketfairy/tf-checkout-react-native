import React, { useCallback, useEffect, useState } from 'react'
import { forwardRef, useImperativeHandle } from 'react'
import BackgroundTimer from 'react-native-background-timer'

import {
  fetchEventConditions,
  fetchOrderDetails,
  fetchOrderReview,
  postOnFreeRegistration,
  postOnPaymentSuccess,
} from '../../api/ApiClient'
import {
  IFetchAccessTokenResponse,
  IFreeRegistrationResponse,
  IMyOrderDetailsResponse,
  IOrderReviewResponse,
} from '../../api/types'
import { refreshAccessToken as refreshAccessTokenAsync } from '../../helpers/RefreshAccessToken'
import { CheckoutCoreHandle, ICheckoutCoreProps } from './CheckoutCoreTypes'

const CheckoutCore = forwardRef<CheckoutCoreHandle, ICheckoutCoreProps>(
  (props, ref) => {
    const [secondsLeft, setSecondsLeft] = useState(420)
    const [timerOn, setTimerOn] = useState(false)

    const handleStopTimer = useCallback(() => {
      BackgroundTimer.stop()
      BackgroundTimer.stopBackgroundTimer()
    }, [])

    const handleStartTimer = useCallback(() => {
      BackgroundTimer.runBackgroundTimer(() => {
        setSecondsLeft((secs) => {
          if (secs > 0) {
            return secs - 1
          } else {
            return 0
          }
        })
      }, 1000)
    }, [])

    const handleTimeIsUp = () => {
      BackgroundTimer.stopBackgroundTimer()
      props.onCartExpired?.()
    }

    useEffect(() => {
      if (secondsLeft === 0) {
        handleTimeIsUp()
      }
      props.onSecondsLeftChange?.(secondsLeft)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [secondsLeft])

    useEffect(() => {
      if (timerOn) {
        handleStartTimer()
      } else {
        BackgroundTimer.stopBackgroundTimer()
      }
      return () => {
        BackgroundTimer.stopBackgroundTimer()
      }
    }, [handleStartTimer, timerOn])

    useImperativeHandle(ref, () => ({
      async getEventConditions(): Promise<any> {
        return await fetchEventConditions()
      },

      async getPurchaseOrderDetails(
        orderId: string
      ): Promise<IMyOrderDetailsResponse> {
        return await fetchOrderDetails(orderId)
      },

      async getOrderReview(orderHash: string): Promise<IOrderReviewResponse> {
        const res = await fetchOrderReview(orderHash)
        if (res.orderReviewData) {
          setSecondsLeft(res.orderReviewData.expiresAt)
          setTimerOn(true)
        }
        return res
      },

      async freeRegistration(
        orderHash: string
      ): Promise<IFreeRegistrationResponse> {
        return await postOnFreeRegistration(orderHash)
      },

      async paymentSuccess(orderHash: string): Promise<any> {
        return await postOnPaymentSuccess(orderHash)
      },

      async refreshAccessToken(
        refreshToken?: string
      ): Promise<IFetchAccessTokenResponse> {
        return await refreshAccessTokenAsync(refreshToken)
      },

      stopCartTimer() {
        return handleStopTimer()
      },
    }))

    return <>{props.children}</>
  }
)

export default CheckoutCore
