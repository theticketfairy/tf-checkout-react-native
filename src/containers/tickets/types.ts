import { ImageSourcePropType, TextStyle, ViewStyle } from 'react-native'

import { IEventData } from '../../api/types'
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
import {
  IEvent,
  IOnFetchTicketsSuccess,
  ISelectedTicket,
  ITicket,
  ITicketsResponseData,
} from '../../types'
import { IError } from '../../types/IError'
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
  isPromoCodeValid?: boolean | number
  onSelectTicketOption: (selectedTicket: ISelectedTicket) => void
  selectedTicket?: ISelectedTicket
  texts?: ITicketsViewTexts
  event?: IEvent
  isWaitingListVisible?: boolean
  isGetTicketsButtonVisible?: boolean
  isPromoEnabled?: boolean
  isAccessCodeEnabled?: boolean
  isUserLogged?: boolean
  onPressMyOrders: () => void
  onPressLogout: () => void

  areLoadingIndicatorsEnabled?: boolean
  areAlertsEnabled?: boolean

  // Callbacks for Waiting list
  onAddToWaitingListSuccess?: () => void
  onAddToWaitingListError?: (error: IError) => void
  onLoadingChange?: (isLoading: boolean) => void
  promoCodeCloseIcon?: ImageSourcePropType
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

  listItem?: ITicketListItemTexts
  waitingList?: IWaitingListTexts
}

export interface ITicketsProps {
  eventId: number

  // Callbacks for when user taps on GET Tickets button
  onAddToCartSuccess: (data: ITicketsResponseData) => void
  onAddToCartError?: (error: IError) => void

  // Callbacks for fetching the tickets
  onFetchTicketsSuccess?: (data: IOnFetchTicketsSuccess) => void
  onFetchTicketsError?: (error: IError) => void

  // Callbacks for fetching the Event
  onFetchEventError?: (error: IError) => void
  onFetchEventSuccess?: (data: IEventData) => void

  // Callbacks for Waiting list
  onAddToWaitingListSuccess?: () => void
  onAddToWaitingListError?: (error: IError) => void

  styles?: ITicketsViewStyles
  texts?: ITicketsViewTexts

  isPromoEnabled?: boolean
  isAccessCodeEnabled?: boolean

  onPressMyOrders: () => void
  onPressLogout?: () => void

  // With the following 3 props you can control the visibility of the stock loading indicators and alerts, so you can use your own.
  onLoadingChange?: (isLoading: boolean) => void
  areAlertsEnabled?: boolean
  areLoadingIndicatorsEnabled?: boolean

  promoCodeCloseIcon?: ImageSourcePropType
}
