import { TextStyle, ViewStyle } from 'react-native'

import { ILoadingStyles } from '../../components/loading/types'
import {
  IPromoCodeStyles,
  IPromoCodeTexts,
} from '../../components/promoCode/types'
import {
  IWaitingListStyles,
  IWaitingListTexts,
} from '../../components/waitingList/types'
import { IEvent, ISelectedTicket, ITicket } from '../../types'
import { ITicketListItemStyles, ITicketListItemTexts } from './components/types'

export interface ITicketsViewProps {
  eventId: number
  isGettingTickets?: boolean
  isBookingTickets?: boolean
  isGettingEvent?: boolean
  tickets: ITicket[]
  styles?: ITicketsViewStyles
  onPressGetTickets: () => void
  onPressApplyPromoCode: (promoCode: string) => void
  promoCodeValidationMessage?: string
  isPromoCodeValid?: boolean
  onSelectTicketOption: (selectedTicket: ISelectedTicket) => void
  selectedTicket?: ISelectedTicket
  texts?: {
    promoCode?: IPromoCodeTexts
    getTicketsButton?: string
    title?: string
    waitingList?: IWaitingListTexts
  }
  event?: IEvent
  isWaitingListVisible?: boolean
  isGetTicketsButtonVisible?: boolean
  isPromoEnabled?: boolean
  isAccessCodeEnabled?: boolean
}

export interface IAddToCartSuccess {
  isBillingRequired: boolean
  isNameRequired: boolean
  isAgeRequired: boolean
}

export interface ITicketListStyles {
  listContainer?: ViewStyle
  item?: ITicketListItemStyles
}

export interface ITicketsViewStyles {
  container?: ViewStyle
  title?: TextStyle
  getTicketsButton?: ViewStyle
  getTicketText?: TextStyle
  promoCode?: IPromoCodeStyles
  ticketList?: ITicketListStyles
  loading?: ILoadingStyles
  waitingList?: IWaitingListStyles
}

export interface ITicketsViewTexts {
  promoCode?: IPromoCodeTexts
  getTicketsButton?: string
  title?: string
  item?: ITicketListItemTexts
}

export interface ITicketsProps {
  eventId: number

  onAddToCartSuccess: (data: IAddToCartSuccess) => void
  onAddToCartError?: (error: any) => void
  onFetchTicketsError?: (error: any) => void

  styles?: ITicketsViewStyles
  texts?: ITicketsViewTexts

  isPromoEnabled?: boolean
  isAccessCodeEnabled?: boolean
}
