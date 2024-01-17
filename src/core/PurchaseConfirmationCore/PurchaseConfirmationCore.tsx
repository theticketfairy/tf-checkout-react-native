import React, { forwardRef, useCallback, useImperativeHandle } from 'react'
import BackgroundTimer from 'react-native-background-timer'

import { fetchPurchaseConfirmation } from '../../api/ApiClient'
import { IFetchAccessTokenResponse } from '../../api/types'
import { refreshAccessToken as refreshAccessTokenAsync } from '../../helpers/RefreshAccessToken'
import { ICoreProps } from '../CoreProps'
import { PurchaseConfirmationCoreHandle } from './PurchaseConfirmationCoreTypes'

const PurchaseConfirmationCore = forwardRef<
  PurchaseConfirmationCoreHandle,
  ICoreProps
>((props, ref) => {
  const handleStopTimer = useCallback(() => {
    BackgroundTimer.stop()
    BackgroundTimer.stopBackgroundTimer()
  }, [])

  useImperativeHandle(ref, () => ({
    async getPurchaseConfirmation(orderHash: string): Promise<any> {
      return await fetchPurchaseConfirmation(orderHash)
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
})

export default PurchaseConfirmationCore
