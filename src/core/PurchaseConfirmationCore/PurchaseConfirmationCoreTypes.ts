import { IPurchaseConfirmationResponse } from '../../api/types'

export type PurchaseConfirmationCoreHandle = {
  getPurchaseConfirmation(
    orderHash: string
  ): Promise<IPurchaseConfirmationResponse>
}
