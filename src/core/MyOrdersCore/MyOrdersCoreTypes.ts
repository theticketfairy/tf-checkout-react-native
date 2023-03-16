import {
  IMyOrderDetailsResponse,
  IMyOrdersRequestParams,
  IMyOrdersResponse,
} from '../../api/types'
import { IAccountTicketsResponse } from '../../types'
import { SessionCoreHandleType } from '../Session/SessionCoreTypes'

export type MyOrdersCoreHandleType = {
  getMyOrders(params: IMyOrdersRequestParams): Promise<IMyOrdersResponse>
  getOrderDetails(orderId: string): Promise<IMyOrderDetailsResponse>
  getAccountTickets(
    params: IMyOrdersRequestParams
  ): Promise<IAccountTicketsResponse>
}

export type MyOrdersCoreHandle = MyOrdersCoreHandleType & SessionCoreHandleType
