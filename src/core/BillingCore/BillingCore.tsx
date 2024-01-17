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
    }))

    return <>{props.children}</>
  }
)

export default BillingCore
