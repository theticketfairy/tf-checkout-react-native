import { TextStyle, ViewStyle } from 'react-native'

import { IButtonStyles } from '../../components/button/types'
import { ILoadingStyles } from '../../components/loading/types'
import {
  ILoggedInStyles,
  ILoggedInTexts,
} from '../../components/loggedIn/types'
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
    loggedIn?: ILoggedInTexts
  }
  event?: IEvent
  isWaitingListVisible?: boolean
  isGetTicketsButtonVisible?: boolean
  isPromoEnabled?: boolean
  isAccessCodeEnabled?: boolean
  isUserLogged?: boolean
  onPressMyOrders: () => void
  onPressLogout: () => void
}

export interface IAddToCartSuccess {
  isBillingRequired: boolean
  isNameRequired: boolean
  isAgeRequired: boolean
  isPhoneRequired: boolean
  minimumAge: number
}

export interface ITicketListStyles {
  listContainer?: ViewStyle
  item?: ITicketListItemStyles
}

export interface ITicketsViewStyles {
  rootContainer?: ViewStyle
  container?: ViewStyle
  title?: TextStyle
  getTicketsButtonDisabled?: IButtonStyles
  getTicketsButtonActive?: IButtonStyles
  promoCode?: IPromoCodeStyles
  ticketList?: ITicketListStyles
  loading?: ILoadingStyles
  waitingList?: IWaitingListStyles
  loggedIn?: ILoggedInStyles
}

export interface ITicketsViewTexts {
  promoCode?: IPromoCodeTexts
  getTicketsButton?: string
  title?: string
  item?: ITicketListItemTexts
  loggedInTexts?: ILoggedInTexts
}

export interface ITicketsProps {
  eventId: number

  onAddToCartSuccess: (data: IAddToCartSuccess) => void
  onAddToCartError?: (error: any) => void
  onFetchTicketsError?: (error: any) => void
  onFetchEventError?: (error: string) => void

  styles?: ITicketsViewStyles
  texts?: ITicketsViewTexts

  isPromoEnabled?: boolean
  isAccessCodeEnabled?: boolean

  onPressMyOrders: () => void
  onPressLogout?: () => void
}
