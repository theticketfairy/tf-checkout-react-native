import {
  ICloseSessionResponse,
  IEventResponse,
  IPostReferralResponse,
  IPromoCodeResponse,
} from '../../api/types'
import { IAddToCartResponse, IError, ITicket } from '../../types'
import { SessionCoreHandleType } from '../Session/SessionCoreTypes'

export interface IBookTicketsOptions {
  optionName: string
  ticketId: string
  quantity: number
  price: number
}

export interface IGetTicketsOptions {
  areTicketsSortedBySoldOut?: boolean
  areTicketsGrouped?: boolean
  promoCode?: string
}

export interface IGroupedTickets {
  title: string
  data: ITicket[]
}

export type TicketsType = ITicket[] | IGroupedTickets[]

export interface IGetTicketsPayload {
  areGroupsShown?: boolean
  tickets?: TicketsType
  error?: IError
  promoCodeResult?: IPromoCodeResponse
  isInWaitingList?: boolean
  isAccessCodeRequired?: boolean
}

export type TicketsCoreHandleType = {
  getTickets(options?: IGetTicketsOptions): Promise<IGetTicketsPayload>
  getEvent(): Promise<IEventResponse>
  addToCart(options: IBookTicketsOptions): Promise<IAddToCartResponse>
  getIsUserLoggedIn(): Promise<boolean>
  logout(): Promise<ICloseSessionResponse>
  postReferralVisit(referralId: string): Promise<IPostReferralResponse>
  unlockPasswordProtectedEvent(password: string): Promise<IEventResponse>
}

export type TicketsCoreHandle = TicketsCoreHandleType & SessionCoreHandleType
