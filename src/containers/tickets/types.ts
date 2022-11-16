import {
  ImageSourcePropType,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native'

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
import { TicketsType } from '../../core/TicketsCore/TicketsCoreTypes'
import {
  IEvent,
  IOnFetchTicketsSuccess,
  ISelectedTicket,
  ITicketsResponseData,
} from '../../types'
import { IError } from '../../types/IError'
import { ITicketListItemStyles, ITicketListItemTexts } from './components/types'

export interface ITicketsViewProps {
  isGettingTickets?: boolean
  isBookingTickets?: boolean
  isGettingEvent?: boolean
  tickets: TicketsType
  areTicketsGroupsShown?: boolean
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
  sectionHeader?: {
    container?: StyleProp<ViewStyle>
    title?: StyleProp<TextStyle>
  }
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

export interface ITicketsConfig {
  areActivityIndicatorsEnabled?: boolean
  areAlertsEnabled?: boolean
  areTicketsSortedBySoldOut?: boolean
  areTicketsGrouped?: boolean
}

export interface ITicketsProps {
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

  onLoadingChange?: (isLoading: boolean) => void
  promoCodeCloseIcon?: ImageSourcePropType

  config?: ITicketsConfig
}
