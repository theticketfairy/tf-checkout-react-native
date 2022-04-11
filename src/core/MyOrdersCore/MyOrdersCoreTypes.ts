import { IMyOrderDetailsResponse, IMyOrdersResponse } from '../../api/types'

export type MyOrdersCoreHandle = {
  getMyOrders(page: number, filter?: string): Promise<IMyOrdersResponse>
  getOrderDetails(orderId: string): Promise<IMyOrderDetailsResponse>
}
