import {
  IFreeRegistrationResponse,
  IMyOrderDetailsResponse,
  IOrderReviewResponse,
} from '../../api/types'
import { ICoreProps } from '../CoreProps'
import { SessionCoreHandleType } from '../Session/SessionCoreTypes'

export type CheckoutCoreHandleType = {
  getEventConditions(): Promise<any>
  getPurchaseOrderDetails(orderId: string): Promise<IMyOrderDetailsResponse>
  getOrderReview(orderHash: string): Promise<IOrderReviewResponse>
  freeRegistration(orderHash: string): Promise<IFreeRegistrationResponse>
  paymentSuccess(orderHash: string): Promise<any>
}

export interface ICheckoutCoreProps extends ICoreProps {
  onCartExpired?: () => void
  onSecondsLeftChange?: (secondsLeft: number) => void
}

export type CheckoutCoreHandle = CheckoutCoreHandleType & SessionCoreHandleType
