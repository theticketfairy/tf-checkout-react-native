import { IPurchaseConfirmationResponse } from '../../api/types'
import { SessionCoreHandleType } from '../Session/SessionCoreTypes'

export type PurchaseConfirmationCoreHandleType = {
  getPurchaseConfirmation(
    orderHash: string
  ): Promise<IPurchaseConfirmationResponse>
  stopCartTimer(): void
}

export type PurchaseConfirmationCoreHandle =
  PurchaseConfirmationCoreHandleType & SessionCoreHandleType
