import {
  IEventResponse,
  IFetchTicketsResponse,
  IPostReferralResponse,
} from '../../api/types'
import { IAddToCartResponse } from '../../types'

export interface IBookTicketsOptions {
  optionName: string
  ticketId: string
  quantity: number
  price: number
}

export type TicketsCoreHandle = {
  getTickets(promoCode?: string): Promise<IFetchTicketsResponse>
  getEvent(): Promise<IEventResponse>
  addToCart(options: IBookTicketsOptions): Promise<IAddToCartResponse>
  getIsUserLoggedIn(): Promise<boolean>
  logout(): Promise<void>
  postReferralVisit(referralId: string): Promise<IPostReferralResponse>
}
