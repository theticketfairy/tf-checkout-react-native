import type { IPurchaseConfirmationResponse } from '../../api/types'
import type { SessionCoreHandleType } from '../Session/SessionCoreTypes'

export type PurchaseConfirmationCoreHandleType = {
  getPurchaseConfirmation(
    orderHash: string
  ): Promise<IPurchaseConfirmationResponse>
}

export type PurchaseConfirmationCoreHandle = PurchaseConfirmationCoreHandleType &
  SessionCoreHandleType
