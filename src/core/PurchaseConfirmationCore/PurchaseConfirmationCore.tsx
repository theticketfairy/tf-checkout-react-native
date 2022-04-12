import React, { forwardRef, useImperativeHandle } from 'react'

import { fetchPurchaseConfirmation } from '../../api/ApiClient'
import { ICoreProps } from '../CoreProps'
import { PurchaseConfirmationCoreHandle } from './PurchaseConfirmationCoreTypes'

const PurchaseConfirmationCore = forwardRef<
  PurchaseConfirmationCoreHandle,
  ICoreProps
>((props, ref) => {
  useImperativeHandle(ref, () => ({
    async getPurchaseConfirmation(orderHash: string): Promise<any> {
      return await fetchPurchaseConfirmation(orderHash)
    },
  }))

  return <>{props.children}</>
})

export default PurchaseConfirmationCore
