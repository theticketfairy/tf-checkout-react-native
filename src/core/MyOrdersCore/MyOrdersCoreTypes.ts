import {
  IMyOrderDetailsResponse,
  IMyOrdersRequestParams,
  IMyOrdersResponse,
} from '../../api/types'
import { SessionCoreHandleType } from '../Session/SessionCoreTypes'

export type MyOrdersCoreHandleType = {
  getMyOrders(params: IMyOrdersRequestParams): Promise<IMyOrdersResponse>
  getOrderDetails(orderId: string): Promise<IMyOrderDetailsResponse>
}

export type MyOrdersCoreHandle = MyOrdersCoreHandleType & SessionCoreHandleType
