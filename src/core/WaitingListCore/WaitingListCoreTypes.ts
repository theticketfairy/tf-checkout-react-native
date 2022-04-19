import { IAddToWaitingListResponse } from '../../api/types'

export interface IAddToWaitingListCoreParams {
  firstName: string
  lastName: string
  email: string
}

export type WaitingListCoreHandle = {
  addToWaitingList(
    params: IAddToWaitingListCoreParams
  ): Promise<IAddToWaitingListResponse>
}
