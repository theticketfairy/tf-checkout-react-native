import { IMyOrderDetailsResponse, IMyOrdersResponse } from '../../api/types'
import { SessionCoreHandleType } from '../Session/SessionCoreTypes'

export type MyOrdersCoreHandleType = {
  getMyOrders(page: number, filter?: string): Promise<IMyOrdersResponse>
  getOrderDetails(orderId: string): Promise<IMyOrderDetailsResponse>
}

export type MyOrdersCoreHandle = MyOrdersCoreHandleType & SessionCoreHandleType
