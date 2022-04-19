import {
  IFreeRegistrationResponse,
  IMyOrderDetailsResponse,
  IOrderReviewResponse,
} from '../../api/types'

export type CheckoutCoreHandle = {
  getEventConditions(eventId: string): Promise<any>
  getPurchaseOrderDetails(orderId: string): Promise<IMyOrderDetailsResponse>
  getOrderReview(orderHash: string): Promise<IOrderReviewResponse>
  freeRegistration(orderHash: string): Promise<IFreeRegistrationResponse>
  paymentSuccess(orderHash: string): Promise<any>
}
