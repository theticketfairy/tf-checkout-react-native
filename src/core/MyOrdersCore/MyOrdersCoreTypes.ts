import type {
  IMyOrderDetailsResponse,
  IMyOrdersRequestParams,
  IMyOrdersResponse,
} from '../../api/types'
import type { IAccountTicketsResponse } from '../../types'
import type { SessionCoreHandleType } from '../Session/SessionCoreTypes'

export type MyOrdersCoreHandleType = {
  getMyOrders(params: IMyOrdersRequestParams): Promise<IMyOrdersResponse>
  getOrderDetails(orderId: string): Promise<IMyOrderDetailsResponse>
  getAccountTickets(
    params: IMyOrdersRequestParams
  ): Promise<IAccountTicketsResponse>
}

export type MyOrdersCoreHandle = MyOrdersCoreHandleType & SessionCoreHandleType
