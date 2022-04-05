import { ReactNode } from 'react'

import { IEventResponse, IFetchTicketsResponse } from '../../api/types'
import { ITicketsResponsePayload } from '../../types'

export interface ITicketsCoreProps {
  children: ReactNode | ReactNode[]
}

export interface IBookTicketsOptions {
  optionName: string
  ticketId: string
  quantity: string
  price: number
}

export type TicketsCoreHandle = {
  getTickets?(promoCode?: string): Promise<IFetchTicketsResponse>
  getEvent?(eventId: string): Promise<IEventResponse>
  addToCart?(options: IBookTicketsOptions): Promise<ITicketsResponsePayload>
}
