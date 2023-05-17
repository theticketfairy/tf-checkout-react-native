import type {
  ICloseSessionResponse,
  IEventResponse,
  IMyOrdersRequestParams,
  IPostReferralResponse,
  IPromoCodeResponse,
} from '../../api/types'
import type {
  IAccountTicketsResponse,
  IAddToCartResponse,
  IError,
  ITicket,
} from '../../types'
import type { SessionCoreHandleType } from '../Session/SessionCoreTypes'

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
  arePromoCodesEnabled?: boolean
}

export type TicketsCoreHandleType = {
  getTickets(options?: IGetTicketsOptions): Promise<IGetTicketsPayload>
  getEvent(): Promise<IEventResponse>
  addToCart(options: IBookTicketsOptions): Promise<IAddToCartResponse>
  getIsUserLoggedIn(): Promise<boolean>
  logout(): Promise<ICloseSessionResponse>
  postReferralVisit(referralId: string): Promise<IPostReferralResponse>
  unlockPasswordProtectedEvent(password: string): Promise<IEventResponse>
  getAccountTickets(
    params: IMyOrdersRequestParams
  ): Promise<IAccountTicketsResponse>
}

export type TicketsCoreHandle = TicketsCoreHandleType & SessionCoreHandleType
