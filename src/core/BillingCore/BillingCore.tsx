import React, { useCallback, useEffect, useState } from 'react'
import { forwardRef, useImperativeHandle } from 'react'
import BackgroundTimer from 'react-native-background-timer'

import {
  checkoutOrder,
  fetchCart,
  fetchCountries,
  fetchStates,
  fetchUserProfile,
  registerNewUser,
} from '../../api/ApiClient'
import { updateCheckout } from '../../api/adapters'
import {
  ICartResponse,
  ICheckoutBody,
  ICountriesResponse,
  IFetchAccessTokenResponse,
  IRegisterNewUserResponse,
  IStatesResponse,
  IUserProfileResponse,
} from '../../api/types'
import { refreshAccessToken as refreshAccessTokenAsync } from '../../helpers/RefreshAccessToken'
import {
  BillingCoreHandle,
  IBillingCoreProps,
  ICheckoutResponse,
} from './BillingCoreTypes'

const BillingCore = forwardRef<BillingCoreHandle, IBillingCoreProps>(
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
      async checkoutOrder(body: ICheckoutBody): Promise<ICheckoutResponse> {
        const checkout = await checkoutOrder(body)
        if (!checkout.error) {
          BackgroundTimer.stopBackgroundTimer()
        }
        return checkout
      },

      async getCart(): Promise<ICartResponse> {
        const cart = await fetchCart()

        if (cart.cartData?.expiresAt) {
          setSecondsLeft(cart.cartData.expiresAt)
          setTimerOn(true)
        }

        return cart
      },

      async getCountries(): Promise<ICountriesResponse> {
        return await fetchCountries()
      },

      async getStates(countryId: string): Promise<IStatesResponse> {
        return await fetchStates(countryId)
      },

      async getUserProfile(): Promise<IUserProfileResponse> {
        return await fetchUserProfile()
      },

      async registerNewUser(data: FormData): Promise<IRegisterNewUserResponse> {
        return await registerNewUser(data)
      },

      async refreshAccessToken(
        refreshToken?: string
      ): Promise<IFetchAccessTokenResponse> {
        return await refreshAccessTokenAsync(refreshToken)
      },

      stopCartTimer() {
        return handleStopTimer()
      },

      // New methods for single page checkout
      async updateCheckout(data: any) {
        try {
          const response = await updateCheckout(data)
          return response
        } catch (error) {
          return { error }
        }
      },

      async processPayment(paymentData: any) {
        try {
          // This would integrate with your payment processing API
          // For now, we'll create a placeholder implementation
          const response = await fetch('/api/payment/process', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentData),
          })
          const data = await response.json()
          return { data }
        } catch (error) {
          return { error }
        }
      },
    }))

    return <>{props.children}</>
  }
)

export default BillingCore
