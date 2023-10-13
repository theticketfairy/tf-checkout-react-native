import type { IAddToWaitingListResponse } from '../../api/types'
import type { SessionCoreHandleType } from '../Session/SessionCoreTypes'

export interface IAddToWaitingListCoreParams {
  firstName: string
  lastName: string
  email: string
}

export type WaitingListCoreHandleType = {
  addToWaitingList(
    params: IAddToWaitingListCoreParams
  ): Promise<IAddToWaitingListResponse>
}

export type WaitingListCoreHandle = WaitingListCoreHandleType &
  SessionCoreHandleType
