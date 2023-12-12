import React, { forwardRef, useImperativeHandle } from 'react'

import { fetchPurchaseConfirmation } from '../../api/ApiClient'
import type { IFetchAccessTokenResponse } from '../../api/types'
import { refreshAccessToken as refreshAccessTokenAsync } from '../../helpers/RefreshAccessToken'
import type { ICoreProps } from '../CoreProps'
import type { PurchaseConfirmationCoreHandle } from './PurchaseConfirmationCoreTypes'

const PurchaseConfirmationCore = forwardRef<
  PurchaseConfirmationCoreHandle,
  ICoreProps
>((props, ref) => {
  useImperativeHandle(ref, () => ({
    async getPurchaseConfirmation(orderHash: string): Promise<any> {
      return await fetchPurchaseConfirmation(orderHash)
    },

    async refreshAccessToken(
      refreshToken?: string
    ): Promise<IFetchAccessTokenResponse> {
      return await refreshAccessTokenAsync(refreshToken)
    },
  }))

  return <>{props.children}</>
})

export default PurchaseConfirmationCore
